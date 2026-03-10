## Stage 2: MVP Submission Form — ChainBois (Avalanche Build Games 2026)

**1. Question:** GitHub Repository
**Answer:** https://github.com/ChainBois/chainbois-api

---

**2. Question:** Technical Documentation — Describe your tech stack, architecture decisions, and implementation approach.

**Answer:**

**Tech Stack:**
- **Smart Contracts**: Solidity 0.8.24 (Hardhat 2.28.6, OpenZeppelin v5.6) — 3 contracts deployed on Avalanche Fuji C-Chain
- **Backend**: Node.js/Express API with MongoDB Atlas, Firebase Realtime DB, and Socket.IO
- **Frontend**: Next.js with Thirdweb wallet integration
- **Game**: Unity (PC + Android builds) communicating via Firebase RTDB
- **Infrastructure**: PM2 cluster mode, Cloudinary (dynamic NFT badge overlays), Pinata (IPFS metadata), Nginx reverse proxy

**Architecture Decisions:**
1. **Backend-heavy blockchain logic**: All on-chain operations (minting, transfers, level-ups, burns) happen server-side. The frontend never directly signs contract calls — this simplifies the UX and allows us to implement purchase failsafes, anti-cheat, and atomic transaction guarantees without depending on client-side wallet interactions.
2. **Firebase as a game bridge**: Our Unity game devs have limited ability to change their integration, so we use Firebase Realtime DB as a bridge. The backend writes NFT ownership, level, and weapon data to Firebase; the game reads it. The backend polls Firebase for scores via cron jobs. This means game developers don't need to implement any API calls.
3. **Pre-minted asset model**: All 50 ChainBoi NFTs, weapons, and the full 10M $BATTLE supply are pre-minted to platform-controlled wallets. Purchases and rewards are transfers, not mints. This gives us full inventory control and enables the purchase failsafe system (atomic DB claim → on-chain transfer → auto-refund on failure).
4. **Dynamic tokenomics**: Rather than static rates, $BATTLE conversion rates, burn rates, and airdrop amounts auto-adjust based on the rewards pool health tier (ABUNDANT → CRITICAL). This creates a self-regulating deflationary economy.
5. **ERC20Capped with fixed supply**: $BATTLE uses OpenZeppelin's ERC20Capped at 10M — the supply is permanently capped on-chain and can never be inflated. Auto-burn from weapon purchases makes it truly deflationary.

Full architecture docs: https://github.com/ChainBois/chainbois-api/blob/main/docs/SYSTEM_ARCHITECTURE.md

---

**3. Question:** Architecture design overview — Outline the main components, workflows, and technical structure.

**Answer:**

```
Unity Game <-> Firebase RTDB <-> Backend API <-> Avalanche C-Chain (Fuji)
                                     |
                               MongoDB Atlas
```

**Components:**
- **3 Smart Contracts** (on-chain): BattleToken (ERC20Capped, 10M fixed supply), ChainBoisNFT (ERC-721 with on-chain levels 0-7), WeaponNFT (ERC-721 with weapon names)
- **Backend API** (off-chain): 50+ REST endpoints across 13 route groups — auth, game sync, training, tournaments, armory, points, inventory, leaderboard, metadata, airdrops, claims, metrics
- **9 Cron Jobs** (automated): Score sync (5min), tournament lifecycle (hourly), purchase failsafe (5min), tokenomics sweep/burn (6h), wallet health monitoring + auto-fund (hourly), platform audit (daily)
- **5 Platform Wallets**: deployer, nft_store, weapon_store, prize_pool, rewards — all AES-256 encrypted, managed by the backend
- **Dynamic Metadata**: NFT metadata is served dynamically via API (`/api/v1/metadata/:tokenId`) with real-time level, stats, and Cloudinary badge overlays — changes reflect instantly on OpenSea/Glacier without re-uploading

**On-chain vs Off-chain:**
- **On-chain**: NFT ownership, NFT levels, $BATTLE balances, weapon ownership, token burns, prize distributions, all asset transfers
- **Off-chain**: Game scores, leaderboards, user profiles, points balances, tournament scheduling, anti-cheat, rarity calculations, platform metrics

This architecture keeps gas costs minimal (users only pay for level-ups) while maintaining full on-chain asset ownership and provenance.

---

**4. Question:** How does a user interact with your solution from start to finish?

**Answer:**

**Step 1 — Sign Up**: User visits the ChainBois frontend (https://chainbois-true.vercel.app), creates an account, and connects their MetaMask/Core wallet on Fuji Testnet.

**Step 2 — Get Assets**: User claims a free starter pack at the testnet faucet (https://chainbois-testnet-faucet.vercel.app) — receives 2 ChainBoi NFTs, 8 weapons (one per category), and 1,000 $BATTLE tokens directly to their wallet via on-chain transfers.

**Step 3 — Asset Verification**: The backend verifies the user's on-chain NFT ownership and writes their assets (hasNFT, level, weapons, characters) to Firebase. The Unity game reads this data.

**Step 4 — Play the Game**: User downloads the game (PC or APK) from the frontend. The game loads their NFT characters and weapons from Firebase. They play and earn points — scores are written back to Firebase by the game.

**Step 5 — Score Sync**: The backend's syncScoresJob polls Firebase every 5 minutes, syncs scores to MongoDB, runs anti-cheat validation (plausibility checks, velocity limits), and updates the leaderboard.

**Step 6 — Train & Level Up**: On the frontend's Training Room, users pay AVAX to level up their ChainBoi NFT (0→7). Each level unlocks 4 new characters and additional weapons in-game. The level is stored on-chain in the smart contract and the NFT metadata updates dynamically.

**Step 7 — Buy Weapons**: In the Armory, users spend $BATTLE tokens to purchase weapon NFTs. The purchase is verified on-chain, the weapon is atomically claimed in the database, then transferred on-chain. If the transfer fails, the purchase failsafe system auto-retries or refunds.

**Step 8 — Compete in Tournaments**: 7 tournament tiers (one per player level) run on 5-day cycles. At tournament end, prizes are automatically distributed: AVAX to 1st/2nd place, $BATTLE to 3rd. No manual claiming required.

**Step 9 — Earn & Convert**: Game points convert to $BATTLE at a dynamic rate based on the rewards pool health. As more $BATTLE is distributed, the conversion rate decreases — creating scarcity and rewarding early/active players.

---

**5. Question:** MoSCoW Framework — Feature Prioritization

**Answer:**

**Must Have (Implemented):**
- Smart contracts deployed on Fuji (BattleToken, ChainBoisNFT, WeaponNFT)
- NFT minting, ownership, and on-chain transfers
- Wallet connection and user authentication
- Game download and Firebase game bridge (play → earn points)
- NFT level-up system with on-chain state
- Weapon and NFT purchase with on-chain payment verification
- Dynamic ERC-721 metadata (levels, stats, badges reflect in real-time)
- Testnet faucet/claim page for judges and testers

**Should Have (Implemented):**
- Tournament system with automated prize distribution
- Dynamic tokenomics (health tiers, auto-burn, rate adjustment)
- Purchase failsafe system (stuck purchase recovery, auto-refund)
- Anti-cheat (score plausibility, velocity checks, threat scoring)
- Wallet health monitoring with auto-fund from deployer
- Platform audit job (solvency, ownership sync)
- Leaderboard with multiple time periods

**Could Have (Partially Implemented):**
- Trait-based rarity airdrops (system built, weekly distribution job running)
- Discord webhook notifications (infrastructure ready, webhook URL pending)
- Socket.IO real-time tournament updates (connected, live on server)

**Won't Have (Post-Hackathon):**
- Mainnet deployment (staying on Fuji for MVP)
- Custom marketplace (using Joepegs for secondary market)
- Armor/equipment system beyond weapons
- Battle pass / season system
- Cross-chain bridging
- Mobile wallet (using MetaMask/Core)

---

**6. Question:** Walkthrough Video
**Answer:** [TO BE RECORDED — max 5 minutes demonstrating: claim starter pack → sign up → connect wallet → download game → play → level up → buy weapon → tournament leaderboard]

---

**7. Question:** Live Prototype Links

**Answer:**
- **Frontend**: https://chainbois-true.vercel.app
- **Backend API**: https://test-2.ghettopigeon.com/api/v1/health
- **Testnet Faucet (Claim Page)**: https://chainbois-testnet-faucet.vercel.app
- **GitHub**: https://github.com/ChainBois/chainbois-api

---

### GAMING MVP SECTION

**8. Question:** What is currently playable?

**Answer:**

The full game loop is live on Fuji Testnet. ChainBois is a **play-to-earn third-person shooter** built with Unity, available on PC and Android.

**Playable Game Modes (7):**
1. **Frontline** — Classic team-based objective mode
2. **Team Deathmatch** — Two teams compete for the most kills
3. **Kill Confirmed** — Collect dog tags from eliminated players to score
4. **Capture the Flag** — Steal the enemy flag and return it to base (has some bugs)
5. **Search and Destroy** — Attack/defend bomb sites (has some bugs)
6. **Gun Fight** — Small-team tactical encounters
7. **Battle Royale** — Last player standing (best experienced with many players)

**Blockchain-Integrated Features:**
1. **Character ownership**: Players own ChainBoi NFTs (ERC-721) that serve as their in-game characters. Each NFT unlocks 4 characters per level (0-7), giving up to 32 unique characters.
2. **Weapon system**: 8 weapon categories (Assault, SMG, LMG, Marksman, Handgun, Launcher, Shotgun, Melee) with unique weapons purchasable via $BATTLE tokens. Weapons are ERC-721 NFTs.
3. **Play-to-earn gameplay**: Players download the Unity game (PC or Android APK), play matches across 7 game modes, and earn points. The game writes scores to Firebase; the backend syncs them to MongoDB every 5 minutes.
4. **Training & leveling**: Players level up their NFTs by paying AVAX on the frontend. Level is stored on-chain in the smart contract — the NFT metadata (name, image, stats) updates dynamically.
5. **Token economy**: Points → $BATTLE conversion at dynamic rates. $BATTLE spent on weapons is periodically burned (deflationary). Tournaments distribute AVAX + $BATTLE prizes automatically.
6. **Tournaments**: 7 tiers of automated tournaments with 5-day cycles, leaderboards, and auto-prize distribution.

Core mechanics that are live: 7 game modes, play-to-earn, NFT ownership, on-chain leveling, weapon purchasing, tournaments, dynamic tokenomics.

---

**9. Question:** Smart contracts deployed

**Answer:**

All 3 contracts are deployed and verified on **Avalanche Fuji Testnet** (Chain ID 43113):

| Contract | Purpose | Address | Explorer |
|----------|---------|---------|----------|
| **BattleToken** | ERC20Capped ($BATTLE, 10M fixed supply, burn-capable) | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | [Snowtrace](https://testnet.snowtrace.io/address/0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0) |
| **ChainBoisNFT** | ERC-721 (player characters, on-chain levels 0-7, EIP-4906 metadata updates) | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | [Snowtrace](https://testnet.snowtrace.io/address/0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b) |
| **WeaponNFT** | ERC-721 (weapons with on-chain names, 8 categories) | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` | [Snowtrace](https://testnet.snowtrace.io/address/0xa2AFf3105668124A187b1212Ab850bf8b98dD07d) |

Built with Solidity 0.8.24, Hardhat 2.28.6, and OpenZeppelin v5.6. Source code is in the `contracts/` directory of the repository.

**Notable on-chain features:**
- BattleToken has a hard cap of 10M tokens (ERC20Capped) — supply can never increase
- BattleToken supports `burn()` — the tokenomics job permanently removes tokens from circulation
- ChainBoisNFT stores `nftLevel` on-chain and emits EIP-4906 `MetadataUpdate` events when levels change, signaling indexers (OpenSea, Glacier) to refresh metadata
- ChainBoisNFT has `emitBatchMetadataUpdate()` for bulk metadata refreshes after off-chain changes (badges, stats)

---

**10. Question:** New player onboarding flow

**Answer:**

We designed onboarding to minimize friction for both Web3 and Web2 players:

**Web3 Players (have a wallet):**
1. Visit the frontend → Sign up → Connect MetaMask/Core wallet on Fuji Testnet
2. Claim free starter pack at https://chainbois-testnet-faucet.vercel.app (2 NFTs + 8 weapons + 1,000 $BATTLE — no gas needed, platform pays all transfer fees)
3. Download game (PC or APK) → characters and weapons load automatically from Firebase
4. Start playing immediately — no seed phrases, no contract interactions required from the player

**Web2 Players (no wallet):**
- Can download and play the game without any wallet setup
- The backend detects unregistered Firebase UIDs and tracks them as Web2 players
- Their scores and progress are saved — they can connect a wallet later to unlock NFT features and claim rewards
- Zero blockchain friction for first play session

**Key onboarding decisions:**
- **No gas for players on first interaction**: The testnet faucet pays all transfer fees. Players receive assets without needing testnet AVAX.
- **One-click claim**: Paste wallet address → click → receive all starter assets. No multi-step approval flows.
- **Max 1 claim per wallet**: Enforced by unique database index + in-memory lock to prevent nonce collisions.
- **Auto-mint if stores are empty**: If platform NFT/weapon stores run out, the system auto-mints new assets directly to the user via the deployer wallet.
- **Firebase bridge eliminates game-side complexity**: Game developers didn't need to implement any API calls or wallet logic. The backend handles everything.

---

**11. Question:** Playtesting results

**Answer:**

**What testers liked:**
- The starter pack claim page was praised for being simple — paste address, click, done. No wallet signing, no gas, no multi-step process.
- Dynamic NFT metadata impressed testers — leveling up an NFT and immediately seeing the updated stats/badges on Snowtrace/Glacier without any manual refresh was a strong "wow" moment.
- Automatic prize distribution in tournaments (no "claim rewards" button) was well-received — players just play and winnings appear in their wallet.
- The deflationary tokenomics model with visible burn mechanics gave $BATTLE a sense of scarcity and value even on testnet.

**Friction points we identified and addressed:**
- **Fuji Testnet not configured**: Many testers didn't have Fuji added to MetaMask. We added clear instructions on the claim page specifying "Fuji Testnet (Avalanche C-Chain)" with the 0x address format hint.
- **PC build wallet redirect**: The in-game button that opens the browser for wallet connection was only implemented in the APK build. PC users need to manually navigate to the access-request URL. This is a known limitation we'd address post-hackathon with a universal deep link.
- **Claim processing time**: Each claim involves 11 sequential on-chain transactions (2 NFTs + 8 weapons + 1 token transfer). This takes 30-90 seconds. We added a real-time progress indicator with elapsed time and per-asset status updates to keep users informed.
- **Large APK download**: The Android build is ~1.5 GB which is large for mobile download. We'd optimize asset bundles for mainnet.
- **Ping/latency issues**: Players on slower internet connections experienced lag in multiplayer matches. This is a Unity networking limitation we'd optimize with better netcode and regional servers post-hackathon.
- **Low-end device performance**: Some testers on lower-end devices experienced frame drops, particularly in Battle Royale mode with many players. Asset LOD optimization planned for mainnet.
- **Sign-up flow confusion**: Some testers were unsure about the wallet connection step during sign-up. We improved the flow with clearer instructions and the standalone faucet/claim page for onboarding.

**Metrics from testing:**
- 286 automated tests passing across the API
- 9 cron jobs running continuously in production
- 7 game modes tested across PC and Android builds
- Purchase failsafe system successfully recovered stuck transactions during testing
- Wallet health auto-fund system keeps platform wallets topped up without manual intervention
