# ChainBois API - Product Requirements Document (PRD)

**Version:** 1.0
**Date:** March 2, 2026
**Status:** Draft - Pending Review

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

- **Avalanche Build Games Hackathon** - 6-week timeline, $1M prize pool
- All blockchain features use **Fuji testnet** for the hackathon
- MVP deadline: ~10 days from project start
- Frontend is already largely built (Next.js 15 + Thirdweb)
- Game (Unity) exists on PC and mobile

### 1.3 Project Scope

This PRD covers the **backend API** that serves:
- The frontend website (Next.js)
- The Unity game client
- Internal services (wallet management)

### 1.4 Key Principles

1. **Use SDKs and APIs over custom smart contracts** wherever possible
2. **Backend-heavy blockchain logic** - keep AVAX operations server-side
3. **Separate wallet management** into its own secure service
4. **Phase-based delivery** with documentation after each phase
5. **Testnet first** - everything on Fuji for hackathon, mainnet migration later

---

## 2. Technical Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend       │     │   Unity Game      │     │   Admin Panel   │
│   (Next.js 15)   │     │   (PC + Mobile)   │     │   (Future)      │
└────────┬────────┘     └────────┬──────────┘     └────────┬────────┘
         │                       │                          │
         │  REST + WebSocket     │  REST (secured)          │  REST
         ▼                       ▼                          ▼
┌────────────────────────────────────────────────────────────────────┐
│                     ChainBois Main API                             │
│                     (Express.js + Node.js)                         │
│                                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │  Auth    │ │ Training │ │  Battle  │ │  Armory  │ │ Game   │  │
│  │ Module   │ │  Room    │ │  ground  │ │  Module  │ │ Sync   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │Inventory │ │  Mint    │ │ Airdrop  │ │Leaderboard││ Points │  │
│  │ Module   │ │  Module  │ │  Module  │ │  Module  │ │ Module │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘  │
└───────────────────────┬────────────────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
┌──────────────┐ ┌───────────┐ ┌──────────────┐
│  MongoDB     │ │  Firebase │ │  Redis       │
│  (Primary DB)│ │  (Realtime│ │  (Cache +    │
│              │ │   Sync)   │ │   Queues)    │
└──────────────┘ └───────────┘ └──────────────┘

         ┌──────────────────────────┐
         │   Wallet Management API  │
         │   (Separate Service)     │
         │   - IP whitelisted       │
         │   - x-client-id auth     │
         │   - Encrypted key store  │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │   Avalanche C-Chain      │
         │   (Fuji Testnet)         │
         │   - Smart Contracts      │
         │   - Token Operations     │
         │   - NFT Operations       │
         └──────────────────────────┘
```

### 2.2 Service Separation

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
| Smart Contracts | Solidity 0.8.20+ | ERC-20, ERC-721, game contracts |
| Contract Tooling | Hardhat | Compilation, deployment, testing |
| Contract Templates | OpenZeppelin v5 | ERC standards, access control |

### 3.3 Third-Party Services

| Service | Purpose |
|---------|---------|
| Cloudinary | Dynamic NFT image transformations (badge overlays) |
| Pinata | IPFS storage for NFT metadata |
| Avalanche Data API | NFT/token balance queries, transfer history |
| DexScreener API | Token price feeds |
| Snowtrace API | Contract verification, tx data |
| Firebase Realtime DB | Game-to-server sync |

### 3.4 Security

| Component | Package |
|-----------|---------|
| HTTP Headers | helmet |
| NoSQL Injection | express-mongo-sanitize |
| XSS Prevention | xss-clean |
| Parameter Pollution | hpp |
| Rate Limiting | express-rate-limit |
| Encryption | Node.js crypto (AES) |
| Auth | JWT (jsonwebtoken) |
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
│   ├── firebase.js              # Firebase Admin init
│   ├── redis.js                 # Redis connection
│   ├── cloudinary.js            # Cloudinary config
│   └── constants.js             # App-wide constants
│
├── models/
│   ├── userModel.js
│   ├── chainboiNftModel.js
│   ├── weaponNftModel.js
│   ├── armorModel.js
│   ├── tournamentModel.js
│   ├── leaderboardModel.js
│   ├── gameSessionModel.js
│   ├── transactionModel.js
│   ├── settingsModel.js
│   ├── securityProfileModel.js
│   ├── airdropModel.js
│   ├── lootBoxModel.js
│   └── ...
│
├── controllers/
│   ├── authController.js
│   ├── trainingRoomController.js
│   ├── battlegroundController.js
│   ├── armoryController.js
│   ├── inventoryController.js
│   ├── mintController.js
│   ├── gameController.js
│   ├── pointsController.js
│   ├── leaderboardController.js
│   ├── airdropController.js
│   └── ...
│
├── routes/
│   ├── authRoutes.js
│   ├── trainingRoomRoutes.js
│   ├── battlegroundRoutes.js
│   ├── armoryRoutes.js
│   ├── inventoryRoutes.js
│   ├── mintRoutes.js
│   ├── gameRoutes.js
│   ├── pointsRoutes.js
│   ├── leaderboardRoutes.js
│   └── ...
│
├── middleware/
│   ├── auth.js                  # JWT verification
│   ├── gameAuth.js              # Game client API key auth
│   ├── antiCheat.js             # Anti-cheat/exploit system
│   ├── ipBlocking.js            # IP-based blocking
│   ├── validateEndpoint.js      # Endpoint whitelist
│   ├── errorHandler.js          # Global error handler
│   └── rateLimiter.js           # Rate limiting config
│
├── utils/
│   ├── avaxUtils.js             # Avalanche blockchain utilities
│   ├── contractUtils.js         # Smart contract interaction
│   ├── cloudinaryUtils.js       # Image manipulation
│   ├── ipfsUtils.js             # Pinata/IPFS operations
│   ├── formatUtils.js           # Number/string formatting
│   ├── cryptUtils.js            # Encryption/decryption
│   ├── catchAsync.js            # Async error wrapper
│   ├── AppError.js              # Custom error class
│   └── apiFeatures.js           # Query filtering/pagination
│
├── jobs/
│   ├── tournamentJob.js         # Tournament lifecycle cron
│   ├── airdropJob.js            # Weekly airdrop snapshots
│   ├── syncJob.js               # Firebase sync jobs
│   └── healthJob.js             # Health monitoring
│
├── contracts/                   # Solidity smart contracts
│   ├── BattleToken.sol
│   ├── ChainBoisNFT.sol
│   ├── WeaponNFT.sol
│   ├── LevelUp.sol
│   ├── PrizeDistribution.sol
│   └── PointsConversion.sol
│
├── scripts/                     # Deployment & utility scripts
│   ├── deploy.js
│   ├── generateArt.js
│   ├── uploadMetadata.js
│   └── seedData.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/
    ├── PRD.md                   # This document
    ├── plans/                   # Phase plans
    ├── api-docs/                # Frontend API documentation
    └── postman/                 # Postman collections
```

### 4.2 Middleware Chain (app.js)

Following the established pattern from reference projects:

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

Standardized across all endpoints to match frontend expectations:

```json
// Success (single item)
{
  "success": true,
  "data": { ... }
}

// Success (paginated list)
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
  address: String,              // Wallet address (primary identifier)
  playerType: String,           // "web2" | "web3"
  username: String,             // In-game username
  role: String,                 // "user" | "admin"
  pointsBalance: Number,        // Accumulated points (pre-tournament)
  tournamentPoints: Number,     // Current tournament points
  chainboiMoneyBalance: Number, // ChainBoi Money balance
  battleTokenBalance: Number,   // Cached $BATTLE balance
  isVerified: Boolean,          // Wallet verification status
  isBanned: Boolean,
  refreshToken: String,
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
  level: Number,                // 0=Trainee, 1-7
  isNormie: Boolean,            // Web2 player NFT
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
  metadataUri: String,          // Current IPFS/API metadata URI
  imageUri: String,             // Current Cloudinary image URI
  isListed: Boolean,            // Listed on marketplace
  createdAt: Date,
  updatedAt: Date
}
```

### 5.3 Weapon NFT Model

```javascript
{
  tokenId: Number,
  contractAddress: String,
  ownerAddress: String,
  weaponName: String,           // e.g., "BP50", "SCAR"
  category: String,             // "assault" | "smg" | "lmg" | "marksman" | "handgun" | "launcher" | "melee"
  blueprintTier: String,        // "base" | "epic" | "legendary" | "mythic"
  mythicLevel: Number,          // 0-5 (only for mythic tier)
  upgradeChips: Number,         // Chips accumulated toward next mythic level
  supply: Number,               // Total supply of this weapon
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
  cooldownEndTime: Date,        // Wednesday 12PM EST (48h after end)
  prizePool: Number,            // AVAX amount
  prizeDistribution: {
    first: Number,              // AVAX for 1st place
    second: Number,             // AVAX for 2nd place
    third: Number               // $BATTLE for 3rd place
  },
  winners: [{
    rank: Number,               // 1, 2, 3
    address: String,
    points: Number,
    collected: Boolean,
    collectedAt: Date
  }],
  prizeCollectionDeadline: Date, // 1 week after tournament end
  createdAt: Date
}
```

### 5.5 Leaderboard Model

```javascript
{
  tournamentId: ObjectId,
  level: Number,
  address: String,
  username: String,
  points: Number,
  rank: Number,
  period: String,               // "tournament" | "weekly" | "monthly" | "all-time"
  createdAt: Date,
  updatedAt: Date
}
```

### 5.6 Game Session Model

```javascript
{
  address: String,
  sessionId: String,
  gameMode: String,             // "battle_royale" | "frontline" | "search_destroy" | etc.
  startTime: Date,
  endTime: Date,
  score: Number,                // Max 5,000 per match
  kills: Number,
  pointsEarned: Number,
  verified: Boolean,            // Anti-cheat verification passed
  nftTokenId: Number,           // ChainBoi NFT used
  createdAt: Date
}
```

### 5.7 Transaction Model

```javascript
{
  type: String,                 // "level_up" | "weapon_purchase" | "armor_purchase" | "loot_box" |
                                // "points_conversion" | "prize_collection" | "mint" | "chip_draw"
  address: String,
  amount: Number,
  currency: String,             // "AVAX" | "BATTLE" | "POINTS" | "CHAINBOI_MONEY"
  txHash: String,               // On-chain transaction hash
  status: String,               // "pending" | "confirmed" | "failed"
  metadata: Object,             // Type-specific details
  createdAt: Date
}
```

### 5.8 Settings Model (Singleton)

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
  mintPrice: Number,            // 2 AVAX (mainnet)
  maxPointsPerMatch: Number,    // 5000
  burnRate: Number,             // 0.5 (50%)
  liquidityRate: Number,        // 0.5 (50%)
  teamRevenueSplit: Number,     // 0.25 (25%)
  awardPoolSplit: Number,       // 0.75 (75%)
  normieUpgradeMultiplier: Number, // 1.2 (120% floor price)
  armoryClosedDuringCooldown: Boolean,
  prizeCollectionWindowDays: Number, // 7
  contracts: {
    battleToken: String,
    chainboisNft: String,
    weaponNft: String,
    levelUp: String,
    prizeDistribution: String,
    pointsConversion: String
  },
  updatedAt: Date
}
```

### 5.9 Security Profile Model

```javascript
{
  address: String,
  threatScore: Number,          // 0-100
  status: String,               // "active" | "cooldown" | "temp_ban" | "perm_ban"
  violationLog: [{
    type: String,
    details: String,
    timestamp: Date
  }],
  dailyEarnings: Number,
  sessionStartTimestamp: Date,
  banExpiresAt: Date,
  blacklistedNfts: [Number],
  createdAt: Date,
  updatedAt: Date
}
```

### 5.10 Airdrop Model

```javascript
{
  type: String,                 // "nft_based" | "trait_based" | "token_based" | "nfd_based"
  snapshotDate: Date,
  status: String,               // "pending" | "processing" | "completed"
  eligibleAddresses: [{
    address: String,
    amount: Number,
    claimed: Boolean,
    claimedAt: Date
  }],
  totalAmount: Number,
  distributedAmount: Number,
  traitFilter: Object,          // For trait-based airdrops
  createdAt: Date
}
```

### 5.11 Loot Box Model

```javascript
{
  tier: String,                 // "bronze" | "silver" | "gold" | "epic" | "special"
  cost: Number,
  costCurrency: String,        // "BATTLE" | "CHAINBOI_MONEY"
  probabilities: [{
    reward: String,             // "weapon_base" | "weapon_epic" | "armor_1" | "battle_tokens" | etc.
    probability: Number,        // 0.0 to 1.0
    amount: Number              // For token rewards
  }],
  isActive: Boolean,
  createdAt: Date
}
```

---

## 6. API Endpoints

### 6.1 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/connect` | Connect wallet, create/find user | None |
| POST | `/api/v1/auth/verify` | Verify wallet ownership (0-AVAX tx) | None |
| POST | `/api/v1/auth/refresh` | Refresh access token | Refresh cookie |
| POST | `/api/v1/auth/logout` | Invalidate tokens | JWT |
| GET | `/api/v1/auth/me` | Get current user profile | JWT |

### 6.2 Training Room

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/training/nfts/:address` | Get all ChainBoi NFTs for wallet | JWT |
| GET | `/api/v1/training/nft/:tokenId` | Get NFT details (level, traits, badge) | JWT |
| POST | `/api/v1/training/level-up` | Initiate level-up transaction | JWT |
| GET | `/api/v1/training/level-up/cost` | Get current level-up cost | JWT |
| GET | `/api/v1/training/eligibility/:tokenId` | Tournament eligibility for NFT | JWT |

### 6.3 Battleground / Tournaments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/tournaments` | List all tournament tiers | Public |
| GET | `/api/v1/tournaments/:level` | Get tournament details for a level | Public |
| GET | `/api/v1/tournaments/:level/leaderboard` | Top 10 leaderboard | Public |
| GET | `/api/v1/tournaments/:level/countdown` | Time remaining | Public |
| GET | `/api/v1/tournaments/:level/winners` | Current/past winners | Public |
| POST | `/api/v1/tournaments/:level/collect-prize` | Winner claims prize | JWT |
| GET | `/api/v1/tournaments/history` | Historical tournament data | Public |

### 6.4 Armory

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/armory/weapons` | All weapons grouped by category | Public |
| GET | `/api/v1/armory/weapons/:category` | Weapons in a category | Public |
| GET | `/api/v1/armory/armor` | All armor tiers with pricing | Public |
| GET | `/api/v1/armory/lootboxes` | Loot box tiers & probabilities | Public |
| POST | `/api/v1/armory/purchase/weapon` | Buy weapon NFT with $BATTLE | JWT |
| POST | `/api/v1/armory/purchase/armor` | Buy armor NFT | JWT |
| POST | `/api/v1/armory/purchase/lootbox` | Buy and open loot box | JWT |
| POST | `/api/v1/armory/convert/points-to-money` | Convert points to ChainBoi Money | JWT |
| POST | `/api/v1/armory/convert/money-to-battle` | Convert ChainBoi Money to $BATTLE | JWT |
| POST | `/api/v1/armory/convert/battle-to-avax` | Cash out $BATTLE for AVAX | JWT |
| GET | `/api/v1/armory/balance/:address` | Get all balances (points, money, $BATTLE) | JWT |

### 6.5 Inventory

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/inventory/:address` | All owned assets categorized | JWT |
| GET | `/api/v1/inventory/:address/nfts` | ChainBoi NFTs only | JWT |
| GET | `/api/v1/inventory/:address/weapons` | Weapon NFTs only | JWT |
| GET | `/api/v1/inventory/:address/armor` | Armor only | JWT |
| GET | `/api/v1/inventory/:address/history` | Transaction history | JWT |

### 6.6 Minting

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/mint/status` | Remaining supply, price, mint state | Public |
| POST | `/api/v1/mint/chainboi` | Mint a ChainBoi NFT | JWT |
| GET | `/api/v1/mint/claim` | Claim page for hackathon judges | Public |
| POST | `/api/v1/mint/claim` | Claim a testnet ChainBoi NFT | JWT |

### 6.7 Game Integration

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/game/verify-assets` | Verify wallet holdings for game | Game API Key |
| GET | `/api/v1/game/points/:address` | Get current points balance | Game API Key |
| POST | `/api/v1/game/session/start` | Start a game session | Game API Key |
| POST | `/api/v1/game/session/end` | End session, report score | Game API Key |
| POST | `/api/v1/game/sync-points` | Sync points from game to platform | Game API Key |
| POST | `/api/v1/game/asset-sync` | Sync purchased assets to game | Game API Key |
| GET | `/api/v1/game/characters/:address` | Get unlocked characters for NFT level | Game API Key |

### 6.8 Points

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/points/:address` | Get points breakdown | JWT |
| POST | `/api/v1/points/convert` | Convert points to ChainBoi Money | JWT |
| GET | `/api/v1/points/history/:address` | Points history | JWT |

### 6.9 Leaderboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/leaderboard` | Global leaderboard | Public |
| GET | `/api/v1/leaderboard/:period` | Period-filtered leaderboard | Public |
| GET | `/api/v1/leaderboard/rank/:address` | Get specific user rank | JWT |

### 6.10 Airdrops (Phase 2)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/airdrops/eligible/:address` | Check eligibility | JWT |
| GET | `/api/v1/airdrops/history/:address` | Airdrop history | JWT |
| POST | `/api/v1/airdrops/claim` | Claim pending airdrop | JWT |

### 6.11 Health & Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/health` | Health check (DB, Redis, blockchain) | None |
| GET | `/api/v1/settings` | Get public settings | None |

---

## 7. Smart Contracts

### 7.1 Contracts Required (Testnet)

| Contract | Standard | Purpose |
|----------|----------|---------|
| **BattleToken** | ERC-20 | $BATTLE token with burn mechanism |
| **ChainBoisNFT** | ERC-721 | ChainBoi NFTs with level metadata |
| **WeaponNFT** | ERC-721 | Weapon NFTs with blueprint tiers |
| **LevelUp** | Custom | Accepts AVAX, calls NFT level update |
| **PrizeDistribution** | Custom | Tournament prize payouts |
| **PointsConversion** | Custom | Points → $BATTLE minting |

### 7.2 BattleToken (ERC-20)

- Standard ERC-20 with burn functionality
- Owner can mint (for points conversion, prize distribution)
- Burn mechanism: 50% burned, 50% to liquidity on purchases
- Team allocation with time-lock (1 year)
- Based on OpenZeppelin ERC20 + ERC20Burnable + Ownable

### 7.3 ChainBoisNFT (ERC-721)

- 4,032 max supply (4,000 public + 32 reserved)
- On-chain level tracking: `mapping(uint256 => uint8) public tokenLevel`
- Normie flag: `mapping(uint256 => bool) public isNormie`
- ERC-4906 support for metadata refresh events
- `tokenURI()` points to our API: `https://api.chainbois.com/metadata/{tokenId}`
- Owner functions: `setBaseURI`, `reserve`, `setNormie`
- Level-up authorized by LevelUp contract only

### 7.4 WeaponNFT (ERC-721)

- Variable supply per weapon type
- Blueprint tier metadata on-chain
- Mythic level tracking for mythic-tier weapons
- Authorized minter (Armory operations)

### 7.5 Deployment Config (Hardhat)

```javascript
// hardhat.config.js
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

### Phase 0: Foundation (Day 1-2)

**Scope:** Project scaffolding, database setup, core utilities

**Deliverables:**
- Express.js app with full middleware chain
- MongoDB connection + base models (User, Settings)
- Firebase Admin setup
- Redis connection
- avaxUtils.js (Avalanche blockchain utilities)
- contractUtils.js (smart contract interaction helpers)
- formatUtils.js, cryptUtils.js
- Error handling framework (AppError, catchAsync, globalErrorHandler)
- Auth system (JWT + wallet verification)
- Endpoint validation middleware
- Health endpoint
- .env.example with all required vars
- PM2 ecosystem config

### Phase 1: Smart Contracts (Day 2-3)

**Scope:** Deploy testnet contracts

**Deliverables:**
- BattleToken.sol (ERC-20)
- ChainBoisNFT.sol (ERC-721 with levels)
- WeaponNFT.sol (ERC-721)
- LevelUp.sol
- PrizeDistribution.sol
- PointsConversion.sol
- Deployment scripts for Fuji testnet
- Contract verification on Snowtrace
- Contract addresses saved to Settings model

### Phase 2: NFT Art Generation & Minting (Day 3-4)

**Scope:** Generate art, upload to IPFS, mint testnet NFTs

**Deliverables:**
- HashLips art engine configuration for ChainBois traits
- Art generation script
- Metadata generation with custom fields (level, badge, stats)
- IPFS upload script (Pinata)
- Cloudinary upload for base images
- Mint controller + routes
- Claim page endpoint for hackathon judges

### Phase 3: Training Room (Day 4-5)

**Scope:** NFT display, leveling, badge system

**Deliverables:**
- Training room controller + routes
- NFT query via Avalanche Data API
- Level-up flow (frontend → API → contract → metadata update)
- Badge overlay system via Cloudinary
- Firebase sync for level updates
- ERC-4906 metadata refresh trigger

### Phase 4: Game Integration (Day 5-6)

**Scope:** Game-to-API communication, anti-cheat

**Deliverables:**
- Game auth middleware (API key)
- Asset verification endpoint
- Game session start/end flow
- Points sync (game → API)
- Anti-cheat system
- Character unlock logic based on NFT level
- Security profile tracking

### Phase 5: Battleground / Tournaments (Day 6-7)

**Scope:** Tournament system, leaderboards, prizes

**Deliverables:**
- Tournament lifecycle cron job (create, start, end, cooldown)
- Leaderboard system with time-filtered queries
- Real-time leaderboard via Socket.IO
- Prize distribution flow
- Prize collection endpoint
- Tournament history

### Phase 6: Armory (Day 7-8)

**Scope:** Weapon/armor marketplace, points conversion

**Deliverables:**
- Weapon catalog with categories
- Purchase flow (select → confirm → sign → receive NFT)
- Armor tiers and purchasing
- Points → ChainBoi Money conversion
- ChainBoi Money → $BATTLE conversion
- $BATTLE → AVAX cash-out
- Balance tracking

### Phase 7: Inventory (Day 8-9)

**Scope:** Asset management, marketplace listing

**Deliverables:**
- Inventory aggregation (NFTs, weapons, armor from wallet)
- Category filtering and search
- Transaction history
- Marketplace listing (redirect to Joepegs or placeholder)

### Phase 8: Integration Testing & Documentation (Day 9-10)

**Scope:** End-to-end testing, frontend docs, Postman

**Deliverables:**
- Comprehensive test suite (unit + integration)
- Postman collection for all endpoints
- Frontend integration documentation
- Manual testing guide
- Demo script for hackathon video
- Judge testing instructions
- README.md for public repo

---

## 9. Security Architecture

### 9.1 Authentication Flow

```
Frontend:
1. User clicks "Connect Wallet" (Thirdweb)
2. Frontend sends POST /auth/connect { address }
3. Backend creates/finds user, returns challenge nonce
4. Frontend signs message with wallet
5. Frontend sends POST /auth/verify { address, signature, nonce }
6. Backend verifies signature, returns JWT access token + refresh token (httpOnly cookie)
7. Subsequent requests include: Authorization: Bearer <jwt>, x-client-id: <clientId>

Game Client:
1. Game has embedded API key (rotatable)
2. Game sends Authorization: Bearer <GAME_API_KEY>
3. gameAuth middleware validates key
4. Additional HMAC signature for score submissions (prevent tampering)
```

### 9.2 Anti-Cheat System (Game → API)

Following the pigeon-puffs pattern:

1. **Session validation**: Game must start a session before submitting scores
2. **Score plausibility**: Max 5,000 points per match, check against time played
3. **Velocity checks**: Flag abnormal scoring rates
4. **Threat scoring**: Accumulate violations, escalate to cooldown → temp ban → perm ban
5. **Daily earning limits**: Cap daily token earnings
6. **NFT verification**: Re-verify ownership at session end
7. **HMAC signatures**: Game signs score data with shared secret

### 9.3 Wallet Management Security

The wallet management service (separate repo):
- IP whitelisted (only ChainBois API server can reach it)
- x-client-id header authentication
- AES-encrypted private keys in MongoDB
- IV generated per wallet
- Keys decrypted only for signing, never exposed
- No direct internet access
- PM2 cluster mode

---

## 10. Third-Party Integrations

### 10.1 Avalanche Data API

**Purpose:** Read wallet NFTs, token balances, transfer history without direct contract calls.

**Key endpoints used:**
- `listErc721` - Get ChainBoi NFTs owned by wallet
- `listErc20` - Get $BATTLE balance
- `listCollectibles` - Combined NFT query
- `reindex` - Trigger metadata refresh after level-up

**Auth:** `x-glacier-api-key` header (free tier sufficient for hackathon)

### 10.2 Cloudinary

**Purpose:** Dynamic NFT image manipulation (badge overlays on level-up).

**Architecture:**
1. Base NFT images stored on Cloudinary: `chainbois/base/{tokenId}.png`
2. Badge images: `chainbois/badges/level_{n}.png`
3. Dynamic URL construction: `https://res.cloudinary.com/{cloud}/image/upload/l_chainbois:badges:level_3,g_north_west,w_80,x_10,y_10/{tokenId}.png`
4. No re-upload needed - transformation happens at CDN level

### 10.3 Pinata (IPFS)

**Purpose:** Store NFT metadata JSON for ERC-721 tokenURI.

**Operations:**
- Upload individual metadata JSON files
- Upload batch metadata
- Pin/unpin content
- Update metadata after level-up (re-pin with updated JSON)

### 10.4 Firebase Realtime Database

**Purpose:** Real-time sync between game and platform.

**Data structure:**
```
/users/{address}/
  level: 3
  hasNft: true
  score: 15000
  lastSync: timestamp
```

### 10.5 DexScreener API (Phase 2)

**Purpose:** $BATTLE token price feed.

**Endpoint:** `GET https://api.dexscreener.com/latest/dex/tokens/{battleTokenAddress}`

---

## 11. NFT Art Generation & Minting Pipeline

### 11.1 Generation Process

1. Receive trait layers (PNGs) in `/layers/` directory
2. Configure HashLips art engine (`src/config.js`):
   - Layer order, rarity weights
   - 4,032 editions (4,000 + 32 reserved)
3. Run `npm run build` to generate images + metadata
4. Add custom metadata fields: level (0 = Trainee), badge, normie flag, stats
5. Upload images to Cloudinary (for dynamic transformations)
6. Upload images to IPFS via Pinata (for immutable backup)
7. Update metadata `image` field to Cloudinary URL
8. Upload metadata JSON to IPFS via Pinata
9. Set contract `baseURI` to our API endpoint (for dynamic metadata)

### 11.2 Metadata Structure

```json
{
  "name": "ChainBoi #1",
  "description": "A ChainBoi warrior on the Avalanche battlefield",
  "image": "https://res.cloudinary.com/{cloud}/image/upload/l_chainbois:badges:trainee,g_nw,w_80,x_10,y_10/chainbois/base/1.png",
  "external_url": "https://chainbois.com/nft/1",
  "attributes": [
    { "trait_type": "Background", "value": "Urban" },
    { "trait_type": "Body", "value": "Tactical" },
    { "trait_type": "Head", "value": "Helmet" },
    { "trait_type": "Eyes", "value": "Visor" },
    { "trait_type": "Level", "value": 0, "display_type": "number" },
    { "trait_type": "Badge", "value": "Trainee" },
    { "trait_type": "Player Type", "value": "Web3" }
  ],
  "properties": {
    "level": 0,
    "badge": "trainee",
    "isNormie": false,
    "kills": 0,
    "score": 0,
    "gamesPlayed": 0
  }
}
```

---

## 12. Dynamic NFT System

### 12.1 Level-Up Flow

```
1. User selects ChainBoi NFT in Training Room
2. Frontend calls POST /api/v1/training/level-up { tokenId }
3. Backend:
   a. Verify ownership via Data API
   b. Check current level (must be < 7)
   c. Calculate cost (1 AVAX per level)
   d. Call Wallet Management API to prepare transaction
   e. Return unsigned transaction to frontend
4. Frontend: User signs transaction with wallet
5. Frontend: sends signed tx back to backend
6. Backend:
   a. Submit transaction to Avalanche
   b. Wait for confirmation
   c. Update NFT level in MongoDB
   d. Update Firebase Realtime DB
   e. Generate new Cloudinary URL with updated badge overlay
   f. Update metadata on IPFS (re-pin via Pinata)
   g. Call Avalanche Data API reindex for marketplace refresh
   h. Emit ERC-4906 MetadataUpdate event from contract
   i. Return success with new NFT data
```

### 12.2 Badge System

| Level | Badge | Characters Unlocked | Tournament Access |
|-------|-------|-------------------|------------------|
| 0 (Trainee) | trainee.png | 4 basic + 4 basic weapons | None |
| 1 | level_1.png | +4 characters | Level 1 (2 AVAX prize) |
| 2 | level_2.png | +4 characters | Level 2 (4 AVAX prize) |
| 3 | level_3.png | +4 characters | Level 3 (6 AVAX prize) |
| 4 | level_4.png | +4 characters | Level 4 (8 AVAX prize) |
| 5 | level_5.png | +4 characters | Level 5 (10 AVAX prize) |
| 6 | level_6.png | +4 characters | Level 6 (12 AVAX prize) |
| 7 | level_7.png | +4 (34 total) | Level 7 (14 AVAX prize) |

---

## 13. Game Integration Architecture

### 13.1 Unity → API Communication

```
Unity Game                          ChainBois API
    │                                    │
    ├─ POST /game/verify-assets ────────►│ Verify wallet NFTs
    │◄─── { characters: [...],           │ Return unlocked assets
    │      weapons: [...] }              │
    │                                    │
    ├─ POST /game/session/start ────────►│ Create GameSession
    │◄─── { sessionId }                 │ Start anti-cheat tracking
    │                                    │
    │  ... game plays ...                │
    │                                    │
    ├─ POST /game/session/end ──────────►│ Validate score, anti-cheat
    │   { sessionId, score, kills,       │ Update points balance
    │     hmacSignature }                │ Update Firebase
    │◄─── { pointsEarned, totalPoints } │
    │                                    │
    ├─ POST /game/sync-points ──────────►│ Real-time points update
    │   { address, points }              │ (during gameplay)
    │                                    │
```

### 13.2 Web2 vs Web3 Player Flow

```
Web2 Player:
1. Game sends player info (no wallet)
2. API creates Web2 user record
3. Limited character access (4 basic)
4. Points accumulate but cannot convert to $BATTLE
5. When player buys ChainBoi NFT → upgrade to Web3
6. Points reset to 0 on upgrade

Web3 Player:
1. Wallet connected
2. API verifies ChainBoi NFT ownership
3. Character access based on NFT level
4. Full tournament access (if level > 0)
5. Points → ChainBoi Money → $BATTLE conversion available
```

---

## 14. Frontend Integration Guide

### 14.1 Environment Variables

```env
NEXT_PUBLIC_BACKEND_BASE_URI=https://api.chainbois.com/api/v1
NEXT_PUBLIC_CLIENT_ID=chainbois-frontend
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.chainbois.com
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=<your-thirdweb-client-id>
NEXT_PUBLIC_NETWORK=fuji
```

### 14.2 Authentication Flow

```javascript
// 1. Connect wallet (Thirdweb handles this)
// 2. After wallet connected, authenticate with backend:
const { data } = await request({
  url: '/auth/connect',
  method: 'POST',
  data: { address: walletAddress }
});
// Returns: { nonce: "...", isNewUser: true/false }

// 3. Sign message and verify
const signature = await signMessage(nonce);
const { data: authData } = await request({
  url: '/auth/verify',
  method: 'POST',
  data: { address: walletAddress, signature, nonce }
});
// Returns: { accessToken: "...", user: {...} }
// Refresh token set as httpOnly cookie automatically
```

### 14.3 Request Pattern

All requests should use the existing `request()` utility with:
- `Authorization: Bearer <accessToken>` header
- `x-client-id: chainbois-frontend` header
- `withCredentials: true` for cookie handling

### 14.4 Pagination

```javascript
// Frontend already has fetchPaginatedData utility
// Backend returns: { [resourceName]: [...], total: N }
// Query params: ?page=1&limit=20
```

### 14.5 WebSocket Events (via Socket.IO)

```javascript
// Events the frontend should listen for:
socket.on('leaderboard:update', (data) => { ... });
socket.on('tournament:countdown', (data) => { ... });
socket.on('points:sync', (data) => { ... });
socket.on('nft:levelup', (data) => { ... });
```

---

## 15. Rate Limits & Constraints

### 15.1 Avalanche Data API

| Tier | Requests/Min | Requests/Day |
|------|-------------|-------------|
| Free (no key) | ~300 | ~60,000 |
| Free (with key) | ~400 | ~100,000 |

Sufficient for hackathon. Monitor usage via dashboard.

### 15.2 Our API Rate Limits

| Endpoint Type | Limit |
|--------------|-------|
| Public endpoints | 100 req/min per IP |
| Authenticated endpoints | 500 req/min per user |
| Game API endpoints | 1000 req/min per game instance |
| Mint endpoint | 10 req/min per user |

### 15.3 Cloudinary (Free Tier)

- 25,000 transformations/month
- 25GB bandwidth
- Sufficient for hackathon; monitor usage

### 15.4 Blockchain Constraints

- Avalanche C-Chain block time: ~2 seconds
- Gas costs on Fuji testnet: free (use faucet)
- Transaction confirmation: 1-2 blocks (~2-4 seconds)

---

## 16. Open Questions & Decisions

### 16.1 Needs Decision (Before Implementation)

| # | Question | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | Airdrop mechanism | Weekly snapshots vs staking-style | Weekly snapshots (simpler) |
| 2 | $BATTLE burn percentage | TBD | 50% burn, 50% liquidity |
| 3 | Points conversion priority | Tournament first vs accumulated first | Accumulated first (per docs) |
| 4 | Web2→Web3 distinction | In-game or on-website? | On-website (simpler for hackathon) |
| 5 | Level-up cost | Fixed or increasing? | Fixed 1 AVAX (per docs) |
| 6 | Gas subsidization | Platform pays gas or user pays? | User pays (simpler for testnet) |
| 7 | Token launch method | ERC-314 (APEX) vs standard ERC-20 | Standard ERC-20 for hackathon |
| 8 | Loot box randomness | On-chain or off-chain? | Off-chain for hackathon |

### 16.2 Deferred to Phase 2+

- APEX integration (widget, staking, trading)
- Eclipse capsule integration
- Superverse token integration
- Memecoin integrations
- In-house secondary marketplace
- Battlepass system
- Normie NFT pool management
- Agent pool buybacks
- NFD airdrops

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

| Level | Prize Pool (AVAX) | 1st | 2nd | 3rd ($BATTLE) |
|-------|------------------|-----|-----|----------------|
| 1 | 2 | 1 | 0.7 | equiv 0.3 |
| 2 | 4 | 2 | 1.4 | equiv 0.6 |
| 3 | 6 | 3 | 2.1 | equiv 0.9 |
| 4 | 8 | 4 | 2.8 | equiv 1.2 |
| 5 | 10 | 5 | 3.5 | equiv 1.5 |
| 6 | 12 | 6 | 4.2 | equiv 1.8 |
| 7 | 14 | 7 | 4.9 | equiv 2.1 |

Total weekly: 56 AVAX across all levels

### 17.3 Mythic Upgrade Chip Costs

| Mythic Level | Chips Required | Cumulative |
|-------------|---------------|------------|
| 0 → 1 | 150 | 150 |
| 1 → 2 | 250 | 400 |
| 2 → 3 | 500 | 900 |
| 3 → 4 | 700 | 1,600 |
| 4 → 5 | 900 | 2,500 |

### 17.4 Chip Draw Probabilities

| Chips | Probability |
|-------|------------|
| 10 | 50% |
| 20 | 25% |
| 30 | 15% |
| 40 | 6% |
| 60 | 3% |
| 100 | 1% |

### 17.5 Revenue Split

| Source | Team (25%) | Award Pool (75%) |
|--------|-----------|-----------------|
| Level-up (1 AVAX) | 0.25 AVAX | 0.75 AVAX |
| Weapon purchase | 25% of $BATTLE | 75% to burn/liquidity |

### 17.6 Key Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/chainbois

# JWT
JWT_SECRET=<secret>
JWT_LIFETIME=15m
REFRESH_TOKEN_SECRET=<secret>
REFRESH_TOKEN_LIFETIME=7d

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
LEVEL_UP_ADDRESS=
PRIZE_DISTRIBUTION_ADDRESS=
POINTS_CONVERSION_ADDRESS=

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

# Game
GAME_API_KEY=<shared-secret>
GAME_HMAC_SECRET=<hmac-secret>

# Client
MAIN_API_CLIENT_ID=chainbois-frontend

# PM2
PM2_INSTANCES=max
```
