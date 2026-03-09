# ChainBois

A military-themed Web3 gaming platform on Avalanche where players own NFT characters, earn $BATTLE tokens through gameplay, train their soldiers, buy weapons, and compete in tournaments for real prizes.

**Live API**: [https://test-2.ghettopigeon.com](https://test-2.ghettopigeon.com)
**Frontend**: [https://chainbois-true.vercel.app](https://chainbois-true.vercel.app)
**Testnet Faucet**: [https://chainbois-testnet-faucet.vercel.app](https://chainbois-testnet-faucet.vercel.app)

---

## For Judges & Testers: Quick Start

### Step 1: Get Testnet Assets

Visit the **[Testnet Starter Pack](https://chainbois-testnet-faucet.vercel.app)** page and paste your Fuji Testnet wallet address. You'll receive:
- **2 ChainBoi NFTs** (ERC-721 characters)
- **8 Weapon NFTs** (one from each category: Assault, SMG, LMG, Marksman, Handgun, Launcher, Shotgun, Melee)
- **1,000 $BATTLE tokens**

> You need a wallet on Avalanche Fuji Testnet (Chain ID 43113). Use [Core Wallet](https://core.app) or MetaMask with the Fuji network added.

### Step 2: Sign Up & Connect Wallet

1. Go to the [ChainBois Frontend](https://chainbois-true.vercel.app)
2. Create an account or sign in
3. Connect your wallet (the same one you used to claim the starter pack)
4. The platform verifies your on-chain NFTs and syncs your game profile

### Step 3: Download & Play the Game

Download the game from the frontend or directly:
- **PC**: `GET https://test-2.ghettopigeon.com/api/v1/game/download/win`
- **Mobile (APK)**: `GET https://test-2.ghettopigeon.com/api/v1/game/download/apk`

The game communicates with the backend via Firebase. Your NFT ownership, level, and weapons are automatically synced to the game.

> **PC Users**: Navigate to [https://chainbois-true.vercel.app/access-request](https://chainbois-true.vercel.app/access-request) manually to connect your wallet (the in-game redirect button is currently available in the APK build only).

### Step 4: Level Up & Train

- Visit the **Training Room** on the frontend
- Pay AVAX to level up your ChainBoi NFT (Level 0 → 7)
- Each level unlocks new characters and weapons in-game
- Level metadata updates on-chain and reflects in the NFT

### Step 5: Buy Weapons & NFTs

- Visit the **Armory** on the frontend
- Purchase weapons with $BATTLE tokens
- Purchase additional ChainBoi NFTs with AVAX
- All purchases are verified on-chain with purchase failsafe protection

### Step 6: Compete in Tournaments

- 7 tournament tiers (one per level)
- 5-day tournaments with automatic prize distribution
- Prizes: AVAX (1st & 2nd place) + $BATTLE (3rd place)
- Leaderboards with multiple time periods

### Step 7: View Your Inventory

- See all owned NFTs, weapons, balances, and transaction history on the frontend

---

## Architecture

```
+------------------+     +------------------+     +-------------------+     +------------------+
|   Unity Game     |     |    Frontend      |     |    Backend API    |     |   Avalanche      |
|   (PC / APK)     |<--->|    (Next.js)     |---->|    (Express)      |---->|   C-Chain        |
+--------+---------+     +------------------+     +--------+----------+     |   (Fuji)         |
         |                                                 |                +------------------+
         v                                                 v
+------------------+                            +-------------------+
|   Firebase       |<-------------------------->|   MongoDB Atlas   |
|   Realtime DB    |        (cron sync)         |   (primary store) |
+------------------+                            +-------------------+
```

### Design Principles

- **Backend-heavy blockchain**: All on-chain operations happen server-side. The frontend never signs contract calls directly.
- **Firebase as game bridge**: The Unity game reads/writes Firebase Realtime DB. The backend syncs Firebase and MongoDB via cron jobs. Game developers don't need to change anything.
- **Pre-minted assets**: NFTs and tokens are pre-minted to platform wallets. Users buy/earn via transfers, not mints. If stores run empty, the system auto-mints more.
- **Dynamic tokenomics**: $BATTLE conversion rates, burn rates, and airdrop amounts auto-adjust based on the rewards wallet health tier.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, CommonJS |
| Database | MongoDB Atlas (primary), Firebase RTDB (game bridge) |
| Blockchain | Avalanche C-Chain (Fuji Testnet), Solidity 0.8.24 |
| Smart Contracts | ERC-721 (NFTs), ERC20Capped ($BATTLE, 10M fixed supply) |
| Contract Tooling | Hardhat 2.28.6, OpenZeppelin v5.6 |
| Image/Metadata | Cloudinary (dynamic badge overlays), Pinata (IPFS) |
| Real-time | Socket.IO (tournament updates) |
| Process Manager | PM2 (cluster mode) |
| Security | Helmet, XSS protection, mongo-sanitize, rate limiting, AES-256 wallet encryption |

---

## Smart Contracts (Fuji Testnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| BattleToken (ERC20Capped) | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | [View on Snowtrace](https://testnet.snowtrace.io/address/0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0) |
| ChainBoisNFT (ERC-721) | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | [View on Snowtrace](https://testnet.snowtrace.io/address/0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b) |
| WeaponNFT (ERC-721) | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` | [View on Snowtrace](https://testnet.snowtrace.io/address/0xa2AFf3105668124A187b1212Ab850bf8b98dD07d) |

All contracts are deployed on **Avalanche Fuji Testnet** (Chain ID 43113). Source code is in the `contracts/` directory.

---

## API Endpoints (50+)

| Group | Base Path | Key Endpoints |
|-------|-----------|---------------|
| Auth | `/api/v1/auth` | create-user, check-user, login, logout, me |
| Game | `/api/v1/game` | download, verify-assets, set-avatar, info |
| Training | `/api/v1/training` | list NFTs, NFT details, level-up, costs, eligibility |
| Tournaments | `/api/v1/tournaments` | list tiers, leaderboard, countdown, winners, history |
| Armory | `/api/v1/armory` | weapons, NFTs, purchase weapon, purchase NFT, balance |
| Points | `/api/v1/points` | balance + rate, convert to $BATTLE, history |
| Inventory | `/api/v1/inventory` | all assets, NFTs, weapons, tx history |
| Leaderboard | `/api/v1/leaderboard` | global (30min to all-time), user rank |
| Metadata | `/api/v1/metadata` | dynamic ERC-721 metadata (serves OpenSea/Glacier) |
| Airdrop | `/api/v1/airdrop` | rarity, trait pools, distribution |
| Claim | `/api/v1/claim` | starter-pack, check claim status |
| Metrics | `/api/v1/metrics` | platform stats, compute |
| Health | `/api/v1` | health check, public settings |

Full API reference: see `docs/phase*/FRONTEND_API.md` and `docs/phase*/POSTMAN_COLLECTION.json` (importable).

---

## Automated Systems (9 Cron Jobs)

| Job | Schedule | Purpose |
|-----|----------|---------|
| syncScoresJob | Every 5 min | Sync game scores from Firebase → MongoDB |
| syncNewUsersJob | Daily midnight | Detect Web2 players for metrics |
| tournamentJob | Hourly | Tournament lifecycle: create, end, distribute prizes |
| purchaseFailsafeJob | Every 5 min | Recover stuck NFT/weapon purchases, auto-refund |
| failedPayoutJob | Every 6 hours | Retry failed tournament prize payouts |
| traitAirdropJob | Wed 8 PM UTC | Weekly trait-based $BATTLE airdrop to NFT holders |
| tokenomicsJob | Every 6 hours | Sweep weapon_store $BATTLE → burn + recycle to rewards |
| walletHealthJob | Hourly | Monitor wallet balances + auto-fund low wallets from deployer |
| platformAuditJob | Daily 3 AM UTC | Solvency check, ownership sync, stuck purchase detection |

---

## Tokenomics

$BATTLE is an **ERC20Capped** token with a **fixed 10M supply** — no new tokens can ever be minted. The system is truly deflationary:

1. **Earn**: Players earn points in-game → convert to $BATTLE at a dynamic rate
2. **Spend**: Players spend $BATTLE on weapons in the Armory
3. **Burn**: Weapon purchase revenue is periodically swept — a portion is **burned permanently** and the rest recycled to the rewards pool
4. **Adjust**: Conversion rates auto-adjust based on rewards pool health:

| Health Tier | Rewards Pool % | Conversion Multiplier | Burn Rate |
|-------------|---------------|----------------------|-----------|
| ABUNDANT | 75%+ | 1.0x | 50% |
| HEALTHY | 50-75% | 0.75x | 40% |
| MODERATE | 30-50% | 0.5x | 30% |
| SCARCE | 15-30% | 0.3x | 20% |
| CRITICAL | <15% | 0.15x | 10% |

---

## Security

- **Wallet encryption**: All platform wallet keys encrypted with AES-256-CBC
- **Purchase failsafe**: Atomic DB claims prevent double-sells; stuck purchases auto-recover
- **Anti-cheat**: Score plausibility checks, velocity limits, threat scoring, temporary/permanent bans
- **Rate limiting**: Per-endpoint rate limits (auth, purchases, claims)
- **Input validation**: Helmet, XSS protection, mongo-sanitize, parameter pollution prevention
- **Transaction verification**: All purchases verified on-chain (sender, receiver, amount, staleness)

---

## Documentation

| Document | Description |
|----------|-------------|
| [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | Complete architecture reference (32KB) |
| [NFT & Token System](docs/NFT_AND_TOKEN_SYSTEM.md) | NFT mechanics, token flows, metadata |
| [Tokenomics Architecture](docs/TOKENOMICS_ARCHITECTURE.md) | Dynamic burn/recycle system |
| [Post-Hackathon Roadmap](docs/POST_HACKATHON_ROADMAP.md) | Future plans: mainnet, armor, battle pass |
| [Setup Guide](docs/SETUP_GUIDE.md) | Development environment setup |
| Phase API Docs | `docs/phase*/FRONTEND_API.md` — endpoint reference per phase |
| Postman Collections | `docs/phase*/POSTMAN_COLLECTION.json` — importable collections |

---

## Getting Started (Development)

```bash
npm install
cp .env.example .env  # Configure environment variables
npm run dev            # Development mode
npm start              # Production (PM2 cluster)
```

## Testing

```bash
npm test                  # Run all tests (286 tests)
npm test -- --verbose     # Verbose output
npm test -- <testfile>    # Run specific test
```

---

## License

Built for the Avalanche Build Games Hackathon 2026
