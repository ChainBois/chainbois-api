# Phase 3: Training Room + Rarity + Airdrops Architecture

## What Phase 3 Implements

Phase 3 is the **NFT progression and metadata layer**. It connects five systems:
1. **Avalanche C-Chain (Fuji)** - On-chain level storage (`setLevel`/`getLevel`), ownership verification, AVAX payment verification
2. **MongoDB** - ChainBoi NFT records (traits, stats, badges), rarity scores, trait airdrop pools
3. **Cloudinary** - Dynamic badge overlay images (rank medals composited onto NFT art)
4. **Firebase** - Auth (token verification for training routes) + RTDB (game data sync after level-up)
5. **Glacier API** - Metadata reindex trigger after on-chain level changes (EIP-4906)

Phase 3 also introduces the **rarity scoring system** and **trait-based $BATTLE airdrops**, which reward holders based on NFT trait rarity.

---

## Component Overview

```
+-----------------------------------------------------------------+
|                     Express App (app.js)                         |
|                                                                  |
|  Phase 3 Routes:                                                 |
|  /api/v1/training/*   -> trainingRoomRoutes.js  (decodeToken)   |
|  /api/v1/metadata/*   -> metadataRoutes.js      (public, CORS *)|
|  /api/v1/airdrop/*    -> airdropRoutes.js       (mixed auth)    |
|                                                                  |
|  Cron Jobs (server.js, PM2 primary only):                        |
|  - traitAirdropJob    -> Wednesdays 8 PM UTC                    |
+-----------------------------------------------------------------+
```

---

## Directory Structure (Phase 3 additions)

```
chainbois-api/
├── controllers/
│   ├── trainingController.js   # NFT listing, detail, level-up, cost, eligibility
│   ├── metadataController.js   # Dynamic ERC-721 metadata endpoint (public)
│   └── airdropController.js    # Rarity leaderboard, trait pools, distribution
├── routes/
│   ├── trainingRoomRoutes.js   # 5 training endpoints (all require decodeToken)
│   ├── metadataRoutes.js       # 1 public endpoint for NFT metadata
│   └── airdropRoutes.js        # 4 public + 3 admin endpoints
├── services/
│   └── rarityService.js        # Rarity scoring engine + trait population
├── jobs/
│   └── traitAirdropJob.js      # Weekly cron: random trait-based $BATTLE distribution
├── models/
│   ├── chainboiNftModel.js     # Extended: level, badge, inGameStats, traits
│   ├── nftRarityModel.js       # Rarity scores, ranks, tiers, percentiles
│   ├── nftTraitModel.js        # Flattened trait fields per NFT (for airdrop queries)
│   ├── traitModel.js           # Unique trait type+value combos with used/unused flag
│   └── traitsPoolModel.js      # Airdrop pool config + distribution history
├── utils/
│   └── cloudinaryUtils.js      # Badge overlay URL builder + upload helpers
├── config/
│   └── cloudinary.js           # Cloudinary SDK initialization
└── assets/
    └── nft-collection/
        ├── images/             # NFT art PNGs (uploaded to Cloudinary)
        ├── metadata/           # Static ERC-721 JSON (fallback for metadata endpoint)
        └── badges/             # Rank badge PNGs (uploaded to Cloudinary)
```

---

## Data Flow Diagrams

### Level-Up Flow

```
Frontend                          API                           Blockchain
   |                               |                               |
   | GET /training/level-up/cost   |                               |
   | ?tokenId=5                    |                               |
   |------------------------------>|                               |
   |                               | getLevel(5) on-chain         |
   |                               |------------------------------>|
   |                               |<---- level: 2 ----------------|
   |                               | Look up cost for level 3      |
   |<--- { cost: 0.003 AVAX } ----|                               |
   |                               |                               |
   | User sends 0.003 AVAX to     |                               |
   | prize_pool via Thirdweb      |                               |
   |------------------------------------------------------------->|
   |<--- txHash: 0xabc...         |                               |
   |                               |                               |
   | POST /training/level-up      |                               |
   | { tokenId: 5, txHash: 0x... }|                               |
   |------------------------------>|                               |
   |                               | 1. Verify Firebase token      |
   |                               | 2. Find user by uid           |
   |                               | 3. Replay protection (txHash) |
   |                               | 4. Verify ownership on-chain  |
   |                               |------------------------------>|
   |                               |<---- owner matches user ------|
   |                               | 5. Verify AVAX payment        |
   |                               |------------------------------>|
   |                               |<---- to=prize_pool, amt ok ---|
   |                               | 6. setLevel(5, 3) via deployer|
   |                               |------------------------------>|
   |                               |<---- success + txHash ---------|
   |                               | 7. Update MongoDB (user+NFT)  |
   |                               | 8. Sync to Firebase RTDB      |
   |                               | 9. Record Transaction         |
   |                               | 10. Trigger metadata reindex  |
   |<--- { newLevel: 3,          |                               |
   |       rank: "Captain",       |                               |
   |       characters: [...] } ---|                               |
```

### Dynamic Metadata Flow

```
Marketplace/Explorer              API                     MongoDB + Chain
       |                           |                           |
       | GET /metadata/5.json      |                           |
       |-------------------------->|                           |
       |                           | 1. getLevel(5) on-chain  |
       |                           |-------------------------->|
       |                           |<--- level: 3 -------------|
       |                           | 2. Query ChainboiNft #5   |
       |                           |    (traits, inGameStats)   |
       |                           |-------------------------->|
       |                           |<--- { traits, stats } ----|
       |                           | 3. Build Cloudinary URL    |
       |                           |    with captain badge      |
       |                           | 4. Build ERC-721 JSON      |
       |<--- {                     |                           |
       |  name: "ChainBoi #5",    |                           |
       |  image: "cloudinary/...", |                           |
       |  attributes: [            |                           |
       |    { Level: 3 },          |                           |
       |    { Rank: "Captain" },   |                           |
       |    { Kills: 42 }, ...     |                           |
       |  ]                        |                           |
       | } ----------------------->|                           |
```

The metadata endpoint is **public** (no auth, CORS set to `*`) because marketplaces, explorers, and Glacier need to access it. The on-chain `tokenURI()` points here.

### Trait Airdrop Flow

```
Weekly Cron (Wed 8 PM UTC)         rarityService           MongoDB + Chain
       |                               |                       |
       | executeTraitAirdrop()         |                       |
       |------------------------------>|                       |
       |                               | 1. Find active pool   |
       |                               |---------------------->|
       |                               | 2. Pick random unused |
       |                               |    trait               |
       |                               |---------------------->|
       |                               | 3. Find all NFTs with |
       |                               |    matching trait      |
       |                               |---------------------->|
       |                               | 4. Look up owners     |
       |                               |    (exclude platform) |
       |                               |---------------------->|
       |                               | 5. Calculate per-NFT  |
       |                               |    distribution       |
       |                               | 6. Transfer $BATTLE   |
       |                               |    from rewards wallet |
       |                               |    to each holder     |
       |                               |======================>| (on-chain)
       |                               | 7. Record transactions|
       |                               |---------------------->|
       |                               | 8. Update pool history|
       |<--- result summary ----------|                       |
```

---

## Key Design Decisions

1. **On-chain level as source of truth**: The `ChainBoisNFT` contract stores levels. The backend reads `getLevel()` before every level-up to prevent stale data. MongoDB mirrors the level for query efficiency but the chain is authoritative.

2. **Payment-then-verify pattern**: The frontend sends AVAX directly to the `prize_pool` wallet via Thirdweb, then submits the `txHash` to the API. The API verifies the payment on-chain before calling `setLevel()`. This avoids the API handling user funds directly.

3. **Deployer wallet for setLevel**: Only the contract owner (deployer) can call `setLevel()`. The deployer's private key is AES-encrypted in MongoDB and decrypted at call time.

4. **Cloudinary URL transformations**: Instead of generating new images for each rank, a single badge overlay is composited onto the base NFT image via Cloudinary URL parameters. This avoids storage costs and allows instant badge updates on level-up.

5. **Public metadata endpoint with relaxed CORS**: The metadata route overrides Helmet's restrictive `Cross-Origin-Resource-Policy` header and sets `Access-Control-Allow-Origin: *` so external indexers (Glacier, OpenSea, Thirdweb) can fetch NFT metadata.

6. **Rarity scoring formula**: Adapted from the ghetto-pigeons reference project. Score = `1/(traitCountFreq/totalSupply) + SUM[1/(traitFreq/totalSupply)]`. Higher score = rarer. NFTs are ranked by score and assigned tiers (legendary, epic, rare, uncommon, common) by percentile.

7. **Trait airdrops from fixed supply**: $BATTLE tokens are transferred (not minted) from the rewards wallet. The airdrop picks a random unused trait each week, finds all NFT holders with that trait, and splits the weekly pool proportionally by NFT count.

---

## Models/Schemas Introduced

### ChainboiNft (extended from Phase 2)

| Field | Type | Description |
|-------|------|-------------|
| `tokenId` | Number (unique) | ERC-721 token ID (starts at 1) |
| `contractAddress` | String | ChainBoisNFT contract address |
| `ownerAddress` | String (indexed) | Current owner (lowercase) |
| `level` | Number (0-7) | Current rank level |
| `badge` | String | Rank badge key (e.g., "captain") |
| `traits` | Array | `[{ trait_type, value }]` from HashLips generation |
| `inGameStats` | Object | `{ kills, score, gamesPlayed }` (updated by syncScoresJob) |
| `imageUri` | String | IPFS image URL |
| `metadataUri` | String | IPFS metadata URL |

### NftRarity

| Field | Type | Description |
|-------|------|-------------|
| `tokenId` | Number (unique) | Links to ChainboiNft |
| `name` | String | "ChainBoi #N" |
| `traits` | Map<String, String> | Flattened trait key-value pairs |
| `traitCount` | Number | How many non-empty traits |
| `rarityScore` | Number (indexed) | Calculated rarity score |
| `rank` | Number (indexed) | Position in collection (1 = rarest) |
| `percentile` | Number | Percentile rank (lower = rarer) |
| `rarityTier` | String enum | legendary, epic, rare, uncommon, common |

### NftTrait

| Field | Type | Description |
|-------|------|-------------|
| `tokenId` | Number (unique) | Links to ChainboiNft |
| `background` | String | Background trait value |
| `skin` | String | Skin trait value |
| `weapon` | String | Weapon trait value |
| `suit` | String | Suit trait value |
| `eyes` | String | Eyes trait value |
| `mouth` | String | Mouth trait value |
| `helmet` | String | Helmet trait value |

Each trait field is individually indexed for efficient airdrop queries.

### Trait

| Field | Type | Description |
|-------|------|-------------|
| `traitType` | String | e.g., "background", "skin" |
| `value` | String | e.g., "Desert", "Green" |
| `used` | Boolean | Whether this trait has been used for an airdrop |
| `usedDate` | Date | When it was used (resets when all traits exhausted) |

Compound unique index on `(traitType, value)`.

### TraitsPool

| Field | Type | Description |
|-------|------|-------------|
| `poolName` | String | Display name |
| `tokenAddress` | String | $BATTLE token contract address |
| `tokenName` | String | "BATTLE" |
| `weeklyDistributionAmount` | Number | $BATTLE distributed per week |
| `walletId` | ObjectId (ref Wallet) | Rewards wallet reference |
| `status` | String enum | active, inactive, completed |
| `lastChosenTrait` | Object | Most recent airdrop trait info |
| `traitHistory` | Array | All past airdrop distributions |

---

## Endpoints Summary

### Training Routes (`/api/v1/training/*`) -- All require `decodeToken`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/training/nfts/:address` | Token | List ChainBoi NFTs owned by address with levels/ranks |
| GET | `/training/nft/:tokenId` | Token | Full NFT detail: traits, stats, cost, eligibility |
| POST | `/training/level-up` | Token + purchaseLimiter | Pay AVAX, level up on-chain |
| GET | `/training/level-up/cost` | Token | Get level-up cost (by tokenId, level, or full table) |
| GET | `/training/eligibility/:tokenId` | Token | Check tournament eligibility for an NFT |

### Metadata Routes (`/api/v1/metadata/*`) -- Public, CORS `*`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/metadata/:tokenId` | Public | Dynamic ERC-721 JSON with live level, rank, stats, badge image |

### Airdrop Routes (`/api/v1/airdrop/*`) -- Mixed auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/airdrop/rarity` | Public | Paginated rarity leaderboard |
| GET | `/airdrop/rarity/:tokenId` | Public | Single NFT rarity data |
| GET | `/airdrop/traits-pool` | Public | Active trait airdrop pools |
| GET | `/airdrop/trait-history` | Public | Distribution history |
| POST | `/airdrop/traits-pool` | Token + Admin | Create/configure airdrop pool |
| POST | `/airdrop/calculate-rarity` | Token + Admin | Trigger rarity calculation |
| POST | `/airdrop/distribute` | Token + Admin | Trigger manual trait distribution |

---

## Rank Progression

| Level | Rank | Cost (AVAX) | Badge | Characters Unlocked |
|-------|------|-------------|-------|---------------------|
| 0 | Private | - | None | 4 (Private A-D) |
| 1 | Corporal | 0.001 | Corporal medal | +4 (8 total) |
| 2 | Sergeant | 0.002 | Sergeant medal | +4 (12 total) |
| 3 | Captain | 0.003 | Captain medal | +4 (16 total) |
| 4 | Major | 0.004 | Major medal | +4 (20 total) |
| 5 | Colonel | 0.005 | Colonel medal | +4 (24 total) |
| 6 | Major General | 0.006 | Major General medal | +4 (28 total) |
| 7 | Field Marshal | 0.007 | Field Marshal medal | +4 (32 total) |

Costs are configurable per-level in the `Settings.levelUpCosts` Map.

---

## Smart Contracts (Fuji Testnet)

| Contract | Address | Role in Phase 3 |
|----------|---------|-----------------|
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | `getLevel()`, `setLevel()`, `ownerOf()` |
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | Trait airdrop transfers |

### Platform Wallets

| Wallet | Address | Role in Phase 3 |
|--------|---------|-----------------|
| Deployer | `0x80dbc4c3c17eb35160aeec41b1590d5f028079c0` | Calls `setLevel()` on ChainBoisNFT |
| Prize Pool | `0xc81f02e4bba2f891e5d831f2dddd9edd61f3f92e` | Receives AVAX level-up payments |
| Rewards | `0xcb7ba57b0e2613b3e220b191ca01e603c375dfb5` | Sends $BATTLE for trait airdrops |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `controllers/trainingController.js` | NFT listing, detail, level-up, cost lookup, eligibility |
| `controllers/metadataController.js` | Dynamic ERC-721 metadata with Cloudinary badge overlay |
| `controllers/airdropController.js` | Rarity leaderboard, trait pool management, distribution |
| `services/rarityService.js` | Rarity scoring engine, trait frequency analysis |
| `jobs/traitAirdropJob.js` | Weekly cron wrapper for trait-based $BATTLE distribution |
| `routes/trainingRoomRoutes.js` | Training endpoints (all `decodeToken` protected) |
| `routes/metadataRoutes.js` | Public metadata route |
| `routes/airdropRoutes.js` | Mixed public/admin airdrop routes |
| `utils/cloudinaryUtils.js` | Badge overlay URL builder, image upload helpers |
| `config/cloudinary.js` | Cloudinary SDK initialization |
| `models/chainboiNftModel.js` | ChainBoi NFT data with traits, stats, level |
| `models/nftRarityModel.js` | Computed rarity scores and rankings |
| `models/nftTraitModel.js` | Flattened trait fields for efficient queries |
| `models/traitModel.js` | Unique trait combos with used/unused tracking |
| `models/traitsPoolModel.js` | Airdrop pool configuration and history |

---

## Dependencies on Previous Phases

| Dependency | From Phase | Used By |
|------------|-----------|---------|
| Firebase Auth (`decodeToken`) | Phase 1 | Training routes, admin airdrop routes |
| `User` model (uid, address, level) | Phase 1 | `trainingController.levelUp` |
| `Wallet` model (AES-encrypted keys) | Phase 0 | Deployer key for `setLevel`, rewards key for airdrops |
| `Transaction` model | Phase 0 | Recording level-up payments, airdrop distributions |
| `Settings` model (levelUpCosts, nftPrice) | Phase 0 | Cost lookup, configurable parameters |
| `syncScoresJob` | Phase 1 | Propagates game stats to `ChainboiNft.inGameStats` |
| `getUnlockedContent()` from `gameController` | Phase 1 | Returns characters/weapons unlocked at each level |
| Smart contracts deployed | Phase 2 | ChainBoisNFT contract for level operations |
| NFTs pre-minted to platform wallets | Phase 2 | ChainboiNft records in MongoDB |
| `contractUtils.js` (getNftLevel, setNftLevel, getNftOwner) | Phase 0/2 | On-chain level read/write/ownership |
| `avaxUtils.js` (verifyPayment, reindexNftMetadata) | Phase 0 | AVAX payment verification, Glacier reindex |
| `cryptUtils.js` (decrypt) | Phase 0 | Deployer wallet key decryption |
