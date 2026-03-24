# ChainBois Finals — Slide Deck Text

**Total Slides: 14**
**Design: Dark theme, ChainBois red (#ec1b24) accents, military/gaming aesthetic**

---

## SLIDE 1: TITLE

**Headline:** ChainBois
**Subhead:** Competitive Shooters Meet True Ownership on Avalanche
**Footer:** Build Games 2026 — Finals | Avalanche C-Chain (Fuji Testnet)
**Visual:** ChainBoi NFT artwork montage / game screenshot

---

## SLIDE 2: THE PROBLEM

**Headline:** $230B Gaming Market. Players Own Nothing.

**Bullets:**
- Players invest thousands of hours but their progress, skins, and achievements live on company servers
- One shutdown, one ban, one policy change — everything gone
- Web3 gaming has tried to fix this, but most projects are either unplayable or just DeFi with a game skin

**Visual:** Split — traditional gaming (locked items) vs. ChainBois (owned NFTs on-chain)

---

## SLIDE 3: THE SOLUTION — PLAYABLE IDENTITY

**Headline:** Your NFT Evolves With Your Skill

**Bullets:**
- ChainBoi NFTs level up on-chain (Level 0 Private → Level 7 Field Marshal)
- Each level unlocks 4 new in-game characters (32 total)
- Dynamic metadata: your kills, score, rank, and badge update as you progress
- NFTs gain value as you play — skill = real economic value
- Trade on any marketplace (Joepegs, Campfire) — your progression travels with you

**Visual:** NFT progression showing Level 0 → Level 7 with rank badges

---

## SLIDE 4: THE PRODUCT — LIVE & PLAYABLE

**Headline:** Not a Concept. Live on Avalanche Fuji.

**Key Stats Grid:**
| Metric | Value |
|--------|-------|
| Smart Contracts | 3 deployed (ERC-20 + 2 ERC-721) |
| API Endpoints | 50+ RESTful |
| Automated Jobs | 10 cron jobs |
| Tests Passing | 258 |
| Game Modes | 7 (FPS multiplayer) |
| Weapons | 13 across 8 categories |
| Characters | 32 unlockable |
| Token Supply | 10M $BATTLE (fixed, capped on-chain) |

**Visual:** Screenshot grid — website, game, faucet, Snowtrace transactions

---

## SLIDE 5: PLAYER JOURNEY

**Headline:** From Download to Tournament Winner in Minutes

**Step-by-Step Flow (horizontal or circular diagram):**

1. **DOWNLOAD** — Get the game from our website (Windows + Mobile)
2. **CLAIM** — Visit testnet faucet → 2 NFTs + 8 weapons + 1,000 $BATTLE (one click)
3. **CONNECT** — Link wallet on website → backend verifies on-chain ownership
4. **PLAY** — 5 game modes (2 more coming), scores sync to backend every 5 minutes via Firebase
5. **TRAIN** — Level up NFTs (pay AVAX) → unlock characters, earn higher rank
6. **ARM** — Buy premium weapons with $BATTLE tokens in the Armory
7. **COMPETE** — Enter tier-based tournaments → auto-distributed AVAX + $BATTLE prizes
8. **TRADE** — Sell leveled NFTs on secondary markets — your time has value

**Visual:** Icons/screenshots for each step connected by arrows

---

## SLIDE 6: GAME MODES & GAMEPLAY

**Headline:** Built for Competition

**Game Modes:**
- Frontline — Large-scale team combat
- Team Deathmatch — Classic team vs team
- Kill Confirmed — Collect dog tags to score
- Gun Fight — Small team tactical
- Battle Royale — Last player standing

**Coming Soon:** Capture the Flag | Search and Destroy

**Weapon Categories:** Assault | SMG | LMG | Marksman | Handgun | Launcher | Shotgun | Melee

**Visual:** Gameplay screenshots / weapon artwork grid

---

## SLIDE 7: TRAINING ROOM

**Headline:** Level Up Your ChainBoi On-Chain

**How It Works:**
- Pay 1 AVAX per level → AVAX goes directly to the tournament prize pool
- Backend calls `setLevel()` on the smart contract (deployer signs)
- NFT metadata updates: new rank badge generated via Cloudinary → pinned to IPFS
- EIP-4906 emitted → marketplaces auto-refresh your NFT display
- Each level unlocks 4 new playable characters in-game

**Rank Progression:**
Level 0: Private → Level 1: Corporal → Level 2: Sergeant → Level 3: Captain → Level 4: Major → Level 5: Colonel → Level 6: Major General → Level 7: Field Marshal

**Visual:** Training Room UI screenshot + rank badge progression

---

## SLIDE 8: ARMORY & WEAPON ECONOMY

**Headline:** Gear Up With $BATTLE Tokens

**How It Works:**
- 13 premium weapons across 8 categories
- Prices: 20-50 $BATTLE per weapon
- Purchase: User sends $BATTLE → backend verifies on-chain → weapon NFT transferred
- Weapon names stored on-chain (`weaponName` mapping in contract)
- All weapon purchases feed the deflationary burn cycle

**Visual:** Armory UI screenshot with weapon cards and prices

---

## SLIDE 8.5: COMPETITIVE LANDSCAPE

**Headline:** Where ChainBois Fits

| | Off The Grid | Shrapnel | ChainBois |
|--|--|--|--|
| **Status** | Live (13M+ users) | Early Access | Live on Fuji Testnet |
| **Chain** | GUNZ (Avalanche L1) | Left Avalanche for GalaChain | Avalanche C-Chain |
| **On-Chain Progression** | No | No | Yes (levels stored on-chain) |
| **Deflationary Token** | No | No | Yes (auto-burn + health tiers) |
| **Auto Prize Distribution** | No | No | Yes (no manual claiming) |
| **Team Size** | 450+ | 100+ | 6 (built in 8 days) |

**Our Edge:** On-chain NFT progression where your skill directly increases asset value. Not extraction royale — ownership-based competitive gaming.

**Visual:** Comparison table

---

## SLIDE 9: TOURNAMENTS & PRIZES

**Headline:** Compete for Real Prizes. Auto-Distributed.

**Tournament Structure:**
- 7 tiers (one per player level) — fair matchmaking
- 5-day cycles with 48-hour cooldowns
- Prize pools funded by level-up AVAX payments

**Prize Distribution (Automatic — no claiming):**
- 1st Place: 50% of AVAX pool
- 2nd Place: 35% of AVAX pool
- 3rd Place: $BATTLE tokens
- Discord webhook: instant winner notifications

**Visual:** Battleground UI with active tournament, leaderboard, countdown

---

## SLIDE 10: DYNAMIC TOKENOMICS

**Headline:** $BATTLE — 10M Fixed Supply, Genuinely Deflationary

**The Mechanism:**
- All 10M $BATTLE pre-minted → rewards wallet (no inflation, ever)
- ERC20Capped enforces hard cap on-chain
- Weapon purchases accumulate in weapon_store wallet
- Every 6 hours: sweep job burns X% on-chain, recycles Y% back to rewards

**Health Tier System (Self-Balancing):**
| Tier | Rewards Health | Conversion Rate | Burn Rate |
|------|---------------|-----------------|-----------|
| ABUNDANT | ≥75% | 1 pt = 1 BATTLE | 50% burned |
| HEALTHY | 50-75% | 1 pt = 0.75 | 40% burned |
| MODERATE | 30-50% | 1 pt = 0.5 | 30% burned |
| SCARCE | 15-30% | 1 pt = 0.3 | 20% burned |
| CRITICAL | <15% | 1 pt = 0.15 | 10% burned |

**Key Property:** As supply drops, outflows decrease and recycling increases → asymptotically sustainable. The economy can't crash — it slows down gracefully.

**Visual:** Flow diagram: Play → Earn Points → Convert to $BATTLE → Buy Weapons → Burn Cycle

---

## SLIDE 11: TECHNICAL ARCHITECTURE

**Headline:** Modular, Resilient, Automated

**Stack Diagram:**
```
[Unity Game] ←→ [Firebase RTDB] ←→ [Express.js API] ←→ [MongoDB Atlas]
                                          ↕
                                   [Avalanche C-Chain]
                                   3 Smart Contracts
                                   5 Platform Wallets
```

**Key Infrastructure:**
- Backend: Node.js + Express, PM2 cluster mode
- Database: MongoDB Atlas + Redis (rate limiting)
- Blockchain: ethers.js v6, Glacier Data API, Hardhat
- Game Sync: Firebase Realtime DB (5-min polling)
- Image Pipeline: Pinata IPFS + Cloudinary overlays
- Monitoring: Discord webhooks for all critical events

**10 Automated Cron Jobs:**
- Score sync (5 min) | Tournament management (hourly) | Tokenomics sweep (6h)
- Wallet health monitoring (hourly) | Purchase failsafe (5 min)
- Platform solvency audit (daily) | Inventory replenishment (30 min)
- Failed payout retry (6h) | Trait airdrop (weekly) | New user sync (daily)

**Visual:** Architecture diagram with color-coded connections

---

## SLIDE 12: SECURITY & ANTI-CHEAT

**Headline:** Built for Production, Not Just Demo Day

**Anti-Cheat System:**
- Score plausibility checks (realistic for time elapsed)
- Velocity limits (max score changes per time window)
- Cumulative threat scoring per player (auto-ban at threshold)
- Daily earnings cap (50,000 points)

**Purchase Security:**
- On-chain transaction verification (sender, receiver, amount, age)
- Replay protection (txHash uniqueness)
- Purchase failsafe job (auto-retry or refund stuck purchases)

**Platform Safety:**
- AES-256 encrypted wallet keys
- Rate limiting per endpoint type
- Daily solvency audit (can rewards cover obligations?)
- Wallet health monitoring with auto-funding

**Visual:** Security shield graphic with bullet points

---

## SLIDE 13: 12-MONTH VISION

**Headline:** From Testnet to Avalanche L1

**Q2 2026 — Mainnet Launch**
- Deploy to Avalanche C-Chain mainnet
- Seed crypto-native community (target: 1,000 players)
- Launch loot box system + battle pass

**Q3 2026 — Competitive Community**
- PvP ranked mode + seasonal tournaments
- Mythic weapon upgrades (5-tier system)
- Ecosystem integrations (LFJ/Trader Joe liquidity, Core Wallet features)
- Target: 5,000 active players

**Q4 2026 — Scale**
- Mobile port (Android first, iOS to follow)
- Dedicated Avalanche L1 for zero-gas gameplay
- In-house marketplace with 2.5% commission
- Community tournament creation tools
- Target: 15,000+ monthly active players

**2027 — Cross-Chain Gaming Studio**
- Cross-chain expansion to other EVM chains
- Console version exploration (Xbox/PlayStation)
- Second game title sharing $BATTLE token economy
- Vision: multi-title studio with unified on-chain economy
- 50,000 MAU | $200K-400K ARR from marketplace fees + season passes

**Visual:** Roadmap timeline with milestones

---

## SLIDE 14: THE TEAM & THE ASK

**Headline:** Built in 8 Days. Imagine What We'll Do With Support.

**Team:**
- Mark Barber — CEO, Product & Strategy
- PortSea Games — Unity Game Development
- Owolabi — Smart Contract Engineering
- Emmanuel — Backend Architecture
- Francis + Kenneth — Marketing & Community
- Declan — NFT Art Direction

**What We Need:**
- Technical guidance on Avalanche L1 migration for scalable gameplay
- BD introductions to Avalanche ecosystem (LFJ/Trader Joe, Core Wallet, Joepegs)
- Marketing support for mainnet launch and tournament series
- Grant funding: 40% product dev, 35% user acquisition, 15% partnerships, 10% ops

**Links:**
- Website: https://chainbois-true.vercel.app
- Faucet: https://chainbois-testnet-faucet.vercel.app
- GitHub: https://github.com/ChainBois
- X: https://x.com/ChainBois

**Visual:** Team photos/avatars + CTA
