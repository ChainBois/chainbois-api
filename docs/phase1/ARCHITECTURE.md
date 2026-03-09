# Phase 1: Backend Architecture

## What Phase 1 Implements

Phase 1 is the **core authentication and game integration layer**. It connects three systems:
1. **Firebase** - Auth (user accounts) + Realtime DB (game data bridge)
2. **MongoDB** - Persistent user profiles, scores, security profiles
3. **Avalanche C-Chain (Fuji)** - NFT ownership verification, levels, weapons

---

## Component Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Express App (app.js)                 │
│                                                         │
│  Middleware Stack (applied in order):                    │
│  1. helmet (security headers)                           │
│  2. CORS (configured origins)                           │
│  3. express-rate-limit (10k/hr global)                  │
│  4. express.json (body parser)                          │
│  5. mongo-sanitize (NoSQL injection)                    │
│  6. xss-clean (XSS prevention)                          │
│  7. hpp (HTTP parameter pollution)                      │
│                                                         │
│  Routes:                                                │
│  /api/v1/auth/*     → authRoutes.js                     │
│  /api/v1/game/*     → gameRoutes.js                     │
│  /api/v1/           → healthRoutes.js                   │
│  /api/v1/leaderboard/* → leaderboardRoutes.js           │
│  /*                 → validateEndpoint (404)            │
│                                                         │
│  Error Handler: errorHandler.js (dev/prod modes)        │
└─────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
chainbois-api/
├── server.js              # Entry point: DB connect, Firebase init, cron start
├── app.js                 # Express app with middleware + route mounting
├── config/
│   ├── db.js              # MongoDB connection (mongoose)
│   ├── firebase.js        # Firebase Admin SDK init (Auth + RTDB)
│   ├── redis.js           # Redis connection (optional caching)
│   └── constants.js       # Game constants: characters, weapons, ranks, intervals
├── controllers/
│   ├── authController.js  # create-user, check-user, login, me, logout
│   ├── gameController.js  # verify-assets, set-avatar
│   ├── downloadController.js  # game file download, game info
│   └── leaderboardController.js  # leaderboard queries
├── routes/
│   ├── authRoutes.js
│   ├── gameRoutes.js
│   ├── healthRoutes.js
│   └── leaderboardRoutes.js
├── middleware/
│   ├── auth.js            # decodeToken: Firebase ID token verification
│   ├── antiCheat.js       # SecurityProfile, threat scoring, ban checks
│   └── rateLimiter.js     # authLimiter (20/15min), generalLimiter (10k/hr)
├── models/
│   ├── userModel.js       # User schema (profile, score, NFT, playerType)
│   ├── settingsModel.js   # Singleton settings (costs, schedule, contracts)
│   ├── securityProfile.js # Per-user threat score, violations, bans
│   ├── weeklyLeaderboard.js  # Aggregated weekly scores
│   ├── scoreChangeModel.js   # Score deltas for time-period queries
│   └── walletModel.js     # AES-encrypted wallet keys
├── jobs/
│   ├── syncNewUsersJob.js # Cron: poll Firebase for new game players (1 min)
│   └── syncScoresJob.js   # Cron: sync scores from Firebase to MongoDB (5 min)
├── utils/
│   ├── appError.js        # Custom error class with statusCode
│   ├── catchAsync.js      # Async error wrapper
│   ├── nftUtils.js        # lookupNftAssets: Glacier API + contract calls
│   ├── contractUtils.js   # Direct contract calls (getLevel, getOwner)
│   ├── avaxUtils.js       # Avalanche-specific helpers
│   ├── cryptUtils.js      # AES encrypt/decrypt for wallet keys
│   ├── formatUtils.js     # Number/string formatting
│   ├── retryHelper.js     # Retry with exponential backoff
│   └── apiFeatures.js     # Query filtering, sorting, pagination
├── abis/                  # Contract ABIs (extracted from Hardhat artifacts)
│   ├── BattleToken.json
│   ├── ChainBoisNFT.json
│   └── WeaponNFT.json
└── __tests__/             # 207 unit tests across 17 suites
```

---

## Data Flow Diagrams

### Authentication Flow

```
                    ┌─────────┐
                    │ Frontend │
                    └────┬────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    create-user      check-user       login
    (public)         (public)       (token+addr)
         │               │               │
         v               v               v
    ┌─────────┐    ┌─────────┐    ┌──────────────┐
    │Firebase │    │Firebase │    │ 1. Verify    │
    │ Auth    │    │ Auth    │    │    token     │
    │ create  │    │ lookup  │    │ 2. Check ban │
    └────┬────┘    └─────────┘    │ 3. Find/     │
         │                        │    create    │
         v                        │    user      │
    ┌─────────┐                   │ 4. Check NFT │
    │Firebase │                   │    on-chain  │
    │ RTDB    │                   │ 5. Update    │
    │ write   │                   │    MongoDB   │
    └─────────┘                   │ 6. Sync to   │
                                  │    Firebase  │
                                  └──────────────┘
```

### Score Sync Flow (Background)

```
┌──────────┐     ┌──────────────┐     ┌─────────┐     ┌──────────────┐
│  Unity   │────>│ Firebase     │────>│  Cron   │────>│   MongoDB    │
│  Game    │     │ RTDB         │     │  (5min) │     │              │
│          │     │              │     │         │     │ User.score   │
│ Writes:  │     │ users/{uid}: │     │ Reads   │     │ User.high    │
│  Score   │     │  Score: 1500 │     │ all     │     │ User.points  │
│          │     │              │     │ scores  │     │ WeeklyLB     │
│          │     │              │     │         │     │ ScoreChange  │
└──────────┘     └──────────────┘     │ Anti-   │     └──────────────┘
                                      │ cheat   │
                                      │ check   │
                                      └─────────┘
```

---

## Key Design Decisions

1. **Address-primary user lookup**: Login finds users by wallet address first, falls back to Firebase UID. This enables the web2-to-web3 upgrade path.

2. **Backend-only blockchain**: Frontend never touches the chain. All NFT checks, level lookups, and weapon detection happen server-side via Glacier Data API + direct contract calls.

3. **Firebase as game bridge**: The Unity game reads/writes Firebase RTDB. The backend syncs this data to MongoDB. This decouples the game from the API completely.

4. **Singleton Settings**: One Settings document in MongoDB controls all game parameters. Prevents race conditions in PM2 cluster mode.

5. **PM2 cluster with primary cron**: Cron jobs only run on instance 0 (`NODE_APP_INSTANCE === "0"`), preventing duplicate syncs.

---

## Deployed Infrastructure

| Component | Details |
|-----------|---------|
| API Server | `https://your-api-domain.com/api/v1` |
| Runtime | PM2 cluster mode (2 instances), port 3003 |
| Reverse Proxy | Nginx with Certbot SSL |
| Database | MongoDB Atlas (cloud) |
| Chain | Avalanche Fuji Testnet (Chain ID 43113) |
| Firebase | `chainbois` project |

### Smart Contracts (Fuji Testnet)

| Contract | Address | Snowtrace |
|----------|---------|-----------|
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | [View](https://testnet.snowtrace.io/address/0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0) |
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | [View](https://testnet.snowtrace.io/address/0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b) |
| WeaponNFT | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` | [View](https://testnet.snowtrace.io/address/0xa2AFf3105668124A187b1212Ab850bf8b98dD07d) |

### Platform Wallets

| Wallet | Address | Purpose |
|--------|---------|---------|
| Deployer | `0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0` | Contract deployment |
| NFT Store | `0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0` | Holds 50 ChainBoi NFTs for sale |
| Weapon Store | `0xD40e6631617B7557C28789bAc01648A74753739C` | Holds 13 weapon NFTs |
| Prize Pool | `0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e` | Tournament prize distribution |

---

## Endpoints Summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/auth/check-user/:email` | Public | Check if user exists |
| POST | `/auth/create-user` | Public | Create Firebase user |
| POST | `/auth/login` | Token | Login + wallet + NFT check |
| GET | `/auth/me` | Token | Get user profile |
| POST | `/auth/logout` | Token | Logout + revoke tokens |
| POST | `/game/verify-assets` | Token | Re-check NFTs on-chain |
| POST | `/game/set-avatar` | Token | Set active NFT avatar |
| GET | `/game/download/:platform` | Public | Download game (win/apk) |
| GET | `/game/info` | Public | Game info + download count |
| GET | `/health` | Public | API health check |
| GET | `/settings` | Public | Game settings |
| GET | `/leaderboard` | Public | All-time leaderboard |
| GET | `/leaderboard/:period` | Public | Time-filtered leaderboard |
| GET | `/leaderboard/rank/:uid` | Token | User's rank |
