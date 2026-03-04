# Phase 1: Game Integration + Auth - Implementation Plan

## Overview
Implement Firebase authentication, wallet-based login, on-chain asset verification, Firebase Realtime DB sync for the Unity game, and two cron jobs (new user sync, score sync).

## Files to Create/Modify

### New Files (7)
1. `controllers/authController.js` - createUser, login, me, logout
2. `controllers/gameController.js` - verifyAssets, setAvatar, getCharacters, endSession
3. `jobs/syncNewUsersJob.js` - Poll Firebase every 1 min, create Web2 users
4. `jobs/syncScoresJob.js` - Sync scores from Firebase every 5 min
5. `middleware/antiCheat.js` - Score validation, threat scoring, ban enforcement
6. `__tests__/authController.test.js` - Auth endpoint tests
7. `__tests__/gameController.test.js` - Game endpoint tests

### Modified Files (4)
1. `routes/authRoutes.js` - Wire to authController
2. `routes/gameRoutes.js` - Wire to gameController
3. `server.js` - Load cron jobs on primary instance
4. `config/constants.js` - Add character unlock data

## Implementation Order
1. Constants (character unlock data)
2. Controllers (authController, gameController)
3. Routes (wire controllers)
4. Jobs (cron sync)
5. Anti-cheat middleware
6. Server.js (load crons)
7. Tests

---

## Detailed Implementation

### 1. `config/constants.js` - Add Character Data

```js
// Character unlock data per level
CHARACTERS_UNLOCK: {
  0: ["Recruit_A", "Recruit_B", "Recruit_C", "Recruit_D"],
  1: ["Soldier_A", "Soldier_B", "Soldier_C", "Soldier_D"],
  2: ["Veteran_A", "Veteran_B", "Veteran_C", "Veteran_D"],
  3: ["Elite_A", "Elite_B", "Elite_C", "Elite_D"],
  4: ["Spec_Ops_A", "Spec_Ops_B", "Spec_Ops_C", "Spec_Ops_D"],
  5: ["Commander_A", "Commander_B", "Commander_C", "Commander_D"],
  6: ["General_A", "General_B", "General_C", "General_D"],
  7: ["Legend_A", "Legend_B", "Legend_C", "Legend_D"],
},

BASE_WEAPONS_UNLOCK: ["Pistol", "Knife", "Shotgun", "SMG"],
```

### 2. `controllers/authController.js`

#### `createUser` - POST /api/v1/auth/create-user
- No auth required (public endpoint)
- Body: `{ email, password, username }`
- Validate: email format, password min 6 chars, username non-empty
- Call `admin.auth().createUser({ email, password, emailVerified: false })`
- Write to Firebase Realtime DB: `users/{uid}` = `{ username, email, Score: 0 }`
- Return 201: `{ success: true, data: { uid } }`

#### `login` - POST /api/v1/auth/login
- Auth: decodeToken middleware (req.user = decoded Firebase token)
- Body: `{ address }` (wallet address, required)
- Validate: address is valid EVM address (ethers.isAddress)
- Normalize address to lowercase
- Find or create User in MongoDB by uid:
  - If new: create with `{ uid, address, playerType: "web2", username (from Firebase) }`
  - If existing: update address if changed
- Check NFTs on-chain for address:
  - Call `getErc721Balances(address, CHAINBOIS_NFT_ADDRESS)`
  - If NFT found: set `hasNft: true`, get level from contract, get weapons
  - If user was web2 and now has NFT: upgrade `playerType` to "web3"
- Write to Firebase Realtime DB: `users/{uid}` update `{ hasNFT, level, weapons }`
- Update lastLogin timestamp
- Return 200: `{ success: true, data: { user, assets: { hasNft, nftTokenId, level }, weapons: [] } }`

#### `me` - GET /api/v1/auth/me
- Auth: decodeToken
- Find User by uid from req.user
- Return 200: `{ success: true, data: { user } }`

#### `logout` - POST /api/v1/auth/logout
- Auth: decodeToken
- Find User by uid
- Write to Firebase: `users/{uid}` update `{ hasNFT: false, weapons: [] }`
- Return 200: `{ success: true, message: "Logged out successfully" }`

### 3. `controllers/gameController.js`

#### `verifyAssets` - POST /api/v1/game/verify-assets
- Auth: decodeToken
- Find User by uid
- If no address: return 400 "No wallet address linked"
- Query on-chain: getErc721Balances for ChainBois NFTs
- Query on-chain: getErc721Balances for Weapon NFTs
- Determine: hasNft, nftTokenId, level (from contract or DB), weapons list
- Update User in MongoDB: hasNft, nftTokenId, level
- Write to Firebase: `users/{uid}` update `{ hasNFT, level, weapons }`
- Return 200: `{ success: true, data: { hasNft, nftTokenId, level, weapons, characters } }`

#### `setAvatar` - POST /api/v1/game/set-avatar
- Auth: decodeToken
- Body: `{ tokenId }` (the ChainBois NFT token ID to use)
- Find User by uid
- Verify user owns this tokenId on-chain (ownerOf check)
- Update User: nftTokenId = tokenId
- Get NFT level, determine unlocked characters/weapons
- Write to Firebase: `users/{uid}` update `{ hasNFT: true, level, weapons }`
- Return 200: `{ success: true, data: { tokenId, level, characters, weapons } }`

#### `getCharacters` - GET /api/v1/game/characters/:address
- Auth: decodeToken
- Validate address format
- Find User by address (lowercase)
- Get NFT level (from User model or on-chain)
- Calculate unlocked characters:
  - Level 0: 4 base characters + 4 base weapons
  - Level N: all chars from level 0 through N
- Return 200: `{ success: true, data: { level, characters: [...], weapons: [...] } }`

#### `endSession` - POST /api/v1/game/end-session
- Auth: decodeToken
- Find User by uid
- Write to Firebase: `users/{uid}` update `{ hasNFT: false, weapons: [] }`
- Return 200: `{ success: true, message: "Session ended" }`

### 4. `jobs/syncNewUsersJob.js`

Runs every 1 minute (PM2 instance 0 only).

```
Logic:
1. Read all users from Firebase: db.ref("users").once("value")
2. Get all existing UIDs from MongoDB: User.find({}).select("uid")
3. Build Set of existing UIDs
4. For each Firebase user NOT in MongoDB:
   a. Skip if firebaseId < 20 chars (malformed)
   b. Create User in MongoDB:
      - uid: firebaseId
      - username: userData.username || ""
      - playerType: "web2"
      - address: null
      - score: parseInt(userData.Score) || 0
      - pointsBalance: parseInt(userData.Score) || 0
      - hasNft: false
      - level: 0
   c. Write back to Firebase: users/{uid} update { level: 0, hasNFT: false }
   d. Log: "New Web2 user synced: {uid}"
5. Log summary: "Synced {count} new users"
```

### 5. `jobs/syncScoresJob.js`

Runs every 5 minutes (PM2 instance 0 only).

```
Logic:
1. Read all users from Firebase: db.ref("users").once("value")
2. For each Firebase user:
   a. Find matching MongoDB user by uid
   b. If not found, skip (syncNewUsers will handle)
   c. Get Firebase score: parseInt(userData.Score) || 0
   d. If score != MongoDB user.score:
      - Validate: score delta <= MAX_POINTS_PER_MATCH (5000) per sync
      - If delta > MAX_POINTS_PER_MATCH: flag as suspicious, cap at MAX
      - Update User: score, highScore = max(highScore, score)
      - Update User: gamesPlayed += 1, lastScoreSync = now
      - Calculate pointsEarned = min(scoreDelta, MAX_POINTS_PER_MATCH)
      - Add to pointsBalance
      - Upsert WeeklyLeaderboard: { uid, weekNumber, tournamentLevel, highScore, totalScore, gamesPlayed }
      - Create GameSession record (if tracking individual sessions)
   e. If user.isBanned: skip score update
3. Log summary: "Score sync complete: {updated}/{total} users updated"
```

### 6. `middleware/antiCheat.js`

Applied to score-processing endpoints and sync jobs.

```
Functions:
- validateScore(score, sessionDuration): Check score is within bounds
- checkVelocity(score, durationSeconds): score/time ratio check
- updateThreatScore(securityProfile, increment, reason): Add to threat, enforce thresholds
- enforceThresholds(securityProfile): Check COOLDOWN/TEMP_BAN/PERM_BAN thresholds
- checkDailyEarnings(securityProfile, pointsEarned): Cap daily earnings
```

### 7. Route Wiring

#### `routes/authRoutes.js`
```js
const authController = require("../controllers/authController");
router.post("/create-user", authLimiter, authController.createUser);
router.post("/login", authLimiter, decodeToken, authController.login);
router.get("/me", decodeToken, authController.me);
router.post("/logout", decodeToken, authController.logout);
```

#### `routes/gameRoutes.js`
```js
const gameController = require("../controllers/gameController");
router.post("/verify-assets", decodeToken, gameController.verifyAssets);
router.post("/set-avatar", decodeToken, gameController.setAvatar);
router.get("/characters/:address", decodeToken, gameController.getCharacters);
router.post("/end-session", decodeToken, gameController.endSession);
```

### 8. `server.js` - Cron Loading

```js
if (isPrimary) {
  const cron = require("node-cron");
  const { syncNewUsersJob } = require("./jobs/syncNewUsersJob");
  const { syncScoresJob } = require("./jobs/syncScoresJob");
  const { SYNC_NEW_USERS_INTERVAL, SYNC_SCORES_INTERVAL } = require("./config/constants");

  cron.schedule(SYNC_NEW_USERS_INTERVAL, syncNewUsersJob);
  cron.schedule(SYNC_SCORES_INTERVAL, syncScoresJob);
  console.log("Cron jobs started: syncNewUsers, syncScores");
}
```

---

## Firebase Data Flow

```
WEBSITE                    BACKEND                    FIREBASE DB              UNITY GAME
   |                          |                          |                        |
   |-- POST /auth/login -->   |                          |                        |
   |                          |-- check NFTs on-chain    |                        |
   |                          |-- write hasNFT/level --> |                        |
   |  <-- user + assets --    |                          |                        |
   |                          |                          |-- game reads hasNFT -->|
   |                          |                          |                        |
   |                          |                          |<-- game writes Score --|
   |                          |<-- cron reads Score --   |                        |
   |                          |-- updates MongoDB        |                        |
```

## Edge Cases to Handle
1. User logs in with new wallet address (different from stored) -> update address
2. User's NFT was transferred away since last login -> set hasNft: false
3. Firebase Score field doesn't exist or is NaN -> default to 0
4. Multiple users with same address -> reject, address should be unique per user
5. Cron job errors should not crash the server -> wrap in try/catch
6. Firebase connection lost during cron -> log error, retry next cycle
7. User banned -> skip score sync, block login with message
8. Web2 player upgrades -> preserve accumulated points
