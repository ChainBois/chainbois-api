# Phase 6: Inventory Architecture

## What Phase 6 Implements

Phase 6 is the **read-only asset aggregation layer**. It provides a unified view of all ChainBois-related assets a user holds: ChainBoi NFTs, weapon NFTs, $BATTLE token balance, points balance, and transaction history. It connects two systems:
1. **MongoDB** - ChainboiNft, WeaponNft, User, and Transaction collections
2. **Avalanche C-Chain (Fuji)** - On-chain $BATTLE token balance via `getBattleBalance()`

This is the simplest phase -- it introduces no new models, no cron jobs, and no write operations. All endpoints are public, read-only, and identified by wallet address.

---

## Component Overview

```
+-----------------------------------------------------------------+
|                     Express App (app.js)                         |
|                                                                  |
|  Phase 6 Routes:                                                 |
|  /api/v1/inventory/* -> inventoryRoutes.js  (all public)        |
|                                                                  |
|  No cron jobs. No background processing.                         |
|  No new models. Pure read-only aggregation.                      |
+-----------------------------------------------------------------+
```

---

## Directory Structure (Phase 6 additions)

```
chainbois-api/
├── controllers/
│   └── inventoryController.js    # 4 read-only endpoints
└── routes/
    └── inventoryRoutes.js        # Inventory routes (all public)
```

No new models, services, jobs, or utilities are introduced in this phase. The controller composes data from models introduced in previous phases.

---

## Data Flow Diagrams

### Full Inventory Query

```
Frontend                          API
   |                               |
   | GET /inventory/0x1234...      |
   |------------------------------>|
   |                               |
   |                               | Parallel queries (Promise.all):
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

### Transaction History Query

```
Frontend                          API
   |                               |
   | GET /inventory/0x1234.../     |
   |     history?type=weapon_      |
   |     purchase&page=1&limit=20  |
   |------------------------------>|
   |                               |
   |                               | Filter:
   |                               |   $or: [
   |                               |     { fromAddress: addr },
   |                               |     { toAddress: addr }
   |                               |   ]
   |                               |   + optional type filter
   |                               |
   |                               | Transaction.find(filter)
   |                               |   .sort({ createdAt: -1 })
   |                               |   .skip(skip).limit(limit)
   |                               |
   |<--- {                        |
   |  history: [{                 |
   |    type, fromAddress,        |
   |    toAddress, amount,        |
   |    currency, txHash,         |
   |    status, metadata,         |
   |    createdAt                 |
   |  }],                         |
   |  total, page, totalPages     |
   | } -------------------------->|
```

---

## Key Design Decisions

1. **No auth -- wallet address only**: Inventory endpoints are public. Wallet addresses and on-chain balances are inherently public information (visible on any block explorer). The inventory aggregates data that is already queryable by address from MongoDB and the blockchain.

2. **Parallel data fetching**: The full inventory endpoint uses `Promise.all` to fetch ChainBoi NFTs, weapon NFTs, and user data simultaneously. The on-chain $BATTLE balance query runs after the parallel queries complete (it's the only external call).

3. **Non-fatal balance query**: If `getBattleBalance()` fails (RPC timeout, rate limit), the inventory still returns with `battle: 0`. The on-chain balance is supplementary -- the core inventory data comes from MongoDB.

4. **Unified transaction history**: The history endpoint queries all transaction types across the user's address (both `fromAddress` and `toAddress`). An optional `type` filter allows narrowing to specific transaction categories.

5. **Type filter validation**: The `type` query parameter is validated against `Object.values(TRANSACTION_TYPES)` to prevent arbitrary filter injection. Invalid types return a 400 error with the list of valid options.

6. **No data duplication**: The inventory controller does not maintain its own data store. It reads from `ChainboiNft` (Phase 2/3), `WeaponNft` (Phase 5), `User` (Phase 1), and `Transaction` (Phase 0) -- all models owned by other phases.

---

## Models/Schemas Used (no new models)

Phase 6 reads from models introduced in previous phases:

| Model | From Phase | Data Read |
|-------|-----------|-----------|
| `ChainboiNft` | Phase 2/3 | tokenId, level, badge, imageUri, traits, inGameStats |
| `WeaponNft` | Phase 5 | tokenId, weaponName, category, blueprintTier, imageUri |
| `User` | Phase 1 | pointsBalance, battleTokenBalance |
| `Transaction` | Phase 0 | type, fromAddress, toAddress, amount, currency, txHash, status, metadata |

---

## Transaction Types Displayed

The history endpoint can filter by any of these transaction types (defined in `config/constants.js`):

| Type | Description | Phase Introduced |
|------|-------------|-----------------|
| `level_up` | AVAX payment for on-chain level-up | Phase 3 |
| `weapon_purchase` | $BATTLE payment for weapon NFT | Phase 5 |
| `nft_purchase` | AVAX payment for ChainBoi NFT | Phase 5 |
| `points_conversion` | Points to $BATTLE conversion | Phase 5 |
| `prize_payout` | Tournament prize distribution | Phase 4 |
| `nft_transfer` | NFT transfer (admin/utility) | Phase 2 |
| `trait_airdrop` | Trait-based $BATTLE distribution | Phase 3 |
| `rarity_airdrop` | Rarity-based $BATTLE distribution | Phase 3 |
| `refund` | Purchase refund (auto or manual) | Phase 5 |

---

## Endpoints Summary

All endpoints are under `/api/v1/inventory` and require no authentication.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/inventory/:address` | Public | Full inventory: NFTs, weapons, balances, counts |
| GET | `/inventory/:address/nfts` | Public | ChainBoi NFTs only with level, rank, stats |
| GET | `/inventory/:address/weapons` | Public | Weapon NFTs only with category, tier |
| GET | `/inventory/:address/history` | Public | Paginated transaction history (filterable by type) |

### Query Parameters

**`/inventory/:address/history`**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Number | 1 | Page number (min 1) |
| `limit` | Number | 20 | Items per page (1-100) |
| `type` | String | none | Filter by transaction type |

---

## Smart Contracts (Fuji Testnet)

| Contract | Address | Role in Phase 6 |
|----------|---------|-----------------|
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | `getBattleBalance()` for on-chain balance read |

No write operations are performed on-chain in Phase 6.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `controllers/inventoryController.js` | 4 read-only endpoints: full inventory, NFTs, weapons, history |
| `routes/inventoryRoutes.js` | Route definitions (all public, no middleware) |
| `models/chainboiNftModel.js` | ChainBoi NFT ownership data (read only) |
| `models/weaponNftModel.js` | Weapon NFT ownership data (read only) |
| `models/userModel.js` | User points/battle balance (read only) |
| `models/transactionModel.js` | Transaction history (read only) |
| `utils/contractUtils.js` | `getBattleBalance()` for on-chain $BATTLE read |
| `config/constants.js` | `RANK_NAMES`, `TRANSACTION_TYPES` for display and validation |

---

## Dependencies on Previous Phases

| Dependency | From Phase | Used By |
|------------|-----------|---------|
| `ChainboiNft` model | Phase 2/3 | NFT inventory with level, badge, traits, inGameStats |
| `WeaponNft` model | Phase 5 | Weapon inventory with category, tier |
| `User` model (pointsBalance) | Phase 1 | Points balance display |
| `Transaction` model | Phase 0 | Transaction history across all types |
| `contractUtils.js` (getBattleBalance) | Phase 0/2 | On-chain $BATTLE balance read |
| `config/constants.js` (RANK_NAMES, TRANSACTION_TYPES) | Phase 0 | Rank display names, type validation |
| `syncScoresJob` | Phase 1 | Keeps ChainboiNft.inGameStats current |
| `armoryController` (purchases) | Phase 5 | Weapon/NFT ownership changes reflected in inventory |
| `trainingController` (level-up) | Phase 3 | Level/badge changes reflected in inventory |
| `pointsController` (conversion) | Phase 5 | Points balance changes reflected in inventory |
| `prizeService` (payouts) | Phase 4 | Prize transactions visible in history |
| `airdropController` (distributions) | Phase 3 | Airdrop transactions visible in history |
