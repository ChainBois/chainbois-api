# Phase 3: Training Room - Flow Documentation

## What Phase 3 Covers

Phase 3 implements the Training Room: NFT display, on-chain level-up with AVAX payment verification, dynamic metadata serving, Cloudinary badge overlays, and tournament eligibility checking.

---

## Architecture Diagram

```
+------------------------------------------------------------------+
|                      FRONTEND (React + Thirdweb)                  |
|                                                                   |
|  1. User views their NFTs  -> GET /training/nfts/:address         |
|  2. User views NFT detail  -> GET /training/nft/:tokenId          |
|  3. User checks cost       -> GET /training/level-up/cost         |
|  4. User sends AVAX via Thirdweb wallet to prize_pool address     |
|  5. User submits txHash    -> POST /training/level-up             |
|  6. Backend verifies payment, updates level on-chain              |
|  7. Backend returns new level + unlocked content                  |
+-----------------------------+------------------------------------+
                              |
                       Firebase ID Token
                       (Authorization: Bearer)
                              |
                              v
+------------------------------------------------------------------+
|                      CHAINBOIS API                                |
|                                                                   |
|  Training Controller                                              |
|  - listNfts: query on-chain ownership, return NFTs + level/rank  |
|  - getNftDetail: full NFT info with traits, stats, next cost     |
|  - levelUp: verify AVAX payment -> setLevel on-chain             |
|  - getLevelUpCost: read cost table from settings                 |
|  - getEligibility: check which tournaments NFT qualifies for     |
|                                                                   |
|  Metadata Controller (PUBLIC - no auth)                           |
|  - GET /metadata/:tokenId.json -> ERC-721 compliant JSON        |
|    (serves real-time level, rank, stats, Cloudinary badge image) |
+----------------------------+-------------------------------------+
                             |
              +--------------+--------------+
              |              |              |
              v              v              v
     +--------+----+  +-----+------+  +----+--------+
     | Avalanche   |  |  MongoDB   |  | Cloudinary  |
     | C-Chain     |  |            |  |             |
     |             |  | ChainboiNft|  | Badge       |
     | setLevel()  |  | (traits,   |  | overlay     |
     | getLevel()  |  |  stats,    |  | URLs        |
     | ownerOf()   |  |  owner)    |  |             |
     +-------------+  +------------+  +-------------+
```

---

## Level-Up Flow (Most Complex Endpoint)

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
   | User sends 0.003 AVAX        |                               |
   | via Thirdweb wallet to       |                               |
   | prize_pool address           |                               |
   |------------------------------------------------------------->|
   |<--- txHash: 0xabc... --------|                               |
   |                               |                               |
   | POST /training/level-up      |                               |
   | { tokenId: 5, txHash: 0x... }|                               |
   |------------------------------>|                               |
   |                               | 1. Verify Firebase token      |
   |                               | 2. Find user by uid           |
   |                               | 3. Check ownership on-chain   |
   |                               |------------------------------>|
   |                               |<---- owner matches user ------|
   |                               | 4. Verify tx receipt          |
   |                               |------------------------------>|
   |                               |<---- to=prize_pool, amt ok ---|
   |                               | 5. Check tx not already used  |
   |                               | 6. setLevel(5, 3) on-chain   |
   |                               |------------------------------>|
   |                               |<---- success + txHash ---------|
   |                               | 7. Update MongoDB             |
   |                               | 8. Sync to Firebase           |
   |                               | 9. Record Transaction         |
   |                               | 10. Emit MetadataUpdate event |
   |<--- { newLevel: 3,          |                               |
   |       rank: "Captain",       |                               |
   |       characters: [...] } ---|                               |
```

### Payment Verification Checks
1. Transaction exists on-chain
2. Transaction is confirmed (not pending)
3. Recipient is the prize_pool wallet address
4. Amount >= expected level-up cost
5. Transaction is not older than 1 hour
6. txHash not already used in another Transaction record (prevents double-spend)

---

## Dynamic Metadata Endpoint

```
Marketplace/Explorer              API                     MongoDB + Chain
       |                           |                           |
       | GET /metadata/5.json      |                           |
       |-------------------------->|                           |
       |                           | 1. getLevel(5) on-chain  |
       |                           |-------------------------->|
       |                           |<--- level: 3 -------------|
       |                           | 2. Query ChainboiNft #5   |
       |                           |    (traits, stats)         |
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

This endpoint is PUBLIC (no auth) because marketplaces and explorers need to access it. The on-chain `tokenURI()` points to this endpoint.

---

## NFT Stats Pipeline (syncScoresJob → ChainboiNft → Metadata)

Game stats flow from the Unity game to NFT metadata through a pipeline:

```
Unity Game        Firebase         syncScoresJob        MongoDB            Metadata API
    |                |                  |                  |                    |
    | Score: 5000    |                  |                  |                    |
    |--------------->|                  |                  |                    |
    |                | Cron (5 min)     |                  |                    |
    |                |<-----------------|                  |                    |
    |                |  Score: 5000     |                  |                    |
    |                |----------------->|                  |                    |
    |                |                  |                  |                    |
    |                |                  | 1. Update User:  |                    |
    |                |                  |    score, points |                    |
    |                |                  |----------------->|                    |
    |                |                  |                  |                    |
    |                |                  | 2. If user has   |                    |
    |                |                  |    wallet + NFT: |                    |
    |                |                  |    ChainboiNft   |                    |
    |                |                  |    .updateMany() |                    |
    |                |                  |    inGameStats = |                    |
    |                |                  |    { score, gp } |                    |
    |                |                  |----------------->|                    |
    |                |                  |                  |                    |
    |                |                  |                  | 3. GET /metadata/5 |
    |                |                  |                  |<-------------------|
    |                |                  |                  | Returns live stats |
    |                |                  |                  |------------------->|
```

The `syncScoresJob` (in `jobs/syncScoresJob.js` lines 135-148) propagates `score` and `gamesPlayed` from the User model to all ChainBoi NFTs owned by that user. This data feeds the dynamic metadata endpoint, which includes game stats as ERC-721 `attributes`:

```json
{
  "attributes": [
    { "trait_type": "Score", "value": 5000, "display_type": "number" },
    { "trait_type": "Games Played", "value": 15, "display_type": "number" }
  ]
}
```

Marketplaces that reindex metadata (triggered by EIP-4906 `MetadataUpdate` events) will display live game stats on NFT listings.

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

---

## Key Files

| File | Purpose |
|------|---------|
| `controllers/trainingController.js` | NFT display, level-up, eligibility |
| `controllers/metadataController.js` | Dynamic ERC-721 metadata (public) |
| `routes/trainingRoutes.js` | Training Room routes (auth required) |
| `routes/metadataRoutes.js` | Metadata routes (public, CORS open) |
| `utils/cloudinaryUtils.js` | Badge overlay URL builder |
| `config/cloudinary.js` | Cloudinary SDK init |
