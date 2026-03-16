# ChainBois Platform — System Architecture

Complete architecture reference for the ChainBois Web3 gaming platform on Avalanche.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Infrastructure](#2-infrastructure)
3. [Smart Contracts](#3-smart-contracts)
4. [Wallet Architecture](#4-wallet-architecture)
5. [Application Architecture](#5-application-architecture)
6. [Data Flow Diagrams](#6-data-flow-diagrams)
7. [Cron Jobs & Background Processing](#7-cron-jobs--background-processing)
8. [Security Architecture](#8-security-architecture)
9. [Tokenomics Engine](#9-tokenomics-engine)
10. [API Endpoint Map](#10-api-endpoint-map)
11. [Data Models](#11-data-models)
12. [External Services](#12-external-services)

---

## 1. Platform Overview

ChainBois is a military-themed Web3 gaming platform on Avalanche where players own NFT characters, earn $BATTLE tokens through gameplay, and compete in tournaments for prizes.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ChainBois Platform                            │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐    │
│  │  Unity   │   │ Frontend │   │  Backend  │   │  Avalanche   │    │
│  │  Game    │◄──│  Website │──►│   API     │──►│  C-Chain     │    │
│  │ (PC/APK) │   │ (React)  │   │ (Express) │   │  (Fuji)      │    │
│  └────┬─────┘   └──────────┘   └─────┬─────┘   └──────────────┘    │
│       │                              │                              │
│       ▼                              ▼                              │
│  ┌──────────┐              ┌──────────────────┐                     │
│  │ Firebase │◄────────────►│    MongoDB Atlas  │                    │
│  │  RTDB    │  (sync jobs) │   (primary store) │                    │
│  └──────────┘              └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Design Principles

- **Backend-heavy blockchain**: All on-chain operations happen server-side. Frontend never signs contract calls directly.
- **Firebase as game bridge**: Game reads/writes Firebase RTDB. Backend syncs Firebase ↔ MongoDB via cron jobs.
- **Pre-minted assets**: All NFTs and tokens are pre-minted to platform wallets. Users buy/earn via transfers, not mints.
- **Fixed supply tokenomics**: $BATTLE has a hard 10M cap. Dynamic rates prevent depletion while maintaining deflation.
- **No custom marketplace**: Secondary trading happens on Joepegs, Campfire, etc.

---

## 2. Infrastructure

| Component | Technology | Details |
|-----------|-----------|---------|
| Server | Ubuntu 22.04 VPS | Single server for hackathon |
| Runtime | Node.js + PM2 | Cluster mode (2 instances), port 3003 |
| Reverse Proxy | Nginx + Certbot | SSL termination, HTTPS |
| Database | MongoDB Atlas | Cloud-hosted, replica set |
| Cache | Redis | Rate limiting, session state |
| Real-time | Socket.IO | Tournament leaderboard updates |
| Blockchain | Avalanche Fuji Testnet | Chain ID 43113 |
| File Storage | IPFS (Pinata) | NFT images + metadata |
| Image CDN | Cloudinary | Badge overlay transformations |
| Game Bridge | Firebase RTDB | Real-time game ↔ backend sync |
| Notifications | Discord Webhooks | Tournament results, wallet alerts, audit reports |

### Server Process Architecture

```
PM2
├── Instance 0 (primary)
│   ├── Express HTTP server (port 3003)
│   ├── Socket.IO (WebSocket)
│   └── 9 Cron Jobs (only on primary instance)
└── Instance 1 (worker)
    ├── Express HTTP server (port 3003)
    └── Socket.IO (WebSocket)
    (No cron jobs — PM2 NODE_APP_INSTANCE !== "0")
```

---

## 3. Smart Contracts

All contracts deployed on Avalanche Fuji Testnet. Solidity 0.8.24, OpenZeppelin v5.6.

### Contract Addresses (Fuji)

| Contract | Address | Standard |
|----------|---------|----------|
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | ERC20Capped (10M cap) |
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | ERC721 + custom level mapping |
| WeaponNFT | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` | ERC721 + weapon name mapping |

### BattleToken (ERC20Capped)

```solidity
// Key features:
- cap() = 10,000,000 * 10^18 (hard cap, immutable)
- All tokens pre-minted to rewards wallet at deploy
- burn(amount) — anyone can burn their own tokens (permanent supply reduction)
- Standard ERC20: transfer, approve, transferFrom, balanceOf
```

### ChainBoisNFT (ERC721)

```solidity
// Key features:
- mint(to) — owner only, auto-incrementing tokenId starting at 1
- setLevel(tokenId, level) — owner only, stores level (0-7) on-chain
- getLevel(tokenId) — public view, returns uint8
- setBaseURI(baseURI) — owner only, shared prefix for all tokenURI calls
- tokenURI(tokenId) = baseURI + tokenId + ".json"
- 4,032 max supply (mainnet) / 50 minted (testnet)
```

### WeaponNFT (ERC721)

```solidity
// Key features:
- mint(to, name) — owner only, stores weapon name on-chain
- weaponName(tokenId) — public view, returns string
- setBaseURI(baseURI) — same pattern as ChainBoisNFT
- 13 weapons minted (testnet)
```

### Contract Interaction (Backend)

```
utils/contractUtils.js          utils/avaxUtils.js
├── getNftOwner(tokenId)        ├── getProvider()
├── getNftLevel(tokenId)        ├── getSigner(privateKey)
├── setNftLevel(tokenId, lv)    ├── getAvaxBalance(address)
├── getNftsByOwner(address)     └── reindexNftMetadata(tokenId)
├── getWeaponsByOwner(address)
├── transferNft(to, tokenId)
├── transferWeapon(to, tokenId)
├── getBattleBalance(address)
├── transferBattleTokens(to, amount, key)
├── burnBattleTokens(amount, key)
└── getBattleTotalSupply()
```

---

## 4. Wallet Architecture

Five platform wallets, all AES-256-encrypted in MongoDB. Decrypted at runtime only when signing transactions.

| Wallet | Role | Purpose | Holds |
|--------|------|---------|-------|
| `deployer` | Contract owner | Deploy contracts, set levels, set baseURI | AVAX (gas) |
| `nft_store` | NFT sales | Holds ChainBoi NFTs for purchase | 50 NFTs + AVAX (gas) |
| `weapon_store` | Weapon sales | Holds weapon NFTs, receives $BATTLE from purchases | 13 weapons + $BATTLE + AVAX (gas) |
| `prize_pool` | Tournament prizes | Receives AVAX from level-ups, pays tournament winners | AVAX |
| `rewards` | Token distribution | Holds $BATTLE supply, pays conversions + airdrops | $BATTLE (10M initial) |

### Fund Flow

```
                    ┌─────────────────┐
                    │   Game Players  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
     ┌──────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐
     │ Buy Weapon  │  │ Level Up   │  │ Convert Pts │
     │ ($BATTLE)   │  │ (AVAX)     │  │ → $BATTLE   │
     └──────┬──────┘  └─────┬──────┘  └──────┬──────┘
            │               │                │
            ▼               ▼                ▼
   ┌────────────────┐ ┌───────────┐  ┌──────────────┐
   │  weapon_store  │ │ prize_pool│  │   rewards    │
   │   wallet       │ │  wallet   │  │   wallet     │
   └────────┬───────┘ └─────┬─────┘  └──────▲───────┘
            │               │                │
   Sweep (6h)        Tournament end    Recycle portion
            │               │                │
            ▼               ▼                │
   ┌────────────────┐ ┌───────────┐          │
   │ Split by       │ │ Auto-pay  │          │
   │ Health Tier    │─┤ 1st/2nd   ├──────────┘
   └────────┬───────┘ │ (AVAX)    │
            │         │ 3rd       │
            │         │ ($BATTLE) │
            ▼         └───────────┘
   ┌────────────────┐
   │  PERMANENTLY   │
   │  BURNED        │
   │  (supply ↓)    │
   └────────────────┘
```

### Wallet Security

- Private keys AES-256-CBC encrypted (`utils/cryptUtils.js`)
- Stored in MongoDB Wallet collection with `key` and `iv` fields (both `select: false`)
- Decrypted only when signing transactions
- Encryption key in environment variable (`WALLET_ENCRYPTION_KEY`)

---

## 5. Application Architecture

### Directory Structure

```
chainbois-api/
├── abis/                    # Contract ABIs (extracted from Hardhat artifacts)
├── assets/                  # NFT images, badges, metadata templates
├── config/
│   ├── constants.js         # All app constants, intervals, tiers
│   ├── db.js                # MongoDB connection
│   ├── firebase.js          # Firebase Admin SDK init
│   ├── redis.js             # Redis client
│   ├── cloudinary.js        # Cloudinary SDK init
│   └── socketio.js          # Socket.IO server init
├── controllers/             # Request handlers (12 controllers)
├── jobs/                    # Cron job handlers (9 jobs)
├── middleware/
│   ├── auth.js              # Firebase token verification
│   ├── antiCheat.js         # Score plausibility, velocity checks
│   ├── errorHandler.js      # Global error handler
│   ├── logger.js            # Request/response logging
│   ├── rateLimiter.js       # Per-endpoint rate limiting
│   └── validateEndpoint.js  # Whitelist-based 404 for unknown routes
├── models/                  # Mongoose schemas (20 models)
├── routes/                  # Express routers (12 route files)
├── scripts/                 # Deployment, minting, migration scripts
├── services/
│   ├── prizeService.js      # Tournament prize calculation + distribution
│   ├── rarityService.js     # NFT rarity scoring algorithm
│   └── tokenomicsService.js # Dynamic rate calculation engine
├── utils/
│   ├── appError.js          # Custom error class with statusCode
│   ├── avaxUtils.js         # Avalanche RPC, Glacier API, provider
│   ├── catchAsync.js        # Async error wrapper for controllers
│   ├── cloudinaryUtils.js   # Badge overlay URL builder
│   ├── contractUtils.js     # All smart contract interactions
│   ├── cryptUtils.js        # AES encrypt/decrypt for wallet keys
│   ├── discordUtils.js      # Discord webhook notifications
│   └── firebaseUtils.js     # Firebase RTDB read/write helpers
├── app.js                   # Express app setup, middleware, routes
├── server.js                # Server startup, cron registration, shutdown
└── package.json
```

### Middleware Pipeline

```
Request → logger → CORS → rateLimiter → JSON parser → validateEndpoint
       → [auth (if route requires)] → [antiCheat (if game route)]
       → controller → response
       ↓ (on error)
       errorHandler → { success: false, message, statusCode }
```

### Authentication Strategy

| Route Group | Auth Required | Method |
|-------------|--------------|--------|
| `/auth/*` | Firebase token (for login, me, logout) | `decodeToken` middleware |
| `/game/*` | Firebase token | `decodeToken` middleware |
| `/training/*` | Firebase token (for level-up, eligibility) | `decodeToken` middleware |
| `/armory/*` | No auth | On-chain tx verification (sender = submitter) |
| `/points/*` | No auth | Wallet address identifies user |
| `/inventory/*` | No auth | Public by wallet address |
| `/leaderboard/*` | No auth | Public read-only |
| `/tournaments/*` | No auth (read), Firebase (actions) | Mixed |
| `/airdrop/*` | No auth (read), none (admin actions) | Public + admin |
| `/metadata/*` | No auth | Public (for marketplaces) |
| `/metrics/*` | No auth | Public |
| `/health` | No auth | Health check |
| `/settings` | No auth | Public settings |

---

## 6. Data Flow Diagrams

### Player Onboarding (Web3)

```
1. Player opens website → connects wallet (MetaMask/Core)
2. Frontend: POST /auth/create-user { email, address }
   → Backend creates Firebase user + MongoDB user
3. Frontend: POST /auth/login { firebaseToken }
   → Backend checks on-chain NFTs (Glacier API)
   → Backend checks on-chain level (contract.getLevel)
   → Backend checks on-chain weapons (Glacier API)
   → Backend writes to Firebase: { hasNFT, level, weapons, characters }
   → Backend returns user profile + asset data
4. Player launches Unity game → game reads Firebase RTDB
   → Unlocks characters/weapons based on NFT ownership + level
```

### Game Score → Leaderboard Pipeline

```
1. Player plays Unity game → game writes score to Firebase RTDB
2. syncScoresJob (every 5 min) polls Firebase:
   → Reads all user scores from Firebase
   → Compares with MongoDB scores
   → Updates MongoDB User.score, User.gamesPlayed
   → Runs antiCheat checks (plausibility, velocity)
   → Updates WeeklyLeaderboard entries
3. tournamentJob (every hour):
   → Checks if any tournament period ended
   → Snapshots final leaderboard
   → Calculates prizes (50/35/15 split)
   → Auto-distributes to winners (AVAX + $BATTLE)
   → Posts results to Discord
   → Creates next tournament
```

### NFT Level-Up Flow

```
1. Frontend shows NFT at Level 2, cost to Level 3 = 1 AVAX
2. User sends 1 AVAX to prize_pool wallet (via MetaMask)
3. Frontend: POST /training/level-up { txHash }
4. Backend verifies on-chain:
   - tx exists, confirmed, correct sender/receiver
   - amount >= cost, age < 5 min, not already used
5. Backend calls contract.setLevel(tokenId, 3) (deployer signs)
6. Backend updates:
   - MongoDB: user.level = 3
   - Firebase: { level: 3, characters: [...updated] }
7. Game reads Firebase → unlocks 4 new characters
```

### Weapon Purchase Flow

```
1. Frontend shows Armory with available weapons + prices
2. User sends $BATTLE to weapon_store wallet
3. Frontend: POST /armory/purchase { txHash, tokenId }
4. Backend verifies $BATTLE transfer on-chain
5. Backend transfers weapon NFT: weapon_store → user wallet
6. Backend updates:
   - MongoDB: weapon ownership
   - Firebase: { weapons: [...updated] }
7. Game reads Firebase → weapon unlocked
```

### Points → $BATTLE Conversion

```
1. Frontend shows points balance + current conversion rate
2. Frontend: GET /points → returns { pointsBalance, conversionRate }
3. User requests conversion of N points
4. Frontend: POST /points/convert { amount: N, address }
5. Backend:
   - Checks rewards wallet health tier
   - effectiveBattle = N * multiplier (e.g., N * 0.75 at HEALTHY)
   - Atomically deducts N points from user
   - Transfers effectiveBattle $BATTLE from rewards → user
   - Records transaction with conversion rate metadata
6. Response includes actual amount received + rate applied
```

---

## 7. Cron Jobs & Background Processing

All cron jobs run only on PM2 instance 0 (primary). Registered in `server.js`.

| Job | File | Schedule | Purpose |
|-----|------|----------|---------|
| syncNewUsersJob | `jobs/syncNewUsersJob.js` | Daily midnight | Detect Web2 players (Firebase UIDs without MongoDB accounts) |
| syncScoresJob | `jobs/syncScoresJob.js` | Every 5 min | Sync game scores Firebase → MongoDB, update leaderboards |
| tournamentJob | `jobs/tournamentJob.js` | Every hour | Create/end tournaments, auto-distribute prizes |
| purchaseFailsafeJob | `jobs/purchaseFailsafeJob.js` | Every 5 min | Recover stuck NFT/weapon purchases (PurchaseAttempt) |
| failedPayoutJob | `jobs/failedPayoutJob.js` | Every 6 hours | Retry failed tournament prize payouts |
| traitAirdropJob | `jobs/traitAirdropJob.js` | Wed 8 PM UTC | Weekly trait-based $BATTLE airdrop to NFT holders |
| tokenomicsJob | `jobs/tokenomicsJob.js` | Every 6 hours | Sweep weapon_store → burn + recycle $BATTLE |
| walletHealthJob | `jobs/walletHealthJob.js` | Every hour | Monitor gas, balances, inventory, prize pool + auto-fund |
| platformAuditJob | `jobs/platformAuditJob.js` | Daily 3 AM UTC | Solvency, ownership sync, stuck purchases, failed payouts |

### Job Details

**syncScoresJob**: Reads Firebase RTDB `users/` tree. For each UID with a MongoDB User, compares `score` and `gamesPlayed`. If different, updates MongoDB and runs anti-cheat validation (score plausibility, velocity checks). Flags suspicious activity on SecurityProfile.

**tournamentJob**: Manages the full tournament lifecycle. Creates Level 1-7 tournaments with 5-day duration + 48h cooldown. When a tournament ends: snapshots leaderboard, calculates prizes (50% 1st / 35% 2nd / 15% 3rd), distributes AVAX (1st/2nd) and $BATTLE (3rd) automatically, posts Discord notifications, creates next tournament.

**tokenomicsJob**: Checks weapon_store $BATTLE balance. If above 10 BATTLE threshold: calculates current health tier, splits into burn portion (10-50%) and recycle portion (50-90%), executes on-chain burn, transfers recycle to rewards wallet, records BurnRecord + Transactions, sends Discord notification.

**walletHealthJob**: Five checks + auto-fund per run:
1. Gas balance (AVAX) for all 5 platform wallets
2. $BATTLE balance for rewards wallet
3. NFT inventory for nft_store (how many unsold)
4. Weapon inventory by category for weapon_store
5. Prize pool funding vs active tournament obligations
6. **Auto-fund**: If any wallet (nft_store, weapon_store, rewards) has low gas, the deployer automatically sends 0.5 AVAX to top it up. The deployer will not fund others if its own balance drops below 0.5 AVAX reserve — instead it sends a Discord alert requesting manual top-up. Each successful top-up and each failure is reported to Discord.

Uses in-memory alert deduplication (6-hour cooldown per wallet+severity) to prevent Discord spam.

**platformAuditJob**: Daily comprehensive audit:
1. Solvency: rewards balance vs annual airdrop obligations + pending conversions + tournament prizes
2. Ownership sync: spot-checks 10 NFTs + 5 weapons (on-chain vs MongoDB)
3. Stuck purchases: PurchaseAttempts in non-terminal state > 24h
4. Failed payouts: unresolved FailedPayout documents
5. Tokenomics health: current tier, burn stats, multiplier

---

## 8. Security Architecture

### Rate Limiting

```javascript
// config/rateLimiter.js — Redis-backed rate limiting
authLimiter:      5 requests / 15 min (login, create-user)
purchaseLimiter:  3 requests / 1 min (weapon/NFT purchases)
generalLimiter:   100 requests / 15 min (all other routes)
```

### Anti-Cheat System

```javascript
// middleware/antiCheat.js — Score validation
- Plausibility check: score change must be realistic for time elapsed
- Velocity check: no more than X score changes in Y minutes
- Threat scoring: accumulated suspicion points per user
- Auto-ban: threshold-based ban on SecurityProfile
- Manual review queue for borderline cases
```

### Endpoint Validation

```javascript
// middleware/validateEndpoint.js — Whitelist-based routing
- All /api/v1/* requests checked against regex patterns
- Unknown endpoints return 404 (prevents enumeration)
- Non-API routes (static files, etc.) pass through
```

### Transaction Verification (On-Chain)

All purchase endpoints verify transactions on-chain before processing:
- Transaction exists and is confirmed
- Sender matches the claimed user address
- Receiver is the correct platform wallet
- Amount meets or exceeds the price
- Transaction is recent (< 5 min old)
- Transaction hash hasn't been used before

### Wallet Key Encryption

```
Encrypt: AES-256-CBC(privateKey, WALLET_ENCRYPTION_KEY) → { encrypted, iv }
Decrypt: AES-256-CBC(encrypted, WALLET_ENCRYPTION_KEY, iv) → privateKey
Stored in MongoDB: Wallet.key (select: false), Wallet.iv (select: false)
Environment: WALLET_ENCRYPTION_KEY (never committed, env-only)
```

---

## 9. Tokenomics Engine

### Overview

$BATTLE has a fixed 10,000,000 supply (ERC20Capped). All tokens start in the rewards wallet. The system is designed to be truly deflationary — total supply permanently decreases via burns while dynamic rates prevent the rewards wallet from emptying.

### Health Tier System

```javascript
// services/tokenomicsService.js
healthPercent = (rewardsBalance / 10,000,000) * 100

ABUNDANT:  healthPercent >= 75%  → multiplier: 1.0,  burnRate: 50%
HEALTHY:   healthPercent >= 50%  → multiplier: 0.75, burnRate: 40%
MODERATE:  healthPercent >= 30%  → multiplier: 0.5,  burnRate: 30%
SCARCE:    healthPercent >= 15%  → multiplier: 0.3,  burnRate: 20%
CRITICAL:  healthPercent <  15%  → multiplier: 0.15, burnRate: 10%
```

### What the Multiplier Affects

| Operation | Effect |
|-----------|--------|
| Points → $BATTLE conversion | `effectiveBattle = points * multiplier` |
| Weekly trait airdrop | `distributionAmount = baseAmount * multiplier` |
| Weapon store sweep (burn) | `burnAmount = sweepBalance * burnRate` |
| Weapon store sweep (recycle) | `recycleAmount = sweepBalance * (1 - burnRate)` |

### Asymptotic Sustainability

As the rewards wallet depletes:
- Less goes out (lower conversion rates, lower airdrop amounts)
- More comes back (higher recycle rate from sweeps)
- Less gets burned (lower burn rate)

This creates a natural equilibrium — the system slows down but never stops. The token becomes more scarce over time, potentially increasing value.

### Sweep Cycle (Every 6 Hours)

```
1. Check weapon_store $BATTLE balance
2. If balance > 10 BATTLE (sweep threshold):
   a. Get current rewards wallet balance
   b. Calculate health tier → burn/recycle split
   c. Execute on-chain burn: contract.burn(burnAmount)
   d. Transfer recycle: weapon_store → rewards
   e. Record BurnRecord in MongoDB
   f. Record Transactions (TOKEN_BURN + TOKEN_RECYCLE)
   g. Send Discord notification with stats
```

---

## 10. API Endpoint Map

### Auth (`/api/v1/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/check-user/:email` | Public | Check if user exists |
| POST | `/create-user` | Public | Create Firebase + MongoDB user |
| POST | `/login` | Firebase | Login, check assets, sync Firebase |
| GET | `/me` | Firebase | Get user profile |
| POST | `/logout` | Firebase | Logout + revoke tokens |

### Game (`/api/v1/game`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/verify-assets` | Firebase | Re-check on-chain NFTs/weapons |
| POST | `/set-avatar` | Firebase | Set active NFT avatar |
| GET | `/download/:platform` | Public | Download game (win/apk) |
| GET | `/characters/:address` | Public | Get characters for wallet |
| GET | `/info` | Public | Game info + settings |

### Training (`/api/v1/training`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/nfts` | Firebase | Get user's NFTs with levels |
| GET | `/nft` | Firebase | Get single NFT details |
| POST | `/level-up` | Firebase | Level up NFT (pay AVAX) |
| GET | `/level-up/cost` | Public | Get level-up costs |
| GET | `/eligibility` | Firebase | Check tournament eligibility |

### Battleground (`/api/v1/tournaments`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | List active tournaments |
| GET | `/:id` | Public | Get tournament details + leaderboard |
| GET | `/history` | Public | Past tournament results |

### Armory (`/api/v1/armory`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | List available items for sale |
| GET | `/weapons` | Public | Available weapons |
| POST | `/purchase` | No auth | Purchase weapon (verify on-chain tx) |
| POST | `/purchase-nft` | No auth | Purchase ChainBoi NFT |

### Points (`/api/v1/points`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No auth | Get points balance + conversion rate |
| POST | `/convert` | No auth | Convert points → $BATTLE |

### Inventory (`/api/v1/inventory`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No auth | Get all assets for address |
| GET | `/:address/nfts` | No auth | Get NFTs for address |

### Leaderboard (`/api/v1/leaderboard`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | Current leaderboard |
| GET | `/weekly` | Public | Weekly leaderboard |

### Airdrop (`/api/v1/airdrop`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/rarity` | Public | Rarity leaderboard (paginated) |
| GET | `/rarity/:tokenId` | Public | Single NFT rarity score |
| GET | `/traits-pool` | Public | Active trait airdrop pools |
| GET | `/trait-history` | Public | Distribution history |
| POST | `/traits-pool` | Admin | Create airdrop pool |
| POST | `/calculate-rarity` | Admin | Trigger rarity calculation |
| POST | `/distribute` | Admin | Manual airdrop trigger |

### Metadata (`/api/v1/metadata`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/:tokenId` | Public | ERC-721 compliant metadata (for marketplaces) |

### Metrics (`/api/v1/metrics`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/platform` | Public | Platform stats (users, NFTs, tournaments) |
| POST | `/compute` | Public | Recompute + return metrics with tokenomics |

### Claim — Testnet Starter Pack (`/api/v1/claim`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/starter-pack` | Public (rate-limited) | Claim 2 NFTs + 8 weapons + 1,000 $BATTLE |
| GET | `/check/:address` | Public | Check if wallet has already claimed |

The claim endpoint has cross-origin headers (`Access-Control-Allow-Origin: *`) to support the Vercel-hosted faucet page at [chainbois-testnet-faucet.vercel.app](https://chainbois-testnet-faucet.vercel.app). Only one claim per wallet (enforced by unique index). Claims are serialized via an in-memory lock to prevent nonce collisions. Auto-mints new assets if platform stores are empty.

### System
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | Public | Health check |
| GET | `/settings` | Public | Public game settings |

---

## 11. Data Models

### Core Models (21 total)

| Model | Collection | Purpose |
|-------|-----------|---------|
| User | users | Player profiles, scores, balances, wallet addresses |
| Wallet | wallets | Platform wallet addresses + encrypted private keys |
| Settings | settings | Global game settings (singleton, level-up costs) |
| ChainboiNft | chainboinfs | NFT ownership, traits, levels (MongoDB mirror) |
| WeaponNft | weaponnfts | Weapon ownership + names |
| Transaction | transactions | All financial operations (purchases, prizes, airdrops, burns) |
| Tournament | tournaments | Tournament lifecycle (active/completed/upcoming) |
| WeeklyLeaderboard | weeklyleaderboards | Per-tournament score entries |
| LeaderboardHistory | leaderboardhistories | Archived tournament results |
| PurchaseAttempt | purchaseattempts | NFT/weapon purchase state machine |
| FailedPayout | failedpayouts | Failed prize distributions (for retry) |
| SecurityProfile | securityprofiles | Anti-cheat threat scores + ban status |
| ScoreChange | scorechanges | Score delta audit trail |
| GameSession | gamesessions | Game session tracking |
| NftRarity | nftrarities | Rarity scores, ranks, tiers per NFT |
| NftTrait | nfttraits | Denormalized traits per NFT (fast queries) |
| Trait | traits | Unique trait type+value combos (airdrop rotation) |
| TraitsPool | traitspools | Trait airdrop pool config + distribution history |
| BurnRecord | burnrecords | Tokenomics sweep events (burn + recycle) |
| PlatformMetrics | platformmetrics | Aggregated platform statistics |
| Claim | claims | Testnet starter pack claims (1 per wallet) |

### Key Relationships

```
User ──────── 1:N ──────── Transaction
User ──────── 1:1 ──────── SecurityProfile
User ──────── 1:N ──────── ScoreChange
Tournament ── 1:N ──────── WeeklyLeaderboard
Tournament ── 1:N ──────── LeaderboardHistory
ChainboiNft ─ 1:1 ──────── NftRarity
ChainboiNft ─ 1:1 ──────── NftTrait
TraitsPool ── contains ──── traitHistory[] (embedded)
```

---

## 12. External Services

| Service | Purpose | Config |
|---------|---------|--------|
| Avalanche Fuji RPC | Blockchain reads/writes | `AVAX_RPC_URL` env var |
| AvalancheJS Glacier API | NFT ownership queries | Public API (no key needed) |
| Firebase Admin SDK | Auth verification + RTDB | Service account JSON |
| MongoDB Atlas | Primary database | `MONGO_URI` env var |
| Redis | Rate limiting + caching | `REDIS_URL` env var |
| Pinata (IPFS) | NFT image + metadata hosting | `PINATA_JWT` env var |
| Cloudinary | Dynamic badge overlay images | `CLOUDINARY_*` env vars |
| Discord Webhooks | Notifications (tournaments, alerts, audits) | `DISCORD_WEBHOOK_URL` env var |

### Glacier API Usage

```javascript
// utils/avaxUtils.js — NFT ownership queries
// GET /v1/chains/{chainId}/addresses/{address}/balances
// Filters by contract address, returns token IDs + metadata
// Used by: login, verify-assets, inventory, armory
```

### Firebase RTDB Schema

```
chainbois/
├── users/
│   └── {uid}/
│       ├── hasNFT: boolean
│       ├── level: number (0-7)
│       ├── weapons: string[] (weapon names)
│       ├── characters: string[] (unlocked character names)
│       ├── score: number
│       └── gamesPlayed: number
└── scores/
    └── {uid}/
        ├── score: number
        └── gamesPlayed: number
```

---

## Implementation Phases (Completed)

| Phase | Name | Status | Key Features |
|-------|------|--------|-------------|
| 0 | Foundation | Done | Scaffolding, models, middleware, utils |
| 1 | Game Integration + Auth | Done | Firebase sync, auth, asset verification |
| 2 | Smart Contracts + NFTs | Done | Deploy contracts, pre-mint NFTs/weapons/tokens |
| 3 | Training Room | Done | NFT display, level-up, badges, metadata |
| 4 | Battleground + Leaderboard | Done | Tournaments, auto prizes, Discord notifications |
| 5 | Armory + Points | Done | Weapon/NFT purchase, dynamic points→$BATTLE |
| 6 | Inventory | Done | Asset display, transaction history |
| 7 | Tokenomics + Monitoring | Done | Auto-burn, wallet health, platform audit |

---

*Last updated: 2026-03-09*
