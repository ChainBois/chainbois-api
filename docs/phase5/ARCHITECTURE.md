# Phase 5: Armory + Points Architecture

## What Phase 5 Implements

Phase 5 is the **commerce and economy layer**. It enables weapon NFT purchases (paid in $BATTLE), ChainBoi NFT purchases (paid in AVAX), and points-to-$BATTLE conversion. It connects four systems:
1. **Avalanche C-Chain (Fuji)** - On-chain payment verification, NFT transfers from platform wallets to buyers, $BATTLE transfers for conversions and refunds
2. **MongoDB** - Weapon/NFT ownership records, user points balances, purchase attempt lifecycle tracking, transaction history
3. **Firebase** - Syncing weapon/NFT ownership to game RTDB after purchases
4. **Discord** - Webhook alerts for refund events and failed purchase recovery

All endpoints in this phase are **public** (no auth token required). User identity is established by wallet address, and purchase legitimacy is proven by on-chain transaction verification.

---

## Component Overview

```
+-----------------------------------------------------------------+
|                     Express App (app.js)                         |
|                                                                  |
|  Phase 5 Routes:                                                 |
|  /api/v1/armory/*   -> armoryRoutes.js   (all public)           |
|  /api/v1/points/*   -> pointsRoutes.js   (all public)           |
|                                                                  |
|  Cron Jobs (server.js, PM2 primary only):                        |
|  - purchaseFailsafeJob -> every 5 minutes                       |
+-----------------------------------------------------------------+
```

---

## Directory Structure (Phase 5 additions)

```
chainbois-api/
├── controllers/
│   ├── armoryController.js      # Weapon/NFT browsing + purchase (8 endpoints)
│   └── pointsController.js      # Points balance + conversion (3 endpoints)
├── routes/
│   ├── armoryRoutes.js          # Armory routes (all public)
│   └── pointsRoutes.js         # Points routes (all public)
├── jobs/
│   └── purchaseFailsafeJob.js   # Failsafe: retry stuck transfers + auto-refund
├── models/
│   ├── weaponNftModel.js        # Weapon NFT data + ownership
│   ├── purchaseAttemptModel.js  # Purchase lifecycle tracking
│   ├── chainboiNftModel.js      # Extended: used for NFT purchases
│   └── transactionModel.js      # Extended: refund type added
└── utils/
    └── retryHelper.js           # withRetry() for transfer retries
```

---

## Data Flow Diagrams

### Weapon Purchase Flow

```
Frontend                          API                           Blockchain
   |                               |                               |
   | GET /armory/weapons           |                               |
   |------------------------------>|                               |
   |<-- weapons grouped by        |                               |
   |    category (in stock) ------|                               |
   |                               |                               |
   | GET /armory/weapon/:id       |                               |
   |------------------------------>|                               |
   |<-- { price, currency:BATTLE, |                               |
   |      paymentAddress } --------|                               |
   |                               |                               |
   | User sends $BATTLE via        |                               |
   | Thirdweb to weapon_store     |                               |
   |------------------------------------------------------------->|
   |<--- txHash: 0xabc...         |                               |
   |                               |                               |
   | POST /armory/purchase/weapon |                               |
   | { address, weaponName, txHash}|                               |
   |------------------------------>|                               |
   |                               | 1. Find user by wallet        |
   |                               | 2. Check user hasNft          |
   |                               | 3. Replay protection (tx+PA)  |
   |                               | 4. ATOMIC: claim weapon       |
   |                               |    (findOneAndUpdate)          |
   |                               | 5. Verify $BATTLE payment     |
   |                               |    (Transfer event in logs)   |
   |                               |------------------------------>|
   |                               |<---- verified ----------------|
   |                               | 6. Create PurchaseAttempt     |
   |                               | 7. Transfer weapon NFT        |
   |                               |    weapon_store -> user        |
   |                               |------------------------------>|
   |                               |<---- receipt -----------------|
   |                               | 8. Record Transaction         |
   |                               | 9. Sync weapon to Firebase    |
   |<--- { weapon, txHash } ------|                               |
```

### ChainBoi NFT Purchase Flow

```
Frontend                          API                           Blockchain
   |                               |                               |
   | GET /armory/nfts              |                               |
   |------------------------------>|                               |
   |<-- { nfts[], price: 0.001,  |                               |
   |      currency: AVAX } -------|                               |
   |                               |                               |
   | User sends AVAX via           |                               |
   | Thirdweb to nft_store        |                               |
   |------------------------------------------------------------->|
   |<--- txHash: 0xdef...         |                               |
   |                               |                               |
   | POST /armory/purchase/nft    |                               |
   | { address, txHash }           |                               |
   |------------------------------>|                               |
   |                               | 1. Find user by wallet        |
   |                               | 2. Replay protection (tx+PA)  |
   |                               | 3. Verify AVAX payment        |
   |                               |    (tx.from, tx.to, tx.value) |
   |                               |------------------------------>|
   |                               |<---- verified ----------------|
   |                               | 4. ATOMIC: claim NFT          |
   |                               |    (findOneAndUpdate)          |
   |                               | 5. Create PurchaseAttempt     |
   |                               | 6. Transfer ChainBoi NFT      |
   |                               |    nft_store -> user           |
   |                               |------------------------------>|
   |                               |<---- receipt -----------------|
   |                               | 7. Update user.hasNft          |
   |                               | 8. Record Transaction         |
   |                               | 9. Sync to Firebase           |
   |<--- { tokenId, txHash } -----|                               |
```

### Points Conversion Flow

```
Frontend                          API                           Blockchain
   |                               |                               |
   | GET /points/:address          |                               |
   |------------------------------>|                               |
   |<-- { pointsBalance: 500,    |                               |
   |      maxConvertible: 500 } --|                               |
   |                               |                               |
   | POST /points/convert          |                               |
   | { address, amount: 200 }     |                               |
   |------------------------------>|                               |
   |                               | 1. Find user by wallet        |
   |                               | 2. ATOMIC: deduct points      |
   |                               |    findOneAndUpdate with      |
   |                               |    { pointsBalance: {$gte} }  |
   |                               |    $inc: { points: -200,      |
   |                               |      battleTokenBalance: +200}|
   |                               | 3. Check rewards wallet       |
   |                               |    has >= 200 $BATTLE          |
   |                               |------------------------------>|
   |                               | 4. Transfer 200 $BATTLE       |
   |                               |    rewards -> user wallet      |
   |                               |------------------------------>|
   |                               |<---- receipt -----------------|
   |                               | 5. Record Transaction         |
   |                               |                               |
   |                               | ON ANY FAILURE (steps 3-4):   |
   |                               |   Rollback: $inc points +200  |
   |                               |                               |
   |<--- { converted: 200,        |                               |
   |       remaining: 300,         |                               |
   |       txHash: 0x... } -------|                               |
```

### Purchase Failsafe Flow

```
+------------------------------------------------------------------+
|              FAILSAFE CRON (every 5 minutes)                     |
|                                                                   |
|  Phase 1: Process stuck "pending" purchases (> 5 min old)        |
|    - Acquire atomic lock (failsafeProcessing = true)             |
|    - Check on-chain ownership (getNftOwner / getWeaponNftOwner)  |
|    - If buyer owns asset: backfill DB records -> "completed"     |
|    - If store owns asset: retry transfer (up to 3 total)         |
|    - If max retries: restore store ownership -> "needs_refund"   |
|                                                                   |
|  Phase 2: Process refunds ("needs_refund")                       |
|    - Acquire atomic lock                                          |
|    - Check store wallet balance (needs gas reserve)              |
|    - AVAX: sendAvax(storeKey, buyer, amount)                     |
|    - BATTLE: transferBattleTokens(buyer, amount, storeKey)       |
|    - On success: "refunded" + Discord notification               |
|    - On failure: retry (up to 10 attempts, then critical alert)  |
|                                                                   |
|  Phase 3: Cleanup                                                |
|    - Release stuck failsafe locks (> 10 min)                    |
|    - Escalate stuck "processing" -> "pending" (> 15 min)         |
+------------------------------------------------------------------+
```

---

## Key Design Decisions

1. **No auth -- wallet address identifies user**: Armory and points endpoints are public. Wallet addresses are publicly visible on block explorers. Purchase legitimacy is proven by on-chain transaction verification (sender must match submitted address, recipient must be correct platform wallet, amount must be sufficient).

2. **Claim-first for weapons, verify-first for NFTs**: Weapon purchases atomically claim the weapon in MongoDB BEFORE on-chain verification to prevent double-sells. NFT purchases verify the AVAX payment on-chain FIRST, then atomically claim. The difference is because weapons need the specific named weapon claimed immediately, while NFTs can pick any available token.

3. **Atomic `findOneAndUpdate` prevents race conditions**: Both weapon and NFT claims use MongoDB's `findOneAndUpdate` with a filter on `ownerAddress = store_wallet`. Only one concurrent request can win -- the other gets `null` (not available).

4. **Points conversion uses atomic $gte guard**: `User.findOneAndUpdate({ pointsBalance: { $gte: amount } }, { $inc: { pointsBalance: -amount } })` is a single atomic operation. Two concurrent conversions cannot overdraft because the `$gte` check and `$inc` happen atomically.

5. **Full rollback on conversion failure**: If $BATTLE transfer fails after points deduction, the deducted points are restored via `$inc: { pointsBalance: +amount }`. Every failure path rolls back.

6. **PurchaseAttempt tracks entire lifecycle**: Created immediately after payment verification (crash safety). The failsafe cron can always find and resolve stuck purchases. Status transitions: `pending -> processing -> completed` or `pending -> needs_refund -> refunded`.

7. **Chain is source of truth for failsafe**: The failsafe always checks on-chain ownership (`ownerOf()`) before deciding to retry vs refund. If a transfer succeeded but the API crashed before recording it, the failsafe detects on-chain ownership and backfills the DB records.

8. **Separate retry counters**: Transfer retries (max 3) and refund retries (max 10) are tracked independently on the PurchaseAttempt. After max refund retries, a critical Discord alert is sent.

9. **Sold-out auto-refund**: When all NFTs are sold but a valid payment was received, the API attempts an immediate refund. If that fails, the PurchaseAttempt is created with `needs_refund` status for the failsafe to handle.

---

## Models/Schemas Introduced

### WeaponNft

| Field | Type | Description |
|-------|------|-------------|
| `tokenId` | Number (unique) | ERC-721 token ID |
| `contractAddress` | String | WeaponNFT contract address |
| `ownerAddress` | String (indexed) | Current owner (lowercase) |
| `weaponName` | String | Weapon display name |
| `category` | String enum | assault, smg, lmg, marksman, handgun, launcher, shotgun, melee |
| `blueprintTier` | String enum | base, epic, legendary, mythic |
| `mythicLevel` | Number (0-5) | Mythic upgrade level |
| `price` | Number | Price in $BATTLE |
| `supply` | Number | Total supply |
| `sold` | Number | Units sold |
| `imageUri` | String | Weapon image URL |

### PurchaseAttempt

| Field | Type | Description |
|-------|------|-------------|
| `type` | String enum | nft_purchase, weapon_purchase |
| `buyerAddress` | String | Buyer's wallet |
| `paymentTxHash` | String (unique) | On-chain payment transaction hash |
| `paymentAmount` | String | Actual payment (stored as string for precision) |
| `paymentCurrency` | String enum | AVAX, BATTLE |
| `storeWalletAddress` | String | Platform wallet that received payment |
| `tokenId` | Number | ChainBoi NFT token ID (for nft_purchase) |
| `weaponTokenId` | Number | Weapon NFT token ID (for weapon_purchase) |
| `weaponName` | String | Weapon name (for weapon_purchase) |
| `status` | String enum | pending, processing, completed, needs_refund, refunded |
| `transferTxHash` | String | On-chain NFT transfer tx hash |
| `refundTxHash` | String | On-chain refund tx hash |
| `retryCount` | Number | Transfer retry count (max 3) |
| `refundRetryCount` | Number | Refund retry count (max 10) |
| `failsafeProcessing` | Boolean | Lock flag for failsafe cron |
| `failsafeStartedAt` | Date | Lock acquisition timestamp |
| `failsafeAttempts` | Number | Total failsafe processing attempts |
| `processingStartedAt` | Date | When processing began (for stuck detection) |

Indexes: `(paymentTxHash)` unique, `(status, createdAt)` for failsafe queries, `(buyerAddress, status)` for user lookup.

### Transaction (extended)

New type added in Phase 5: `refund`. Full enum: `level_up`, `weapon_purchase`, `points_conversion`, `prize_payout`, `nft_transfer`, `nft_purchase`, `trait_airdrop`, `rarity_airdrop`, `refund`.

---

## Concurrency Safety Analysis

### Points Conversion

```javascript
// Atomic deduct with $gte guard (pointsController.js)
User.findOneAndUpdate(
  { _id: user._id, pointsBalance: { $gte: amount } },
  { $inc: { pointsBalance: -amount, battleTokenBalance: amount } }
)
```

Two concurrent requests for 200 points each, user has 300:
- Request A: `300 >= 200` -> deducts -> balance 100
- Request B: `100 >= 200` -> FAILS (atomic check)
- Result: Only one conversion succeeds. No overdraft.

### Weapon Purchase

```javascript
// Atomic claim (armoryController.js)
WeaponNft.findOneAndUpdate(
  { weaponName, ownerAddress: weaponStoreWallet.address },
  { ownerAddress: buyerAddress }
)
```

Two buyers for the same weapon simultaneously: only one `findOneAndUpdate` returns the document. The other gets `null`.

### NFT Purchase

```javascript
// Atomic claim (armoryController.js)
ChainboiNft.findOneAndUpdate(
  { ownerAddress: nftStoreWallet.address },
  { ownerAddress: buyerAddress }
)
```

Same pattern as weapons. One buyer wins, the other gets "No NFTs available."

---

## Security Model

### On-Chain Transaction Verification

| Check | Weapon Purchase | NFT Purchase |
|-------|----------------|--------------|
| Sender matches | Transfer event `from` = submitted address | `tx.from` = submitted address |
| Correct recipient | Transfer event `to` = weapon_store | `tx.to` = nft_store |
| Sufficient amount | `parsed.args.value >= expectedAmount` | `tx.value >= expectedAmount` |
| Tx not reused | `Transaction.findOne` + `PurchaseAttempt.findOne` | Same |
| Tx succeeded | `receipt.status === 1` | `receipt.status === 1` |

### Points Conversion Security

Anyone can call `POST /points/convert { address: "0xVICTIM", amount: 100 }`. The victim gains $BATTLE tokens (transferred to their wallet on-chain) and loses points. The attacker cannot redirect funds. Acceptable for hackathon; production should add `decodeToken`.

---

## Endpoints Summary

### Armory Routes (`/api/v1/armory/*`) -- All public

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/armory/weapons` | Public | All weapons grouped by category (in stock) |
| GET | `/armory/weapons/:category` | Public | Weapons in a specific category |
| GET | `/armory/weapon/:weaponId` | Public | Weapon detail + price + payment address |
| GET | `/armory/nfts` | Public | Available ChainBoi NFTs for sale |
| GET | `/armory/nft/:tokenId` | Public | Single NFT detail + price + payment address |
| POST | `/armory/purchase/weapon` | Public | Verify $BATTLE payment, transfer weapon NFT |
| POST | `/armory/purchase/nft` | Public | Verify AVAX payment, transfer ChainBoi NFT |
| GET | `/armory/balance/:address` | Public | Points + $BATTLE balance for a wallet |

### Points Routes (`/api/v1/points/*`) -- All public

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/points/:address` | Public | Points balance + max convertible |
| POST | `/points/convert` | Public | Convert points to $BATTLE (1:1) |
| GET | `/points/history/:address` | Public | Paginated conversion/purchase history |

---

## Smart Contracts (Fuji Testnet)

| Contract | Address | Role in Phase 5 |
|----------|---------|-----------------|
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | Weapon payment verification, points conversion |
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | NFT transfer from nft_store to buyer |
| WeaponNFT | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` | Weapon transfer from weapon_store to buyer |

### Platform Wallets

| Wallet | Address | Role in Phase 5 |
|--------|---------|-----------------|
| NFT Store | `0x469622d0fb5ed43b2e7c45e98d355f2cf03816a0` | Holds ChainBoi NFTs, receives AVAX, sends refunds |
| Weapon Store | `0xd40e6631617b7557c28789bac01648a74753739c` | Holds weapon NFTs, receives $BATTLE, sends refunds |
| Rewards | `0xcb7ba57b0e2613b3e220b191ca01e603c375dfb5` | Sends $BATTLE for points conversion |

---

## Testnet Pricing

| Item | Price | Currency |
|------|-------|----------|
| ChainBoi NFT | 0.001 AVAX | AVAX (native) |
| Weapons | 1-5 $BATTLE | $BATTLE (ERC-20) |
| Points conversion | 1:1 | Points -> $BATTLE |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `controllers/armoryController.js` | Weapon + NFT browsing and purchase with failsafe |
| `controllers/pointsController.js` | Points balance, conversion with atomic deduction |
| `routes/armoryRoutes.js` | 8 armory endpoints (all public) |
| `routes/pointsRoutes.js` | 3 points endpoints (all public) |
| `jobs/purchaseFailsafeJob.js` | 3-phase failsafe: retry transfers, process refunds, cleanup |
| `models/weaponNftModel.js` | Weapon NFT schema with category, tier, price |
| `models/purchaseAttemptModel.js` | Purchase lifecycle with dual retry counters |
| `models/chainboiNftModel.js` | ChainBoi NFT (extended with ownership for armory) |
| `models/transactionModel.js` | Extended with refund transaction type |
| `utils/retryHelper.js` | `withRetry()` exponential backoff wrapper |
| `utils/contractUtils.js` | `transferNft`, `transferWeaponNft`, `transferBattleTokens`, `getBattleBalance` |
| `utils/avaxUtils.js` | `sendAvax`, `getAvaxBalance`, `getProvider` |
| `utils/cryptUtils.js` | `decrypt` for AES-encrypted wallet keys |

---

## Dependencies on Previous Phases

| Dependency | From Phase | Used By |
|------------|-----------|---------|
| `User` model (address, hasNft, pointsBalance, battleTokenBalance) | Phase 1 | User lookup, points balance, NFT ownership check |
| `Wallet` model (AES-encrypted keys) | Phase 0 | nft_store, weapon_store, rewards wallet decryption |
| `Transaction` model | Phase 0 | Recording purchases, conversions, refunds |
| `Settings` model (nftPrice, armoryClosedDuringCooldown) | Phase 0 | NFT pricing, cooldown lockout |
| `ChainboiNft` model | Phase 2/3 | NFT ownership tracking for armory |
| `syncScoresJob` (pointsBalance increments) | Phase 1 | Points accumulation that feeds conversion |
| `contractUtils.js` (transferNft, transferWeaponNft, etc.) | Phase 0/2 | On-chain NFT transfers |
| `avaxUtils.js` (sendAvax, getProvider) | Phase 0 | AVAX payment verification and refunds |
| `cryptUtils.js` (decrypt) | Phase 0 | Wallet key decryption |
| `retryHelper.js` (withRetry) | Phase 0 | Transfer retry with exponential backoff |
| `config/constants.js` (WEAPON_CATEGORIES, WEAPON_DEFINITIONS, PURCHASE_FAILSAFE) | Phase 0 | Weapon catalog, failsafe thresholds |
| `Tournament` model | Phase 4 | Armory cooldown check (armoryClosedDuringCooldown) |
| Firebase RTDB sync | Phase 1 | Syncing purchased weapons/NFTs to game |
| Discord webhooks | Phase 4 | Refund notifications, critical alerts |
