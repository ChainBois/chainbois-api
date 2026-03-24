# ChainBois — Build Games 2026 Finals Submission Answers

---

## 1. Pitch Recording & Slides

**Answer:**
[Link to Google Slides] | [Link to 7-min Video]

*(See FINALS_DEMO_SCRIPT.md for the full recording guide and FINALS_SLIDES_TEXT.md for all slide content)*

---

## 2. Project Summary

**Answer:**

ChainBois is a live, playable Web3 competitive shooter on Avalanche where player-owned NFTs evolve on-chain as you play. Your ChainBoi NFT levels up from Private to Field Marshal (8 ranks), each level unlocking 4 new characters in our Unity-based multiplayer game. 3 smart contracts (ERC-20 capped $BATTLE token + 2 ERC-721 NFTs), 50+ API endpoints, 10 automated cron jobs, and 268 passing tests — all deployed on Fuji testnet.

Players earn points through gameplay, convert them to $BATTLE tokens at dynamic rates, buy weapons in the Armory, and compete in tiered tournaments for auto-distributed AVAX and $BATTLE prizes. The economy is genuinely deflationary — a fixed 10M token supply with periodic on-chain burns and a 5-tier health system that self-balances to prevent depletion.

Built in 8 days. Everything is live.

**Website:** https://chainbois-true.vercel.app
**Testnet Faucet:** https://chainbois-testnet-faucet.vercel.app
**GitHub:** https://github.com/ChainBois
**X (Twitter):** https://x.com/ChainBois
**API (Live):** https://test-2.ghettopigeon.com/api/v1/health

**Team:** Mark Barber (CEO/Product), PortSea Games (Unity dev), Owolabi (Smart Contracts), Emmanuel (Backend), Francis + Kenneth (Marketing), Declan (NFT Art)

---

## 3. What type of support do you need to succeed?

**Answer:**

**Technical Guidance (Highest Priority):**
We need architecture review and guidance on migrating from C-Chain to a dedicated Avalanche Subnet. As we scale past 5K+ players, gas costs from level-ups, weapon purchases, and tournament prize distributions will compound. A gasless Subnet with our own validator set would let us offer zero-gas gameplay while keeping true on-chain ownership. We'd love technical support from Ava Labs on Subnet design, custom gas tokens, and cross-chain bridging for $BATTLE.

**BD & Ecosystem Introductions:**
- **Core Wallet** — We already use EIP-6963 wallet discovery; a native Core integration would streamline onboarding for Avalanche-native players
- **Trader Joe / Pharaoh** — $BATTLE liquidity pool on mainnet launch for token utility and price discovery
- **Joepegs / Campfire** — Featured collection placement for ChainBoi NFTs (our metadata is already EIP-4906 compliant and marketplace-ready)
- **Gaming-focused Avalanche projects** — Cross-promotions, shared tournament events, interoperable NFTs

**Marketing & Community Building:**
- Amplification for mainnet launch and first tournament series
- Access to Avalanche gaming community channels and events
- Co-branded content opportunities (blog features, Twitter Spaces, livestreams)

**Funding Allocation (if grant awarded):**
- 40% Product Development (mobile port, Subnet migration, battle pass system)
- 35% User Acquisition (tournament prize pools, influencer partnerships, community incentives)
- 15% Ecosystem Partnerships (liquidity provision, marketplace integrations)
- 10% Operations (infrastructure, monitoring, security audits)

---

## 4. Live player metrics & traction

**Answer:**

We're transparent about where we are: ChainBois was built in 8 days for this hackathon and is currently on **Fuji testnet**, so we don't have mainnet DAU/retention metrics yet. Here's what we DO have that demonstrates real product traction:

**Build Traction (What Exists & Works):**
- **3 smart contracts** deployed and verified on Fuji (BattleToken, ChainBoisNFT, WeaponNFT)
- **50+ ChainBoi NFTs** minted to platform wallets, actively claimable via faucet
- **13 weapon NFTs** across 8 categories, purchasable with $BATTLE
- **10M $BATTLE tokens** minted (ERC20Capped — hard cap enforced on-chain)
- **50+ API endpoints** live and tested
- **268 tests passing** across all 7 implementation phases
- **10 cron jobs** running continuously (score sync, tournaments, tokenomics sweeps, wallet health, platform audits)
- **Testnet faucet** distributing starter packs (2 NFTs + 8 weapons + 1,000 $BATTLE per wallet)
- **Full frontend** deployed on Vercel with wallet connect, training room, armory, inventory, battleground
- **7 tournament tiers** configured and cycling automatically

**On-Chain Activity (Fuji Testnet):**
- All contract interactions verifiable on Snowtrace:
  - BattleToken: `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0`
  - ChainBoisNFT: `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b`
  - WeaponNFT: `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d`
- NFT minting, token transfers, level-ups, weapon purchases — all on-chain and verifiable

**Technical Readiness Metrics:**
- Full tokenomics engine with dynamic health tiers (tested and running)
- Anti-cheat system with threat scoring, velocity checks, auto-bans
- Purchase failsafe with auto-retry and auto-refund
- Wallet health monitoring with auto-funding
- Daily platform solvency audits
- Real-time Discord webhook notifications for all critical events

**What This Means:**
We prioritized building a **complete, production-ready system** over inflating testnet numbers. Every feature — from the burn mechanism to tournament auto-distribution to the anti-cheat — is implemented, tested, and running. We're not showing mockups; we're showing a live platform that's ready for mainnet deployment and real players.

---

## 5. 12-month vision

**Answer:**

**Q2 2026 — Mainnet Launch & Seed Community (Months 1-3)**
- Deploy all 3 contracts to Avalanche C-Chain mainnet
- Mainnet faucet → paid NFT sales (0.5-2 AVAX per ChainBoi, 20-50 $BATTLE per weapon)
- Launch inaugural tournament series with real AVAX prize pools
- Loot box system (Bronze/Silver/Gold/Epic tiers — randomized weapon drops)
- Battle Pass v1 (free + premium track, seasonal themes)
- Target: **1,000 monthly active players**, 500+ NFTs sold, 5,000+ on-chain transactions

**Q3 2026 — Competitive Community & Economy (Months 4-6)**
- PvP ranked mode with seasonal ELO ratings
- Mythic weapon upgrade path (5 levels: 150→250→500→700→900 $BATTLE each tier)
- Ecosystem integrations:
  - $BATTLE liquidity pool on Trader Joe
  - Featured collection on Joepegs
  - Core Wallet native integration
- Weekly sponsored tournaments with partner prize pools
- Mobile port (Android first, iOS to follow)
- Target: **5,000 MAU**, $50K+ in on-chain transaction volume/month, 2 ecosystem partnerships live

**Q4 2026 — Scale & Subnet (Months 7-9)**
- Migrate to dedicated **Avalanche Subnet** for zero-gas gameplay
  - Custom gas token or gasless transactions
  - Own validator set (team + community)
  - Cross-chain bridge for $BATTLE (C-Chain ↔ Subnet)
- In-house secondary marketplace (2.5% commission on NFT trades)
- DAO governance for tournament rules, economy parameters, and community proposals
- Console exploration (Xbox/PlayStation partnership discussions)
- Target: **15,000 MAU**, $150K+ monthly on-chain volume

**Q1 2027 — Expansion (Months 10-12)**
- Cross-chain expansion (other EVM chains via bridges)
- Season 2 game content: new maps, modes, 30+ new weapons
- Player-created tournament brackets (community-run competitive scene)
- ChainBois SDK: let other games integrate our NFT/token economy
- Target: **50,000 MAU**, **$500K+ ARR** from:
  - Primary NFT sales (new seasons, limited editions)
  - Marketplace commission (2.5% on secondary trades)
  - Battle Pass revenue (seasonal purchases)
  - Tournament entry fees (premium tier)
  - Token sinks (weapon upgrades, cosmetics, name changes)

**Revenue Model at Scale:**
| Stream | Projected Annual Revenue |
|--------|------------------------|
| Primary NFT Sales | $100K-200K |
| Marketplace Fees (2.5%) | $100K-150K |
| Battle Pass (seasonal) | $100K-150K |
| Tournament Fees | $50K-75K |
| Token Sinks & Upgrades | $50K-100K |
| **Total ARR** | **$400K-675K** |

**Why Avalanche:**
- Sub-second finality for real-time game transactions
- Subnet architecture for dedicated game infrastructure at scale
- Growing gaming ecosystem (DeFi Kingdoms, Shrapnel, Off The Grid proved the market)
- Low gas costs on C-Chain for bootstrapping, Subnet for scaling

**The North Star:** Build the first Web3 competitive shooter where players' on-chain progression and economic activity is meaningful enough to sustain both the game AND the community long-term. Not play-to-earn — play-to-own.
