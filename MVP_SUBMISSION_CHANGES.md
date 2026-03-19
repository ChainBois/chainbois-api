# MVP Submission Form — Full Updated Answers

Complete answers for all questions that have been updated since the original submission. Copy-paste these directly into the submission form.

---

## Question 2: Technical Documentation

**Full answer:**

Tech Stack:

Frontend (Next.js 14):
- Next.js 14 with App Router and React Server Components
- Thirdweb SDK for wallet connection (MetaMask, WalletConnect, Coinbase Wallet, In-App Wallet)
- Firebase Auth for social/phone login, next-auth for session management
- CSS Modules + Emotion for styling
- Axios for API communication
- Pages: Landing, Battleground, Armory, Training Room, Marketplace, Inventory, Request Access

Backend (Node.js/Express):
- Express.js REST API with 50+ endpoints across 13 route groups
- MongoDB Atlas for persistent storage (users, NFTs, scores, transactions, burn records, platform metrics)
- Firebase Realtime Database for game-to-backend communication bridge
- Socket.IO for real-time tournament and leaderboard updates
- 10 automated cron jobs (score sync, tournament lifecycle, tokenomics sweep, wallet health, platform audit, user metrics, purchase failsafe, failed payout retry, trait airdrop, inventory replenishment)
- 5 AES-256 encrypted platform wallets (deployer, nft_store, weapon_store, prize_pool, rewards)
- PM2 cluster mode for production process management
- Cloudinary for dynamic NFT badge overlays via URL transformations
- Pinata SDK for IPFS metadata hosting
- `utils/pinataUtils.js` — dedicated utility for pinning images and JSON to IPFS via Pinata
- `buildCurrentTraits()` system — NFT traits always include current Level, Rank, Kills, Score, and Games Played with live values
- Badge overlay flow: Cloudinary generates badge image -> pinned to IPFS via Pinata -> Cloudinary copy deleted -> imageUri in API responses points to permanent IPFS badge image
- Enriched NFT/weapon responses: every endpoint returns full token data (contractAddress, imageUri, metadataUri, traits, inGameStats)
- Weapon metadata endpoint: `GET /metadata/weapon/:tokenId.json`
- Simulate login endpoint for Postman/curl testing without the frontend
- Auto-replenishment job mints new NFTs and weapons when store inventory runs low
- 258 automated tests across the full API suite
- Nginx reverse proxy with SSL

Smart Contracts (Avalanche C-Chain -- Fuji Testnet):
- Solidity 0.8.24 compiled with Hardhat 2.28.6 (evmVersion: cancun)
- BattleToken (ERC20Capped) -- 10,000,000 fixed supply, burn-capable
- ChainBoisNFT (ERC-721) -- 4,032 total supply (4,000 public + 32 reserved), on-chain level storage, EIP-4906
- WeaponNFT (ERC-721) -- 30 weapons across 8 categories, on-chain weapon names
- OpenZeppelin v5.6 contracts (ERC20Capped, ERC721Enumerable, Ownable, ReentrancyGuard)

Game (Unity):
- Unity engine targeting PC and Android APK
- Communicates exclusively through Firebase Realtime Database (zero direct API calls)
- Backend writes player state (hasNFT, level, weapons) -> game reads
- Game writes scores and match results -> backend polls and syncs
- 7 game modes: Frontline, Team Deathmatch, Kill Confirmed, Gun Fight, Battle Royale, Capture the Flag, Search and Destroy

Architecture Decisions:

1. Backend-heavy blockchain logic. All Avalanche interactions (minting, transfers, metadata updates, token burns) happen server-side through encrypted platform wallets. The frontend never touches private keys -- it connects a wallet via Thirdweb for identity, and the backend executes all on-chain operations. This keeps the game client and frontend thin, simplifies security, and means game developers don't need any blockchain knowledge.

2. Firebase RTDB as the game bridge. The Unity game reads and writes exclusively to Firebase Realtime Database. The backend polls Firebase on a 5-minute cron cycle to sync scores into MongoDB and writes player state (NFT ownership, level, unlocked weapons) back to Firebase for the game to read. This decouples the game entirely from the API -- game developers made zero backend changes during integration.

3. Pre-minted NFTs with platform custody. All ChainBoi NFTs are pre-minted to platform wallets rather than minted on-demand. Purchases trigger a transfer from the platform wallet to the buyer. This eliminates mint-time gas surprises, lets us control metadata and art upfront, and makes the "buy" flow a simple transfer with purchase failsafe recovery built in. An auto-replenishment job monitors inventory levels and mints new assets when stores run low.

4. Dynamic tokenomics with auto-burn. $BATTLE has a fixed 10M supply with no further minting possible (ERC20Capped). A 6-hourly cron job sweeps the weapon_store wallet -- burning a percentage of accumulated $BATTLE and recycling the rest to the rewards wallet. Health tiers (ABUNDANT -> CRITICAL) dynamically adjust points-to-token conversion rates and prize payouts based on rewards wallet balance, creating a self-regulating economy.

5. SDKs and APIs over custom smart contracts wherever possible. We used Thirdweb for wallet connection, Pinata for IPFS, Cloudinary for dynamic image composition (badge overlays via URL transforms), and Firebase for real-time sync -- reserving custom Solidity only for the three contracts that genuinely needed on-chain logic (token cap, NFT levels, weapon types).

Full architecture docs: https://github.com/ChainBois/chainbois-api/blob/main/docs/SYSTEM_ARCHITECTURE.md

---

## Question 3: Architecture Design Overview

**Full answer:**

Main Components

Frontend (Next.js 14):
- Landing Page (/): Project introduction, game trailer, connect wallet CTA, platform statistics, leaderboard preview
- Battleground (/battleground): Active tournaments, live leaderboard (real-time via Socket.IO), match history
- Armory (/armory): Browse and purchase ChainBoi NFTs (with AVAX) and weapon NFTs (with $BATTLE), loot boxes
- Training Room (/training-room): View owned ChainBois, level-up by paying AVAX, see rank progression (Private -> Field Marshal), badge overlays
- Inventory (/inventory): All owned assets (ChainBois, weapons, $BATTLE balance), transaction history
- Marketplace (/marketplace): Primary purchases + links to secondary markets (Joepegs)
- Request Access (/request-access): Wallet connection and onboarding flow
- Wallet Connection: Thirdweb SDK supports MetaMask, WalletConnect, Coinbase Wallet, and In-App Wallet -- wallet address becomes the user's identity across the platform
- Auth: Firebase Auth handles social/phone login, next-auth manages sessions; wallet address is the primary identifier for all API calls

Game (Unity -- PC + Android APK):
- 7 game modes: Frontline, Team Deathmatch, Kill Confirmed, Gun Fight, Battle Royale, Capture the Flag, Search and Destroy
- Players launch the game, create account, then redirect to website for wallet connection (APK has in-game button, PC users navigate manually)
- Game reads player state from Firebase RTDB: hasNFT, level, weapons[]
- Unlocks characters and weapons based on on-chain ownership (verified by backend, written to Firebase)
- Game writes scores and match results directly to Firebase RTDB
- Zero direct communication with the backend API or blockchain -- Firebase is the sole interface
- Game developers required zero backend or blockchain changes for integration

Backend API (Express.js -- 50+ Endpoints, 10 Cron Jobs):

Controller Modules:
- Auth Controller: Login/logout by wallet address, user creation, Firebase UID linking, simulate login for Postman testing
- Game Controller: Game download (PC/APK), asset verification, avatar selection
- Training Controller: Level-up (pay AVAX -> increment on-chain level), rank calculation, badge overlay generation via Cloudinary URL transforms, IPFS badge pinning
- Battleground Controller: Tournament creation/lifecycle, score submission with anti-cheat (plausibility checks, velocity limits, threat scoring, bans), prize pool calculation, auto-distribution
- Armory Controller: ChainBoi NFT purchase (AVAX), weapon NFT purchase ($BATTLE), on-chain transfer from platform wallets with purchase failsafe
- Points Controller: Points-to-$BATTLE conversion at dynamic rates, health tier lookup, conversion history
- Inventory Controller: Owned assets aggregation (on-chain + MongoDB), transaction history, balance queries
- Leaderboard Controller: Rankings across multiple time periods (30min, 1hr, 24hr, week, month, all-time)
- Metadata Controller: Dynamic ERC-721 metadata serving for ChainBois and Weapons
- Airdrop Controller: Trait-based rarity distribution, airdrop pools, weekly distribution
- Claims Controller: Testnet starter pack claim (2 NFTs + 8 weapons + 1000 $BATTLE)
- Metrics Controller: Platform-wide analytics (total users, web2 vs web3, transaction volumes)

Cron Jobs (10 total):
1. syncScoresJob (5 min): Polls Firebase RTDB for new scores -> validates with anti-cheat -> syncs to MongoDB
2. syncNewUsersJob (daily midnight): Counts game-only Firebase UIDs not in MongoDB -> updates web2/web3 platform metrics
3. tournamentJob (hourly): Tournament lifecycle -- start, end, auto-distribute prizes, Discord notifications
4. purchaseFailsafeJob (5 min): Recover stuck NFT/weapon purchases, auto-retry or refund
5. failedPayoutJob (6 hours): Retry failed tournament prize payouts
6. traitAirdropJob (Wed 8 PM UTC): Weekly trait-based $BATTLE airdrop to NFT holders
7. tokenomicsJob (6 hours): Sweep weapon_store $BATTLE -> burn X% + recycle Y% to rewards wallet
8. walletHealthJob (hourly): Monitor wallet balances + auto-fund low wallets from deployer
9. platformAuditJob (daily 3 AM UTC): Solvency check, ownership sync, stuck purchase detection
10. inventoryReplenishJob (30 min): Auto-mint NFTs and weapons when store inventory runs low

Platform Wallets (5, AES-256 encrypted):
- deployer -- Deploys contracts, mints new assets, funds other wallets
- nft_store -- Holds ChainBoi NFTs for sale
- weapon_store -- Holds Weapon NFTs; receives $BATTLE from weapon purchases (swept by tokenomics job)
- rewards -- Holds $BATTLE for prizes, points conversions, airdrops (~9,999,000 BATTLE at launch)
- prize_pool -- Holds AVAX for tournament prizes

Smart Contracts (Avalanche C-Chain -- Fuji Testnet):
- BattleToken (ERC20Capped): 10,000,000 fixed supply, no further minting possible. Used for prizes, weapon purchases, points conversions, and airdrops. Auto-burn mechanism reduces circulating supply over time.
- ChainBoisNFT (ERC-721): 4,032 total (4,000 public + 32 reserved, 50 on testnet). On-chain level storage (0-7), EIP-4906 metadata update events, dynamic metadata via API with IPFS-pinned badge overlays.
- WeaponNFT (ERC-721): 30 weapons across 8 categories. On-chain weapon names. Base weapons: M4, RENETTI, GUTTER KNIFE, RPG.
- All contracts use OpenZeppelin v5.6, compiled with Solidity 0.8.24 and Hardhat 2.28.6.

Infrastructure:
- MongoDB Atlas for persistent data (users, scores, transactions, burn records, metrics, settings)
- Firebase Realtime Database as the game<->backend bridge
- Cloudinary for dynamic NFT image composition (badge overlays applied via URL transformations)
- Pinata IPFS for decentralized NFT metadata storage
- PM2 in cluster mode for process management and zero-downtime restarts
- Nginx as reverse proxy with SSL termination
- Discord webhooks for tournament notifications and prize announcements

Data Flow:

1. Player onboarding: User connects wallet on frontend (Thirdweb) -> frontend calls /login with wallet address -> backend creates user in MongoDB, links Firebase UID -> backend checks on-chain NFT ownership -> writes { hasNFT, level, weapons } to Firebase RTDB -> game reads Firebase and unlocks content.

2. Gameplay loop: Player plays in Unity -> game writes score to Firebase RTDB -> score sync cron (5 min) reads Firebase, runs anti-cheat validation (plausibility, velocity, threat scoring) -> writes valid scores to MongoDB -> leaderboard updates -> Socket.IO pushes updates to connected frontends.

3. NFT purchase (Armory): User selects NFT on frontend -> frontend calls /armory/purchase with wallet address and payment tx hash -> backend verifies on-chain payment -> transfers NFT from platform wallet to user wallet -> purchase failsafe tracks state (if tx fails, recovery cron detects and auto-retries/refunds) -> backend updates Firebase with new ownership -> game reflects unlocked content. If store inventory runs low, the auto-replenishment job mints more from the deployer wallet.

4. Level-up (Training Room): User pays AVAX via frontend -> backend verifies payment -> increments on-chain level on ChainBoisNFT contract -> emits EIP-4906 MetadataUpdate event -> badge overlay generated via Cloudinary URL transform, downloaded, and pinned to IPFS as a permanent image -> metadata JSON built with all traits (Level, Rank, Kills, Score, Games Played) + IPFS image URL, also pinned to IPFS -> previous level's Cloudinary image deleted (saves free tier quota, skipped for level 0) -> MongoDB updated with new IPFS imageUri, metadataUri, and traits -> updates Firebase with new level -> game reflects new rank and unlocked characters.

5. Token economy cycle: Weapon purchases send $BATTLE to weapon_store wallet -> tokenomics sweep cron (6h) calculates health tier from rewards wallet balance -> burns X% of weapon_store balance (permanent supply reduction) -> recycles Y% back to rewards wallet -> dynamic rates auto-adjust for points conversion and prize payouts based on new health tier (ABUNDANT/HEALTHY/MODERATE/SCARCE/CRITICAL).

6. Tournament lifecycle: Tournament cron starts event on schedule -> players submit scores through gameplay loop -> at tournament end, cron calculates final rankings -> auto-distributes prizes from rewards/prize_pool wallets to winner wallets -> fires Discord webhook with results -> updates leaderboard history.

---

## Question 8: What is Currently Playable

**Full answer:**

The full game loop is live on Fuji Testnet. ChainBois is a play-to-earn third-person shooter built with Unity, available on PC and Android.

Playable Game Modes (7):
1. Frontline -- Classic team-based combat
2. Team Deathmatch -- Squad vs squad elimination
3. Kill Confirmed -- Collect dog tags from downed enemies to score
4. Capture the Flag -- Objective-based flag capture (currently buggy, being fixed)
5. Search and Destroy -- Attack/defend bomb sites (currently buggy, being fixed)
6. Gun Fight -- Small-team tactical rounds
7. Battle Royale -- Last player standing (best with many players)

Blockchain-Integrated Features (Live):
- Wallet Connection -- Players connect their wallet via Thirdweb on the frontend website
- NFT Ownership Verification -- Backend checks on-chain NFT ownership and writes to Firebase; the game reads Firebase to unlock characters and weapons
- Score Syncing -- Game writes scores to Firebase, backend polls every 5 minutes and syncs to MongoDB with anti-cheat validation
- $BATTLE Token -- ERC20 token with fixed 10M supply and on-chain burn mechanics
- ChainBoi NFTs -- ERC-721 player characters with on-chain levels and dynamic metadata
- Weapon NFTs -- ERC-721 weapons with on-chain names across 8 categories
- Dynamic Metadata -- NFT metadata updates in real-time with level, army rank, stats, and IPFS-pinned badge overlay images
- Automated Tokenomics -- Cron jobs handle burn/recycle sweeps, wallet health checks, and platform audits
- Auto-Replenishment -- Inventory replenishment job automatically mints new NFTs and weapons when store wallets run low
- Testnet Faucet -- New users claim 2 NFTs + 8 weapons + 1,000 $BATTLE with zero gas
- Simulate Login -- Developers can get Firebase auth tokens via API for Postman testing without the frontend

API-Ready (Frontend Integration In Progress):

The following features are fully built on the backend with complete API endpoints, documentation, and importable Postman collections -- frontend integration is actively in progress:

- Training Room -- Level up ChainBoi NFTs through 8 army ranks (Private -> Field Marshal), with on-chain level updates and IPFS-pinned badge overlays. Each level unlocks 4 new playable characters.
- Armory -- Purchase weapons with $BATTLE and buy ChainBoi NFTs with AVAX, with automatic burn/recycle tokenomics on weapon purchases and purchase failsafe protection.
- Tournaments -- 7 competition tiers (one per player level) with 5-day cycles and automated prize distribution (AVAX + $BATTLE). Discord webhook notifications for winners.
- Points Conversion -- Convert in-game points to $BATTLE at a dynamic exchange rate that adjusts based on rewards wallet health (5 tiers: ABUNDANT -> CRITICAL).
- Inventory -- Full asset view showing owned ChainBoi NFTs (with level, rank, badge), weapons, token balances, and complete transaction history.
- Leaderboard -- Rankings across multiple time periods (30min, 1hr, 24hr, week, month, all-time).
- Airdrops -- Weekly trait-based $BATTLE distribution to NFT holders based on rarity.

All of these have full API endpoints, frontend integration docs per phase, and importable Postman collections ready for the frontend developer to connect.

---

## Question 9: Smart Contracts Deployed

**Full answer:**

All 3 contracts are deployed and verified on Avalanche Fuji Testnet (Chain ID 43113):

| Contract | Purpose | Address | Explorer |
|----------|---------|---------|----------|
| BattleToken | ERC20Capped ($BATTLE, 10M fixed supply, burn-capable) | 0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0 | Snowtrace |
| ChainBoisNFT | ERC-721 (player characters, on-chain levels 0-7, EIP-4906 metadata updates) | 0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b | Snowtrace |
| WeaponNFT | ERC-721 (weapons with on-chain names, 8 categories) | 0xa2AFf3105668124A187b1212Ab850bf8b98dD07d | Snowtrace |

Built with Solidity 0.8.24, Hardhat 2.28.6, and OpenZeppelin v5.6. Source code is in the contracts/ directory of the repository.

Notable On-Chain Features:

BattleToken -- Deflationary Fixed Supply:
BattleToken is built with OpenZeppelin's ERC20Capped extension, enforcing an immutable hard cap of 10,000,000 $BATTLE. This cap is set at deployment and can never be increased -- no additional tokens can ever be minted beyond the initial supply. The contract exposes a burn() function that the platform's automated tokenomics job uses to permanently remove tokens from circulation. Every time a player purchases a weapon with $BATTLE, a percentage of the spent tokens is swept from the weapon store wallet and burned on-chain, permanently reducing total supply. This makes $BATTLE inherently deflationary -- the longer the game runs and the more weapons players buy, the scarcer $BATTLE becomes.

ChainBoisNFT -- On-Chain Levels with Dynamic Metadata:
ChainBoisNFT goes beyond standard ERC-721 by storing each NFT's level directly on-chain via an nftLevel mapping (mapping(uint256 => uint8)). When a player levels up their ChainBoi, the contract updates this on-chain level and emits an EIP-4906 MetadataUpdate event -- a standard signal that tells indexers, marketplaces (OpenSea, Joepegs), and block explorers (Snowtrace, Glacier) to re-fetch the token's metadata. The backend serves dynamic metadata at /api/v1/metadata/:tokenId that reflects the player's current army rank name (an 8-tier progression from Private -> Corporal -> Sergeant -> Captain -> Major -> Colonel -> Major General -> Field Marshal), real-time stats (games played, points earned, tournaments won), and badge overlay images pinned permanently to IPFS. During level-up, the badge overlay is generated via Cloudinary URL transforms, downloaded and pinned to IPFS through Pinata, and the Cloudinary copy is deleted -- the `imageUri` in API responses points to the permanent IPFS badge image. Metadata JSON (including all traits and the IPFS image URL) is also pinned to IPFS. The entire flow is automatic: the on-chain level changes, MetadataUpdate fires, marketplaces fetch the new metadata URL, and the NFT's displayed image, rank, and stats update everywhere. The contract also includes emitBatchMetadataUpdate() for triggering bulk metadata refreshes after batch off-chain changes (e.g., after a tournament concludes and multiple players' stats change simultaneously).

WeaponNFT -- Immutable On-Chain Weapon Identity:
WeaponNFT stores each weapon's name directly on-chain via a weaponName mapping, making the weapon's identity immutable and verifiable. Across 8 weapon categories (Assault, SMG, LMG, Marksman, Handgun, Launcher, Shotgun, Melee) and 30 total weapons, each minted weapon NFT carries its name (e.g., "M4", "RENETTI", "GUTTER KNIFE", "RPG") as permanent on-chain data. This means a weapon's identity can never be tampered with -- it is permanently anchored to the blockchain regardless of what any off-chain metadata service reports.

---

## Question 11: Playtesting Results

**Full answer:**

Manual Playtesting -- Game

We ran playtesting sessions with testers across the PC build and Android APK to evaluate gameplay, performance, and the blockchain integration experience.

What testers liked:

- 7 game modes gave real variety -- testers consistently highlighted that having seven distinct modes kept gameplay fresh. Frontline and Team Deathmatch were the clear favorites for fast-paced action and replayability.
- Gun Fight mode praised for tight tactical gameplay -- the smaller-scale format created tense, skill-based encounters that testers found highly engaging.
- Battle Royale was exciting with enough players -- when lobbies filled up, the Battle Royale mode delivered genuine tension and excitement.
- Character models and weapon variety appreciated -- the ChainBoi character designs and the 30 weapons spanning 8 categories gave players meaningful loadout choices.
- Play-to-earn concept excited testers -- the idea of actually owning in-game characters and weapons as NFTs, earning tokens from gameplay, and seeing their NFT metadata update with real stats generated genuine enthusiasm, even on testnet.

Friction points identified and plans:

- Ping/latency on slower connections -- some testers on slower internet experienced lag during multiplayer matches. This is a Unity networking limitation. Plan: implement better netcode optimization and regional servers post-hackathon.
- Low-end device frame drops -- especially noticeable in Battle Royale mode when many players were on screen simultaneously. Plan: implement LOD (Level of Detail) optimization to reduce rendering load on lower-end hardware.
- APK size is ~1.5GB -- several testers noted the large download size for mobile. Plan: implement Unity asset bundle optimization to reduce the initial download.
- PC build wallet connect limitation -- the in-game wallet connect button only functions in the APK. PC players must manually navigate to /access-request on the website. Plan: implement a universal deep link system that works across both builds.
- Sign-up flow confusion -- some testers were unsure how to go from creating a game account to connecting a wallet. Improved by adding clearer instructions and building the standalone faucet claim page.
- Fuji Testnet not configured -- testers with MetaMask needed to manually add Fuji. We added explicit network configuration instructions directly on the claim page.
- Capture the Flag and Search and Destroy have bugs -- these two modes exhibited gameplay bugs (objective tracking, round transitions). Being fixed post-hackathon -- does not affect the other 5 fully functional modes.
- Claim takes 30-90 seconds -- the starter pack executes 11 sequential on-chain transactions. We added a real-time progress indicator showing each transaction as it completes.

Manual Playtesting -- Platform & Blockchain

- Starter pack claim praised for simplicity -- paste address, click one button, watch assets arrive. No gas, no approvals, no complexity.
- Dynamic NFT metadata was a "wow" moment -- leveling up a ChainBoi and seeing the updated rank, stats, and badge overlay appear immediately on Snowtrace/Glacier without any manual refresh. The concept of a living NFT that reflects actual gameplay progress resonated strongly.
- Deflationary tokenomics with visible burns -- testers could see $BATTLE being burned on-chain when weapons were purchased. The sweep/burn/recycle cycle gave $BATTLE a tangible sense of value even on testnet.

Automated Testing -- Backend API

- 258 automated tests passing across the full API test suite, covering: authentication, game sync, training room, armory, points conversion, inventory, leaderboard, NFT metadata, airdrops, claims, endpoint validation, and platform metrics.
- IPFS badge pinning verified on testnet -- Token #1 is Level 1 Corporal with badge image pinned at ipfs://bafybeihz3ugt56zztjzqj7syfe4h7vdmvplowzr7drdvfekjna2g2x52ny/chainboi-1.png.
- 10 cron jobs running continuously in production -- score sync (5min), leaderboard, tournament lifecycle, tokenomics sweep (6h), wallet health (hourly), platform audit (daily), user metrics (daily), purchase failsafe (5min), failed payout retry (6h), inventory replenishment (30min).
- Purchase failsafe recovered stuck transactions -- during testing, some on-chain purchases entered a pending state due to network delays. The automated failsafe job detected and recovered them without manual intervention.
- Wallet health auto-fund system -- the hourly wallet health job monitors gas and token balances across all 5 platform wallets, automatically topping up from the deployer when below thresholds.
- Inventory auto-replenishment -- the 30-minute replenishment job detects when NFT or weapon store inventory drops below thresholds and automatically mints new assets from the deployer wallet.
- Anti-cheat validation tested -- the score sync pipeline was tested with edge cases including implausibly high scores, rapid submission (velocity checks), and suspicious patterns. The system correctly flagged and handled all test cases.
