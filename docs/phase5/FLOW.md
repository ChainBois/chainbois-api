# Phase 5: Armory + Points - Flow Documentation

## What Phase 5 Covers

Phase 5 implements the armory (weapon AND ChainBoi NFT purchases from platform wallets) and points-to-$BATTLE conversion.

---

## Auth Model: No Auth Required

All armory and points endpoints are **public**. The user's **wallet address** identifies them — it maps to their MongoDB User record (created during the Phase 1 login flow).

- No Firebase token needed
- No JWT needed
- Wallet address is the identifier (already stored in MongoDB from login)
- On-chain transaction verification proves the buyer is who they say they are (transaction sender must match the submitted address)

---

## Architecture Diagram

```
+--------------------------------------------------------------------+
|                     FRONTEND (React + Thirdweb)                     |
|                                                                     |
|  ARMORY:                                                           |
|  1. Browse weapons       -> GET /armory/weapons          (public)  |
|  2. Browse by category   -> GET /armory/weapons/:cat     (public)  |
|  3. Weapon detail        -> GET /armory/weapon/:id       (public)  |
|  4. Browse ChainBoi NFTs -> GET /armory/nfts             (public)  |
|  5. NFT detail           -> GET /armory/nft/:tokenId     (public)  |
|  6. Purchase weapon      -> POST /armory/purchase/weapon (public)  |
|  7. Purchase NFT         -> POST /armory/purchase/nft    (public)  |
|  8. Check balance        -> GET /armory/balance/:addr    (public)  |
|                                                                     |
|  POINTS:                                                           |
|  9. Check points balance -> GET /points/:address         (public)  |
| 10. Convert to $BATTLE   -> POST /points/convert         (public)  |
| 11. View history         -> GET /points/history/:addr    (public)  |
+------------------------------+-------------------------------------+
                               |
                   No auth — wallet address
                   identifies the user
                               |
                               v
+--------------------------------------------------------------------+
|                     CHAINBOIS API                                   |
|                                                                     |
|  Armory Controller                                                 |
|  - List weapons/NFTs available in platform wallets                 |
|  - Purchase: verify on-chain payment -> transfer asset to buyer    |
|                                                                     |
|  Points Controller                                                  |
|  - Read pointsBalance from MongoDB (accumulated by sync job)       |
|  - Convert: deduct points -> transfer $BATTLE from rewards wallet  |
+----------------------------+---------------------------------------+
         |                   |                    |
         v                   v                    v
  +-----------+       +-------------+       +-------------+
  | MongoDB   |       | Avalanche   |       | Firebase    |
  |           |       | C-Chain     |       | RTDB        |
  | WeaponNft |       |             |       |             |
  | ChainboiNft|      | Verify tx   |       | Write       |
  | User      |       | Transfer    |       | weapons/NFT |
  | (points   |       | weapon NFT  |       | to game     |
  |  balance) |       | Transfer    |       |             |
  | Transaction|      | ChainBoi NFT|       +-------------+
  +-----------+       | Transfer    |
                      | $BATTLE     |
                      +-------------+
```

---

## Weapon Purchase Flow

```
Frontend                          API                           Blockchain
   |                               |                               |
   | GET /armory/weapons           |                               |
   |------------------------------>|                               |
   |<-- weapons available in       |                               |
   |    weapon_store wallet -------|                               |
   |                               |                               |
   | GET /armory/weapon/:id        |                               |
   | (gets price + paymentAddress) |                               |
   |------------------------------>|                               |
   |<-- { price, paymentAddress }--|                               |
   |                               |                               |
   | User sends $BATTLE via        |                               |
   | Thirdweb wallet to            |                               |
   | weapon_store address          |                               |
   |------------------------------------------------------------->|
   |<--- txHash: 0xabc... ---------|                               |
   |                               |                               |
   | POST /armory/purchase/weapon  |                               |
   | { address, weaponName, txHash}|                               |
   |------------------------------>|                               |
   |                               | 1. Find user by wallet address|
   |                               | 2. Check user hasNft          |
   |                               | 3. Check weapon in stock      |
   |                               |    (owned by weapon_store)     |
   |                               | 4. Verify tx on-chain:        |
   |                               |    - Is $BATTLE transfer      |
   |                               |    - Sender = user address    |
   |                               |    - To = weapon_store addr   |
   |                               |    - Amount >= price           |
   |                               |    - Tx not already used       |
   |                               |------------------------------>|
   |                               |<---- tx verified --------------|
   |                               | 5. Transfer weapon NFT        |
   |                               |    weapon_store -> user        |
   |                               |------------------------------>|
   |                               |<---- transfer receipt ---------|
   |                               | 6. Update WeaponNft.owner      |
   |                               | 7. Record Transaction          |
   |                               | 8. Sync weapon to Firebase     |
   |<--- { weapon, txHash } ------|                               |
```

---

## ChainBoi NFT Purchase Flow

Same pattern as weapon purchase, but pays AVAX (not $BATTLE) to the nft_store wallet:

```
Frontend                          API                           Blockchain
   |                               |                               |
   | GET /armory/nfts              |                               |
   |------------------------------>|                               |
   |<-- { nfts[], price,          |                               |
   |      paymentAddress } --------|                               |
   |                               |                               |
   | User sends AVAX via           |                               |
   | Thirdweb wallet to            |                               |
   | nft_store address             |                               |
   |------------------------------------------------------------->|
   |<--- txHash: 0xdef... ---------|                               |
   |                               |                               |
   | POST /armory/purchase/nft     |                               |
   | { address, txHash,            |                               |
   |   tokenId (optional) }        |                               |
   |------------------------------>|                               |
   |                               | 1. Find user by wallet address|
   |                               | 2. Find available NFT          |
   |                               |    (owned by nft_store)        |
   |                               | 3. Get price from Settings     |
   |                               | 4. Verify AVAX tx on-chain:    |
   |                               |    - Sender = user address    |
   |                               |    - To = nft_store address   |
   |                               |    - Value >= nftPrice         |
   |                               |    - Tx not already used       |
   |                               |------------------------------>|
   |                               |<---- tx verified --------------|
   |                               | 5. Transfer ChainBoi NFT      |
   |                               |    nft_store -> user           |
   |                               |------------------------------>|
   |                               |<---- transfer receipt ---------|
   |                               | 6. Update ChainboiNft.owner    |
   |                               | 7. Update user hasNft          |
   |                               | 8. Record Transaction          |
   |                               | 9. Sync to Firebase            |
   |                               |    (hasNFT: true, level: 0)   |
   |<--- { tokenId, txHash } -----|                               |
```

### NFT Pricing
- Price stored in `Settings.nftPrice` (default: 0.001 AVAX for testnet)
- Paid in AVAX (native token), NOT $BATTLE
- Same price for all ChainBoi NFTs (they're the same collection, differentiated by traits)

---

## Points Accumulation + Conversion Flow

### How Points Accumulate

```
Unity Game            Firebase               syncScoresJob           MongoDB
    |                    |                        |                     |
    | Score: 5000        |                        |                     |
    |------------------->|                        |                     |
    |                    |  Cron polls (5 min)     |                     |
    |                    |<-----------------------|                     |
    |                    |  Score: 5000            |                     |
    |                    |----------------------->|                     |
    |                    |                        |                     |
    |                    |                        | Delta = 5000 - 4500 |
    |                    |                        |       = 500 points  |
    |                    |                        |                     |
    |                    |                        | user.pointsBalance  |
    |                    |                        |   += 500 (ADD delta)|
    |                    |                        |   (NOT overwrite)   |
    |                    |                        |-------------------->|
```

**CRITICAL**: The sync job computes a **delta** and **ADDS** it to `pointsBalance`. It does NOT overwrite the total.

### Conversion Flow

```
Frontend                          API                           Blockchain
   |                               |                               |
   | GET /points/:address          |                               |
   |------------------------------>|                               |
   |<-- { pointsBalance: 500 } ---|                               |
   |                               |                               |
   | POST /points/convert          |                               |
   | { address: "0x...",           |                               |
   |   amount: 200 }               |                               |
   |------------------------------>|                               |
   |                               | 1. Find user by wallet address|
   |                               | 2. Check pointsBalance >= 200 |
   |                               | 3. Check rewards wallet       |
   |                               |    has >= 200 $BATTLE          |
   |                               | 4. Transfer 200 $BATTLE       |
   |                               |    rewards wallet -> user      |
   |                               |------------------------------>|
   |                               |<---- transfer receipt ---------|
   |                               | 5. Deduct 200 from            |
   |                               |    user.pointsBalance          |
   |                               | 6. Record Transaction          |
   |<--- { converted: 200,        |                               |
   |       remaining: 300,         |                               |
   |       txHash: 0x... } -------|                               |
```

---

## Testnet Pricing (Hackathon)

All prices are set low so testers can afford them with testnet tokens:

| Item | Price | Currency |
|------|-------|----------|
| ChainBoi NFT | 0.001 AVAX | AVAX (native) |
| Weapons | 1-5 $BATTLE | $BATTLE (ERC-20) |
| Points conversion | 1:1 | Points -> $BATTLE |

---

## Key Files

| File | Purpose |
|------|---------|
| `controllers/armoryController.js` | Weapon + NFT browsing and purchase |
| `controllers/pointsController.js` | Points balance + conversion |
| `routes/armoryRoutes.js` | Armory routes (all public) |
| `routes/pointsRoutes.js` | Points routes (all public) |
| `models/weaponNftModel.js` | Weapon NFT data + ownership |
| `models/chainboiNftModel.js` | ChainBoi NFT data + ownership |
| `models/settingsModel.js` | nftPrice, armory settings |
| `models/transactionModel.js` | Records purchases + conversions |
