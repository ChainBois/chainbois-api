# ChainBois — Post-Hackathon Roadmap

Features and improvements planned for after the Avalanche Build Games hackathon.

---

## Phase 2 — Shortly After Hackathon (Months 1-2, Mainnet Launch)

### Mainnet Deployment
- Deploy BattleToken, ChainBoisNFT, WeaponNFT to Avalanche C-Chain mainnet
- Mint 4,000 ChainBoi NFTs (public) + 32 reserved
- Launch $BATTLE token (potentially via APEX Burst / 314 token model)
- Fund platform wallets with real AVAX
- Migrate MongoDB data to production cluster

### Landing Page Enhancements
- **A7**: Platform statistics (total players, NFTs minted, tournaments played)
- **A8**: Leaderboard preview on landing page

### Training Room Additions
- **B6**: Tournament eligibility display per NFT
- **B7**: Character unlock progress tracker

### Battleground Improvements
- **C7**: Fully automated smart contract prize distribution (currently backend-managed)
- **C8**: Historical tournament data browser with filters

### Armory Expansion
- **D2**: Armor display and purchase system (new asset category)
- **D4-D6**: Loot box system — bronze/silver/gold/epic tiers with probability display and opening animation
- **D8**: ChainBoi Money balance display
- **D11**: $BATTLE → AVAX cash-out (sell tokens for AVAX via DEX integration or direct swap)

### Inventory Improvements
- **E3**: Auto-receive purchased assets from secondary markets (detect on-chain transfers)
- **E4**: Filter and search by weapon type, rarity, etc.
- **E5**: Full transaction history view (currently basic)

### Airdrop Expansion
- **G2**: NFT level-based airdrops (higher level = more $BATTLE)
- **G4**: Token-based airdrops (rewards based on $BATTLE holdings)
- **G7**: Airdrop tracking dashboard (view history of received airdrops per wallet)

### Game Integration
- **H1**: Web2 vs Web3 player selection UI in game launcher

### Merchandise
- **K1**: Merch page on website
- **K2**: CryptoLids integration for branded merchandise

---

## Phase 3 — Long-Term Roadmap (Months 3-6+)

### Token Economy Maturation
- **G5**: Refined burn mechanism (currently 10-50% dynamic, may add community governance for parameters)
- **G6**: Additional redistribution types (random airdrop triggers, timing randomization)
- Liquidity pool creation on TraderJoe / Pangolin
- Price oracle integration for dynamic pricing

### Onboarding & Accessibility
- **H6**: Normie (Web2) onboarding with platform-managed wallets (abstract wallet complexity)
- **J5**: Normie → Web3 upgrade flow (pay 120% floor price to get full ownership)

### Battle Pass System
- **I1**: Free battlepass (base weapon models, daily challenges, community events)
- **I2**: Premium battlepass (exclusive NFT assets, higher-rarity blueprints)
- **I3**: Seasonal themes (monthly themed content drops)
- **I4**: Raffle system (purchase battle passes with $BATTLE, raffle for upgrade chips)

### Advanced NFT Systems
- **J1**: Mythic upgrade system (5-level upgrade using chips: 150→250→500→700→900)
- **J2**: Upgrade chip draw (spend $BATTLE for probability-tiered chip drops)
- **J3**: Agent pool buyback (platform buys back NFTs at fixed prices for supply control)
- **J4**: Rerun mechanics (reintroduce popular assets at premium pricing)
- Advanced weapon tiers: Epic → Legendary → Mythic blueprints

### Marketplace
- **J6**: In-house secondary marketplace with commission structure (currently using Joepegs)

### Platform Growth
- **A9-A10**: News section and feature highlights on landing page
- Community governance (DAO for game parameters)
- Console game version
- Additional game landscapes and modes
- Cross-chain expansion (Solana, Base)

---

## Technical Debt & Improvements

### Known Issues to Address
- `metricsController.js`: `POST /compute` has no auth protection (potential DoS vector for expensive recomputation)
- `armoryRoutes.js`: Purchase endpoints should add `purchaseLimiter` middleware
- `config/cloudinary.js`: `initCloudinary()` not called from server.js startup

### Cleanup Opportunities
- Remove unused models/utils: `gameSessionModel.js`, `apiFeatures.js`, `formatUtils.js`
- Remove `mintBattleTokens` from contractUtils (BATTLE is fixed supply, only transfers)
- Add admin authentication (JWT pattern from reference projects) for admin-only endpoints
- Add comprehensive integration tests with real testnet interactions
- Add OpenAPI/Swagger spec for API documentation

### Performance & Scaling
- Add MongoDB read replicas for read-heavy endpoints (leaderboard, inventory)
- Implement response caching (Redis) for frequently-accessed data (settings, tournament list)
- Consider separate worker process for cron jobs instead of PM2 instance check
- Add database connection pooling optimization
- Implement proper health check that verifies MongoDB + Redis + Firebase connectivity

### Monitoring & Observability
- Add structured logging (JSON format) for log aggregation
- Add APM (Application Performance Monitoring)
- Add uptime monitoring and alerting
- Create Grafana dashboard for tokenomics metrics
- Add error tracking (Sentry or similar)

---

*Last updated: 2026-03-09*
