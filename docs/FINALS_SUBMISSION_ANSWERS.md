# ChainBois — Build Games 2026 Finals Submission Answers

---

## 1. Pitch Recording & Slides

**Answer:**
[Link to Google Slides] | [Link to 7-min Video]

*(See FINALS_DEMO_SCRIPT.md for the full recording guide and FINALS_SLIDES_TEXT.md for all slide content)*

---

## 2. Project Summary

**Answer:**

ChainBois is a live, playable Web3 competitive shooter on Avalanche where player-owned NFTs evolve on-chain as you play. Your ChainBoi NFT levels up from Private to Field Marshal (8 ranks), each level unlocking 4 new characters in our Unity-based multiplayer game. 3 smart contracts (ERC-20 capped $BATTLE token + 2 ERC-721 NFTs), 50+ API endpoints, 10 automated cron jobs, and 258 passing tests — all deployed on Fuji testnet.

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
We need architecture review and guidance on migrating from C-Chain to a dedicated Avalanche L1. Since the Etna upgrade (Avalanche9000), launching a sovereign L1 is 99.9% cheaper — validators pay ~1.33 AVAX/month instead of staking 2,000 AVAX each. As we scale past 5K+ players, a gasless L1 with our own validator set would let us offer zero-gas gameplay while keeping true on-chain ownership. We'd love technical support from Ava Labs and AvaCloud on L1 design, custom gas tokens, and Interchain Messaging (ICM) for cross-chain $BATTLE bridging.

**BD & Ecosystem Introductions:**
- **Core Wallet** — We already use EIP-6963 wallet discovery; a native Core integration with its direct bank/card onramps would streamline onboarding for Avalanche-native players
- **LFJ (formerly Trader Joe) / Pharaoh** — $BATTLE liquidity pool on mainnet launch for token utility and price discovery
- **Joepegs / Campfire** — Featured collection placement for ChainBoi NFTs (our metadata is already EIP-4906 compliant and marketplace-ready)
- **Gaming-focused Avalanche projects** — Cross-promotions, shared tournament events, interoperable NFTs

**Marketing & Community Building:**
- Amplification for mainnet launch and first tournament series
- Access to Avalanche gaming community channels and events
- Co-branded content opportunities (blog features, Twitter Spaces, livestreams)

**Funding Allocation (if grant awarded):**
- 40% Product Development (mobile port, L1 migration, battle pass system)
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
- **258 tests passing** across all 7 implementation phases
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
- Note: All testnet activity is from our development and QA testing — we have not done a public testnet launch yet

**What This Means:**
We prioritized building a **complete, production-ready system** over inflating testnet numbers. Every feature — from the dynamic tokenomics engine to tournament auto-distribution to the anti-cheat with threat scoring — is implemented, tested, and running. The platform includes purchase failsafes, wallet health monitoring, daily solvency audits, and Discord webhook alerts for all critical events. We're not showing mockups; we're showing a live platform that's ready for mainnet deployment and real players.

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

**Q4 2026 — Scale & L1 Migration (Months 7-9)**
- Migrate to dedicated **Avalanche L1** for zero-gas gameplay
  - Custom gas token or gasless transactions
  - Own validator set (team + community)
  - Interchain Messaging (ICM) bridge for $BATTLE (C-Chain ↔ L1)
- In-house secondary marketplace (2.5% commission on NFT trades)
- Community tournament creation tools (user-organized competitive scene)
- Target: **15,000 MAU**, $150K+ monthly on-chain volume

**Q1 2027 — Expansion (Months 10-12)**
- Cross-chain expansion (other EVM chains via ICM bridges)
- Season 2 game content: new maps, modes, 30+ new weapons
- Player-created tournament brackets (community-run competitive scene)
- Target: **50,000 MAU**, **$200K-400K ARR** from:
  - Primary NFT sales (new seasons, limited editions)
  - Marketplace commission (2.5% on secondary trades)
  - Battle Pass revenue (seasonal purchases)
  - Tournament entry fees (premium tier)
  - Token sinks (weapon upgrades, cosmetics, name changes)

**Revenue Model at Scale:**
| Stream | Projected Annual Revenue |
|--------|------------------------|
| Primary NFT Sales | $50K-100K |
| Marketplace Fees (2.5%) | $50K-80K |
| Battle Pass (seasonal) | $50K-100K |
| Tournament Fees | $20K-50K |
| Token Sinks & Upgrades | $30K-70K |
| **Total ARR** | **$200K-400K** |

**Why Avalanche:**
- Sub-second finality for real-time game transactions
- Sovereign L1 architecture (post-Etna/Avalanche9000) for dedicated game infrastructure at 99.9% lower cost
- Proven gaming ecosystem: Off The Grid (13M+ users on GUNZ L1), MapleStory Universe (100M+ transactions on Henesys L1), BEAM gaming chain, FCHAIN
- Low gas costs on C-Chain for bootstrapping (further reduced by Octane upgrade), dedicated L1 for scaling

**The North Star:** Build the first Web3 competitive shooter where players' on-chain progression and economic activity is meaningful enough to sustain both the game AND the community long-term. Not play-to-earn — play-to-own.
