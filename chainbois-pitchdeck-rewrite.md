# ChainBois Pitch Deck — Rewrite

This document contains the rewritten content for each slide of the ChainBois pitch deck. The slide structure follows best practices for Web3 gaming pitch decks: 14 slides, story-driven, traction shown early, studio narrative throughout.

---

## SLIDE 1: Title

**ChainBois**
*The Web3 Gaming Studio Building Competitive Shooters on Avalanche*

- Play. Compete. Own Your Identity.
- Live on Avalanche Fuji Testnet | 7 Game Modes | 3 Smart Contracts | 50+ API Endpoints

[Logo + gameplay screenshot]

---

## SLIDE 2: The Problem

**Gaming's $200B Industry Has a Broken Ownership Model**

Every year, players collectively spend billions on in-game assets they will never own.

- **$230B+** spent annually on gaming — players own nothing. Progress is locked to centralized accounts that can be banned, reset, or shut down without recourse.
- **Web3 gaming hasn't fixed this.** Most blockchain games offer static NFT collectibles with no gameplay relevance, inflationary tokens that collapse in value, and gameplay so basic that players leave within days.
- **90% of gaming tokens** launched in 2025 failed to maintain value post-launch. Studios like Nyan Heroes (Solana, $11M raised) and Shatterline (Avalanche) shut down despite significant funding.

The missing piece: **a system where gameplay skill directly affects the value of digital assets.**

---

## SLIDE 3: The Solution — Playable Identity

**ChainBois Introduces Playable Identity**

Your character is not a static collectible. It is a living record of your competitive history.

Every ChainBoi NFT records:
- **Wins and kills** — on-chain game statistics
- **Tournament placements** — verifiable competitive ranking
- **Level progression** — 8 army ranks from Private to Field Marshal
- **Dynamic metadata** — NFT image, stats, and badge overlays update in real-time as you play

This creates three things no competitor offers:

1. **Skill-based asset value** — A Level 7 Field Marshal with 500 tournament wins is provably more valuable than a freshly minted character. Value comes from skill, not speculation.
2. **Tradeable progression** — Players can sell upgraded identities. New players can buy into a competitive advantage. A secondary market emerges around player skill.
3. **Long-term engagement** — Your character becomes a personal competitive asset with history and prestige. Players don't churn when their NFT carries their legacy.

---

## SLIDE 4: The Product — Live and Playable

**ChainBois: A Competitive Third-Person Shooter**

Built with Unity | Available on PC and Android | Live on Avalanche Fuji Testnet

**7 Game Modes:**
- Frontline | Team Deathmatch | Kill Confirmed | Gun Fight | Battle Royale | Capture the Flag | Search and Destroy

**What's Built and Deployed:**

| Component | Status |
|-----------|--------|
| Multiplayer game client (PC + Android APK) | Live |
| 3 smart contracts on Avalanche Fuji | Deployed & verified |
| Backend API with 50+ endpoints | Running in production |
| 9 automated cron jobs (tournaments, tokenomics, anti-cheat) | Active |
| Dynamic NFT metadata with on-chain levels | Working |
| Testnet faucet (2 NFTs + 8 weapons + 1,000 $BATTLE) | Live |
| Frontend with wallet connection | Deployed |
| 268 automated tests | Passing |

This is not a concept or whitepaper. This is a shipped product.

[Screenshots: gameplay, faucet page, Snowtrace contract verification]

---

## SLIDE 5: How It Works — Player Journey

**Download. Play. Own.**

```
1. DOWNLOAD          2. PLAY              3. OWN
   PC or Android        7 game modes         NFT characters
   No wallet needed     Earn points          Weapon NFTs
   Play as Web2 first   Anti-cheat scored    $BATTLE tokens

4. PROGRESS          5. COMPETE           6. TRADE
   Level up NFT         Weekly tournaments   Sell upgraded NFTs
   Unlock characters    Auto prize payout    Trade weapons
   Rank: Private→       AVAX + $BATTLE       Secondary market
   Field Marshal        prizes               creates value
```

**The key insight:** Players can start playing without any blockchain knowledge. The Web3 layer activates when they're ready — connect a wallet, claim assets, and everything they've earned carries over.

---

## SLIDE 6: Market Opportunity

**The Web3 Gaming Market Is $28-38B in 2025, Projected to Reach $117-183B by 2034**

- **Web3 gaming CAGR:** 19-33% depending on source (Precedence Research, Straits Research)
- **Mobile gaming:** 41-50% market share — ChainBois supports mobile from day one
- **Play-to-earn segment:** 42% of Web3 gaming market
- **Competitive shooters:** Consistently the most-played genre globally (CoD, Fortnite, Apex, Valorant)

**Our addressable market:**
- **TAM:** $38B global Web3 gaming market
- **SAM:** $5B Web3 competitive/shooter segment
- **SOM:** $50M — 50,000 active players spending an average of $1,000/year on NFTs, tokens, and tournament entries

**Why now:** Avalanche9000 reduced the cost of launching a gaming L1 from $300,000 to $3,000. Off The Grid proved Web3 shooters can hit mainstream (13M users). The infrastructure is ready; the market is waiting for games worth playing.

---

## SLIDE 7: Token Economy — $BATTLE

**Fixed Supply. Deflationary. Skill-Driven.**

| Property | Detail |
|----------|--------|
| Token | $BATTLE (ERC20Capped) |
| Total Supply | 10,000,000 (hard cap, immutable on-chain) |
| Minting | Impossible — supply permanently capped at deployment |
| Burn Mechanism | Automated: weapon purchases trigger periodic burns |
| Distribution | Dynamic rates auto-adjust based on rewards pool health |

**How $BATTLE flows:**

```
Players earn points → Convert to $BATTLE (dynamic rate)
                              ↓
         ┌──────────────────────────────────────┐
         ↓                                      ↓
   Buy weapons ($BATTLE)              Tournament prizes ($BATTLE + AVAX)
         ↓
   weapon_store wallet
         ↓
   Tokenomics sweep (every 6 hours)
         ↓
   ┌─────────────┬──────────────┐
   ↓             ↓
   BURN       RECYCLE to
   (10-50%)   rewards pool
              (50-90%)
```

**Dynamic Health Tiers:**

| Tier | Rewards Pool % | Conversion Rate | Burn Rate |
|------|---------------|-----------------|-----------|
| ABUNDANT | 75%+ | 1.0x | 50% |
| HEALTHY | 50-75% | 0.75x | 40% |
| MODERATE | 30-50% | 0.5x | 30% |
| SCARCE | 15-30% | 0.3x | 20% |
| CRITICAL | <15% | 0.15x | 10% |

**Why this matters:** Most Web3 games print infinite tokens and collapse under inflation. $BATTLE has a permanent cap and active burns. The more players play and buy weapons, the scarcer $BATTLE becomes. This is not theoretical — the burn mechanism is deployed and running on testnet today.

---

## SLIDE 8: Technical Architecture

**Modular. Scalable. Studio-Grade.**

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Unity Game  │    │   Frontend   │    │  Avalanche    │
│  PC + Mobile │◄──►│  Next.js 14  │───►│  C-Chain      │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                    │
       │ Firebase RTDB     │ REST API           │ RPC
       ▼                   ▼                    │
┌────────────────────────────────────────────────────┐
│              Backend API (Express.js)                │
│  50+ endpoints | 9 cron jobs | 5 encrypted wallets  │
│  Anti-cheat | Purchase failsafe | Dynamic tokenomics │
└────────────────────────┬───────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   MongoDB Atlas   Firebase RTDB   Cloudinary/IPFS
```

**Smart Contracts (Deployed on Fuji Testnet):**
- **BattleToken** — ERC20Capped, 10M fixed supply, burn function
- **ChainBoisNFT** — ERC-721, on-chain levels (0-7), EIP-4906 metadata events
- **WeaponNFT** — ERC-721, on-chain weapon names, 8 categories, 30 weapons

**Why this architecture scales across titles:** The backend infrastructure — dynamic tokenomics, wallet management, tournament automation, anti-cheat, purchase failsafes — is not game-specific. It is platform infrastructure. When we ship Title 2, it plugs into the same $BATTLE economy, the same wallet system, the same tournament engine.

---

## SLIDE 9: Traction & Proof of Execution

**What We've Shipped in 8 Days**

| Metric | Value |
|--------|-------|
| Smart contracts deployed | 3 (verified on Snowtrace) |
| API endpoints | 50+ across 13 route groups |
| Automated cron jobs | 9 (running in production) |
| Automated tests | 268 (all passing) |
| Game modes | 7 (playable on PC + Android) |
| NFTs minted on testnet | 50 ChainBois + 30 weapons |
| Platform wallets | 5 (AES-256 encrypted) |
| Testnet faucet | Live — claim 2 NFTs + 8 weapons + 1,000 $BATTLE |
| Documentation | 6 phase docs + Postman collections + system architecture |

**Live Links:**
- Frontend: chainbois-true.vercel.app
- Backend API: test-2.ghettopigeon.com/api/v1/health
- Testnet Faucet: chainbois-testnet-faucet.vercel.app
- GitHub: github.com/ChainBois

This was built by a lean team in 8 days. Builder drive is not a claim — it is visible in the commit history.

---

## SLIDE 10: Competitive Landscape

**How ChainBois Compares**

| Feature | ChainBois | Off The Grid | Shrapnel | Web2 Shooters |
|---------|-----------|-------------|----------|---------------|
| **On-chain progression (Playable Identity)** | Yes | No | No | No |
| **Deflationary token (auto-burn)** | Yes | No (buyback) | No | N/A |
| **Dynamic tokenomics (self-adjusting)** | Yes | No | No | N/A |
| **Free-to-play Web2 entry** | Yes | Yes | No | Yes |
| **Automated tournaments + prizes** | Yes | No | No | Partial |
| **NFTs reflect gameplay skill** | Yes | No (static loot) | No (UGC tools) | No |
| **Mobile + PC** | Yes | Yes | PC only | Varies |
| **Avalanche native** | Yes | Yes (GUNZ L1) | No (left for GalaChain) | No |
| **Team size** | Lean (<10) | 450+ | 100+ | 1,000+ |
| **Funding required** | Low | $30M+ | $37M+ | Billions |

**Key insight:** Off The Grid proved the market exists (13M users). Shrapnel proved the premium FPS market cares about ownership. ChainBois brings what both lack: **NFTs that evolve based on player skill, creating asset value from competition rather than cosmetics.**

---

## SLIDE 11: Go-to-Market Strategy

**Three Phases to 15,000 Active Players**

**Phase 1 — Crypto-Native Seed (Q2 2026)**
- Avalanche ecosystem activation (Frontrunners, Foundation grants, Build Games exposure)
- Launch tournament series with AVAX prize pools
- Discord-first community with level-gated channels
- 5-10 Avalanche KOL partnerships
- Target: 1,000 players

**Phase 2 — Competitive Community (Q3 2026)**
- Streamer tournament invitationals ($10K+ prize pools)
- Guild partnerships: Beam (60+ games), GuildFi (280K APAC), IndiGG (India)
- Referral system: limited-edition weapon NFT for recruiting 3 active players
- Play-to-airdrop quest campaign
- Target: 5,000 players

**Phase 3 — Mainstream Scaling (Q4 2026+)**
- Mobile optimization with regional servers
- Epic Games Store listing
- Battle Pass seasonal content
- Multi-title launch expands the player base across genres
- Target: 15,000+ players

**Growth Flywheel:** Player joins → plays → earns → buys weapons (burns $BATTLE) → levels up NFT → NFT gains value → shares progress → new player joins → repeat.

---

## SLIDE 12: Monetization

**Five Revenue Streams**

1. **Primary NFT Sales** — 4,000 ChainBoi mints + seasonal weapon collections
2. **Marketplace Fees** — 2.5% on all secondary trades (NFTs appreciate through gameplay)
3. **Token Sinks** — Weapon purchases, level-ups, chip draws (all burn or recycle $BATTLE)
4. **Tournament Revenue** — Premium tournament entries + brand sponsorships
5. **Multi-Title Expansion** — Each new title = new collections, new sinks, new marketplace volume

**Why it's sustainable:** Revenue comes from real economic activity (purchases, trades, competition), not from printing tokens. Fixed supply + active burns = structural scarcity.

---

## SLIDE 13: The Team

**CEO & Founder — Mark Barber**
[Photo]
Vision, strategy, and business development. Driving ChainBois from concept to competitive gaming ecosystem.

**Gaming Team — PortSea Games**
Unity game development, multiplayer engineering, 7 game modes across PC and Android.

**Blockchain Development**
- Owolabi Adeyemi — Smart contracts, Solidity, Hardhat, OpenZeppelin
- Emmanuel Agbavwe — Backend API, Node.js, MongoDB, Firebase integration, tokenomics engine

**Marketing**
- Francis Samuel Oche — Community building, social strategy
- Kenneth Umoekpe — Growth, partnerships, guild relations

**Artist — Declan O'Callahan**
NFT art generation (HashLips), character design, visual identity

**Social:** @chainbois | @chainboismc

---

## SLIDE 14: The Ask & What's Next

**What We're Building:**
A Web3 AAA gaming studio on Avalanche — starting with a competitive shooter, expanding to a multi-title franchise powered by $BATTLE and Playable Identity.

**What Grant Funding Accelerates:**

| Allocation | % | Purpose |
|------------|---|---------|
| Product Development | 40% | Game optimization, mobile scaling, netcode improvements, Title 2 R&D |
| User Acquisition | 35% | Tournament prize pools, streamer partnerships, guild scholarships, community campaigns |
| Ecosystem Partnerships | 15% | Avalanche L1 deployment, Beam integration, DEX liquidity, marketplace partnerships |
| Operations | 10% | Community management, tournament administration, infrastructure costs |

**ChainBois is already built. The grant takes it from testnet to ecosystem.**

- **Frontend:** chainbois-true.vercel.app
- **API:** test-2.ghettopigeon.com
- **Faucet:** chainbois-testnet-faucet.vercel.app
- **GitHub:** github.com/ChainBois
- **Contact:** contact@chainbois.com

---

## NOTES FOR PITCH DECK DESIGN

**Design Principles:**
- Dark theme with ChainBois brand colors (black, white, red from logo)
- Max 6 lines of text per slide, max 30 words per bullet
- Use the tables above as visual elements — designers can convert to infographics
- Every slide with a claim should have a supporting visual (screenshot, diagram, or data point)
- Gameplay screenshots on slides 1, 4, and 5
- Snowtrace verification screenshots on slide 9
- Architecture diagram on slide 8 should be a clean visual, not ASCII art

**Key narrative thread:** ChainBois is not a hackathon project. It is Title 1 from a gaming studio. Every piece of infrastructure (tokenomics, wallet management, tournament engine, anti-cheat) is designed to scale across multiple titles. The $BATTLE economy compounds with each new title — more games, more burns, scarcer token, more player value.
