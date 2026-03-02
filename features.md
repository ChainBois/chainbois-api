# ChainBois — Build Games Hackathon: Feature Plan

---

## PART 1: FEATURE CATEGORIZATION & HACKATHON STRATEGY

### Context

- **Hackathon:** Avalanche Build Games ($1M prize pool, 6 weeks)
- **Platform:** Avalanche blockchain (TESTNET for hackathon)
- **Game Status:** Already built on PC & Mobile ✅
- **Landing Page:** Already built ✅
- **What We're Building:** The Web3 website/platform layer that connects the game to blockchain
- **Key Note:** All blockchain features for the hackathon will use **testnet AVAX, testnet tokens, and testnet NFTs** — no real token launches or NFT mints required
- **Judging Criteria:** Builder drive, execution (working product in 6 weeks), crypto culture, long-term intent

---

## WEBSITE FEATURES — FULL CATEGORIZED BREAKDOWN

### A. LANDING PAGE (Already Built ✅)

| \#  | Feature                   | Description                                                                |
| :-- | :------------------------ | :------------------------------------------------------------------------- |
| A1  | Hero Section              | Dynamic hero with game trailer, visuals, tagline                           |
| A2  | Game Download Links       | PC download \+ mobile store redirects                                      |
| A3  | Hamburger Navigation Menu | Links to all pages (Training Room, Battleground, Armory, Inventory, Merch) |
| A4  | Wallet Connect Button     | AVAX wallet connection (Core, MetaMask, etc.)                              |
| A5  | Social Media Icons/Links  | Twitter, Discord, LinkedIn                                                 |
| A6  | Marketplace Redirects     | Links to Joepegs, Salvor, Hyperspace collections                           |
| A7  | Platform Statistics       | Total players, NFTs minted, tournaments played, etc.                       |
| A8  | Leaderboard Preview       | Top players across tournaments                                             |
| A9  | News & Updates Section    | Latest announcements                                                       |
| A10 | Feature Highlights        | Key selling points of the platform                                         |

### B. TRAINING ROOM

| \#  | Feature                        | Description                                                         |
| :-- | :----------------------------- | :------------------------------------------------------------------ |
| B1  | NFT Display Grid               | Show all ChainBoi NFTs in connected wallet                          |
| B2  | Level Badge Display            | Visual badge on each NFT showing current level (Trainee → Level 7\) |
| B3  | Level-Up Button                | Per-NFT button to initiate level-up                                 |
| B4  | Level-Up Transaction           | Sign testnet AVAX payment for upgrade                               |
| B5  | Level-Up Animation             | Animated transformation \+ badge acquisition visual                 |
| B6  | Tournament Eligibility Display | Show which tournaments each NFT qualifies for                       |
| B7  | Character Unlock Tracker       | Display how many characters are unlocked per level                  |

### C. BATTLEGROUND

| \#  | Feature                      | Description                                                |
| :-- | :--------------------------- | :--------------------------------------------------------- |
| C1  | Tournament Level Display     | Grid/list of all tournament tiers (1-7)                    |
| C2  | Live Leaderboard             | Top 10 players per tournament, real-time                   |
| C3  | Countdown Timer              | Days, hours, minutes, seconds until tournament end         |
| C4  | Tournament Schedule Info     | Start: Wed 12PM EST, End: Mon 12PM EST, 48hr cooldown      |
| C5  | Winner Display               | Gold/Silver/Bronze trophies for top 3 when tournament ends |
| C6  | Prize Collection Button      | Winners sign transaction to collect rewards                |
| C7  | Automated Prize Distribution | Smart contract sends prizes directly to wallets            |
| C8  | Historical Tournament Data   | Past tournament results                                    |

### D. ARMORY

| \#  | Feature                            | Description                                                                                       |
| :-- | :--------------------------------- | :------------------------------------------------------------------------------------------------ |
| D1  | Weapon Display by Category         | Melee, Assault, SMG, LMG, Marksman, Handgun, Launcher — horizontal scroll                         |
| D2  | Armor Display                      | Armor tiers displayed with pricing                                                                |
| D3  | Buy Now Button \+ Confirmation     | Purchase flow with confirmation dialog                                                            |
| D4  | Loot Box Display                   | Bronze, Silver, Gold, Epic treasure chests with color coding                                      |
| D5  | Loot Box Probability Display       | Show % chance for each possible reward                                                            |
| D6  | Loot Box Opening Animation         | Animated reveal of contents                                                                       |
| D7  | Points Balance Display             | Box showing current in-game points                                                                |
| D8  | ChainBoi Money Balance Display     | Converted currency balance                                                                        |
| D9  | Points → ChainBoi Money Conversion | Convert button that deducts from tournament score                                                 |
| D10 | $BATTLE Token Bank                 | Interface to purchase $BATTLE tokens with ChainBoi Money (1:1 ratio), sign blockchain transaction |
| D11 | $BATTLE → $AVAX Cash-out           | Sell $BATTLE tokens for AVAX via signed transaction                                               |

### E. INVENTORY

| \#  | Feature                   | Description                                                     |
| :-- | :------------------------ | :-------------------------------------------------------------- |
| E1  | Asset Display by Category | Weapons sorted by type, armor section                           |
| E2  | Sell Button per Asset     | Redirect to marketplace to list for sale                        |
| E3  | Receive Purchased Assets  | Auto-populate inventory when assets bought on secondary markets |
| E4  | Filter & Search           | Filter by weapon type, rarity, etc.                             |
| E5  | Transaction History       | Log of purchases, sales, transfers                              |

### F. NFT MINTING (Testnet for Hackathon)

| \#  | Feature                | Description                                                   |
| :-- | :--------------------- | :------------------------------------------------------------ |
| F1  | ChainBoi NFT Mint Page | Mint from supply using testnet AVAX                           |
| F2  | Mint Counter           | Show remaining supply                                         |
| F3  | Mint Transaction Flow  | Connect wallet → select quantity → sign → receive testnet NFT |
| F4  | Weapon NFT Minting     | 30 weapon types minted as testnet NFTs                        |

### G. TOKEN ECONOMICS & AIRDROPS

| \#  | Feature                    | Description                                          |
| :-- | :------------------------- | :--------------------------------------------------- |
| G1  | $BATTLE Token (Testnet)    | Testnet ERC-20 token deployed on Avalanche Fuji      |
| G2  | NFT-Based Airdrops         | Weekly distribution based on NFT level               |
| G3  | Trait-Based Airdrops       | Random trait selected weekly, rewards based on level |
| G4  | Token-Based Airdrops       | Rewards based on $BATTLE holdings                    |
| G5  | Partial Burn Mechanism     | 50% burn, 50% to liquidity pool on purchases         |
| G6  | Redistribution System      | Random airdrop types, timing randomization           |
| G7  | Airdrop Tracking Dashboard | View history of received airdrops                    |

### H. GAME INTEGRATION

| \#  | Feature                       | Description                                               |
| :-- | :---------------------------- | :-------------------------------------------------------- |
| H1  | Web2 vs Web3 Player Selection | Choose play mode at game launch                           |
| H2  | Asset Verification System     | Backend verifies wallet holdings → unlocks in-game assets |
| H3  | Points Sync                   | Real-time sync of in-game points to website               |
| H4  | Points → $BATTLE Conversion   | Convert accumulated points to tokens                      |
| H5  | Asset → Game Sync             | Purchased weapons/armor immediately available in-game     |
| H6  | Normie (Web2) Onboarding      | Platform-managed wallet, restricted NFT, upgrade path     |

### I. BATTLEPASS & SEASONAL CONTENT

| \#  | Feature            | Description                                                   |
| :-- | :----------------- | :------------------------------------------------------------ |
| I1  | Free Battlepass    | Base weapon models, daily challenges, community events        |
| I2  | Premium Battlepass | Exclusive NFT assets, higher-rarity blueprints                |
| I3  | Seasonal Themes    | Monthly themed content drops                                  |
| I4  | Raffle System      | Purchase battle passes with $BATTLE, raffle for upgrade chips |

### J. ADVANCED SYSTEMS

| \#  | Feature                        | Description                                                |
| :-- | :----------------------------- | :--------------------------------------------------------- |
| J1  | Mythic Upgrade System          | 5-level upgrade using chips (150→250→500→700→900 chips)    |
| J2  | Upgrade Chip Draw              | Spend $BATTLE tokens to draw chips with probability tiers  |
| J3  | Agent Pool Buyback             | Platform buys back NFTs at fixed prices for supply control |
| J4  | Rerun Mechanics                | Reintroduce popular assets at premium pricing              |
| J5  | Normie → Web3 Upgrade          | Pay 120% floor price to upgrade from Web2 to full Web3     |
| J6  | In-house Secondary Marketplace | List, buy, sell assets with commission structure           |

### K. MERCHANDISE

| \#  | Feature             | Description                                      |
| :-- | :------------------ | :----------------------------------------------- |
| K1  | Merch Page          | Featured products display                        |
| K2  | CryptoLids Redirect | Link to CryptoLids store for branded merchandise |

---

## HACKATHON PRIORITY RECOMMENDATIONS

**IMPORTANT:** Since we're on **testnet**, we don't need to worry about real token launches, real NFT mints, liquidity, or mainnet deployment. This means we can focus purely on building and demonstrating working blockchain integration. We deploy a testnet $BATTLE ERC-20, testnet ChainBoi NFTs, and testnet weapon NFTs — all on Avalanche Fuji. This actually makes development faster since there's no financial risk and we can iterate freely.

### 🟢 PHASE 1 — BUILD FOR HACKATHON (Weeks 1-6)

_Goal: Demonstrate a complete, working Web3 gaming loop on Avalanche testnet._

**Landing Page (Already Built — Polish Only)**

- A3: Ensure navigation links to new pages work
- A4: Wallet connect (must work with Fuji testnet)
- A5-A6: Social links & marketplace redirects

**Testnet Smart Contracts (Backend Priority)**

- G1: Deploy testnet $BATTLE ERC-20 on Fuji
- F1/F3: Deploy testnet ChainBoi NFT contract (mint functionality)
- F4: Deploy testnet weapon NFT contract
- Level-up contract (accepts testnet AVAX, updates NFT metadata)
- Points → $BATTLE conversion contract
- Prize distribution contract

**Training Room (Core — Build New)**

- B1: NFT display grid (read from wallet)
- B2: Level badge display
- B3: Level-up button
- B4: Level-up transaction (testnet AVAX)
- B5: Level-up animation (can be simple/clean)

**Battleground (Core — Build New)**

- C1: Tournament level display
- C2: Leaderboard (can use demo/seeded data for hackathon showcase)
- C3: Countdown timer
- C5: Winner display with trophies
- C6: Prize collection button

**Armory (Core — Build New)**

- D1: Weapon display by category
- D3: Buy now \+ confirmation (spend testnet $BATTLE for weapon NFTs)
- D7: Points balance display
- D9: Points → ChainBoi Money conversion
- D10: $BATTLE token bank (convert & sign testnet transaction)

**Inventory (Core — Build New)**

- E1: Asset display by category (read NFTs from wallet)
- E2: Sell button (can link to testnet marketplace or placeholder)

**Game Integration (Core — Backend)**

- H2: Asset verification (wallet → backend → game checks)
- H3: Points sync between game and website
- H4: Points → $BATTLE conversion flow
- H5: Weapon/armor purchase → available in-game

**Why these features?** They demonstrate to judges:

- ✅ A REAL GAME that already works on PC & mobile
- ✅ Complete blockchain integration on Avalanche (testnet)
- ✅ NFT minting, leveling, and ownership verification
- ✅ A working token economy ($BATTLE earn → spend → burn loop)
- ✅ Tournament system with on-chain prize distribution
- ✅ Game ↔ blockchain sync (assets verified and usable in-game)
- ✅ Long-term intent (massive feature roadmap beyond hackathon)

---

### 🟡 PHASE 2 — BUILD SHORTLY AFTER HACKATHON (Months 1-2 post, Mainnet)

_Deploy to mainnet and add depth._

- A7-A8: Platform statistics & leaderboard preview on landing page
- B6-B7: Tournament eligibility & character unlock tracker
- C7: Fully automated prize distribution smart contract
- C8: Historical tournament data
- D2: Armor display & purchase
- D4-D6: Loot box system (display, probabilities, opening animation)
- D8: ChainBoi Money balance display
- D11: $BATTLE → $AVAX cash-out
- E3: Auto-receive purchased assets from secondary
- E4-E5: Filter/search & transaction history
- G2-G4: Airdrop systems (NFT-based, trait-based, token-based)
- G1 (mainnet): Real $BATTLE token launch via APEX Burst (314 token)
- F1 (mainnet): Real ChainBoi NFT mint (4,000 at 2 AVAX)
- H1: Web2 vs Web3 player selection UI
- K1-K2: Merchandise page / CryptoLids integration

---

### 🔴 PHASE 3 — LONG-TERM ROADMAP (Months 3-6+)

_Complex systems requiring a live economy and active player base._

- G5-G6: Burn mechanism & redistribution system
- G7: Airdrop tracking dashboard
- H6: Normie (Web2) onboarding with managed wallets
- I1-I4: Battlepass system (free \+ premium \+ seasonal \+ raffle)
- J1-J2: Mythic upgrade system & chip draws
- J3-J4: Agent pool buybacks & rerun mechanics
- J5: Normie → Web3 upgrade flow (120% floor price)
- J6: In-house secondary marketplace with commission
- A9-A10: News section, feature highlights
- Advanced weapon blueprint tiers (Epic → Legendary → Mythic)
- Community governance
- NFD airdrops
- Console version
- Memecoin integrations (Solana, Base)
- Additional game landscapes & modes

---

### FRONTEND vs BACKEND EFFORT SUMMARY (Hackathon Scope)

| Feature Area                  | Frontend Effort | Backend Effort | Notes                                                  |
| :---------------------------- | :-------------- | :------------- | :----------------------------------------------------- |
| Landing Page Polish           | Low             | None           | Already built, just hook up nav \+ wallet              |
| Wallet Connect (Fuji Testnet) | Medium          | Low            | Use wagmi/RainbowKit or similar                        |
| Testnet Smart Contracts       | None            | High           | ERC-20, ERC-721, level-up, prizes                      |
| Training Room                 | High            | High           | NFT fetching, level-up tx, animation                   |
| Battleground                  | High            | High           | Leaderboard, timer, winner display, prize claim        |
| Armory                        | High            | High           | Weapon display, purchase flow, points/token conversion |
| Inventory                     | Medium          | Medium         | Read NFTs from wallet, display by category             |
| Game ↔ Blockchain Sync        | Low             | Very High      | Asset verification API, points sync, real-time updates |
