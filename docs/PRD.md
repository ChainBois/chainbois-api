# ChainBois API - Product Requirements Document (PRD)

**Version:** 2.0
**Date:** March 2, 2026
**Status:** Draft - Pending Review
**MVP Deadline:** March 9, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Architecture](#2-technical-architecture)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Data Models](#5-data-models)
6. [API Endpoints](#6-api-endpoints)
7. [Smart Contracts](#7-smart-contracts)
8. [Implementation Phases](#8-implementation-phases)
9. [Security Architecture](#9-security-architecture)
10. [Third-Party Integrations](#10-third-party-integrations)
11. [NFT Art Generation & Minting Pipeline](#11-nft-art-generation--minting-pipeline)
12. [Dynamic NFT System](#12-dynamic-nft-system)
13. [Game Integration Architecture](#13-game-integration-architecture)
14. [Frontend Integration Guide](#14-frontend-integration-guide)
15. [Rate Limits & Constraints](#15-rate-limits--constraints)
16. [Open Questions & Decisions](#16-open-questions--decisions)
17. [Appendix](#17-appendix)

---

## 1. Project Overview

### 1.1 What is ChainBois?

ChainBois is a Web3 gaming platform on the **Avalanche C-Chain** that connects a 3rd-person shooter game (PC + mobile, built with Unity) to blockchain mechanics: NFT characters, leveling, tournaments, a weapon economy, and a native $BATTLE token.

### 1.2 Immediate Context

- **Avalanche Build Games Hackathon** - $1M prize pool
- **MVP Deadline: March 9, 2026** - must have working API + frontend integration + demo
- All blockchain features use **Fuji testnet** for the hackathon
- Frontend is already largely built (Next.js 15 + Thirdweb) - needs API docs per phase ASAP
- Game (Unity) exists on PC and mobile - limited game dev changes possible
- Must deliver frontend integration docs after each phase for parallel FE work

### 1.3 Key Principles

1. **Use SDKs and APIs over custom smart contracts** wherever possible
2. **Backend-heavy blockchain logic** - keep AVAX operations server-side
3. **Separate wallet management** into its own secure service
4. **Phase-based delivery** with frontend docs after EACH phase
5. **Testnet first** - everything on Fuji for hackathon
6. **Follow reference project patterns** - especially ghetto-pigeons and pigeon-puffs
7. **Game communicates via Firebase** - game devs have limited ability to make changes
8. **No custom marketplace** - use existing marketplaces (Joepegs, etc.)
9. **No ChainBoi Money** - points convert directly to $BATTLE
10. **Auto-distribute prizes** - no manual claiming, Discord notifications

---

## 2. Technical Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend       │     │   Unity Game      │     │   Admin Panel   │
│   (Next.js 15)   │     │   (PC + Mobile)   │     │   (Future)      │
└────────┬────────┘     └────────┬──────────┘     └────────┬────────┘
         │                       │                          │
         │ REST + WebSocket      │ Firebase Realtime DB     │ REST
         ▼                       ▼                          ▼
┌────────────────────────────────────────────────────────────────────┐
│                     ChainBois Main API                             │
│                     (Express.js + Node.js)                         │
│                                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │  Auth    │ │ Training │ │  Battle  │ │  Armory  │ │ Game   │  │
│  │ Module   │ │  Room    │ │  ground  │ │  Module  │ │ Sync   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │Inventory │ │Leaderboard││ Points   │ │  Cron    │             │
│  │ Module   │ │  Module  │ │ Module   │ │  Jobs    │             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
└───────────────────────┬────────────────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
┌──────────────┐ ┌───────────┐ ┌──────────────┐
│  MongoDB     │ │  Firebase │ │  Redis       │
│  (Primary DB)│ │  Realtime │ │  (Cache +    │
│              │ │  DB       │ │   Queues)    │
└──────────────┘ └───────────┘ └──────────────┘

         ┌──────────────────────────┐
         │   Wallet Management API  │
         │   (Separate Service)     │
         │   - IP whitelisted       │
         │   - x-client-id auth     │
         │   - Encrypted key store  │
         │   - Signs & sends txs    │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │   Avalanche C-Chain      │
         │   (Fuji Testnet)         │
         │   - Smart Contracts      │
         │   - NFTs pre-minted in   │
         │     platform wallets     │
         └──────────────────────────┘
```

### 2.2 Key Architectural Pattern: Game ↔ Backend via Firebase

Following the ghetto-pigeons and pigeon-puffs pattern:

```
Unity Game                    Firebase Realtime DB              Backend API
    │                               │                              │
    │  Writes user data             │                              │
    │  (score, username)            │                              │
    │──────────────────────────────►│                              │
    │                               │                              │
    │                               │  Cron polls every 1-5 min   │
    │                               │◄─────────────────────────────│
    │                               │                              │
    │                               │  Backend reads new users +   │
    │                               │  score changes               │
    │                               │─────────────────────────────►│
    │                               │                              │  Syncs to MongoDB
    │                               │                              │  Updates leaderboard
    │                               │                              │
    │  Backend writes back:         │                              │
    │  hasNFT, level, weapons       │                              │
    │◄──────────────────────────────│◄─────────────────────────────│
    │                               │                              │
    │  Game reads Firebase          │                              │
    │  to unlock content            │                              │
```

### 2.3 Key Pattern: NFT/Weapon Sales from Platform Wallets

NFTs and weapons are **pre-minted and held in platform wallets**. When a user buys:

1. User pays (on-chain tx to platform wallet)
2. Backend verifies payment on-chain
3. Backend transfers NFT/weapon from platform wallet to user wallet
4. Backend uses encrypted keys from wallet-mgt service to sign transfers

### 2.4 Key Pattern: Auto Prize Distribution

Prizes are **auto-sent** by the backend, not manually claimed:

1. Cron job runs at tournament end (or weekly leaderboard reset)
2. Backend calculates winners (top 3)
3. Backend sends prizes from prize pool wallet to winners' wallets
4. Discord webhook notification sent with results
5. Failed payouts stored in FailedPayout collection, retried automatically

### 2.5 Service Separation

| Service | Repository | Purpose |
|---------|-----------|---------|
| **ChainBois Main API** | `chainbois-api` | All frontend/game-facing endpoints |
| **Wallet Management API** | `chainbois-wallet-mgt` (separate repo) | Secure wallet operations, transaction signing |

---

## 3. Technology Stack

### 3.1 Backend Core

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ LTS |
| Framework | Express.js | 4.x |
| Database | MongoDB + Mongoose | 7.x / 8.x |
| Real-time DB | Firebase Admin SDK | 12.x |
| Cache & Queues | Redis + Bull | 4.x / 4.x |
| WebSocket | Socket.IO | 4.x |
| Process Manager | PM2 | 5.x |

### 3.2 Blockchain

| Component | Technology | Purpose |
|-----------|-----------|---------|
| EVM Interaction | ethers.js v6 | Contract calls, transactions |
| Avalanche Data | @avalanche-sdk/chainkit | Data API (NFT/token queries) |
| Avalanche Client | @avalanche-sdk/client | Wallet creation, AVAX transfers |
| Smart Contracts | Solidity 0.8.24+ | ERC-20, ERC-721 |
| Contract Tooling | Hardhat | Compilation, deployment, testing |
| Contract Templates | OpenZeppelin v5 | ERC standards, access control |

### 3.3 Third-Party Services

| Service | Purpose |
|---------|---------|
| Cloudinary | Dynamic NFT image transformations (badge overlays) |
| Pinata | IPFS storage for NFT metadata |
| Avalanche Data API | NFT/token balance queries, transfer history |
| Snowtrace API | Contract verification |
| Firebase Realtime DB | Game ↔ backend sync |
| Discord Webhooks | Prize notifications, alerts |

### 3.4 Security

| Component | Package |
|-----------|---------|
| HTTP Headers | helmet |
| NoSQL Injection | express-mongo-sanitize |
| XSS Prevention | xss-clean |
| Parameter Pollution | hpp |
| Rate Limiting | express-rate-limit |
| Encryption | Node.js crypto (AES) |
| Auth | Firebase Admin (verifyIdToken) |
| Cookie Security | cookie-parser (httpOnly, secure, sameSite) |

---

## 4. System Architecture

### 4.1 Project Structure

```
chainbois-api/
├── server.js                    # Entry point, DB connect, PM2 setup
├── app.js                       # Express app config, middleware chain
├── ecosystem.config.js          # PM2 cluster config
├── package.json
├── .env.example
├── .gitignore
│
├── config/
│   ├── db.js                    # MongoDB connection
│   ├── firebase.js              # Firebase Admin init (main + chainbois game instance)
│   ├── redis.js                 # Redis connection
│   ├── cloudinary.js            # Cloudinary config
│   └── constants.js             # App-wide constants
│
├── models/
│   ├── userModel.js
│   ├── chainboiNftModel.js
│   ├── weaponNftModel.js
│   ├── tournamentModel.js
│   ├── leaderboardModel.js
│   ├── weeklyLeaderboardModel.js
│   ├── leaderboardHistoryModel.js
│   ├── gameSessionModel.js
│   ├── transactionModel.js
│   ├── failedPayoutModel.js
│   ├── settingsModel.js
│   ├── securityProfileModel.js
│   ├── walletModel.js
│   └── ...
│
├── controllers/
│   ├── authController.js
│   ├── gameController.js         # Firebase sync, asset verification
│   ├── trainingRoomController.js
│   ├── battlegroundController.js
│   ├── armoryController.js
│   ├── inventoryController.js
│   ├── pointsController.js
│   ├── leaderboardController.js
│   └── ...
│
├── routes/
│   ├── authRoutes.js
│   ├── gameRoutes.js
│   ├── trainingRoomRoutes.js
│   ├── battlegroundRoutes.js
│   ├── armoryRoutes.js
│   ├── inventoryRoutes.js
│   ├── pointsRoutes.js
│   ├── leaderboardRoutes.js
│   └── ...
│
├── middleware/
│   ├── auth.js                  # Firebase token verification (decodeToken)
│   ├── antiCheat.js             # Anti-cheat/exploit system
│   ├── ipBlocking.js            # IP-based blocking
│   ├── validateEndpoint.js      # Endpoint whitelist
│   ├── errorHandler.js          # Global error handler
│   └── rateLimiter.js           # Rate limiting config
│
├── utils/
│   ├── avaxUtils.js             # Avalanche blockchain utilities
│   ├── contractUtils.js         # Smart contract interaction
│   ├── cloudinaryUtils.js       # Image manipulation (badge overlays)
│   ├── ipfsUtils.js             # Pinata/IPFS operations
│   ├── discordService.js        # Discord webhook notifications
│   ├── formatUtils.js           # Number/string formatting
│   ├── cryptUtils.js            # Encryption/decryption (wallet keys)
│   ├── catchAsync.js            # Async error wrapper
│   ├── AppError.js              # Custom error class
│   └── apiFeatures.js           # Query filtering/pagination
│
├── jobs/
│   ├── syncNewUsersJob.js       # Count game-only Firebase users for web2/web3 metrics (daily midnight)
│   ├── syncScoresJob.js         # Sync scores from Firebase to MongoDB (every 5 min)
│   ├── tournamentJob.js         # Tournament lifecycle cron
│   ├── leaderboardResetJob.js   # Weekly leaderboard reset + auto prize distribution
│   ├── retryPayoutsJob.js       # Retry failed payouts
│   └── healthJob.js             # Health monitoring + pool balance alerts
│
├── contracts/                   # Solidity smart contracts
│   ├── BattleToken.sol
│   ├── ChainBoisNFT.sol
│   └── WeaponNFT.sol
│
├── scripts/
│   ├── deploy.js
│   ├── generateArt.js
│   ├── uploadMetadata.js
│   └── seedData.js
│
├── tests/
│
└── docs/
    ├── PRD.md
    ├── FEATURE_OVERVIEW.md
    ├── api-docs/                # Frontend API docs (per phase)
    └── postman/                 # Postman collections
```

### 4.2 Middleware Chain (app.js)

```
1. helmet()                          # Security headers
2. cookieParser()                    # Parse cookies
3. cors(corsOptions)                 # CORS with credentials
4. express.json({ limit: "50mb" })   # Body parser
5. mongoSanitize()                   # NoSQL injection prevention
6. xss()                            # XSS prevention
7. hpp()                            # Parameter pollution prevention
8. validateEndpoint()               # Endpoint whitelist
9. compression()                    # Response compression
10. morgan/logger                   # Request logging
11. ROUTES                          # API routes
12. 404 catch-all                   # Unknown route handler
13. globalErrorHandler              # Centralized error handling
```

### 4.3 Response Format

```json
// Success (single item)
{
  "success": true,
  "data": { ... }
}

// Success (paginated list) - matches frontend fetchPaginatedData
{
  "success": true,
  "data": {
    "<resourceName>": [ ... ],
    "total": 123,
    "page": 1,
    "limit": 20
  }
}

// Error
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable message"
}
```

---

## 5. Data Models

### 5.1 User Model

```javascript
{
  uid: String,                  // Firebase Auth UID
  address: String,              // Wallet address (null for Web2 players)
  playerType: String,           // "web2" | "web3"
  username: String,             // In-game username (from Firebase)
  email: String,                // From Firebase Auth
  role: String,                 // "user" | "admin"
  pointsBalance: Number,        // Accumulated points
  battleTokenBalance: Number,   // Cached $BATTLE balance
  hasNft: Boolean,              // Owns a ChainBoi NFT
  nftTokenId: Number,           // Primary ChainBoi NFT token ID
  level: Number,                // Current NFT level (0-7)
  isVerified: Boolean,          // Wallet verified
  isBanned: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.2 ChainBoi NFT Model

```javascript
{
  tokenId: Number,
  contractAddress: String,
  ownerAddress: String,
  level: Number,                // 0=Private, 1-7
  traits: [{
    trait_type: String,
    value: String
  }],
  badge: String,                // Current badge image identifier
  inGameStats: {
    kills: Number,
    score: Number,
    gamesPlayed: Number
  },
  metadataUri: String,
  imageUri: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.3 Weapon NFT Model

```javascript
{
  tokenId: Number,
  contractAddress: String,
  ownerAddress: String,         // Platform wallet address until sold
  weaponName: String,           // e.g., "BP50", "SCAR"
  category: String,             // "assault" | "smg" | "lmg" | "marksman" | "handgun" | "launcher" | "melee"
  blueprintTier: String,        // "base" | "epic" | "legendary" | "mythic"
  mythicLevel: Number,          // 0-5 (only for mythic tier)
  price: Number,                // Price in $BATTLE
  supply: Number,               // Total supply of this weapon
  sold: Number,                 // Number sold
  metadataUri: String,
  imageUri: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.4 Tournament Model

```javascript
{
  level: Number,                // 1-7
  status: String,               // "upcoming" | "active" | "cooldown" | "completed"
  startTime: Date,              // Wednesday 12PM EST
  endTime: Date,                // Monday 12PM EST
  cooldownEndTime: Date,        // Wednesday 12PM EST
  prizePool: Number,            // AVAX amount
  prizeDistribution: {
    first: Number,              // AVAX
    second: Number,             // AVAX
    third: Number               // $BATTLE equivalent
  },
  winners: [{
    rank: Number,
    address: String,
    username: String,
    points: Number,
    paid: Boolean,
    txHash: String,
    paidAt: Date
  }],
  createdAt: Date
}
```

### 5.5 Weekly Leaderboard Model

```javascript
{
  address: String,
  username: String,
  tournamentLevel: Number,
  highScore: Number,
  totalScore: Number,
  gamesPlayed: Number,
  createdAt: Date,
  updatedAt: Date
}
// Deleted and recreated each week after prize distribution
```

### 5.6 Leaderboard History Model

```javascript
{
  weekNumber: Number,
  tournamentLevel: Number,
  winners: [{
    rank: Number,
    address: String,
    username: String,
    highScore: Number,
    prizeAmount: Number,
    prizeCurrency: String,      // "AVAX" | "BATTLE"
    txHash: String
  }],
  totalPayout: Number,
  createdAt: Date
}
```

### 5.7 Game Session Model

```javascript
{
  uid: String,                  // Firebase UID
  address: String,
  sessionId: String,
  gameMode: String,
  startTime: Date,
  endTime: Date,
  score: Number,                // Max 5,000 per match
  kills: Number,
  pointsEarned: Number,
  verified: Boolean,
  nftTokenId: Number,
  createdAt: Date
}
```

### 5.8 Transaction Model

```javascript
{
  type: String,                 // "level_up" | "weapon_purchase" | "points_conversion" |
                                // "prize_payout" | "nft_transfer"
  fromAddress: String,
  toAddress: String,
  amount: Number,
  currency: String,             // "AVAX" | "BATTLE"
  txHash: String,
  status: String,               // "pending" | "confirmed" | "failed"
  metadata: Object,
  createdAt: Date
}
```

### 5.9 Failed Payout Model

```javascript
{
  address: String,
  amount: Number,
  currency: String,
  reason: String,               // "insufficient_balance" | "tx_failed" | etc.
  retryCount: Number,
  lastRetry: Date,
  resolved: Boolean,
  resolvedTxHash: String,
  createdAt: Date
}
```

### 5.10 Wallet Model (Platform Wallets)

```javascript
{
  address: String,
  key: String,                  // AES encrypted private key
  iv: String,                   // Initialization vector
  role: String,                 // "admin" | "prize_pool" | "nft_store" | "weapon_store"
  balance: Number,              // Cached balance
  createdAt: Date,
  updatedAt: Date
}
```

### 5.11 Settings Model (Singleton)

```javascript
{
  tournamentSchedule: {
    startDay: String,           // "wednesday"
    startHour: Number,          // 12 (EST)
    durationHours: Number,      // 120 (5 days)
    cooldownHours: Number       // 48
  },
  prizePools: {                 // AVAX per level
    1: 2, 2: 4, 3: 6, 4: 8, 5: 10, 6: 12, 7: 14
  },
  levelUpCost: Number,          // 1 AVAX
  maxPointsPerMatch: Number,    // 5000
  burnRate: Number,             // 0.5 (50%)
  teamRevenueSplit: Number,     // 0.25 (25%)
  awardPoolSplit: Number,       // 0.75 (75%)
  armoryClosedDuringCooldown: Boolean,
  contracts: {
    battleToken: String,
    chainboisNft: String,
    weaponNft: String
  },
  updatedAt: Date
}
```

### 5.12 Security Profile Model

```javascript
{
  address: String,
  threatScore: Number,
  status: String,               // "active" | "cooldown" | "temp_ban" | "perm_ban"
  violationLog: [{
    type: String,
    details: String,
    timestamp: Date
  }],
  dailyEarnings: Number,
  banExpiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. API Endpoints

### 6.1 Authentication (Firebase-based, following reference projects)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/create-user` | Create Firebase user (email/password) | None |
| POST | `/api/v1/auth/login` | Login with Firebase token + wallet address | Firebase Token |
| GET | `/api/v1/auth/me` | Get current user profile | Firebase Token |
| POST | `/api/v1/auth/logout` | End session, clear Firebase flags | Firebase Token |

### 6.2 Game Integration (Firebase sync - following pigeon-puffs cbController pattern)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/game/verify-assets` | Verify wallet NFTs, write hasNFT/level/weapons to Firebase | Firebase Token |
| POST | `/api/v1/game/set-avatar` | Set active NFT avatar, update Firebase | Firebase Token |
| GET | `/api/v1/game/characters/:address` | Get unlocked characters based on NFT level | Firebase Token |
| POST | `/api/v1/game/end-session` | Clear Firebase flags on game exit | Firebase Token |

**Cron Jobs (not endpoints - run on PM2 instance 0):**
- `syncNewUsersJob` (daily midnight) - counts Firebase UIDs not in MongoDB to update web2/web3 platform metrics. Game-only players remain invisible to the leaderboard and points system until they visit the website, connect a wallet, and log in — at which point the login endpoint creates their MongoDB record and syncs their data.
- `syncScoresJob` (every 5 min) - sync scores from Firebase to MongoDB, update leaderboard

### 6.3 Training Room

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/training/nfts/:address` | Get all ChainBoi NFTs for wallet | Firebase Token |
| GET | `/api/v1/training/nft/:tokenId` | Get NFT details (level, traits, badge) | Firebase Token |
| POST | `/api/v1/training/level-up` | Initiate level-up (user pays AVAX, backend updates NFT) | Firebase Token |
| GET | `/api/v1/training/level-up/cost` | Get current level-up cost | Firebase Token |
| GET | `/api/v1/training/eligibility/:tokenId` | Tournament eligibility for NFT | Firebase Token |

### 6.4 Battleground / Tournaments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/tournaments` | List all tournament tiers with status | Public |
| GET | `/api/v1/tournaments/:level` | Get tournament details for a level | Public |
| GET | `/api/v1/tournaments/:level/leaderboard` | Top 10 leaderboard | Public |
| GET | `/api/v1/tournaments/:level/countdown` | Time remaining | Public |
| GET | `/api/v1/tournaments/:level/winners` | Current/past winners | Public |
| GET | `/api/v1/tournaments/history` | Historical tournament data | Public |

**Cron Jobs:**
- `tournamentJob` (hourly) - manage tournament lifecycle (create, start, end, cooldown)
- `leaderboardResetJob` (at tournament end) - calculate winners, auto-send prizes, Discord notification, reset leaderboard

### 6.5 Armory (Buy from platform wallets)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/armory/weapons` | All weapons grouped by category | Public |
| GET | `/api/v1/armory/weapons/:category` | Weapons in a category | Public |
| GET | `/api/v1/armory/weapon/:weaponId` | Single weapon details + platform wallet address | Firebase Token |
| POST | `/api/v1/armory/purchase/weapon` | Verify payment tx, send weapon NFT from platform wallet | Firebase Token |
| GET | `/api/v1/armory/balance/:address` | Get points + $BATTLE balance | Firebase Token |

**Purchase flow (following ghetto-market pattern):**
1. Frontend calls `GET /armory/weapon/:id` → gets price + platform wallet address
2. User signs payment tx (sends $BATTLE to platform wallet)
3. Frontend calls `POST /armory/purchase/weapon` with `{ weaponId, txHash }`
4. Backend verifies on-chain payment (correct amount, receiver, not stale)
5. Backend transfers weapon NFT from platform wallet to user's wallet
6. Backend syncs new weapon to Firebase so game sees it immediately

### 6.6 Points & Conversion

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/points/:address` | Get points balance | Firebase Token |
| POST | `/api/v1/points/convert` | Convert points → $BATTLE (direct, 1:1) | Firebase Token |
| GET | `/api/v1/points/history/:address` | Points history | Firebase Token |

**No ChainBoi Money.** Points convert directly to $BATTLE tokens. If users want AVAX, they sell $BATTLE on a DEX themselves.

### 6.7 Claim (Simple page for hackathon testers/judges)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/claim/status` | Remaining claimable NFTs, limit per wallet | Public |
| POST | `/api/v1/claim` | Claim a free testnet ChainBoi NFT (1 per wallet) | Firebase Token |

Simple flow: connect wallet → click "Claim" → backend transfers a pre-minted NFT from platform wallet to user. Limited to 1 per wallet. For hackathon judges and testers to try the app.

### 6.8 Inventory

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/inventory/:address` | All owned assets categorized | Firebase Token |
| GET | `/api/v1/inventory/:address/nfts` | ChainBoi NFTs only | Firebase Token |
| GET | `/api/v1/inventory/:address/weapons` | Weapon NFTs only | Firebase Token |
| GET | `/api/v1/inventory/:address/history` | Transaction history | Firebase Token |

### 6.8 Leaderboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/leaderboard` | Global leaderboard | Public |
| GET | `/api/v1/leaderboard/:period` | Period-filtered (30min, 1hour, 24hours, week, month, all) | Public |
| GET | `/api/v1/leaderboard/rank/:address` | Get specific user rank | Firebase Token |

### 6.9 Health & Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/health` | Health check (DB, Redis, Firebase, blockchain) | None |
| GET | `/api/v1/settings` | Get public settings | None |

---

## 7. Smart Contracts

### 7.1 Contracts Required (Testnet - Minimal)

| Contract | Standard | Purpose |
|----------|----------|---------|
| **BattleToken** | ERC-20 | $BATTLE token with mint + burn |
| **ChainBoisNFT** | ERC-721 | ChainBoi NFTs with on-chain level tracking |
| **WeaponNFT** | ERC-721 | Weapon NFTs (pre-minted to platform wallets) |

No LevelUp, PrizeDistribution, or PointsConversion contracts needed - the backend handles these operations using platform wallets.

### 7.2 BattleToken (ERC-20)

- Standard ERC-20 with burn + mint by owner
- Owner mints for points conversion and prize distribution
- 50% of spending burned, 50% to liquidity (tracked off-chain for hackathon)
- Based on OpenZeppelin ERC20 + ERC20Burnable + Ownable

### 7.3 ChainBoisNFT (ERC-721)

- 4,032 max supply (4,000 public + 32 reserved)
- On-chain level tracking: `mapping(uint256 => uint8) public tokenLevel`
- ERC-4906 support for metadata refresh events
- `tokenURI()` points to our API for dynamic metadata
- Owner functions: `setBaseURI`, `reserve`, `setLevel` (called by backend)
- **Pre-minted** to platform wallet, transferred to users on purchase/claim

### 7.4 WeaponNFT (ERC-721)

- Variable supply per weapon type
- Blueprint tier stored on-chain
- **Pre-minted** to platform wallets
- Transferred to users when purchased with $BATTLE

### 7.5 Deployment Config (Hardhat)

```javascript
{
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",  // CRITICAL: Avalanche C-Chain support
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [DEPLOYER_PRIVATE_KEY]
    }
  }
}
```

---

## 8. Implementation Phases

**CRITICAL: Frontend docs delivered after EACH phase. Start with game integration.**

### Phase 0: Foundation (Day 1)

**Scope:** Project scaffolding, database setup, core utilities

**Deliverables:**
- Express.js app with full middleware chain
- MongoDB connection + all base models
- Firebase Admin setup (main instance + chainbois game instance)
- Redis connection
- avaxUtils.js (Avalanche blockchain utilities)
- contractUtils.js, cloudinaryUtils.js, ipfsUtils.js
- cryptUtils.js (AES encryption for wallet keys)
- discordService.js (webhook notifications)
- formatUtils.js, catchAsync.js, AppError.js
- Auth middleware (Firebase decodeToken)
- Anti-cheat middleware
- Endpoint validation, IP blocking, rate limiting
- Health endpoint
- .env.example
- PM2 ecosystem config

**Frontend docs:** Environment setup, auth flow, request pattern

### Phase 1: Game Integration + Auth (Day 2)

**PRIORITY - Frontend needs this first**

**Scope:** Firebase sync, auth, asset verification

**Deliverables:**
- Auth controller (createUser, login with Firebase + wallet, logout)
- Game controller (verify assets, set avatar, end session)
- Cron: syncNewUsersJob (web2/web3 metrics count, daily midnight)
- Cron: syncScoresJob (sync scores every 5 min)
- Firebase writes: hasNFT, level, weapons (game reads these)
- Web2 player support (track progress in DB, no wallet needed)
- Character unlock logic based on NFT level

**Frontend docs:** Auth flow, game integration endpoints, WebSocket events

### Phase 2: Smart Contracts + NFT Creation (Day 3)

**Scope:** Deploy contracts, create/mint NFTs

**Deliverables:**
- BattleToken.sol, ChainBoisNFT.sol, WeaponNFT.sol
- Deploy to Fuji testnet
- Contract verification on Snowtrace
- HashLips art generation (when traits are provided)
- IPFS metadata upload (Pinata)
- Cloudinary base image upload
- Pre-mint NFTs to platform wallets
- Pre-mint weapons to platform wallets
- Contract addresses saved to Settings

**Frontend docs:** Contract addresses, how NFTs work

### Phase 3: Training Room (Day 4)

**Scope:** NFT display, leveling, badge system

**Deliverables:**
- Training room controller + routes
- NFT query via Avalanche Data API
- Level-up flow: user pays AVAX → backend updates on-chain level + metadata
- Badge overlay via Cloudinary URL transformations
- Firebase sync for level updates
- ERC-4906 metadata refresh trigger

**Frontend docs:** Training room endpoints, level-up UX flow

### Phase 4: Battleground + Leaderboard (Day 5-6)

**Scope:** Tournaments, leaderboards, auto prize distribution

**Deliverables:**
- Tournament lifecycle cron job
- Leaderboard with time-filtered MongoDB aggregation
- Weekly leaderboard accumulation (highScore, totalScore, gamesPlayed)
- Auto prize distribution at tournament end
- Failed payout tracking + retry
- Discord webhook: winner notifications
- Discord webhook: low balance alerts
- Leaderboard history
- Socket.IO for real-time leaderboard updates

**Frontend docs:** Tournament endpoints, leaderboard, real-time updates

### Phase 5: Armory + Points (Day 7)

**Scope:** Weapon purchases from platform wallets, points → $BATTLE conversion

**Deliverables:**
- Weapon catalog by category
- Purchase flow: get wallet → pay → verify → transfer NFT
- Price calculated server-side only (security)
- On-chain payment verification (correct amount, receiver, not stale)
- Points → $BATTLE conversion (backend mints tokens)
- Firebase sync for new weapons (game sees immediately)
- Balance endpoint

**Frontend docs:** Armory endpoints, purchase flow, points conversion

### Phase 6: Inventory (Day 8)

**Scope:** Asset display, transaction history

**Deliverables:**
- Inventory aggregation via Avalanche Data API (NFTs, weapons, tokens)
- Category filtering
- Transaction history
- Links to Joepegs for secondary marketplace

**Frontend docs:** Inventory endpoints

### Phase 7: Integration Testing + Polish (Day 8-9)

**Scope:** End-to-end testing, demo prep

**Deliverables:**
- Test suite (unit + integration)
- Postman collection for all endpoints
- Complete frontend integration docs
- Manual testing guide
- Demo video script
- Judge testing instructions
- README.md for public repo

---

## 9. Security Architecture

### 9.1 Authentication (Firebase-based)

Following the reference projects (ghetto-pigeons, pigeon-puffs, cec-api):

```
1. User signs up via game or website (Firebase Auth: email/password)
2. Firebase returns ID token
3. Frontend/game includes token in Authorization: Bearer <firebaseIdToken>
4. Backend middleware (decodeToken) calls admin.auth().verifyIdToken(token)
5. On login, user also provides wallet address
6. Backend verifies wallet, fetches NFTs, writes to Firebase for game
```

### 9.2 Anti-Cheat System

Following pigeon-puffs pattern:
- Session validation
- Score plausibility (max 5,000 per match)
- Velocity checks
- Threat scoring → cooldown → temp ban → perm ban
- Daily earning limits
- NFT re-verification at session end

### 9.3 Wallet Management Security

Separate service:
- IP whitelisted
- x-client-id header auth
- AES-encrypted private keys
- IV per wallet
- Keys decrypted only for signing
- Failed payouts tracked and retried

### 9.4 Armory Purchase Security (following ghetto-market pattern)

- Price ALWAYS calculated server-side (never accepted from frontend)
- On-chain payment verification:
  - Correct sender
  - Correct receiver (platform wallet)
  - Correct amount
  - Transaction not stale (within 50 seconds)
- Supply validation
- Armory closed during cooldown

---

## 10. Third-Party Integrations

### 10.1 Avalanche Data API

Read wallet NFTs, token balances, transfer history.

### 10.2 Cloudinary

Dynamic badge overlays on NFT images via URL transformations.

### 10.3 Pinata (IPFS)

Store NFT metadata JSON.

### 10.4 Firebase Realtime Database

Game ↔ backend sync. Two patterns:
- Backend writes: `hasNFT`, `level`, `weapons` (game reads)
- Game writes: `score`, `username` (backend polls via cron)

### 10.5 Discord Webhooks

- Leaderboard winner notifications (weekly)
- Low pool balance alerts
- Prize distribution confirmations

### 10.6 Joepegs / External Marketplace

Users can list/sell NFTs on Joepegs. We just link to it. No custom marketplace.

---

## 11. NFT Art Generation & Minting Pipeline

### 11.1 Process

1. Receive trait layers (PNGs) - **waiting for ZIP from user**
2. Configure HashLips art engine
3. Generate 4,032 images + metadata
4. Add custom metadata (level=0, badge=private, stats=0)
5. Upload images to Cloudinary + IPFS
6. Upload metadata to IPFS
7. **Pre-mint all NFTs to platform wallets** (not a public mint page)
8. Users buy from platform or marketplace (Joepegs)

### 11.2 Metadata Structure

```json
{
  "name": "ChainBoi #1",
  "description": "A ChainBoi warrior on the Avalanche battlefield",
  "image": "https://res.cloudinary.com/{cloud}/image/upload/l_chainbois:badges:private,g_nw,w_80/chainbois/base/1.png",
  "external_url": "https://chainbois.com/nft/1",
  "attributes": [
    { "trait_type": "Background", "value": "Urban" },
    { "trait_type": "Level", "value": 0, "display_type": "number" },
    { "trait_type": "Badge", "value": "Private" }
  ],
  "properties": {
    "level": 0,
    "badge": "private",
    "kills": 0,
    "score": 0,
    "gamesPlayed": 0
  }
}
```

---

## 12. Dynamic NFT System

### 12.1 Level-Up Flow

1. User selects NFT in Training Room
2. Frontend calls `POST /training/level-up { tokenId }`
3. Backend verifies ownership, checks level < 7
4. Backend prepares unsigned AVAX payment tx
5. User signs and sends payment
6. Backend verifies payment on-chain
7. Backend calls contract `setLevel(tokenId, newLevel)`
8. Backend updates MongoDB, Firebase, Cloudinary URL, IPFS metadata
9. Emits ERC-4906 MetadataUpdate event
10. Returns updated NFT data to frontend

### 12.2 Badge System

| Level | Badge | Characters Unlocked | Tournament Access |
|-------|-------|-------------------|------------------|
| 0 (Private) | private.png | 4 basic + 4 basic weapons | None |
| 1-7 | level_N.png | +4 characters each | Level N tournament |

---

## 13. Game Integration Architecture

### 13.1 The Flow (following ghetto-pigeons/pigeon-puffs pattern)

```
1. User opens game → game uses Firebase Auth (email/password)
2. Game writes user data to Firebase: { username, score: 0 }
3. User visits website → connects wallet (Thirdweb)
4. Frontend calls POST /auth/login with Firebase token + wallet address
5. Backend: verify Firebase token, find/create MongoDB user, check NFTs on-chain
6. Backend: write to Firebase { hasNFT: true, level: 3, weapons: [...] }
7. Game reads Firebase → sees hasNFT=true → unlocks characters/weapons
8. User plays game → game updates score in Firebase
9. Backend cron (every 5 min) → reads Firebase scores → updates MongoDB leaderboard
10. User exits game → backend clears Firebase flags
```

### 13.2 Game-Only → Web3 Transition

**How game-only players are detected (ZERO game dev changes needed):**

The `syncNewUsersJob` cron (daily midnight) counts Firebase UIDs that don't exist in MongoDB — these are game-only players. This count is used for web2/web3 platform metrics only. Game-only players are NOT created in MongoDB — they remain invisible to the leaderboard and points system until they visit the website and connect a wallet. When they log in via the website, the login endpoint creates their MongoDB record as `playerType: "web3"` (connecting a wallet = permanent web3 status).

**Transition flow:**
1. Game-only player plays with limited access (4 characters, basic weapons)
2. Player visits website, connects wallet (auto-switches to Fuji via EIP-3085/EIP-3326)
3. Login creates MongoDB record as `playerType: "web3"` — permanent, no downgrade
4. Backend checks on-chain NFT ownership during login
5. If NFT found: `hasNft: true`, level set from contract, characters/weapons unlocked
6. Accumulated points become convertible to $BATTLE
7. Progress data written to NFT metadata
8. Firebase updated with `hasNFT: true, level: N` → game unlocks content

---

## 14. Frontend Integration Guide

### 14.1 Environment Variables

```env
NEXT_PUBLIC_BACKEND_BASE_URI=https://api.chainbois.com/api/v1
NEXT_PUBLIC_CLIENT_ID=chainbois-frontend
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.chainbois.com
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=<thirdweb-client-id>
NEXT_PUBLIC_NETWORK=fuji
```

### 14.2 Auth Flow (Firebase-based)

```javascript
// 1. Firebase Auth (game or website creates user)
// 2. Get Firebase ID token
const firebaseToken = await firebase.auth().currentUser.getIdToken();

// 3. Login with backend (after wallet connect)
const { data } = await request({
  url: '/auth/login',
  method: 'POST',
  data: { address: walletAddress },
  headers: { Authorization: `Bearer ${firebaseToken}` }
});
// Returns: { success: true, data: { user, assets, weapons } }
```

### 14.3 Pagination

Backend returns: `{ [resourceName]: [...], total: N }` with `?page=N&limit=N`

### 14.4 WebSocket Events

```javascript
socket.on('leaderboard:update', (data) => { ... });
socket.on('tournament:status', (data) => { ... });
socket.on('points:sync', (data) => { ... });
```

---

## 15. Rate Limits & Constraints

### 15.1 Our API

| Endpoint Type | Limit |
|--------------|-------|
| Public endpoints | 100 req/min per IP |
| Authenticated endpoints | 500 req/min per user |
| Purchase endpoints | 10 req/min per user |

### 15.2 Avalanche Data API

Free tier: ~300 req/min, ~60,000/day. Sufficient for hackathon.

### 15.3 Blockchain

- C-Chain block time: ~2 seconds
- Gas on Fuji: free (faucet)

---

## 16. Open Questions & Decisions

| # | Question | Recommendation |
|---|----------|----------------|
| 1 | Level-up cost | Fixed 1 AVAX per level |
| 2 | Gas for purchases | User pays |
| 3 | Token launch method | Standard ERC-20 for hackathon |
| 4 | Loot box randomness | Off-chain for hackathon, Phase 2 |
| 5 | Armor system | Phase 2 |
| 6 | Airdrop system | Phase 2 |
| 7 | Battlepass | Phase 2 |

---

## 17. Appendix

### 17.1 Weapon Catalog

| Category | Weapons | Count |
|----------|---------|-------|
| Assault | BP50, FR 5.56, M13, M16, M4, SCAR | 6 |
| SMG | STRIKER 45, FENNEC, MINI UZI, P90, MP40 | 5 |
| LMG | BRUEN MK9, HOLGER 26, RPD | 3 |
| Marksman | SP-R, KAR98K, LOCKWOOD MK2, INTERVENTION | 4 |
| Handgun | RENETTI, .50 GS, BASILISK, KIMBO | 4 |
| Launcher | RGL-80, RPG, THUMPER | 3 |
| Melee | GUTTER KNIFE, KARAMBIT, PICKAXE, MACHETE, SAMURAI SWORD | 5 |

### 17.2 Tournament Prize Distribution

| Level | Total (AVAX) | 1st | 2nd | 3rd ($BATTLE) |
|-------|-------------|-----|-----|----------------|
| 1 | 2 | 1 | 0.7 | ~0.3 |
| 2 | 4 | 2 | 1.4 | ~0.6 |
| 3 | 6 | 3 | 2.1 | ~0.9 |
| 4 | 8 | 4 | 2.8 | ~1.2 |
| 5 | 10 | 5 | 3.5 | ~1.5 |
| 6 | 12 | 6 | 4.2 | ~1.8 |
| 7 | 14 | 7 | 4.9 | ~2.1 |

### 17.3 Key Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/chainbois

# Firebase
FIREBASE_SERVICE_ACCOUNT=<path-or-json>
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# Redis
REDIS_URL=redis://localhost:6379

# Avalanche
AVAX_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVAX_CHAIN_ID=43113
AVAX_DATA_API_KEY=<key>
DEPLOYER_PRIVATE_KEY=<key>

# Contracts (populated after deployment)
BATTLE_TOKEN_ADDRESS=
CHAINBOIS_NFT_ADDRESS=
WEAPON_NFT_ADDRESS=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Pinata
PINATA_API_KEY=
PINATA_API_SECRET=
PINATA_JWT=

# Wallet Management API
WALLET_MGT_API_URL=http://localhost:5001
WALLET_MGT_CLIENT_ID=chainbois-main-api

# Discord
DISCORD_LEADERBOARD_WEBHOOK=
DISCORD_ALERTS_WEBHOOK=

# Client
MAIN_API_CLIENT_ID=chainbois-frontend
```
