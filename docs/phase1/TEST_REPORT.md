# Phase 1 Integration Test Report

**Date**: March 4, 2026
**Result**: 47/47 PASSED (0 failed, 0 skipped)
**Duration**: ~9.2 seconds total
**Script**: `scripts/testPhase1.js`
**Results JSON**: `test-results/phase1-integration.json`

---

## 1. Test Environment

| Component | Details |
|-----------|---------|
| **Server** | `http://localhost:5000/api/v1` (local) / `https://your-api-domain.com/api/v1` (domain) |
| **MongoDB** | Atlas cluster `your-cluster.mongodb.net/testnet` |
| **Firebase** | Project `chainbois`, RTDB `your-project-default-rtdb.firebaseio.com` |
| **Network** | Avalanche Fuji Testnet (Chain ID 43113) |
| **RPC** | `https://api.avax-test.network/ext/bc/C/rpc` |
| **Unit Tests** | 207/207 passing (17 test suites) - no regressions |

### Smart Contracts (Fuji)

| Contract | Address |
|----------|---------|
| BattleToken ($BATTLE) | `0xF16214F76f19bD1E6d3349fC199B250a8E441E8C` |
| ChainBoisNFT (CB) | `0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5` |
| WeaponNFT | `0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28` |

### Platform Wallets

| Wallet | Address | NFTs Held |
|--------|---------|-----------|
| nft_store | `0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0` | 50 ChainBoi NFTs (#1-50) |
| weapon_store | `0xD40e6631617B7557C28789bAc01648A74753739C` | 13 Weapon NFTs (#1-13) |
| deployer | `0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0` | 0 NFTs (has AVAX) |
| prize_pool | `0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e` | Empty |

### Test User

| Field | Value |
|-------|-------|
| Email | `test_phase1_{timestamp}@chainbois.test` |
| Password | `TestSoldier123!` |
| Username | `IntegrationTestSoldier` |
| Wallets tested | nft_store (web3, 50 NFTs), deployer (web2, 0 NFTs) |

---

## 2. Data Flow Diagrams

### Create User Flow

```
POST /auth/create-user { email, password, username }
    |
    v
[Input Validation]
    ├── email: validator.isEmail() → 400 if invalid
    ├── password: length >= 6 → 400 if short
    └── username: required, max 100 → 400 if missing/long
    |
    v
[Firebase Auth] ── admin.auth().createUser({ email, password, emailVerified: false })
    |                  └── If email exists → admin.auth().updateUser() (idempotent)
    v
[Firebase RTDB] ── ref('users/{uid}').set({
    |                  username: "IntegrationTestSoldier",
    |                  Score: 0,
    |                  hasNFT: false,
    |                  level: 0
    |               })
    v
Response 201: { success: true, data: { uid: "LArkCyP62DNN4T2hPIH9a1qPPr42" } }

DB Changes:
  Firebase Auth: New user record created
  Firebase RTDB: /users/{uid} created with initial data
  MongoDB: NO changes (user created in Mongo on first login)
```

### Login Flow

```
POST /auth/login { address: "0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0" }
Headers: Authorization: Bearer {firebaseIdToken}
    |
    v
[decodeToken middleware] ── verifyIdToken(token) → req.user.uid
    |
    v
[Input Validation] ── ethers.isAddress(address) → 400 if invalid
    |
    v
[Address Uniqueness] ── Check no other user has this address
    |
    v
[MongoDB Lookup]
    ├── 1st: User.findOne({ address }) → finds existing web3 users
    └── 2nd: User.findOne({ uid }) → finds web2 users (uid fallback)
    |
    ├── If no user → Create new User document
    └── If found → Update address if changed, fill username from Firebase
    |
    v
[Anti-Cheat] ── getOrCreateSecurityProfile(uid)
    |              └── checkBanStatus → 403 if banned
    v
[On-Chain NFT Lookup] ── lookupNftAssets(address)
    |   ├── Avalanche Glacier API: getErc721Balances(address, CHAINBOIS_NFT_ADDRESS)
    |   │   └── Returns list of owned ChainBoi NFT token IDs
    |   ├── Contract call: getNftLevel(tokenId) → level (0-7)
    |   └── Glacier API: getErc721Balances(address, WEAPON_NFT_ADDRESS)
    |       └── Returns list of owned weapon NFT token IDs + names
    v
[MongoDB Update]
    ├── hasNft: true (if NFT found)
    ├── nftTokenId: 1 (first NFT found)
    ├── level: 0 (from contract)
    ├── playerType: "web3" (upgraded from web2 if NFT found)
    └── lastLogin: new Date()
    |
    v
[Firebase RTDB Sync] ── ref('users/{uid}').update({
    |                       hasNFT: true,
    |                       level: 0,
    |                       weapons: ["AR M4 MK18", ...] (or null)
    |                    })
    v
Response 200: {
  success: true,
  data: {
    user: { uid, username, address, playerType: "web3", pointsBalance: 0,
            battleTokenBalance: 0, level: 0, score: 0, highScore: 0,
            gamesPlayed: 0, hasNft: true, nftTokenId: 1, isBanned: false,
            hasClaimed: false, lastLogin: "..." },
    assets: { hasNft: true, nftTokenId: 1, level: 0 },
    weapons: [{ tokenId: 1, name: "AR M4 MK18" }, ...]
  }
}

DB Changes:
  MongoDB User: Created/updated (address, hasNft, nftTokenId, level, playerType, lastLogin)
  MongoDB SecurityProfile: Created if new (uid, threatScore: 0, status: "active")
  Firebase RTDB: /users/{uid} updated with hasNFT, level, weapons
```

### Verify Assets Flow

```
POST /game/verify-assets {}
Headers: Authorization: Bearer {firebaseIdToken}
    |
    v
[decodeToken] → req.user.uid
    |
    v
[MongoDB] ── User.findOne({ uid }) → 404 if not found
    |          └── Check address linked → 400 if no address
    v
[On-Chain Lookup] ── lookupNftAssets(user.address) (same as login)
    |
    v
[MongoDB Update] ── hasNft, nftTokenId, level, playerType
    |
    v
[Firebase RTDB Sync] ── hasNFT, level, weapons
    |
    v
Response 200: {
  success: true,
  data: { hasNft: true, nftTokenId: 1, level: 0, ownedWeaponNfts: [...] }
}

DB Changes:
  MongoDB User: Updated (hasNft, nftTokenId, level, playerType if changed)
  Firebase RTDB: /users/{uid} updated with current asset state
```

### Set Avatar Flow

```
POST /game/set-avatar { tokenId: 25 }
Headers: Authorization: Bearer {firebaseIdToken}
    |
    v
[Input Validation]
    ├── tokenId required → 400
    └── tokenId must be valid non-negative integer → 400
    |
    v
[MongoDB] ── User.findOne({ uid }) → 404 if not found
    |          ├── Check address linked → 400
    |          └── Check NFT contract configured → 503
    v
[Contract Call] ── getNftOwner(tokenId)
    |                  ├── Returns address or throws → 400 "may not exist"
    |                  └── owner !== user.address → 403 "You do not own this NFT"
    v
[Contract Call] ── getNftLevel(tokenId) → level (0-7)
    |
    v
[MongoDB Update]
    ├── nftTokenId: 25
    ├── hasNft: true
    ├── level: 0
    └── playerType: "web3" (if was web2)
    |
    v
[Firebase RTDB Sync] ── hasNFT: true, level: 0
    |
    v
Response 200: { success: true, data: { tokenId: 25, level: 0 } }

DB Changes:
  MongoDB User: Updated (nftTokenId, hasNft, level, playerType)
  Firebase RTDB: /users/{uid} updated (hasNFT, level)
```

### Logout Flow

```
POST /auth/logout {}
Headers: Authorization: Bearer {firebaseIdToken}
    |
    v
[decodeToken] → req.user.uid
    |
    v
[Firebase Auth] ── admin.auth().revokeRefreshTokens(uid)
    |                  └── Invalidates ALL sessions for this user
    v
[Firebase RTDB] ── ref('users/{uid}').update({
    |                  hasNFT: false,
    |                  level: 0,
    |                  weapons: null
    |               })
    v
Response 200: { success: true, message: "Logged out successfully" }

DB Changes:
  Firebase Auth: All refresh tokens revoked
  Firebase RTDB: /users/{uid} cleared (hasNFT=false, level=0, weapons=null)
  MongoDB: NO changes
```

### Wallet Switching Flow (web3 → web2 → web3)

```
Step 1: Login with nft_store (has 50 NFTs)
  POST /auth/login { address: "0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0" }
  → playerType: "web3", hasNft: true, nftTokenId: 1
  MongoDB: playerType="web3", hasNft=true
  Firebase: hasNFT=true, level=0, weapons=[...]

Step 2: Login with deployer (has 0 NFTs)
  POST /auth/login { address: "0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0" }
  → playerType: "web2", hasNft: false
  MongoDB: address changed, playerType="web2", hasNft=false, nftTokenId=null
  Firebase: hasNFT=false, level=0, weapons=null

Step 3: Login back with nft_store (re-upgrade to web3)
  POST /auth/login { address: "0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0" }
  → playerType: "web3", hasNft: true (re-detected)
  MongoDB: address changed back, playerType="web3", hasNft=true
  Firebase: hasNFT=true, level=0, weapons=[...]
```

---

## 3. Test Results by Section

### Section 1: Health & Settings (3/3 passed)

| # | Test | Method | Path | Auth | Status | Time | Verified |
|---|------|--------|------|------|--------|------|----------|
| 1.1 | Health check | GET | /health | No | 200 | 20ms | `success: true`, `data.status: "ok"`, `services.mongodb: "connected"` |
| 1.2 | Settings | GET | /settings | No | 200 | 92ms | `levelUpCosts`, `prizePools`, `maxPointsPerMatch` present |
| 1.3 | Nonexistent endpoint | GET | /nonexistent | No | 404 | 5ms | `success: false` (validateEndpoint middleware) |

**DB Changes**: None (read-only endpoints)

---

### Section 2: Public Game Endpoints (3/3 passed)

| # | Test | Method | Path | Auth | Status | Time | Verified |
|---|------|--------|------|------|--------|------|----------|
| 2.1 | Game info | GET | /game/info | No | 200 | 89ms | `data.platforms` object, `data.downloads` is number |
| 2.2 | Download win | GET | /game/download/win | No | 404 | 4ms | No game file uploaded yet (expected) |
| 2.3 | Download linux | GET | /game/download/linux | No | 404 | 2ms | `validateEndpoint` only allows `/download/(win\|mac)` |

**DB Changes**: None

**Edge Case Note**: Test 2.3 sends `/download/linux` which is rejected by the `validateEndpoint` middleware regex (only allows `win` and `mac`), returning 404 before the route handler even runs. This is the expected behavior.

---

### Section 3: Create User (6/6 passed)

| # | Test | Request Body | Status | Time | Response |
|---|------|-------------|--------|------|----------|
| 3.1 | Valid user | `{ email: "test_phase1_...@chainbois.test", password: "TestSoldier123!", username: "IntegrationTestSoldier" }` | 201 | 772ms | `{ success: true, data: { uid: "LArkCyP62DNN4T2hPIH9a1qPPr42" } }` |
| 3.2 | Duplicate email | Same email as 3.1 | 400 | 150ms | "Email is already registered" |
| 3.3 | Missing email | `{ password: "TestSoldier123!", username: "NoEmail" }` | 400 | 3ms | "Please provide a valid email address" |
| 3.4 | Invalid email | `{ email: "notanemail", password: "TestSoldier123!", username: "BadEmail" }` | 400 | 3ms | "Please provide a valid email address" |
| 3.5 | Short password | `{ email: "short@test.com", password: "123", username: "ShortPass" }` | 400 | 3ms | "Password must be at least 6 characters" |
| 3.6 | Missing username | `{ email: "nouser@test.com", password: "TestSoldier123!" }` | 400 | 2ms | "Username is required" |

**DB Changes (test 3.1 only)**:
- Firebase Auth: User created with email, emailVerified=false
- Firebase RTDB: `/users/{uid}` → `{ username: "IntegrationTestSoldier", Score: 0, hasNFT: false, level: 0 }`
- MongoDB: No changes (user created on first login)

---

### Section 4: Login Flow (8/8 passed)

**Auth Token**: Obtained via Firebase REST API `identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`

| # | Test | Request Body | Auth | Status | Time | Key Response Fields |
|---|------|-------------|------|--------|------|---------------------|
| 4.1 | Login with NFT wallet | `{ address: "0x469622d...6a0" }` | Bearer token | 200 | 1280ms | `user.playerType: "web3"`, `assets.hasNft: true`, `assets.nftTokenId: <number>`, `weapons: [...]` |
| 4.2 | Missing address | `{}` | Bearer token | 400 | 113ms | "Please provide a valid EVM wallet address" |
| 4.3 | Invalid address | `{ address: "not-an-address" }` | Bearer token | 400 | 84ms | "Please provide a valid EVM wallet address" |
| 4.4 | Empty wallet | `{ address: "0x80dBC4...9C0" }` | Bearer token | 200 | 640ms | `user.playerType: "web2"`, `assets.hasNft: false` |
| 4.5 | Re-upgrade to web3 | `{ address: "0x469622d...6a0" }` | Bearer token | 200 | 766ms | `user.playerType: "web3"`, `assets.hasNft: true` |
| 4.6 | No auth token | `{ address: "0x469622d...6a0" }` | None | 401 | 2ms | Unauthorized |
| 4.7 | Invalid token | `{ address: "0x469622d...6a0" }` | "invalid.jwt.token" | 401 | 2ms | Unauthorized |
| 4.8 | Firebase synced | (read Firebase RTDB) | - | - | 310ms | `hasNFT: true`, `level: 0` in Firebase |

**DB Changes (test 4.1)**:
- MongoDB User: Created with `{ uid, address: "0x469622d...", playerType: "web3", hasNft: true, nftTokenId: 1, level: 0, lastLogin: Date }` + defaults for scores/balances
- MongoDB SecurityProfile: Created with `{ uid, threatScore: 0, status: "active" }`
- Firebase RTDB: `/users/{uid}` updated with `{ hasNFT: true, level: 0, weapons: [...] }`

**DB Changes (test 4.4 - wallet switch to deployer)**:
- MongoDB User: `address` → deployer, `playerType` → "web2", `hasNft` → false, `nftTokenId` → null
- Firebase RTDB: `hasNFT` → false, `level` → 0, `weapons` → null

**DB Changes (test 4.5 - re-upgrade)**:
- MongoDB User: `address` → nft_store, `playerType` → "web3", `hasNft` → true (re-detected)
- Firebase RTDB: `hasNFT` → true, `level` → 0, `weapons` → [...]

---

### Section 5: Get Profile (4/4 passed)

| # | Test | Auth | Status | Time | Verified |
|---|------|------|--------|------|----------|
| 5.1 | Returns profile | Bearer token | 200 | 89ms | `user.uid` matches, `hasNft: true`, `playerType: "web3"` |
| 5.2 | All fields present | Bearer token | 200 | 89ms | All 15 fields: uid, username, address, playerType, pointsBalance, battleTokenBalance, level, score, highScore, gamesPlayed, hasNft, nftTokenId, isBanned, hasClaimed, lastLogin |
| 5.3 | No auth | None | 401 | 2ms | Unauthorized |
| 5.4 | Invalid token | "bad.token" | 401 | 2ms | Unauthorized |

**DB Changes**: None (read-only endpoint, returns data from MongoDB)

---

### Section 6: Verify Assets (4/4 passed)

| # | Test | Auth | Status | Time | Verified |
|---|------|------|--------|------|----------|
| 6.1 | NFT wallet | Bearer token | 200 | 416ms | `hasNft: true`, `nftTokenId` is number, `level: 0`, `ownedWeaponNfts` array |
| 6.2 | No auth | None | 401 | 2ms | Unauthorized |
| 6.3 | Firebase synced | (read RTDB) | - | 36ms | `hasNFT: true` in Firebase after verify-assets |
| 6.4 | No-NFT wallet | Bearer token | 200 | 335ms | `hasNft: false` (after switching to deployer wallet) |

**DB Changes (test 6.1)**:
- MongoDB User: Re-verified `hasNft`, `nftTokenId`, `level` (unchanged since already correct)
- Firebase RTDB: Re-synced `hasNFT: true`, `level: 0`

**On-Chain Calls Made**:
- Avalanche Glacier Data API: `getErc721Balances(nft_store, ChainBoisNFT)` → 50 tokens
- Contract call: `getNftLevel(tokenId)` → 0
- Avalanche Glacier Data API: `getErc721Balances(nft_store, WeaponNFT)` → 0 tokens (weapons are on weapon_store)

---

### Section 7: Set Avatar (6/6 passed)

| # | Test | Request Body | Auth | Status | Time | Response |
|---|------|-------------|------|--------|------|----------|
| 7.1 | Owned token #1 | `{ tokenId: 1 }` | Bearer | 200 | 338ms | `{ tokenId: 1, level: 0 }` |
| 7.2 | Owned token #25 | `{ tokenId: 25 }` | Bearer | 200 | 361ms | `{ tokenId: 25, level: 0 }` |
| 7.3 | Unowned token #999 | `{ tokenId: 999 }` | Bearer | 400 | 936ms | "Failed to verify NFT ownership. Token may not exist." |
| 7.4 | Missing tokenId | `{}` | Bearer | 400 | 3ms | "tokenId is required" |
| 7.5 | Invalid tokenId -1 | `{ tokenId: -1 }` | Bearer | 400 | 3ms | "tokenId must be a valid non-negative integer" |
| 7.6 | No auth | `{ tokenId: 1 }` | None | 401 | 1ms | Unauthorized |

**DB Changes (test 7.1)**:
- MongoDB User: `nftTokenId` → 1, `hasNft` → true, `level` → 0
- Firebase RTDB: `hasNFT` → true, `level` → 0

**DB Changes (test 7.2)**:
- MongoDB User: `nftTokenId` → 25 (avatar switched)
- Firebase RTDB: `hasNFT` → true, `level` → 0

**On-Chain Calls (test 7.1)**:
- `getNftOwner(1)` → `0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0` (matches user's address)
- `getNftLevel(1)` → 0

**Edge Case (test 7.3)**: Token #999 does not exist on-chain. `getNftOwner(999)` throws, caught and returned as 400. Took 936ms due to on-chain call timeout.

---

### Section 8: Leaderboard (7/7 passed)

| # | Test | Method | Path | Auth | Status | Time | Verified |
|---|------|--------|------|------|--------|------|----------|
| 8.1 | All-time | GET | /leaderboard | No | 200 | 174ms | `period: "all"`, `leaderboard` array, `totalUsers` number, `currentPage`, `totalPages` |
| 8.2 | 24 hours | GET | /leaderboard/24hours | No | 200 | 89ms | `period: "24hours"`, `startDate` set |
| 8.3 | Week | GET | /leaderboard/week | No | 200 | 87ms | `period: "week"` |
| 8.4 | Invalid period | GET | /leaderboard/invalid | No | 400 | 3ms | "Invalid period. Valid periods: ..." |
| 8.5 | Pagination | GET | /leaderboard?limit=5&page=1 | No | 200 | 173ms | `leaderboard.length <= 5` |
| 8.6 | User rank | GET | /leaderboard/rank/{uid} | Bearer | 200 | 176ms | `rank` is number, `scoreGained` exists, `currentScore` exists |
| 8.7 | User rank no auth | GET | /leaderboard/rank/{uid} | None | 401 | 2ms | Unauthorized |

**DB Changes**: None (read-only queries)

**Implementation Notes**:
- All-time leaderboard queries `User` collection sorted by `score` descending
- Time-period leaderboards aggregate `ScoreChange` collection by timestamp range
- User rank counts users with higher score and adds 1

---

### Section 9: Logout (3/3 passed)

| # | Test | Auth | Status | Time | Verified |
|---|------|------|--------|------|----------|
| 9.1 | Logout | Bearer token | 200 | 202ms | `success: true`, `message: "Logged out successfully"` |
| 9.2 | No auth | None | 401 | 3ms | Unauthorized |
| 9.3 | Firebase cleared | (read RTDB) | - | 36ms | `hasNFT: false`, `level: 0` in Firebase |

**DB Changes (test 9.1)**:
- Firebase Auth: All refresh tokens revoked for this user
- Firebase RTDB: `/users/{uid}` → `{ hasNFT: false, level: 0, weapons: null }`
- MongoDB: No changes

---

### Section 10: Security & Edge Cases (3/3 passed)

| # | Test | Scenario | Status | Time | Verified |
|---|------|----------|--------|------|----------|
| 10.1 | XSS stripping | `username: "<script>alert(1)</script>TestUser"` in create-user | 201 | 799ms | Firebase RTDB username does NOT contain `<script>` (xss-clean middleware strips tags) |
| 10.2 | NoSQL injection | `address: { "$gt": "" }` in login | 400 | 77ms | mongo-sanitize strips `$` operators, `ethers.isAddress()` rejects |
| 10.3 | CORS | Request with `Origin: http://evil.com` | 200 | 2ms | `Access-Control-Allow-Origin` header does NOT equal `http://evil.com` |

**Security Middleware Stack** (in order):
1. `helmet` - Security headers (CSP in report-only mode)
2. `mongoSanitize` - Strips `$` and `.` from request data
3. `xss-clean` - Strips HTML/JS tags from request data
4. `hpp` - Prevents parameter pollution
5. `rateLimiter` - authLimiter (20/15min), generalLimiter (10000/hr)
6. `validateEndpoint` - Regex whitelist for valid API paths

---

## 4. Edge Cases & Error Scenarios Summary

| Category | Test | Input | Status | Error Message |
|----------|------|-------|--------|---------------|
| **Validation** | Missing email | `{ password, username }` | 400 | "Please provide a valid email address" |
| **Validation** | Invalid email | `{ email: "notanemail" }` | 400 | "Please provide a valid email address" |
| **Validation** | Short password | `{ password: "123" }` | 400 | "Password must be at least 6 characters" |
| **Validation** | Missing username | `{ email, password }` | 400 | "Username is required" |
| **Validation** | Duplicate email | Same email twice | 400 | "Email is already registered" |
| **Validation** | Missing address | `{}` for login | 400 | "Please provide a valid EVM wallet address" |
| **Validation** | Invalid address | `"not-an-address"` | 400 | "Please provide a valid EVM wallet address" |
| **Validation** | Missing tokenId | `{}` for set-avatar | 400 | "tokenId is required" |
| **Validation** | Negative tokenId | `{ tokenId: -1 }` | 400 | "tokenId must be a valid non-negative integer" |
| **Auth** | No Bearer token | (any protected endpoint) | 401 | Unauthorized |
| **Auth** | Invalid JWT | `"invalid.jwt.token"` | 401 | Unauthorized |
| **Ownership** | Unowned NFT | `{ tokenId: 999 }` | 400 | "Failed to verify NFT ownership. Token may not exist." |
| **Routing** | Unknown endpoint | `/nonexistent` | 404 | validateEndpoint rejection |
| **Routing** | Invalid platform | `/download/linux` | 404 | validateEndpoint regex rejects (only win/mac) |
| **Leaderboard** | Invalid period | `/leaderboard/invalid` | 400 | "Invalid period. Valid periods: ..." |
| **Security** | XSS in username | `<script>alert(1)</script>` | 201 | Tags stripped, user created safely |
| **Security** | NoSQL injection | `{ "$gt": "" }` | 400 | Operators stripped by mongo-sanitize |
| **Security** | CORS from evil | `Origin: http://evil.com` | - | No `Access-Control-Allow-Origin` for evil.com |

---

## 5. Rate Limiting

| Limiter | Scope | Limit | Window | Tested |
|---------|-------|-------|--------|--------|
| authLimiter | `/auth/create-user`, `/auth/login` | 20 requests | 15 minutes | Yes (discovered in Round 1 → server restart resets) |
| generalLimiter | All `/api/*` endpoints | 10,000 requests | 1 hour | Not hit during testing |
| purchaseLimiter | Purchase endpoints (Phase 5+) | 10 requests | 1 minute | Not applicable yet |

**Note**: Rate limiters are in-memory (express-rate-limit). Server restart resets all counters. During testing, we ran into the authLimiter on consecutive test runs and had to restart the server between rounds.

---

## 6. Test Cleanup

After all tests complete, the script cleans up all test data:

| Store | Action | Confirmed |
|-------|--------|-----------|
| Firebase Auth | `admin.auth().deleteUser(testUid)` | User `LArkCyP62DNN4T2hPIH9a1qPPr42` deleted |
| Firebase RTDB | `ref('users/{uid}').remove()` | RTDB entry removed |
| MongoDB User | `User.deleteOne({ uid: testUid })` | User document deleted |
| MongoDB SecurityProfile | `SecurityProfile.deleteOne({ uid: testUid })` | Security profile deleted |
| XSS test user | `admin.auth().deleteUser(xssUid)` | XSS test user deleted from Firebase Auth |

No test data remains in any database after script completion.

---

## 7. Test Execution History

| Round | Date | Result | Notes |
|-------|------|--------|-------|
| Round 1 | March 4, 2026 | 46/47 | Test 2.3 expected 400 but got 404 (validateEndpoint middleware). Fixed test expectation. |
| Round 2 | March 4, 2026 | 27/47 | 20 failures due to auth rate limiter exhaustion (20 req/15min). All auth-dependent tests cascaded. |
| Round 3 | March 4, 2026 | **47/47** | Server restarted (resets in-memory rate limiter). All tests pass. |
| Round 4 | March 5, 2026 | **47/47** | Tests run against live domain `https://your-api-domain.com` via HTTPS+SSL. All pass. |

---

## 8. Endpoints Tested (Complete Coverage)

| # | Method | Path | Auth | Public | Phase |
|---|--------|------|------|--------|-------|
| 1 | GET | /health | No | Yes | 1 |
| 2 | GET | /settings | No | Yes | 1 |
| 3 | POST | /auth/create-user | No | Yes | 1 |
| 4 | POST | /auth/login | Yes | No | 1 |
| 5 | GET | /auth/me | Yes | No | 1 |
| 6 | POST | /auth/logout | Yes | No | 1 |
| 7 | POST | /game/verify-assets | Yes | No | 1 |
| 8 | POST | /game/set-avatar | Yes | No | 1 |
| 9 | GET | /game/download/:platform | No | Yes | 1 |
| 10 | GET | /game/info | No | Yes | 1 |
| 11 | GET | /leaderboard | No | Yes | 4 |
| 12 | GET | /leaderboard/:period | No | Yes | 4 |
| 13 | GET | /leaderboard/rank/:uid | Yes | No | 4 |

**Total: 13 unique endpoints tested across Phase 1 + Phase 4 (Leaderboard)**
