# Phase 1: Game Integration & Auth - Complete Flow Documentation

This document describes **everything Phase 1 does**, how all the pieces connect, and confirms the system is working correctly.

---

## What Phase 1 Covers

Phase 1 implements the core authentication loop and game-to-backend integration:

- Firebase Auth: user creation, token verification, logout
- Wallet-based login: connects Avalanche wallet, checks NFT ownership
- Asset verification: on-chain NFT/weapon/level detection
- Firebase RTDB sync: writes game data for Unity to read
- Background jobs: auto-detect new game players, sync scores
- Anti-cheat: score validation, velocity checks, ban system
- Character/weapon unlock system based on NFT level

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                           │
│                                                                     │
│  1. User signs up → POST /auth/create-user                         │
│  2. User logs in with Firebase (email/password)                     │
│  3. User connects wallet (Thirdweb)                                 │
│  4. Frontend calls POST /auth/login { address }                     │
│     with Authorization: Bearer {firebaseIdToken}                    │
│  5. Receives: { user, assets, weapons }                             │
│  6. Displays dashboard                                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    HTTPS + Firebase Token
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CHAINBOIS API (Express)                      │
│                                                                     │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐         │
│  │  Auth   │  │   Game   │  │  Health   │  │  Middleware │         │
│  │ Routes  │  │  Routes  │  │  Routes   │  │            │         │
│  │         │  │          │  │           │  │ • Firebase  │         │
│  │ create  │  │ verify   │  │ /health   │  │   Auth     │         │
│  │ login   │  │ set-     │  │           │  │ • Rate     │         │
│  │ me      │  │  avatar  │  │           │  │   Limit    │         │
│  │ logout  │  │ chars    │  │           │  │ • Anti-    │         │
│  │         │  │ download │  │           │  │   Cheat    │         │
│  │         │  │ info     │  │           │  │ • Validate │         │
│  └────┬────┘  └────┬─────┘  └───────────┘  └────────────┘         │
│       │            │                                                │
│       ▼            ▼                                                │
│  ┌──────────────────────┐   ┌──────────────────────┐               │
│  │      MongoDB         │   │  Firebase Admin SDK   │               │
│  │                      │   │                       │               │
│  │ • User (profile,     │   │ • Auth (create,       │               │
│  │   score, level,      │   │   verify, revoke)     │               │
│  │   playerType)        │   │                       │               │
│  │ • SecurityProfile    │   │ • Realtime DB         │               │
│  │   (threat score,     │   │   (write hasNFT,      │               │
│  │    violations)       │   │    level, weapons     │               │
│  │ • WeeklyLeaderboard  │   │    for Unity game)    │               │
│  │ • Wallet (encrypted) │   │                       │               │
│  └──────────────────────┘   └───────────┬───────────┘               │
│                                         │                           │
│  ┌──────────────────────┐               │ Firebase RTDB             │
│  │  Avalanche C-Chain   │               │ users/{uid}:              │
│  │                      │               │  { username, Score,       │
│  │ • Glacier Data API   │               │    hasNFT, level,         │
│  │   (NFT ownership)    │               │    weapons }              │
│  │ • Contract calls     │               │         ▲                 │
│  │   (getLevel, etc)    │               │         │                 │
│  └──────────────────────┘               │    Unity Game             │
│                                         │    reads this             │
│  ┌──────────────────────┐               │         │                 │
│  │   Background Jobs    │               │         ▼                 │
│  │                      │◄──────────────┘                           │
│  │ • syncNewUsers       │  Polls Firebase every 1 min               │
│  │   (1 min cron)       │  Detects unregistered players             │
│  │                      │  Creates as WEB2 in MongoDB               │
│  │ • syncScores         │                                           │
│  │   (5 min cron)       │  Polls Firebase every 5 min               │
│  │   Syncs Score →      │  Updates score, highScore, points         │
│  │   MongoDB, validates │  Validates via anti-cheat                 │
│  │   anti-cheat         │  Updates leaderboard                      │
│  └──────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Endpoint-by-Endpoint Flow

### 1. POST /api/v1/auth/create-user (Public)

**Purpose**: Register a new user in Firebase.

```
Frontend                              API                           Firebase
   │                                   │                              │
   │  POST /auth/create-user           │                              │
   │  { email, password, username }    │                              │
   │──────────────────────────────────▶│                              │
   │                                   │  Validate inputs             │
   │                                   │  • email format              │
   │                                   │  • password >= 6 chars       │
   │                                   │  • username non-empty, <= 100│
   │                                   │                              │
   │                                   │  firebase.createUser()       │
   │                                   │─────────────────────────────▶│
   │                                   │                              │  Creates Auth record
   │                                   │  ◀─────────────── uid ───────│
   │                                   │                              │
   │                                   │  firebase.RTDB.update()      │
   │                                   │─────────────────────────────▶│
   │                                   │                              │  users/{uid}:
   │                                   │                              │   username: "ChainBoi_001"
   │                                   │                              │   Score: 0
   │                                   │                              │   hasNFT: false
   │                                   │                              │   level: 0
   │                                   │                              │
   │  ◀─── 201 { uid } ───────────────│                              │
   │                                   │                              │
   │  Frontend signs in with Firebase: │                              │
   │  signInWithEmailAndPassword()     │                              │
```

**Error cases:**
- 400: Missing/invalid email, short password, empty username
- 400: "Email is already registered" (Firebase `auth/email-already-exists`)

---

### 2. POST /api/v1/auth/login (Protected)

**Purpose**: Connect wallet, check NFTs, sync to Firebase for game.

This is the most complex endpoint. Here's the full flow:

```
Frontend                          API                    Avalanche    Firebase     MongoDB
   │                               │                        │           │           │
   │  POST /auth/login             │                        │           │           │
   │  { address: "0x..." }         │                        │           │           │
   │  Authorization: Bearer {tok}  │                        │           │           │
   │──────────────────────────────▶│                        │           │           │
   │                               │                        │           │           │
   │                               │  1. Verify Firebase token          │           │
   │                               │─────────────────────────────────▶│           │
   │                               │  ◀──────── req.user.uid ────────│           │
   │                               │                        │           │           │
   │                               │  2. Validate address (ethers.isAddress)       │
   │                               │                        │           │           │
   │                               │  3. Check address not used by another user    │
   │                               │──────────────────────────────────────────────▶│
   │                               │  ◀────────── no conflict ───────────────────│
   │                               │                        │           │           │
   │                               │  4. Check ban status                          │
   │                               │──────────────────────────────────────────────▶│
   │                               │  ◀──── SecurityProfile ─────────────────────│
   │                               │  (if banned → 403)     │           │           │
   │                               │                        │           │           │
   │                               │  5. Get username from Firebase RTDB           │
   │                               │─────────────────────────────────▶│           │
   │                               │  ◀────── username ──────────────│           │
   │                               │                        │           │           │
   │                               │  6. Find or create user in MongoDB            │
   │                               │──────────────────────────────────────────────▶│
   │                               │  ◀────── user document ─────────────────────│
   │                               │                        │           │           │
   │                               │  7. Check NFTs on-chain (if contract configured)
   │                               │  ┌─────────────────────┤           │           │
   │                               │  │ Glacier Data API:   │           │           │
   │                               │  │ listErc721(address, │           │           │
   │                               │  │  CHAINBOIS_NFT_ADDR)│           │           │
   │                               │──┤────────────────────▶│           │           │
   │                               │  │◀── [{tokenId: 42}]──│           │           │
   │                               │  │                     │           │           │
   │                               │  │ contract.getLevel(42)           │           │
   │                               │──┤────────────────────▶│           │           │
   │                               │  │◀────── level: 2 ────│           │           │
   │                               │  │                     │           │           │
   │                               │  │ Glacier Data API:   │           │           │
   │                               │  │ listErc721(address, │           │           │
   │                               │  │  WEAPON_NFT_ADDR)   │           │           │
   │                               │──┤────────────────────▶│           │           │
   │                               │  │◀── [{tokenId: 1}]───│           │           │
   │                               │  └─────────────────────┤           │           │
   │                               │                        │           │           │
   │                               │  8. Update user in MongoDB:                   │
   │                               │     hasNft=true, nftTokenId=42, level=2       │
   │                               │     playerType="web3" (auto-upgrade)          │
   │                               │──────────────────────────────────────────────▶│
   │                               │                        │           │           │
   │                               │  9. Write to Firebase for Unity game:         │
   │                               │     { hasNFT: true, level: 2,     │           │
   │                               │       weapons: ["AK-47"] }        │           │
   │                               │─────────────────────────────────▶│           │
   │                               │                        │           │           │
   │  ◀── 200 { user, assets,     │                        │           │           │
   │           weapons } ──────────│                        │           │           │
```

**Response shape:**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "firebase_uid",
      "username": "ChainBoi_001",
      "address": "0xabc...",
      "playerType": "web3",
      "pointsBalance": 500,
      "battleTokenBalance": 0,
      "level": 2,
      "score": 1500,
      "highScore": 1500,
      "gamesPlayed": 10,
      "hasNft": true,
      "nftTokenId": 42,
      "isBanned": false,
      "hasClaimed": false,
      "lastLogin": "2026-03-03T12:00:00.000Z"
    },
    "assets": {
      "hasNft": true,
      "nftTokenId": 42,
      "level": 2
    },
    "weapons": [
      { "tokenId": 1, "name": "AK-47" }
    ]
  }
}
```

**Key behaviors:**
- First login creates user in MongoDB
- If user has NFT → `playerType: "web3"`, unlocks premium features
- If user loses NFT (sold/transferred) → auto-downgrade to `"web2"`
- Firebase RTDB updated for Unity game to read
- Address collision prevented (one wallet per user)

---

### 3. GET /api/v1/auth/me (Protected)

**Purpose**: Get current user profile from MongoDB (no on-chain check).

```
Frontend                          API                    MongoDB
   │                               │                       │
   │  GET /auth/me                 │                       │
   │  Authorization: Bearer {tok}  │                       │
   │──────────────────────────────▶│                       │
   │                               │  Find user by uid     │
   │                               │──────────────────────▶│
   │                               │  ◀──── user ─────────│
   │  ◀── 200 { user } ───────────│                       │
```

Fast endpoint - just reads MongoDB, no blockchain calls.

---

### 4. POST /api/v1/auth/logout (Protected)

**Purpose**: End session, revoke tokens, clear game data.

```
Frontend                          API                    Firebase
   │                               │                       │
   │  POST /auth/logout            │                       │
   │  Authorization: Bearer {tok}  │                       │
   │──────────────────────────────▶│                       │
   │                               │  revokeRefreshTokens()│
   │                               │─────────────────────▶│
   │                               │                       │
   │                               │  RTDB update:         │
   │                               │  { hasNFT: false,     │
   │                               │    level: 0,          │
   │                               │    weapons: null }    │
   │                               │─────────────────────▶│
   │                               │                       │  Game reads → resets
   │  ◀── 200 "Logged out" ───────│                       │
```

Clears Firebase game data so Unity resets the player's session.

---

### 5. POST /api/v1/game/verify-assets (Protected)

**Purpose**: Re-fetch on-chain NFT data without re-logging in.

Same on-chain lookup as login (steps 7-9), returns characters/weapons:

```json
{
  "success": true,
  "data": {
    "hasNft": true,
    "nftTokenId": 42,
    "level": 2,
    "ownedWeaponNfts": [{ "name": "AK-47", "tokenId": 1 }],
    "characters": ["Recruit_A", "Recruit_B", "Recruit_C", "Recruit_D",
                    "Soldier_A", "Soldier_B", "Soldier_C", "Soldier_D",
                    "Veteran_A", "Veteran_B", "Veteran_C", "Veteran_D"],
    "baseWeapons": ["Pistol", "Knife", "Shotgun", "SMG"]
  }
}
```

---

### 6. POST /api/v1/game/set-avatar (Protected)

**Purpose**: Set the user's active ChainBoi NFT avatar.

```
Frontend                          API                    Avalanche
   │                               │                       │
   │  POST /game/set-avatar        │                       │
   │  { tokenId: 42 }             │                       │
   │──────────────────────────────▶│                       │
   │                               │  contract.ownerOf(42) │
   │                               │─────────────────────▶│
   │                               │  ◀── owner: 0xabc ───│
   │                               │                       │
   │                               │  Verify user.address  │
   │                               │  === owner            │
   │                               │  (if not → 403)       │
   │                               │                       │
   │                               │  contract.getLevel(42)│
   │                               │─────────────────────▶│
   │                               │  ◀── level: 2 ───────│
   │                               │                       │
   │                               │  Update MongoDB +     │
   │                               │  Firebase             │
   │                               │                       │
   │  ◀── 200 { tokenId, level,   │                       │
   │           characters,         │                       │
   │           baseWeapons } ──────│                       │
```

---

### 7. GET /api/v1/game/characters/:address (Protected, BOLA)

**Purpose**: Get unlocked characters for an address.

BOLA (Broken Object Level Authorization) protected: user can only query their own address.

Returns characters based on the user's current level in MongoDB (no on-chain call).

---

## Background Jobs

### syncNewUsersJob (Every 1 Minute)

**Purpose**: Auto-detect players who started playing via Unity but haven't connected a wallet yet.

```
Firebase RTDB                     syncNewUsersJob              MongoDB
    │                                  │                          │
    │  Read all users/                 │                          │
    │◀─────────────────────────────────│                          │
    │── { uid1: {Score:500}, ... } ───▶│                          │
    │                                  │                          │
    │                                  │  For each Firebase UID:  │
    │                                  │  Check if exists in      │
    │                                  │  MongoDB                 │
    │                                  │─────────────────────────▶│
    │                                  │  ◀── null (not found) ───│
    │                                  │                          │
    │                                  │  Create User:            │
    │                                  │  { uid, playerType:      │
    │                                  │    "web2", score: 500 }  │
    │                                  │─────────────────────────▶│
    │                                  │                          │
    │  Write { hasNFT: false,          │                          │
    │          level: 0 }              │                          │
    │◀─────────────────────────────────│                          │
```

This is how WEB2 players (no wallet) get into the system. The game writes to Firebase, the cron job picks them up.

### syncScoresJob (Every 5 Minutes)

**Purpose**: Pull game scores from Firebase into MongoDB.

```
Firebase RTDB                     syncScoresJob              MongoDB
    │                                  │                          │
    │  Read all users/                 │                          │
    │◀─────────────────────────────────│                          │
    │── { uid1: {Score:1500}, ... } ──▶│                          │
    │                                  │                          │
    │                                  │  For each user:          │
    │                                  │  Find in MongoDB         │
    │                                  │─────────────────────────▶│
    │                                  │  ◀── user (Score:1000) ──│
    │                                  │                          │
    │                                  │  Score delta = 500       │
    │                                  │  Validate:               │
    │                                  │  • delta <= 5000/sync    │
    │                                  │  • daily earnings cap    │
    │                                  │                          │
    │                                  │  Update user:            │
    │                                  │  score=1500, points+=500 │
    │                                  │  highScore = max(1500)   │
    │                                  │  gamesPlayed += 1        │
    │                                  │─────────────────────────▶│
    │                                  │                          │
    │                                  │  Upsert leaderboard      │
    │                                  │  entry for this week     │
    │                                  │─────────────────────────▶│
```

---

## Anti-Cheat System

The anti-cheat system runs during score syncs (`syncScoresJob`). Two checks are performed per sync cycle:

```
Score delta = 500 since last sync

Check 1: MAX_POINTS_PER_MATCH cap (5000 per sync)
  500 <= 5000 → PASS (delta capped at 5000 if exceeded)
  If exceeded → threat score += 5 (VELOCITY_EXPLOIT)

Check 2: Daily earnings cap (50,000 pts/day)
  Today's total + 500 = 2500 → PASS (< 50,000)
  If exceeded → points capped to remaining daily allowance

Both checks pass → score accepted, points awarded
```

> **Note**: The `checkVelocity` (pts/sec) and session duration functions exist in `antiCheat.js` but are not currently called during score sync. They are available for future use (e.g., real-time game session endpoints).

If a check fails:
```
Delta exceeds MAX_POINTS_PER_MATCH → threat score += 5

Threat score thresholds:
  0-99:    Active (normal play)
  100-149: Cooldown (score capped, warning)
  150-249: Temporary ban (24 hours)
  250+:    Permanent ban
```

---

## Player Type Transitions

```
                    ┌──────────────┐
                    │  NEW PLAYER  │
                    │  (from game) │
                    └──────┬───────┘
                           │
                    syncNewUsersJob
                    detects Firebase UID
                           │
                           ▼
                    ┌──────────────┐
                    │    WEB2      │
                    │  (no wallet) │
                    │              │
                    │ Can play game│
                    │ Earns points │
                    │ NO tokens    │
                    │ NO tourneys  │
                    └──────┬───────┘
                           │
                    User connects wallet
                    + owns ChainBoi NFT
                    (login detects on-chain)
                           │
                           ▼
                    ┌──────────────┐
                    │    WEB3      │
                    │ (has wallet  │
                    │  + NFT)      │
                    │              │
                    │ Full access  │
                    │ Tournaments  │
                    │ Points→$BTLR │
                    │ Level-up     │
                    └──────┬───────┘
                           │
                    Sells/transfers NFT
                    (next login detects
                     NFT is gone)
                           │
                           ▼
                    ┌──────────────┐
                    │  WEB2 again  │
                    │ (downgraded) │
                    └──────────────┘
```

---

## Character Unlock Table

The actual character names (from `config/constants.js`):

| Level | Characters | Names |
|-------|-----------|-------|
| 0 | 4 | Recruit_A, Recruit_B, Recruit_C, Recruit_D |
| 1 | +4 (8 total) | Soldier_A, Soldier_B, Soldier_C, Soldier_D |
| 2 | +4 (12 total) | Veteran_A, Veteran_B, Veteran_C, Veteran_D |
| 3 | +4 (16 total) | Elite_A, Elite_B, Elite_C, Elite_D |
| 4 | +4 (20 total) | Spec_Ops_A, Spec_Ops_B, Spec_Ops_C, Spec_Ops_D |
| 5 | +4 (24 total) | Commander_A, Commander_B, Commander_C, Commander_D |
| 6 | +4 (28 total) | General_A, General_B, General_C, General_D |
| 7 | +4 (32 total) | Legend_A, Legend_B, Legend_C, Legend_D |

Base weapons (always available, not NFTs): **Pistol, Knife, Shotgun, SMG**

---

## Rate Limits

| Endpoint Group | Limit | Window | Message |
|---------------|-------|--------|---------|
| Auth (`/auth/create-user`, `/auth/login`) | 20 requests | 15 minutes | "Too many auth attempts. Please try again later." |
| General (all `/api/*` routes) | 10,000 requests | 1 hour | "Too many requests from this IP, please try again in an hour!" |

The auth limiter is applied specifically to `create-user` and `login` routes. All API routes (including game, health, etc.) fall under the general limiter. Rate limit responses return HTTP 429.

---

## Error Response Format

**Production:**
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

**Development** (note: key is `error`, not `message`):
```json
{
  "success": false,
  "error": "Human-readable error description",
  "stack": "Error: ...\n    at ..."
}
```

| Status | When |
|--------|------|
| 400 | Bad input (invalid email, missing address, bad tokenId) |
| 401 | Missing or invalid Firebase token |
| 403 | Banned user, or BOLA violation (querying another user's address) |
| 404 | User not found, resource not found |
| 429 | Rate limit exceeded |
| 503 | Contract not configured (CHAINBOIS_NFT_ADDRESS not set) |

---

## Test Coverage

Phase 1 has 187 passing tests across 15 test suites:

```
__tests__/
├── antiCheat.test.js          ← Threat scoring, bans, velocity checks
├── apiFeatures.test.js        ← Query filtering, sorting, pagination
├── appError.test.js           ← Error class behavior
├── catchAsync.test.js         ← Async error wrapper
├── constants.test.js          ← Character unlock math, config values
├── cryptUtils.test.js         ← AES encrypt/decrypt
├── discordService.test.js     ← Discord webhook notifications
├── errorHandler.test.js       ← Global error handler
├── formatUtils.test.js        ← Number/string formatting
├── gameController.test.js     ← verify-assets, set-avatar, characters
├── nftUtils.test.js           ← lookupNftAssets (with/without NFTs)
├── retryHelper.test.js        ← Retry with backoff
├── syncNewUsersJob.test.js    ← Firebase → MongoDB new user sync
├── syncScoresJob.test.js      ← Score sync + anti-cheat validation
└── validateEndpoint.test.js   ← Unknown route handling
```

---

## Confirmation: Phase 1 is Complete

- [x] Firebase Auth integration (create, verify, revoke)
- [x] Wallet-based login with on-chain NFT checking
- [x] Auto WEB2 ↔ WEB3 player type transitions
- [x] Asset verification endpoint
- [x] Set avatar with on-chain ownership verification
- [x] Character/weapon unlock based on NFT level
- [x] Firebase RTDB sync for Unity game
- [x] Background job: sync new users (1 min)
- [x] Background job: sync scores (5 min)
- [x] Anti-cheat: velocity, session, daily cap, threat scoring, bans
- [x] Rate limiting (auth: 20/15min, general: 10,000/1hr)
- [x] BOLA protection on character endpoint
- [x] 503 graceful degradation when contracts not configured
- [x] 187 unit tests passing
- [x] Frontend API docs (FRONTEND_API.md)
- [x] Frontend integration guide (FRONTEND_INTEGRATION.md)
- [x] Postman collection (POSTMAN_COLLECTION.json)
