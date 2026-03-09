# ChainBois API

Backend API for the ChainBois Web3 gaming platform on Avalanche.

## Overview

ChainBois is a military-themed gaming platform where players own NFT characters, earn $BATTLE tokens through gameplay, and compete in tournaments for prizes. The API handles all blockchain interactions, game state synchronization, and platform operations.

**Chain**: Avalanche C-Chain (Fuji Testnet)
**Stack**: Node.js, Express, MongoDB Atlas, Firebase, Redis, Socket.IO

## Key Features

- **NFT Character System** — 50 ChainBoi NFTs with on-chain levels (0-7), unlocking 4 characters per level
- **Weapon NFTs** — 13 premium weapons purchasable with $BATTLE tokens
- **$BATTLE Token** — Fixed 10M supply (ERC20Capped), truly deflationary with auto-burn
- **Dynamic Tokenomics** — Conversion rates, airdrop amounts, and burn rates auto-adjust based on rewards wallet health
- **Tournament System** — Automated 5-day tournaments with auto-prize distribution (AVAX + $BATTLE)
- **Firebase Game Bridge** — Unity game reads/writes Firebase RTDB; backend syncs via cron jobs
- **Trait-Based Airdrops** — Weekly $BATTLE distribution to NFT holders based on random trait selection
- **Wallet Monitoring** — Hourly gas/balance/inventory checks with Discord alerts
- **Anti-Cheat** — Score plausibility checks, velocity limits, threat scoring

## Testnet Starter Pack (Claim Page)

**Live**: [https://chainbois-testnet-faucet.vercel.app](https://chainbois-testnet-faucet.vercel.app)

A standalone claim page for judges, testers, and users to receive free testnet assets:
- **2 ChainBoi NFTs** (ERC-721 characters with on-chain levels)
- **8 Weapon NFTs** (one from each category)
- **1,000 $BATTLE tokens**

The page is in `testnet-faucet/` and is deployed to Vercel separately. Max 1 claim per wallet. Auto-mints new assets if platform stores run low.

**Claim API**: `POST /api/v1/claim/starter-pack` | **Check**: `GET /api/v1/claim/check/:address`

> **Setup**: Update `API_BASE` in `testnet-faucet/index.html` to point to your API domain. Add the Vercel domain to `CORS_ORIGINS` or rely on the built-in cross-origin headers on the `/claim` route.

## Architecture

```
Unity Game ↔ Firebase RTDB ↔ Backend API ↔ Avalanche C-Chain
                                  ↕
                            MongoDB Atlas
```

See [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) for complete architecture documentation.

## Smart Contracts (Fuji Testnet)

| Contract | Address |
|----------|---------|
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` |
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` |
| WeaponNFT | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` |

## Getting Started

```bash
npm install
cp .env.example .env  # Configure environment variables
npm run dev            # Development mode
npm start              # Production (PM2)
```

### Required Environment Variables

- `MONGO_URI` — MongoDB Atlas connection string
- `REDIS_URL` — Redis connection URL
- `AVAX_RPC_URL` — Avalanche RPC endpoint
- `FIREBASE_*` — Firebase service account credentials
- `WALLET_ENCRYPTION_KEY` — AES key for wallet encryption
- `PINATA_JWT` — Pinata IPFS API token
- `DISCORD_WEBHOOK_URL` — Discord notifications

## API Documentation

Per-phase frontend API docs are in `docs/phaseN/FRONTEND_API.md`:

- [Phase 1 — Auth + Game Integration](docs/phase1/FRONTEND_API.md)
- [Phase 3 — Training Room](docs/phase3/FRONTEND_API.md)
- [Phase 4 — Battleground + Leaderboard](docs/phase4/FRONTEND_API.md)
- [Phase 5 — Armory + Points](docs/phase5/FRONTEND_API.md)
- [Phase 6 — Inventory](docs/phase6/FRONTEND_API.md)

Additional docs:
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [NFT & Token System](docs/NFT_AND_TOKEN_SYSTEM.md)
- [Tokenomics Architecture](docs/TOKENOMICS_ARCHITECTURE.md)
- [Post-Hackathon Roadmap](docs/POST_HACKATHON_ROADMAP.md)
- [Setup Guide](docs/SETUP_GUIDE.md)

## Cron Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| syncScoresJob | Every 5 min | Firebase → MongoDB score sync |
| syncNewUsersJob | Daily midnight | Detect Web2 players |
| tournamentJob | Every hour | Tournament lifecycle + auto-prizes |
| purchaseFailsafeJob | Every 5 min | Recover stuck purchases |
| failedPayoutJob | Every 6 hours | Retry failed payouts |
| traitAirdropJob | Wed 8 PM UTC | Weekly trait-based $BATTLE airdrop |
| tokenomicsJob | Every 6 hours | Sweep weapon_store → burn + recycle |
| walletHealthJob | Every hour | Gas, balance, inventory monitoring |
| platformAuditJob | Daily 3 AM UTC | Solvency + ownership audit |

## Testing

```bash
npm test                  # Run all tests
npm test -- --verbose     # Verbose output
npm test -- <testfile>    # Run specific test
```

## License

Private — Avalanche Build Games Hackathon 2026
