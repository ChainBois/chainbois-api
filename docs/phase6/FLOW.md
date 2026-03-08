# Phase 6: Inventory - Flow Documentation

## What Phase 6 Covers

Phase 6 provides a read-only inventory view of all ChainBois-related assets a user holds: ChainBoi NFTs, weapon NFTs, $BATTLE token balance, points balance, and transaction history.

---

## Auth Model: No Auth Required

All inventory endpoints are **public**. The user's **wallet address** is the only identifier needed — it's used to query MongoDB for owned assets and the blockchain for token balances.

---

## Architecture Diagram

```
+--------------------------------------------------------------------+
|                     FRONTEND (React)                                |
|                                                                     |
|  1. Full inventory      -> GET /inventory/:address         (public)|
|  2. ChainBoi NFTs only  -> GET /inventory/:address/nfts    (public)|
|  3. Weapons only        -> GET /inventory/:address/weapons (public)|
|  4. Transaction history -> GET /inventory/:address/history (public)|
+------------------------------+-------------------------------------+
                               |
                   Wallet address only
                   (no auth token needed)
                               |
                               v
+--------------------------------------------------------------------+
|                     CHAINBOIS API                                   |
|                                                                     |
|  Inventory Controller                                              |
|  - Queries MongoDB for NFTs/weapons owned by this address          |
|  - Queries blockchain for $BATTLE balance                          |
|  - Queries MongoDB for points balance (from User model)            |
|  - Returns paginated transaction history                           |
+----------------------------+---------------------------------------+
         |                   |
         v                   v
  +-----------+       +-------------+
  | MongoDB   |       | Avalanche   |
  |           |       | C-Chain     |
  | ChainboiNft|      |             |
  | WeaponNft |       | getBattle   |
  | User      |       |  Balance()  |
  | Transaction|      |             |
  +-----------+       +-------------+
```

---

## Full Inventory Flow

```
Frontend                          API
   |                               |
   | GET /inventory/0x1234...      |
   |------------------------------>|
   |                               |
   |                               | Parallel queries:
   |                               | 1. ChainboiNft.find({ ownerAddress })
   |                               | 2. WeaponNft.find({ ownerAddress })
   |                               | 3. User.findOne({ address }) -> pointsBalance
   |                               | 4. getBattleBalance(address) -> on-chain
   |                               |
   |<--- {                        |
   |  chainbois: [{               |
   |    tokenId, level, rank,     |
   |    badge, imageUri, stats    |
   |  }],                         |
   |  weapons: [{                 |
   |    tokenId, weaponName,      |
   |    category, tier, imageUri  |
   |  }],                         |
   |  balances: {                 |
   |    points: 500,              |
   |    battle: 150.0             |
   |  },                          |
   |  counts: {                   |
   |    chainbois: 1,             |
   |    weapons: 3                |
   |  }                           |
   | } -------------------------->|
```

---

## Transaction History

```
GET /inventory/:address/history?page=1&limit=20&type=weapon_purchase
```

Returns paginated transaction records for a wallet address.

**Transaction Types:**
- `level_up` - Level-up AVAX payments
- `weapon_purchase` - Weapon NFT purchases
- `nft_purchase` - ChainBoi NFT purchases
- `points_conversion` - Points to $BATTLE conversions
- `prize_payout` - Tournament prize payouts

---

## Key Files

| File | Purpose |
|------|---------|
| `controllers/inventoryController.js` | Full inventory, NFTs, weapons, history |
| `routes/inventoryRoutes.js` | Inventory routes (all public) |
| `models/chainboiNftModel.js` | ChainBoi NFT ownership data |
| `models/weaponNftModel.js` | Weapon NFT ownership data |
| `models/transactionModel.js` | Transaction history |
