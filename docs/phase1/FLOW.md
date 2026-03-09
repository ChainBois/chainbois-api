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
- Character/weapon unlock system based on NFT level (characters handled game-side only, not returned by API)

---

## Architecture Diagram

```
+---------------------------------------------------------------------------+
|                          FRONTEND (React)                                  |
|                                                                            |
|  1. User signs up -> POST /auth/create-user                               |
|  2. User logs in with Firebase (email/password)                            |
|  3. User connects wallet (Thirdweb)                                        |
|  4. Frontend calls POST /auth/login { address }                            |
|     with Authorization: Bearer {firebaseIdToken}                           |
|  5. Receives: { user, assets, weapons }                                    |
|  6. Displays dashboard                                                     |
+-----------------------------+----------------------------------------------+
                              |
                     HTTPS + Firebase Token
                              |
                              v
+---------------------------------------------------------------------------+
|                        CHAINBOIS API (Express)                             |
|                                                                            |
|  +----------+  +-----------+  +----------+  +-------------+               |
|  |  Auth    |  |   Game    |  |  Health  |  |  Middleware  |               |
|  |  Routes  |  |  Routes   |  |  Routes  |  |             |               |
|  |          |  |           |  |          |  | - Firebase   |               |
|  | create   |  | verify    |  | /health  |  |   Auth       |               |
|  | check    |  | set-      |  |          |  | - Rate       |               |
|  | login    |  |  avatar   |  |          |  |   Limit      |               |
|  | me       |  | download  |  |          |  | - Anti-      |               |
|  | logout   |  | info      |  |          |  |   Cheat      |               |
|  +----+-----+  +----+------+  +----------+  +-------------+               |
|       |             |                                                      |
|       v             v                                                      |
|  +------------------------+   +------------------------+                   |
|  |      MongoDB            |   |  Firebase Admin SDK    |                   |
|  |                         |   |                        |                   |
|  | - User (profile,       |   | - Auth (create,        |                   |
|  |   score, level,        |   |   verify, revoke)      |                   |
|  |   playerType)          |   |                        |                   |
|  | - SecurityProfile      |   | - Realtime DB          |                   |
|  |   (threat score,       |   |   (write hasNFT,       |                   |
|  |    violations)         |   |    level, weapons      |                   |
|  | - WeeklyLeaderboard    |   |    for Unity game)     |                   |
|  | - ScoreChange          |   |                        |                   |
|  | - Wallet (encrypted)   |   +----------+-------------+                   |
|  +------------------------+              |                                  |
|                                          | Firebase RTDB                    |
|  +------------------------+             | users/{uid}:                     |
|  |  Avalanche C-Chain      |             |  { username, Score,              |
|  |                         |             |    hasNFT, level,                |
|  | - Glacier Data API      |             |    weapons }                     |
|  |   (NFT ownership)      |             |         ^                        |
|  | - Contract calls        |             |         |                        |
|  |   (getLevel, etc)      |             |    Unity Game                    |
|  +------------------------+             |    reads this                    |
|                                          |         |                        |
|  +------------------------+             |         v                        |
|  |   Background Jobs       |<------------+                                  |
|  |                         |  Polls Firebase daily (midnight)               |
|  | - syncNewUsers          |  Detects unregistered players                  |
|  |   (daily cron)         |  Creates as WEB2 in MongoDB                    |
|  |                         |                                                |
|  | - syncScores            |  Polls Firebase every 5 min                    |
|  |   (5 min cron)         |  Updates score, highScore, points              |
|  |   Syncs Score ->        |  Validates via anti-cheat                      |
|  |   MongoDB, validates    |  Updates leaderboard + ScoreChange             |
|  |   anti-cheat            |                                                |
|  +------------------------+                                                |
+---------------------------------------------------------------------------+
```

---

## Blockchain Explorer (Snowtrace Fuji Testnet)

| Contract/Wallet | Address | Explorer Link |
|-----------------|---------|---------------|
| BattleToken | `0xF16214F76f19bD1E6d3349fC199B250a8E441E8C` | [Snowtrace](https://testnet.snowtrace.io/address/0xF16214F76f19bD1E6d3349fC199B250a8E441E8C) |
| ChainBoisNFT | `0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5` | [Snowtrace](https://testnet.snowtrace.io/address/0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5) |
| WeaponNFT | `0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28` | [Snowtrace](https://testnet.snowtrace.io/address/0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28) |
| Deployer | `0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0` | [Snowtrace](https://testnet.snowtrace.io/address/0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0) |
| NFT Store | `0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0` | [Snowtrace](https://testnet.snowtrace.io/address/0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0) |
| Weapon Store | `0xD40e6631617B7557C28789bAc01648A74753739C` | [Snowtrace](https://testnet.snowtrace.io/address/0xD40e6631617B7557C28789bAc01648A74753739C) |
| Prize Pool | `0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e` | [Snowtrace](https://testnet.snowtrace.io/address/0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e) |

---

## Endpoint-by-Endpoint Flow

### 0. GET /api/v1/auth/check-user/:email (Public)

**Purpose**: Check if a user exists in Firebase Auth before showing signup form.

```
Frontend                              API                           Firebase
   |                                   |                              |
   |  GET /auth/check-user/a@b.com    |                              |
   |---------------------------------->|                              |
   |                                   |  Validate email format       |
   |                                   |  firebase.getUserByEmail()   |
   |                                   |----------------------------->|
   |                                   |  <-- user record or error ---|
   |                                   |                              |
   |  <--- 200 { exists: true/false } |                              |
```

---

### 1. POST /api/v1/auth/create-user (Public)

**Purpose**: Register a new user in Firebase.

```
Frontend                              API                           Firebase
   |                                   |                              |
   |  POST /auth/create-user           |                              |
   |  { email, password, username }    |                              |
   |---------------------------------->|                              |
   |                                   |  Validate inputs             |
   |                                   |  - email format              |
   |                                   |  - password >= 6 chars       |
   |                                   |  - username non-empty, <= 100|
   |                                   |                              |
   |                                   |  firebase.createUser()       |
   |                                   |----------------------------->|
   |                                   |                              |  Creates Auth record
   |                                   |  <------------- uid ---------|
   |                                   |                              |
   |                                   |  firebase.RTDB.update()      |
   |                                   |----------------------------->|
   |                                   |                              |  users/{uid}:
   |                                   |                              |   username: "ChainBoi_001"
   |                                   |                              |   Score: 0
   |                                   |                              |   hasNFT: false
   |                                   |                              |   level: 0
   |                                   |                              |
   |  <--- 201 { uid } ---------------|                              |
   |                                   |                              |
   |  Frontend signs in with Firebase: |                              |
   |  signInWithEmailAndPassword()     |                              |
```

**Error cases:**
- 400: Missing/invalid email, short password, empty username
- 400: "Email is already registered" (Firebase `auth/email-already-exists`)

---

### 2. POST /api/v1/auth/login (Protected)

**Purpose**: Connect wallet, check NFTs, sync to Firebase for game.

This is the most complex endpoint. Full flow:

1. Verify Firebase token -> get uid
2. Validate address (ethers.isAddress)
3. Check address not used by another user
4. Check ban status via SecurityProfile
5. Get username from Firebase RTDB
6. Find user by address (primary) or uid (fallback for web2->web3 upgrade), or create new
7. Check NFTs on-chain (Glacier Data API + contract.getLevel)
8. Update user in MongoDB (hasNft, nftTokenId, level, playerType)
9. Write to Firebase for Unity game ({ hasNFT, level, weapons })
10. Return { user, assets, weapons }

**Key behaviors:**
- First login creates user in MongoDB
- If user has NFT -> `playerType: "web3"`, unlocks premium features
- If user loses NFT (sold/transferred) -> auto-downgrade to `"web2"`
- Firebase RTDB updated for Unity game to read
- Address collision prevented (one wallet per user)

---

### 3. GET /api/v1/auth/me (Protected)

**Purpose**: Get current user profile from MongoDB (no on-chain check). Fast endpoint.

---

### 4. POST /api/v1/auth/logout (Protected)

**Purpose**: End session, revoke tokens, clear game data in Firebase RTDB so Unity resets.

---

### 5. POST /api/v1/game/verify-assets (Protected)

**Purpose**: Re-fetch on-chain NFT data without re-logging in.

> **Note**: Characters are handled game-side only (Unity reads the level from Firebase and unlocks characters locally). The API does not return character lists.

---

### 6. POST /api/v1/game/set-avatar (Protected)

**Purpose**: Set the user's active ChainBoi NFT (CB) avatar. Verifies on-chain ownership via `ownerOf()`, gets level via `getLevel()`.

---

## Background Jobs

### syncNewUsersJob (Daily at Midnight)

**Purpose**: Auto-detect players who started playing via Unity but haven't connected a wallet yet.

The game writes to Firebase via Firebase SDK. This cron job polls Firebase, detects new UIDs not in MongoDB, and creates WEB2 user records. This is how web2 players enter the system. Also increments platform metrics (`PlatformMetrics.incrementUsers("web2")`) for each new user.

### syncScoresJob (Every 5 Minutes)

**Purpose**: Pull game scores from Firebase into MongoDB and propagate to NFT metadata.

For each user with a score change:
1. Calculate delta (Firebase score - MongoDB score)
2. Validate via anti-cheat (cap at MAX_POINTS_PER_MATCH, daily earnings limit)
3. Update user score, highScore, pointsBalance, gamesPlayed
4. Sync in-game stats to ChainBoi NFTs (if user has wallet + NFT): `ChainboiNft.inGameStats.score` and `.gamesPlayed`
5. Upsert weekly leaderboard entry
6. Create ScoreChange record (for time-period leaderboard queries)
7. Emit real-time leaderboard updates via Socket.IO (for active tournaments)

**NFT stats sync**: When a user has `address` and `hasNft`, the sync job propagates their cumulative score and gamesPlayed to all ChainBoi NFTs they own. This feeds the dynamic metadata endpoint (`GET /api/v1/metadata/:tokenId.json`), so marketplaces and explorers see live game stats on NFTs.

---

## Anti-Cheat System

The anti-cheat system runs during score syncs (`syncScoresJob`). Two checks per sync cycle:

```
Score delta = 500 since last sync

Check 1: MAX_POINTS_PER_MATCH cap (5000 per sync)
  500 <= 5000 -> PASS (delta capped at 5000 if exceeded)
  If exceeded -> threat score += 5 (VELOCITY_EXPLOIT)

Check 2: Daily earnings cap (50,000 pts/day)
  Today's total + 500 = 2500 -> PASS (< 50,000)
  If exceeded -> points capped to remaining daily allowance

Both checks pass -> score accepted, points awarded
```

Threat score thresholds:
```
  0-99:    Active (normal play)
  100-149: Cooldown (score capped, warning)
  150-249: Temporary ban (24 hours)
  250+:    Permanent ban
```

---

## Player Type Transitions

```
                    +---------------+
                    |  NEW PLAYER   |
                    |  (from game)  |
                    +------+--------+
                           |
                    syncNewUsersJob
                    detects Firebase UID
                           |
                           v
                    +---------------+
                    |    WEB2       |
                    |  (no wallet)  |
                    |               |
                    | Can play game |
                    | Earns points  |
                    | NO tokens     |
                    | NO tourneys   |
                    +------+--------+
                           |
                    User connects wallet
                    + owns ChainBoi NFT (CB)
                    (login detects on-chain)
                           |
                           v
                    +---------------+
                    |    WEB3       |
                    | (has wallet   |
                    |  + NFT)       |
                    |               |
                    | Full access   |
                    | Tournaments   |
                    | Points->$BTLR |
                    | Level-up      |
                    +------+--------+
                           |
                    Sells/transfers NFT
                    (next login detects
                     NFT is gone)
                           |
                           v
                    +---------------+
                    |  WEB2 again   |
                    | (downgraded)  |
                    +---------------+
```

---

## Character Unlock Table

> **Note**: Characters are handled game-side only. The API provides the player's level via Firebase RTDB; Unity uses the level to unlock characters locally. The API does not return character lists in any endpoint.

The actual character names (army ranks, from `config/constants.js`):

| Level | Characters | Rank |
|-------|-----------|------|
| 0 | 4 | Private_A, Private_B, Private_C, Private_D |
| 1 | +4 (8 total) | Corporal_A, Corporal_B, Corporal_C, Corporal_D |
| 2 | +4 (12 total) | Sergeant_A, Sergeant_B, Sergeant_C, Sergeant_D |
| 3 | +4 (16 total) | Captain_A, Captain_B, Captain_C, Captain_D |
| 4 | +4 (20 total) | Major_A, Major_B, Major_C, Major_D |
| 5 | +4 (24 total) | Colonel_A, Colonel_B, Colonel_C, Colonel_D |
| 6 | +4 (28 total) | Major_General_A, Major_General_B, Major_General_C, Major_General_D |
| 7 | +4 (32 total) | Field_Marshal_A, Field_Marshal_B, Field_Marshal_C, Field_Marshal_D |

Base weapons (always available, not NFTs): **M4, RENETTI, GUTTER KNIFE, RPG**

### All Weapons by Category (30 total)

| Category | Weapons |
|----------|---------|
| Assault | BP50, FR 5.56, M13, M16, M4, SCAR |
| SMG | STRIKER 45, FENNEC, MINI UZI, P90, MP40 |
| LMG | BRUEN MK9, HOLGER 26, RPD |
| Marksman | SP-R, KAR98K, LOCKWOOD MK2, INTERVENTION |
| Handgun | RENETTI, .50 GS, BASILISK, KIMBO |
| Launcher | RGL-80, RPG, THUMPER |
| Melee | GUTTER KNIFE, KARAMBIT, PICKAXE, MACHETE, SAMURAI SWORD |

---

## ChainBois NFT Details

| Property | Value |
|----------|-------|
| Symbol | CB |
| Total Supply | 4,032 |
| Public Supply | 4,000 |
| Reserved | 32 |
| Testnet Supply | 50 |

$BATTLE token uses **6 decimal places**.

---

## Rate Limits

| Endpoint Group | Limit | Window | Message |
|---------------|-------|--------|---------|
| Auth (`/auth/create-user`, `/auth/login`) | 20 requests | 15 minutes | "Too many auth attempts. Please try again later." |
| General (all `/api/*` routes) | 10,000 requests | 1 hour | "Too many requests from this IP, please try again in an hour!" |

---

## Test Coverage

207 passing tests across 17 test suites:

```
__tests__/
  antiCheat.test.js              <- Threat scoring, bans, velocity checks
  apiFeatures.test.js            <- Query filtering, sorting, pagination
  appError.test.js               <- Error class behavior
  catchAsync.test.js             <- Async error wrapper
  constants.test.js              <- Character unlock math, config values
  cryptUtils.test.js             <- AES encrypt/decrypt
  discordService.test.js         <- Discord webhook notifications
  errorHandler.test.js           <- Global error handler
  formatUtils.test.js            <- Number/string formatting
  gameController.test.js         <- verify-assets, set-avatar
  leaderboardController.test.js  <- Leaderboard endpoints (period, rank)
  nftUtils.test.js               <- lookupNftAssets (with/without NFTs)
  retryHelper.test.js            <- Retry with backoff
  scoreChangeModel.test.js       <- ScoreChange model validation
  syncNewUsersJob.test.js        <- Firebase -> MongoDB new user sync
  syncScoresJob.test.js          <- Score sync + anti-cheat validation
  validateEndpoint.test.js       <- Unknown route handling
```

---

## Confirmation: Phase 1 is Complete

- [x] Firebase Auth integration (create, verify, revoke)
- [x] Wallet-based login with on-chain NFT checking
- [x] Auto WEB2 <-> WEB3 player type transitions
- [x] Asset verification endpoint
- [x] Set avatar with on-chain ownership verification
- [x] Character unlock system (army ranks: Private through Field Marshal)
- [x] Weapon system (30 weapons across 7 categories)
- [x] Firebase RTDB sync for Unity game
- [x] Background job: sync new users (daily at midnight)
- [x] Background job: sync scores (5 min) with ScoreChange tracking + NFT stats propagation
- [x] Anti-cheat: velocity, session, daily cap, threat scoring, bans
- [x] Rate limiting (auth: 20/15min, general: 10,000/1hr)
- [x] 503 graceful degradation when contracts not configured
- [x] Leaderboard endpoints (period-filtered, rank lookup)
- [x] 207 unit tests passing
- [x] Frontend API docs (docs/phase1/FRONTEND_API.md)
- [x] Postman collection (docs/phase1/POSTMAN_COLLECTION.json)
