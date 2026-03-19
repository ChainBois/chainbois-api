## Stage 3: GTM & Vision Submission Form — ChainBois (Avalanche Build Games 2026)

**1. Question:** Product Vision
**Suggestion/Placeholder:** What is your project's ultimate goal? Where do you see it in 1-2 years?

**Answer:**

ChainBois is building a Web3 AAA gaming studio on Avalanche — not a single game, but a franchise of competitive titles powered by a shared on-chain economy.

Our first title is a multiplayer third-person shooter with a complete MVP live on Fuji Testnet: 7 game modes, NFT character progression, a deflationary $BATTLE token, automated tournaments, and a fully operational backend with 258 passing automated tests and 10 cron jobs running continuously in production. This game proves our core thesis: that blockchain should make gaming more valuable, not more complicated.

**Playable Identity** is the concept at the center of everything we build. Your ChainBoi NFT is not a static JPEG — it is a living record of your competitive career. Our IPFS-pinned badge overlay system is live: when a player levels up, badge images are dynamically generated via Cloudinary transformations, permanently pinned to IPFS, and the Cloudinary source is deleted after. The on-chain metadata is always current — our `buildCurrentTraits()` system reconstructs the full trait set (Level, Rank, Kills, Score, Games Played) from live data on every API response, so no stale data ever reaches the frontend or marketplace. Weapons have their own metadata endpoint with full trait resolution. Every kill, every tournament win, every rank-up is permanently part of your on-chain identity.

In 1-2 years, we see ChainBois as:

- **A multi-title gaming studio** where $BATTLE and ChainBoi NFTs carry value across games — your rank, weapons, and Playable Identity travel with you between titles
- **A competitive gaming ecosystem on Avalanche** running recurring prize tournaments across multiple game modes and titles, with automated on-chain prize distribution
- **A reference implementation for sustainable Web3 gaming economics** — our dynamic tokenomics system (5 health tiers, auto-burn, self-regulating conversion rates) is studio-level infrastructure already running in production and scales across every future title we ship
- **An Avalanche L1 operator** — as our player base grows, we plan to deploy a dedicated ChainBois L1 (leveraging Avalanche9000's 100x cost reduction) for gas-free gameplay transactions and instant finality

The long-term vision is to become the competitive gaming home on Avalanche — a studio where players own their progression, skill determines asset value, and every title adds demand pressure to a fixed-supply, deflationary token economy.

---

**2. Question:** Milestones & Roadmap
**Suggestion/Placeholder:** Outline your key development and growth milestones for the next 6-12 months.

**Answer:**

**Q2 2026 (April - June) — Early Access Launch**
- Smart contracts already deployed on Fuji Testnet (BattleToken, ChainBoisNFT, WeaponNFT) — mainnet deployment is a configuration change, not a rebuild
- MVP backend complete: 258 automated tests passing, 10 cron jobs running continuously (including auto-replenishment), training room badge system live with IPFS-pinned overlays
- Frontend integration actively underway — all API endpoints documented with Postman collections per phase
- Deploy to Avalanche C-Chain Mainnet, mint full 4,032 ChainBoi NFT collection (4,000 public + 32 reserved)
- Launch $BATTLE token with initial DEX liquidity on Trader Joe
- Run first mainnet tournament series with real AVAX + $BATTLE prizes
- Target: 1,000 active players, 500 NFT holders

**Q3 2026 (July - September) — Community Growth & Competitive Scene**
- Launch Battle Pass system (free + premium tiers with seasonal content)
- Implement armor/equipment layer and loot box system
- Partner with 2-3 Avalanche gaming guilds (Beam ecosystem, GuildFi) for scholarship programs
- Launch streamer tournament program — invite competitive gaming content creators for prize events
- Integrate $BATTLE → AVAX cashout via Trader Joe DEX
- Implement in-house secondary marketplace for NFT and weapon trading (2.5% platform fee)
- Target: 5,000 active players, 2,000 NFT holders, 100+ daily marketplace transactions

**Q4 2026 (October - December) — Platform Scaling & Studio Expansion**
- Deploy dedicated ChainBois Avalanche L1 for gas-free gameplay transactions
- Launch mobile-optimized build with improved netcode and regional servers
- Begin development of Title 2 (new genre, same $BATTLE economy and cross-title NFT utility)
- Implement community governance (DAO) for tournament parameters and game direction
- Launch referral system with NFT rewards for player acquisition
- Target: 15,000 active players, 5,000 NFT holders, functioning L1

**Q1-Q2 2027 — Multi-Title Studio**
- Launch Title 2 early access (sharing $BATTLE economy with ChainBois shooter)
- Cross-title NFT utility: ChainBoi characters usable as avatars/assets across titles
- Mythic upgrade system and advanced weapon tiers
- Console port exploration (PlayStation, Xbox)
- Target: 30,000+ active players across titles

---

**3. Question:** Target User Personas
**Suggestion/Placeholder:** Who are you building for? Be specific.

**Answer:**

We are building for three distinct personas, acquired in sequence. The game is already playable on testnet with 7 game modes, and Web2 players can play immediately without a wallet — blockchain features unlock when they choose to connect.

**Persona 1: The Crypto Gamer (Launch audience)**
Profile: 18-35 year old male, already holds crypto (likely AVAX, ETH, or SOL), active on Discord and Twitter/X, has played at least one Web3 game and was disappointed by the gameplay quality. Currently plays competitive shooters (Valorant, Apex, Warzone) in Web2 but wants a Web3 alternative that doesn't feel like a downgrade. Has a Core Wallet or MetaMask, trades on Trader Joe or a CEX.
What they want: A game that's actually fun AND gives them real ownership. They're tired of Web3 games that are either boring clickers or vaporware. They want skill-based competition where winning has financial upside.
How we reach them: Avalanche community channels, crypto gaming Discords, Twitter/X KOLs, Avalanche Frontrunners program, Build Games exposure.

**Persona 2: The Competitive FPS Player (Growth audience)**
Profile: 16-30 year old, plays Call of Duty, Apex Legends, Valorant, or Fortnite regularly. May have heard of crypto but hasn't used it for gaming. Values skill-based ranking, competitive integrity, and prestige. Spends money on battle passes and skins in Web2 games.
What they want: A competitive shooter with real stakes — tournaments with actual prizes, assets they truly own and can sell, and a progression system where their skill is reflected in their digital identity.
How we reach them: Streamer tournaments, YouTube/TikTok gameplay content, gaming subreddits, Epic Games Store listing (post-mainnet), word-of-mouth from Persona 1.

**Persona 3: The Mobile-First Casual Gamer (Scale audience)**
Profile: 18-40 year old, primarily plays on mobile, casual gaming sessions (15-30 min). May be in regions where play-to-earn has strong appeal (Southeast Asia, Latin America, Africa). Values low barrier to entry and earning potential.
What they want: Download a game, play for free, earn something. Zero blockchain knowledge required. Web2 players can jump in immediately — no wallet, no setup — and the game auto-detects their scores.
How we reach them: Mobile app stores, guild scholarship programs (GuildFi, IndiGG for India/SEA markets), social referral programs, Web2 ad spend on mobile gaming channels.

---

**4. Question:** Player Acquisition Strategy
**Suggestion/Placeholder:** How will you get your first 1,000 users?

**Answer:**

Our player acquisition strategy follows a three-phase funnel, targeting 1,000 active players within the first 60 days of mainnet launch:

**Phase 1: Crypto-Native Seed (Days 1-30) — Target: 500 players**

- **Avalanche Build Games Exposure:** ChainBois is already part of Build Games 2026. This program puts us in front of the Avalanche ecosystem's most active builders, investors, and community members.
- **Testnet Claim Page Already Live:** Our faucet and NFT claim page is operational on testnet, with 8 downloads already tracked. These users become first mainnet players — they already have the game installed and understand the mechanics.
- **Discord-First Community:** Build an engaged Discord with level-gated channels, exclusive early access, and direct developer interaction. Run daily challenges and community events.
- **Twitter/X Growth Loop:** Daily content showing gameplay clips, tournament highlights, and NFT evolution moments. Partner with 5-10 Avalanche-native KOLs (micro-influencers with 5K-50K followers) for authentic gameplay promotion.
- **Launch Tournament Series:** $5,000 AVAX prize pool launch tournament to create competitive urgency and attract crypto gamers.

**Phase 2: Competitive Community (Days 30-60) — Target: 500 more players**

- **Streamer Tournaments:** Invite 10-20 gaming content creators (mix of crypto and traditional gaming streamers) for a $10,000 prize pool invitational tournament, streamed live. Each streamer brings their audience.
- **Referral System with NFT Rewards:** Players earn a limited-edition weapon NFT for every 3 friends who reach Level 2. Creates organic growth loop — each active player recruits 1-3 more.
- **Guild Partnerships:** Partner with Beam (60+ games on Avalanche subnet), GuildFi (280K APAC members), and IndiGG (India's 500M gamer market) for scholarship programs — guilds provide players, we provide the game and earning infrastructure.
- **Play-to-Airdrop Campaign:** Structured quest system: follow socials → download game → reach Level 3 → connect wallet → eligible for $BATTLE airdrop. Each step filters for real players, not bots.

**Phase 3: Sustained Growth (Ongoing)**

- **Weekly Tournament Cycle:** 7 tournament tiers running continuously with auto-distributed prizes create a recurring reason to play and compete.
- **Secondary Market Flywheel:** As high-performing NFTs gain value on marketplaces (Joepegs), new players enter to compete for character progression — creating organic demand.
- **Content Machine:** Encourage user-generated content — gameplay clips, tournament highlights, NFT evolution showcases — by featuring community content on official channels.

**Growth Loop:** Player joins → plays → earns points → converts to $BATTLE → buys weapon (triggers burn) → weapon makes them more competitive → they level up NFT → NFT gains value → they share their progress → new player sees it → new player joins.

---

**5. Question:** Community & Guild Strategy
**Suggestion/Placeholder:** How will you build and engage your community? Do you have plans to work with gaming guilds?

**Answer:**

**Community Building: Discord as the Command Center**

Our community strategy centers on Discord as the primary engagement hub, designed to reward active participation:

- **Level-Gated Channels:** As players level up their ChainBoi NFTs (0-7), they unlock exclusive Discord channels. Field Marshal (Level 7) holders get access to a private strategy channel and early access to new features. This mirrors the in-game progression and creates aspirational engagement.
- **Tournament Discord Integration:** Discord webhook infrastructure is built and ready — live tournament leaderboard feeds, real-time winner announcements, and prize distribution notifications visible to the entire community. Creates spectator engagement even when not playing.
- **Developer Transparency:** Weekly "State of ChainBois" updates in Discord. Open development roadmap with community input on feature prioritization. Bug bounty program for community-discovered issues.
- **Community Events:** Weekly AMA sessions with the development team. Community-organized scrimmages with custom rules. Art contests for NFT design input on future collections.

**Guild Strategy: Three-Tier Partnership Model**

1. **Tier 1 — Avalanche-Native Guilds (Beam Ecosystem)**
   Beam (formerly Merit Circle) operates 60+ games on their Avalanche subnet. We will integrate with the Beam ecosystem for cross-promotion, shared player base, and potential listing on Beam Hub. This gives us immediate access to the largest organized gaming community on Avalanche.

2. **Tier 2 — Regional Guilds for Market Expansion**
   - **GuildFi** (280,000+ APAC members): Scholarship model where guilds provide NFTs to players who can't afford the initial investment, taking a share of earnings.
   - **IndiGG** (India focus): Access to India's 500M+ mobile gamer market. Scholarship programs for mobile players.
   - **Ancient8** (Vietnam/SEA): Infrastructure-level partnership — they provide onboarding tools and player acquisition, we provide the game.

3. **Tier 3 — Competitive Guild Leagues**
   Create guild-specific tournaments where guilds compete against each other for prize pools. Guild leaderboards with seasonal rankings. This turns guilds from passive player suppliers into active competitive organizations with skin in the game.

**Guild-Specific Features (Post-Mainnet):**
- Guild tags visible in-game and on NFT metadata
- Guild treasury wallets for shared prize management
- Guild leaderboards with tier-based rewards
- Scholarship management tools (guild leaders can delegate NFTs to scholars with automated earning splits)

---

**6. Question:** Monetization Model
**Suggestion/Placeholder:** How will the project sustain itself?

**Answer:**

ChainBois has five revenue streams, designed to grow with the player base and remain sustainable without relying on speculative token appreciation:

**1. Primary NFT Sales (Launch Revenue)**
- 4,000 public ChainBoi NFT mints at launch price (target: 2 AVAX each = ~$80,000 at current prices)
- Seasonal weapon collections and limited-edition character drops
- Battle Pass NFTs with exclusive cosmetics and weapons

**2. Marketplace Transaction Fees (Recurring Revenue)**
- 2.5% platform fee on all secondary market trades through our in-house marketplace
- As NFTs gain value through gameplay progression (Playable Identity), secondary volume increases
- Higher-level ChainBois with strong competitive records command premium prices, driving volume

**3. Token Economy Sinks (Deflationary Mechanics)**
- Weapon purchases in $BATTLE: revenue split between permanent burn (10-50%, dynamic) and rewards pool recycling
- Level-up fees in AVAX: directed to prize pool wallet for tournament prizes
- Points-to-$BATTLE conversion: dynamic rates based on health tier ensure the rewards pool is never depleted
- Future: chip draws for mythic upgrades (probability-based $BATTLE sink)

**4. Tournament Entry & Sponsorship (Competitive Revenue)**
- Premium tournament tiers with entry fees (portion to prize pool, portion to platform)
- Sponsored tournaments: brands/projects pay to sponsor prize pools in exchange for in-game visibility
- Esports event ticketing and streaming rights (long-term)

**5. Multi-Title Expansion (Studio Revenue)**
- Each new title adds new NFT collections, new token sinks, and new marketplace volume
- Shared $BATTLE economy means Title 2 launch creates new demand for existing tokens
- Studio-level IP licensing for merchandise and media

**Why This Is Sustainable — And Already Running:**
Unlike most Web3 games that rely on continuous token emissions (inflationary death spiral), ChainBois has a FIXED 10M $BATTLE supply that is actively deflationary. Revenue comes from real economic activity (purchases, trades, tournament fees), not from printing new tokens. The dynamic tokenomics system is live and operational: a 6-hourly sweep job moves weapon purchase revenue from the weapon_store wallet, splits it between permanent burn and rewards pool recycling, with rates determined by 5 health tiers (ABUNDANT/HEALTHY/MODERATE/SCARCE/CRITICAL). 10 cron jobs run continuously handling tokenomics sweeps, wallet health monitoring, platform audits, score syncing, tournament lifecycle, inventory replenishment, and more. This is not a whitepaper — it is running infrastructure. The more players play, the more $BATTLE is burned, creating natural scarcity without artificial inflation.

---

**7. Question:** Competitive Landscape
**Suggestion/Placeholder:** Who are your top 3 competitors and what makes you different?

**Answer:**

**Top 3 Competitors:**

| | Off The Grid | Shrapnel | Traditional Shooters (CoD, Apex, Valorant) |
|---|---|---|---|
| **Chain** | Avalanche (GUNZ L1) | GalaChain (left Avalanche) | None |
| **Genre** | Extraction Battle Royale | Extraction FPS | Various competitive FPS |
| **Studio Size** | 450+ employees | ~100+ employees | 1,000+ employees |
| **Funding** | $30M+ (Animoca, Republic) | $37M+ (Gala, Polychain) | Billions (Activision, EA, Riot) |
| **NFT Model** | Cosmetic loot extraction | Creator tools + UGC | No ownership |
| **Token** | $GUN (10B supply, dropped 60% post-launch) | $SHRAP (migrated chains) | None |
| **On-chain Progression** | No (NFTs are static loot) | No (NFTs are creator assets) | No (locked in account) |
| **Deflationary Economics** | No (buyback model, not burn) | No | N/A |
| **Player Asset Value from Skill** | No | No | No |

**The Web3 Shooter Graveyard Is Growing:**
Off The Grid launched to 13M users but $GUN dropped 60% post-launch — massive scale, unsustainable economics. Shatterline shut down in 2025. Nyan Heroes shut down in 2025. Both had significant funding ($11M+). The pattern is clear: big studios raise big money, ship games with inflationary tokenomics, and collapse when emission schedules outpace demand. ChainBois is designed from day one to avoid this trap.

**What Makes ChainBois Different — Playable Identity:**

Our core differentiator is that **gameplay skill directly affects NFT value**. In ChainBois, your character NFT records your wins, kills, tournament placements, and rank progression on-chain via IPFS-pinned badge overlays and always-current trait metadata. A Level 7 Field Marshal ChainBoi with 500 tournament wins is provably more valuable than a freshly minted one — and that value was created by player skill, not RNG.

No competitor does this:
- **Off The Grid** has impressive scale but NFTs are static cosmetic loot items. A weapon doesn't get better because you played well with it. And $GUN's 60% price drop shows that scale without sustainable economics is a ticking clock.
- **Shrapnel** focuses on creator tools and UGC — players create maps and mods, not competitive progression. Left Avalanche for GalaChain.
- **Traditional shooters** trap all progression inside accounts. A Global Elite CSGO account's value is locked — you can't sell your rank as an NFT.

**Additional Competitive Advantages:**

1. **Deflationary token design that is live and running.** $BATTLE has a hard cap of 10M tokens (ERC20Capped) with active burn mechanics executing on a 6-hourly cycle. $GUN has 10B supply and dropped 60%. Our fixed supply + automated burns create structural scarcity. The more players play, the scarcer $BATTLE becomes.

2. **Automated tournament infrastructure.** 10 cron jobs handling tournament lifecycle, prize distribution, score validation, tokenomics sweeps, inventory replenishment, and anti-cheat — all without manual intervention. This scales to thousands of concurrent tournaments.

3. **Web2-to-Web3 bridge.** Players can download and play without a wallet. Web2 scores are auto-detected and tracked. The blockchain layer is optional but compelling. This eliminates the onboarding friction that kills most Web3 games.

4. **Studio-level infrastructure on Avalanche.** Our backend architecture (dynamic tokenomics with 5 health tiers, wallet management, purchase failsafes, anti-cheat, 258 automated tests) is not game-specific — it's platform infrastructure that scales across multiple titles. ChainBois is Title 1 from a gaming studio, not a standalone project.

5. **Cost-efficient positioning.** Off The Grid raised $30M+ and has 450 employees. Shrapnel raised $37M+. Nyan Heroes raised $11M and shut down. Shatterline shut down. ChainBois ships with a lean team and sustainable economics — we don't need $30M to survive, we need players who play. Our dynamic tokenomics ensures the economy self-corrects before it can death-spiral.
