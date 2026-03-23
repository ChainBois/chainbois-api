# ChainBois

**ChainBois** is a play-to-earn third-person shooter (TPS) game built on Avalanche. Players own NFT soldiers, equip weapon NFTs, earn $BATTLE tokens through gameplay, train and level up their characters, and compete in tournaments for real prizes. The game features multiple game modes including Frontline, Team Deathmatch, Kill Confirmed, Capture the Flag, Search and Destroy, Gun Fight, and Battle Royale.

This repository contains the backend API that powers the entire platform — handling blockchain interactions, game state synchronization via Firebase, the in-game economy, automated tournaments, dynamic tokenomics, and more.

**Live API**: [https://test-2.ghettopigeon.com](https://test-2.ghettopigeon.com)
**Frontend**: [https://chainbois-true.vercel.app](https://chainbois-true.vercel.app)
**Testnet Faucet**: [https://chainbois-testnet-faucet.vercel.app](https://chainbois-testnet-faucet.vercel.app)

---

## For Judges & Testers: Getting Started

### Step 1: Install a Wallet

Install any of these browser wallet extensions:
- [MetaMask](https://metamask.io/) (most popular)
- [Core Wallet](https://core.app/) (Avalanche's native wallet)
- [Phantom](https://phantom.app/) (supports EVM chains)
- [Coinbase Wallet](https://www.coinbase.com/wallet) or [Trust Wallet](https://trustwallet.com/)

> **No manual network setup needed.** Both the faucet and the website will automatically prompt your wallet to add and switch to the Avalanche Fuji Testnet — just click Approve when prompted. If you have multiple wallets installed, you'll see a chooser to pick which one to use.

Get free testnet AVAX from the [Avalanche Faucet](https://core.app/tools/testnet-faucet/) (needed for level-ups).

### Step 2: Claim Your Free Starter Pack

Visit the **[Testnet Starter Pack](https://chainbois-testnet-faucet.vercel.app)** and click **Connect Wallet**. The faucet will automatically add the Fuji Testnet to your wallet if needed and switch to it. You'll receive:
- **2 ChainBoi NFTs** (ERC-721 soldier characters)
- **8 Weapon NFTs** (one from each category: Assault, SMG, LMG, Marksman, Handgun, Launcher, Shotgun, Melee)
- **1,000 $BATTLE tokens**

No gas needed — the platform pays all transfer fees. Max 1 claim per wallet.

### Step 3: Download the Game & Create an Account

Download the game first, create an account in-game, then connect your wallet:

**Download from the frontend:**
Visit [https://chainbois-true.vercel.app](https://chainbois-true.vercel.app) and navigate to the download section.

**Or download directly** (paste in browser, no `GET` prefix):
- **PC**: [https://test-2.ghettopigeon.com/api/v1/game/download/win](https://test-2.ghettopigeon.com/api/v1/game/download/win)
- **Mobile (APK)**: [https://test-2.ghettopigeon.com/api/v1/game/download/apk](https://test-2.ghettopigeon.com/api/v1/game/download/apk)

**Using Postman or curl:**
```bash
# PC build
curl -OJ https://test-2.ghettopigeon.com/api/v1/game/download/win

# Android APK
curl -OJ https://test-2.ghettopigeon.com/api/v1/game/download/apk
```

### Step 4: Sign Up & Connect Your Wallet

1. Open the game and create an account
2. **Mobile (APK)**: The game has a button that redirects you to the website to connect your wallet
3. **PC**: Navigate manually to [https://chainbois-true.vercel.app/access-request](https://chainbois-true.vercel.app/access-request) to connect your wallet
4. Connect the same wallet you used to claim the starter pack — the website will auto-switch to Fuji if needed
5. The backend verifies your on-chain NFTs and syncs your assets (characters, weapons, level) to the game via Firebase

### Step 5: Play & Earn

Launch the game — your NFT characters and weapons are automatically loaded. Play matches across multiple game modes to earn points. Your scores sync to the backend every 5 minutes.

### Available Game Modes
- **Frontline** — Large-scale team combat
- **Team Deathmatch** — Classic team vs team
- **Kill Confirmed** — Collect dog tags to score
- **Gun Fight** — Small team tactical
- **Battle Royale** — Last player standing (best with many players)
- **Capture the Flag** — Objective-based (in development)
- **Search and Destroy** — Plant/defuse objective (in development)

### Step 6: Explore Platform Features (API-Ready, Frontend In Progress)

The following features are **fully implemented in the backend API** with documentation and Postman collections. Frontend integration is in progress:

- **Training Room** — Level up your ChainBoi NFT (0→7) by paying AVAX. Each level unlocks 4 new characters and additional weapons. Level is stored on-chain in the smart contract.
- **Armory** — Purchase weapon NFTs with $BATTLE tokens. Purchase additional ChainBoi NFTs with AVAX. All transactions verified on-chain with purchase failsafe protection.
- **Tournaments** — 7 tournament tiers (one per player level). 5-day cycles with automatic prize distribution: AVAX to 1st/2nd, $BATTLE to 3rd.
- **Points Conversion** — Convert in-game points to $BATTLE tokens at a dynamic rate that adjusts based on the rewards pool health.
- **Inventory** — View all owned NFTs, weapons, $BATTLE balance, points balance, and full transaction history.
- **Leaderboard** — Global rankings with multiple time periods (30min, 1 hour, 24 hours, week, month, all-time).

> All endpoints are documented with Postman collections — see the [API Documentation](#api-documentation) section below.

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

### How It Works

1. **Player owns NFTs on-chain** — ChainBoi character NFTs and Weapon NFTs on Avalanche C-Chain
2. **Backend verifies ownership** — Checks the blockchain, syncs data to Firebase Realtime DB
3. **Game reads Firebase** — Unity game loads characters, weapons, and level from Firebase (no direct API calls from game)
4. **Player plays & earns** — Game writes scores to Firebase; backend polls every 5 minutes and syncs to MongoDB
5. **Economy runs automatically** — Tournaments auto-distribute prizes, tokenomics auto-burn $BATTLE, wallet health auto-funds low wallets
6. **NFT metadata is dynamic** — Level-ups, badges, and stats update in real-time via the metadata API endpoint (EIP-4906 compliant). Badge overlays are generated via Cloudinary, pinned to IPFS via `utils/pinataUtils.js`, then the Cloudinary cache is deleted — after level-up, `imageUri` points to the IPFS-pinned badge image (`ipfs://{cid}/chainboi-{tokenId}.png`)

### Design Principles

- **Backend-heavy blockchain**: All on-chain operations happen server-side. The frontend and game never directly sign contract calls — this simplifies UX and enables purchase failsafes.
- **Firebase as game bridge**: Unity game devs don't need to implement API calls. The backend handles all blockchain logic and syncs state via Firebase.
- **Pre-minted assets**: NFTs and tokens are pre-minted to platform wallets. Users buy/earn via transfers. If stores empty out, the system auto-mints more.
- **Dynamic tokenomics**: $BATTLE conversion rates, burn rates, and airdrop amounts auto-adjust based on the rewards wallet health tier — creating a self-regulating deflationary economy.
- **Anti-cheat**: Score plausibility checks, velocity limits, threat scoring, and ban system protect competitive integrity.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, CommonJS |
| Database | MongoDB Atlas (primary), Firebase RTDB (game bridge) |
| Blockchain | Avalanche C-Chain (Fuji Testnet), Solidity 0.8.24 |
| Smart Contracts | ERC-721 (ChainBoi NFTs, Weapon NFTs), ERC20Capped ($BATTLE, 10M fixed supply) |
| Contract Tooling | Hardhat 2.28.6, OpenZeppelin v5.6 |
| NFT Art | HashLips Art Engine (generative), Cloudinary (badge overlay generation), Pinata (IPFS hosting + badge image pinning) |
| Real-time | Socket.IO (tournament updates) |
| Process Manager | PM2 (cluster mode) |
| Security | Helmet, XSS protection, mongo-sanitize, rate limiting, AES-256 wallet encryption |

---

## Smart Contracts (Fuji Testnet)

| Contract | Purpose | Address | Explorer |
|----------|---------|---------|----------|
| **BattleToken** | ERC20Capped, 10M fixed supply, burn-capable | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | [Snowtrace](https://testnet.snowtrace.io/address/0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0) |
| **ChainBoisNFT** | ERC-721, on-chain levels (0-7), EIP-4906 metadata | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | [Snowtrace](https://testnet.snowtrace.io/address/0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b) |
| **WeaponNFT** | ERC-721, on-chain weapon names, 8 categories | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` | [Snowtrace](https://testnet.snowtrace.io/address/0xa2AFf3105668124A187b1212Ab850bf8b98dD07d) |

Source code: [`contracts/`](contracts/) | ABIs: [`abis/`](abis/)

---

## API Endpoints (50+)

| Group | Base Path | Key Endpoints |
|-------|-----------|---------------|
| Auth | `/api/v1/auth` | create-user, check-user, simulate, login, logout, me |
| Game | `/api/v1/game` | download, verify-assets, set-avatar, info |
| Training | `/api/v1/training` | list NFTs, NFT details, level-up, costs, eligibility |
| Tournaments | `/api/v1/tournaments` | list tiers, leaderboard, countdown, winners, history |
| Armory | `/api/v1/armory` | weapons, NFTs, purchase weapon, purchase NFT, balance |
| Points | `/api/v1/points` | balance + rate, convert to $BATTLE, history |
| Inventory | `/api/v1/inventory` | all assets, NFTs, weapons, tx history |
| Leaderboard | `/api/v1/leaderboard` | global (30min to all-time), user rank |
| Metadata | `/api/v1/metadata` | ChainBoi metadata (`:tokenId`), weapon metadata (`/weapon/:tokenId`) |
| Airdrop | `/api/v1/airdrop` | rarity, trait pools, distribution |
| Claim | `/api/v1/claim` | starter-pack, check claim status |
| Metrics | `/api/v1/metrics` | platform stats, compute |
| Health | `/api/v1` | health check, public settings |

### Response Format

All endpoints return a consistent response pattern:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "Error description" }
```

> The metadata endpoints (`/api/v1/metadata/:tokenId` and `/api/v1/metadata/weapon/:tokenId`) return raw ERC-721 JSON (no wrapper) as required by the standard.

---

## API Documentation

### Per-Phase Reference

| Phase | Name | API Docs | Architecture | Flow | Postman |
|-------|------|----------|--------------|------|---------|
| 1 | Auth & Game Integration | [API](docs/phase1/FRONTEND_API.md) | [Arch](docs/phase1/ARCHITECTURE.md) | [Flow](docs/phase1/FLOW.md) | [Collection](docs/phase1/POSTMAN_COLLECTION.json) |
| 3 | Training Room & NFT Progression | [API](docs/phase3/FRONTEND_API.md) | [Arch](docs/phase3/ARCHITECTURE.md) | [Flow](docs/phase3/FLOW.md) | [Collection](docs/phase3/POSTMAN_COLLECTION.json) |
| 4 | Battleground & Leaderboard | [API](docs/phase4/FRONTEND_API.md) | [Arch](docs/phase4/ARCHITECTURE.md) | [Flow](docs/phase4/FLOW.md) | [Collection](docs/phase4/POSTMAN_COLLECTION.json) |
| 5 | Armory & Points Economy | [API](docs/phase5/FRONTEND_API.md) | [Arch](docs/phase5/ARCHITECTURE.md) | [Flow](docs/phase5/FLOW.md) | [Collection](docs/phase5/POSTMAN_COLLECTION.json) |
| 6 | Inventory & Transaction History | [API](docs/phase6/FRONTEND_API.md) | [Arch](docs/phase6/ARCHITECTURE.md) | [Flow](docs/phase6/FLOW.md) | [Collection](docs/phase6/POSTMAN_COLLECTION.json) |

### Additional Documentation

| Document | Description |
|----------|-------------|
| [System Architecture](docs/SYSTEM_ARCHITECTURE.md) | Complete architecture reference — infrastructure, wallets, data flows, security |
| [NFT & Token System](docs/NFT_AND_TOKEN_SYSTEM.md) | NFT mechanics, character unlocks, token flows, metadata system |
| [Tokenomics Architecture](docs/TOKENOMICS_ARCHITECTURE.md) | Dynamic burn/recycle system, health tiers, sweep mechanics |
| [Product Requirements](docs/PRD.md) | Full PRD with requirements, flows, and data models |
| [Wallet Connect & Chain Switching](docs/WALLET_CONNECT_FLOW.md) | Full flow: auto network add/switch for faucet and frontend |
| [Chain Switching Guide](docs/CHAIN_SWITCHING_GUIDE.md) | Technical implementation guide for EIP-3085/3326 integration |
| [Post-Hackathon Roadmap](docs/POST_HACKATHON_ROADMAP.md) | Mainnet launch, armor, battle pass, marketplace, cross-chain |
| [Setup Guide](docs/SETUP_GUIDE.md) | Development environment setup |

---

## Automated Systems (10 Cron Jobs)

| Job | Schedule | Purpose |
|-----|----------|---------|
| syncScoresJob | Every 5 min | Sync game scores from Firebase → MongoDB, run anti-cheat |
| syncNewUsersJob | Daily midnight | Count game-only players (Firebase users not in MongoDB) for web2/web3 metrics |
| tournamentJob | Hourly | Tournament lifecycle: create, end, auto-distribute prizes |
| purchaseFailsafeJob | Every 5 min | Recover stuck NFT/weapon purchases, auto-refund |
| failedPayoutJob | Every 6 hours | Retry failed tournament prize payouts |
| traitAirdropJob | Wed 8 PM UTC | Weekly trait-based $BATTLE airdrop to NFT holders |
| tokenomicsJob | Every 6 hours | Sweep weapon_store $BATTLE → burn + recycle to rewards |
| walletHealthJob | Hourly | Monitor wallet balances + auto-fund low wallets from deployer |
| platformAuditJob | Daily 3 AM UTC | Solvency check, ownership sync, stuck purchase detection |
| inventoryReplenishJob | Every 30 min | Auto-mint NFTs and weapons when store inventory runs low |

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

See [Tokenomics Architecture](docs/TOKENOMICS_ARCHITECTURE.md) for full details.

---

## NFT System

### ChainBoi NFTs (ERC-721)
- **Supply**: 4,032 total (4,000 public + 32 reserved), 50 on testnet
- **Art**: Generative art via HashLips Art Engine, hosted on IPFS (Pinata)
- **On-chain level**: Stored in smart contract (`mapping(uint256 => uint8) nftLevel`), 0-7
- **Character unlocks**: Each level unlocks 4 characters (32 total at max level)
- **Army ranks**: Private → Corporal → Sergeant → Captain → Major → Colonel → Major General → Field Marshal
- **Dynamic metadata**: Served via API with real-time level, stats, and IPFS-pinned badge images (generated via Cloudinary, pinned to IPFS). Traits always include current Level, Rank, Kills, Score, Games Played via `buildCurrentTraits()`
- **EIP-4906**: `MetadataUpdate` events emitted on level-up, triggering indexer refreshes

### Weapon NFTs (ERC-721)
- **8 categories**: Assault, SMG, LMG, Marksman, Handgun, Launcher, Shotgun, Melee
- **Purchased with**: $BATTLE tokens
- **Base weapons** (free in-game): M4, RENETTI, GUTTER KNIFE, RPG

### Platform Wallets (5)
All wallet keys encrypted with AES-256-CBC:
- **deployer** — Deploys contracts, mints new assets, funds other wallets
- **nft_store** — Holds ChainBoi NFTs for sale
- **weapon_store** — Holds Weapon NFTs for sale
- **rewards** — Holds $BATTLE for prizes, conversions, airdrops
- **prize_pool** — Holds AVAX for tournament prizes

---

## Security

- **Wallet encryption**: All platform wallet keys encrypted with AES-256-CBC
- **Purchase failsafe**: Atomic DB claims prevent double-sells; stuck purchases auto-recover with retry or refund
- **Anti-cheat**: Score plausibility checks, velocity limits, daily earning caps, threat scoring, temporary/permanent bans
- **Rate limiting**: Per-endpoint rate limits (auth, purchases, claims)
- **Input validation**: Helmet, XSS protection, mongo-sanitize, parameter pollution prevention
- **Transaction verification**: All purchases verified on-chain (sender, receiver, amount, staleness check)
- **Auto-fund**: Deployer wallet automatically tops up low-gas wallets; sends Discord alerts when its own balance is low

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
npm test                  # Run all tests (258 tests)
npm test -- --verbose     # Verbose output
npm test -- <testfile>    # Run specific test
```

---

## Post-Hackathon Roadmap

- **Mainnet Launch** — Deploy to Avalanche mainnet, mint full 4,032 NFT collection
- **Armor & Loot Boxes** — Additional equipment layer with random drops
- **$BATTLE Cashout** — Convert $BATTLE back to AVAX via DEX integration
- **Battle Pass** — Free and premium seasonal content with tiered rewards
- **Mythic Upgrades** — Rare NFT evolution system
- **Secondary Marketplace** — In-house trading for NFTs and weapons
- **Cross-Chain** — Bridge to other EVM chains

See [Post-Hackathon Roadmap](docs/POST_HACKATHON_ROADMAP.md) for the full plan.

---

Built for the **Avalanche Build Games Hackathon 2026**
