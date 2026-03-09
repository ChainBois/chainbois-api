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

## Points System: Complete Flow

### Two Separate Tracking Fields

The points system uses **two independent fields** on the User model:

| Field | Purpose | Modified By |
|-------|---------|-------------|
| `user.score` | Cumulative game score from Firebase (monotonically increasing) | `syncScoresJob` only |
| `user.pointsBalance` | Spendable points balance (goes up and down) | `syncScoresJob` (increment) and `convertPoints` (decrement) |

These fields are **independent**. The sync job uses `user.score` to calculate deltas. The conversion endpoint only touches `user.pointsBalance`. This separation is the key to preventing double-counting.

### How Points Accumulate (syncScoresJob)

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
    |                    |                        | user.score = 5000   |
    |                    |                        | user.pointsBalance  |
    |                    |                        |   += 500 (ADD delta)|
    |                    |                        |   (NOT overwrite)   |
    |                    |                        |-------------------->|
```

**CRITICAL**: The sync job computes a **delta** from `user.score` (cumulative) and **ADDS** it to `pointsBalance`. It does NOT overwrite the total.

**Delta formula** (syncScoresJob.js lines 86-94):
```
firebaseScore = Firebase.users[uid].Score    // cumulative, game only increments
previousScore = user.score                    // last known cumulative
delta = firebaseScore - previousScore         // only NEW points since last sync
if (delta <= 0) skip                          // no change or score went down
```

**Anti-cheat caps** (lines 97-120):
```
cappedDelta = min(delta, MAX_POINTS_PER_MATCH)  // cap at 5000 per sync cycle
cappedDelta = checkDailyEarnings(cappedDelta)     // cap at 50,000 per day
```

### Why Conversion Does NOT Cause Double-Counting

**Example timeline**:
```
Time 1: Firebase.Score = 5000
  Sync: delta = 5000 - 0 = 5000
  Result: user.score = 5000, user.pointsBalance = 5000

Time 2: User converts 3000 points to $BATTLE
  Conversion: pointsBalance -= 3000
  Result: user.score = 5000 (UNCHANGED), user.pointsBalance = 2000

Time 3: Firebase.Score = 5800 (user earned 800 more in-game)
  Sync: delta = 5800 - 5000 = 800 (only the NEW 800, not the converted 3000)
  Result: user.score = 5800, user.pointsBalance = 2800

Time 4: Firebase.Score = 5800 (no change)
  Sync: delta = 5800 - 5800 = 0 → SKIP (no new points)
```

The conversion deducts from `pointsBalance` but does NOT modify `user.score`. The next sync calculates delta from `user.score`, which still reflects the last cumulative total. The 3000 converted points are never re-added because they were already counted in `user.score = 5000`.

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
   |                               | 2. ATOMIC: deduct points      |
   |                               |    findOneAndUpdate with      |
   |                               |    { pointsBalance: {$gte} }  |
   |                               |    $inc: { points: -200,      |
   |                               |      battleTokenBalance: +200}|
   |                               | 3. Check rewards wallet       |
   |                               |    has >= 200 $BATTLE          |
   |                               | 4. Transfer 200 $BATTLE       |
   |                               |    rewards wallet -> user      |
   |                               |------------------------------>|
   |                               |<---- transfer receipt ---------|
   |                               | 5. Record Transaction          |
   |                               |                               |
   |                               | ON ANY FAILURE (steps 3-4):   |
   |                               |   Rollback: $inc points +200  |
   |                               |                               |
   |<--- { converted: 200,        |                               |
   |       remaining: 300,         |                               |
   |       txHash: 0x... } -------|                               |
```

### Points to NFT Stats Pipeline

The `syncScoresJob` also propagates game data to NFT metadata (added in Phase 3B):

```
syncScoresJob                           MongoDB
    |                                     |
    | After updating user.score:          |
    | if (user.address && user.hasNft)    |
    |   ChainboiNft.updateMany(           |
    |     { ownerAddress: user.address }, |
    |     { inGameStats.score: score,     |
    |       inGameStats.gamesPlayed: gp } |
    |   )                                 |
    |------------------------------------>|
    |                                     |
    | This feeds the dynamic metadata     |
    | endpoint: GET /metadata/:tokenId    |
    | which serves live stats to          |
    | marketplaces and explorers          |
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

## Security Analysis

### Points Endpoints — No Auth by Design

| Endpoint | Auth? | Risk | Rationale |
|----------|-------|------|-----------|
| `GET /points/:address` | No | **Low** | Read-only. Wallet addresses are public (visible on block explorers). No sensitive data beyond what's on-chain. |
| `GET /points/history/:address` | No | **Low** | Read-only transaction history. Same rationale. |
| `POST /points/convert` | No | **Medium-Low** | Anyone can trigger conversion for any address, BUT tokens go to the address owner's wallet. Attacker gains nothing. |

**POST /points/convert without auth — detailed analysis:**

An attacker who knows a victim's wallet address could call `POST /points/convert { address: "0xVICTIM", amount: 100 }`. What happens:
1. 100 points deducted from victim's `pointsBalance`
2. 100 $BATTLE transferred to victim's wallet (on-chain, irreversible)

The victim **gains** $BATTLE tokens (the more valuable asset) and loses points (valueless outside the platform). The attacker cannot redirect funds to themselves. The worst case is an unwanted conversion — the victim may have preferred to hold points.

**Hackathon verdict**: Acceptable. Points and $BATTLE have equivalent value (1:1 conversion). No financial loss to the victim.

**Production recommendation**: Add `decodeToken` auth to `/points/convert` so only the account owner can trigger conversions.

### Armory Purchase Endpoints — No Auth, On-Chain Verification

Purchase endpoints use **on-chain transaction verification** instead of auth tokens:

| Check | Weapon Purchase | NFT Purchase |
|-------|----------------|--------------|
| Sender matches submitted address | Transaction logs (`Transfer` event from) | `tx.from` matches `address` |
| Recipient is correct platform wallet | Transfer event `to` = weapon_store | `tx.to` = nft_store |
| Amount sufficient | `parsed.args.value >= expectedAmount` | `tx.value >= expectedAmount` |
| Transaction not reused | `Transaction.findOne({ txHash })` | Same |

This is secure because:
- You cannot forge an on-chain transaction (cryptographically signed by the sender)
- The txHash uniqueness check prevents replay attacks
- The sender verification prevents using someone else's payment

### Anti-Gaming Vectors

| Vector | Protection | Residual Risk |
|--------|-----------|---------------|
| Score manipulation in Firebase | Anti-cheat: per-sync cap (5000), daily cap (50,000), threat scoring, bans | Firebase security rules are the first line of defense — if weak, scores can be inflated |
| txHash reuse | All purchase/level-up endpoints check `Transaction.findOne({ txHash })` | None — replay is impossible |
| Points double-counting after conversion | `user.score` (cumulative tracker) is independent of `user.pointsBalance` (spendable) | None — see delta mechanism above |
| Unauthorized points conversion | Tokens go to the address owner's wallet, not the attacker | Unwanted conversion (no financial loss) |
| Front-running weapon claims | Weapon claim + verify is fast (~1-3s), txHash uniqueness prevents repeated abuse | Brief window where weapon appears unavailable |

---

## Concurrency & Race Condition Audit

### Points Conversion — SAFE

**Mechanism**: Atomic `findOneAndUpdate` with `$gte` guard (pointsController.js lines 77-81):
```javascript
User.findOneAndUpdate(
  { _id: user._id, pointsBalance: { $gte: amount } },
  { $inc: { pointsBalance: -amount, battleTokenBalance: amount } }
)
```

**Scenario**: Two concurrent requests for 200 points each, user has 300 points.
- Request A: `300 >= 200` → deducts → balance now 100
- Request B: `100 >= 200` → FAILS (atomic check)
- Result: Only one conversion succeeds. No overdraft possible.

**Rollback**: Every failure path (rewards wallet missing, insufficient $BATTLE, transfer failure) atomically restores points via `$inc: { pointsBalance: +amount }`.

### Weapon Purchase — SAFE (with minor note)

**Mechanism**: Atomic `findOneAndUpdate` claims weapon BEFORE on-chain verification (armoryController.js line 261):
```javascript
WeaponNft.findOneAndUpdate(
  { weaponName, ownerAddress: weaponStoreWallet.address },
  { ownerAddress: buyerAddress }
)
```

**Why claim-first**: Prevents double-sells. If two buyers submit valid payments for the same weapon simultaneously, only one `findOneAndUpdate` returns the document — the other gets `null` (weapon not available).

**Rollback**: If on-chain verification fails, ownership is restored to weapon_store.

**Minor note**: During verification (~1-3 seconds), the weapon appears unavailable to other buyers. For a hackathon with 30 weapons and low traffic, this is negligible. In production, the reference project pattern (distributed lock + MongoDB transactions) would be more robust.

### NFT Purchase — SAFE (with edge case)

**Mechanism**: On-chain verification FIRST, then atomic `findOneAndUpdate` (armoryController.js line 463):
```javascript
// 1. Verify AVAX payment on-chain (lines 434-456)
// 2. Then atomically claim NFT:
ChainboiNft.findOneAndUpdate(
  { ownerAddress: nftStoreWallet.address },
  { ownerAddress: buyerAddress }
)
```

**Why verify-first**: Ensures only verified payments proceed to the claim step.

**Edge case**: Two buyers both verify valid payments simultaneously. One succeeds at claiming; the other gets "No NFTs available for purchase" (404). The second buyer's AVAX payment is already on-chain. They would need a manual refund. For a hackathon with 50 NFTs and low traffic, this is extremely unlikely.

**Production note**: The reference project (ghetto-warzones shuffles controller) solves this with a **reserve-then-verify-then-complete** pattern using distributed locks, MongoDB ACID transactions, and 5-minute reservation windows. See the NFT Allocation Architecture section below.

### Level-Up — SAFE

**Mechanism**: Protected by `decodeToken` (Firebase auth), on-chain ownership verification, on-chain payment verification, and txHash replay protection. The deployer wallet calls `setLevel()` on-chain only after all checks pass. No race condition possible — the on-chain level is the source of truth.

### Score Sync — SAFE

**Mechanism**: Single cron job instance (PM2 primary), processes users sequentially with per-user error isolation. Each user's points are incremented independently. No two sync cycles can overlap because the cron interval (5 min) exceeds the typical job duration.

---

## NFT Allocation Architecture

### Current ChainBois Approach (Hackathon-Scale)

ChainBois uses **atomic `findOneAndUpdate`** for NFT/weapon claims. This is a single-operation pattern:

```
Available NFT (ownerAddress = nft_store)
    |
    v  [findOneAndUpdate: change ownerAddress atomically]
Claimed NFT (ownerAddress = buyer)
    |
    +-- [on-chain transfer succeeds] → DONE
    |
    +-- [on-chain transfer fails] → Rollback: restore ownerAddress to nft_store
```

**Strengths**: Simple, correct for low concurrency. MongoDB's `findOneAndUpdate` is atomic — only one caller wins.

**Limitations for high-traffic production**:
- No reservation window (claim is immediate and final pending verification)
- No distributed lock (concurrent requests from same user are possible)
- No ACID transaction spanning multiple collections (claim + metrics update are separate operations)
- No failsafe cron to clean up stuck states

### Reference Project Approach (Production-Scale)

The ghetto-warzones shuffles controller uses a **5-layer protection model** with a **reserve-then-complete** pattern:

```
Layer 1: ReservationLock (distributed lock)
  - MongoDB unique compound index on {userAddress, shuffleID}
  - 60-second TTL, prevents concurrent requests from same user
  - Retry with exponential backoff on lock contention

Layer 2: MongoDB ACID Transaction
  - session.startTransaction() wraps all reads + writes
  - Shuffle.nfts array read + reservation creation + NFT removal = single atomic transaction

Layer 3: Reserved NFT Set Exclusion
  - Before selecting NFTs, query ALL pending reservations
  - Build Set of reserved NFT IDs, exclude from available pool
  - Prevents any gap between "selected" and "reserved" states

Layer 4: Atomic $pull from Shuffle.nfts
  - NFTs removed from available array within the same transaction
  - $addToSet for idempotent restoration on expiry/cancellation

Layer 5: Single Pending Reservation Per User
  - If user already has a pending reservation → reject new request
  - Combined with Layer 1 lock, prevents duplicate reservations
```

**State transitions**:
```
NFT in Shuffle.nfts (available)
  |
  v  [reserveShuffleNfts: $pull from array + create ReservedNft]
ReservedNft: status "pending", 5-minute TTL
  |
  +-- [completeShufflePurchase] → status "processing" → transfer → status "completed"
  |
  +-- [5 min expiry, no payment] → failsafe cron restores NFTs via $addToSet
  |
  +-- [5 min expiry, payment found] → failsafe cron completes transfer
```

**Additional safeguards**:
- **Anti-re-rolling**: `WalletNftAssignment` persists which NFTs were assigned to a user (48h TTL). If they cancel and retry, they get the SAME NFTs back (prevents gaming for rares).
- **Verification tokens**: AES-256-GCM encrypted token binds NFT IDs + buyer address + timestamp. Payment transaction must contain this token on-chain.
- **Failsafe cron jobs**: Process stuck reservations every 5 minutes, clean up expired reservations every 30 minutes, auto-end sold-out shuffles every 5 minutes.
- **On-chain consistency**: Before selecting NFTs, the system queries the actual blockchain wallet to prune "phantom" NFTs (in DB but not on-chain).

### When to Upgrade

For ChainBois with 50 testnet NFTs and a hackathon audience, the current `findOneAndUpdate` pattern is sufficient. The upgrade path for mainnet/production would involve:

1. Add a `ReservationLock` model with TTL index
2. Switch to MongoDB sessions/transactions for purchase flows
3. Add a `ReservedNft` model with reservation lifecycle
4. Add failsafe cron jobs for stuck reservation cleanup
5. Add on-chain wallet verification before listing available NFTs

---

## Purchase Failsafe & Auto-Refund System

### Problem

When a user sends payment but the purchase doesn't complete (sold out, transfer failure, server crash), the user loses funds. The failsafe system automatically detects, retries, or refunds these stuck purchases.

### Architecture (inspired by ghetto-warzones shuffle failsafe)

```
+------------------------------------------------------------------+
|                    PURCHASE FLOW                                  |
|                                                                   |
|  1. Verify on-chain payment                                      |
|  2. Create PurchaseAttempt (status: "pending")                   |
|  3. Attempt NFT/weapon transfer (3 retries with backoff)         |
|  4. On success: status = "completed" → done                     |
|  5. On failure: status stays "pending" → failsafe picks up      |
|  6. On sold-out: status = "needs_refund" → refund immediately   |
+----------------------------+-------------------------------------+
                             |
                    If stuck > 5 minutes
                             |
                             v
+------------------------------------------------------------------+
|              FAILSAFE CRON (every 5 minutes)                     |
|                                                                   |
|  Phase 1: Process stuck "pending" purchases                      |
|    - Check on-chain ownership (getNftOwner / getWeaponNftOwner)  |
|    - If buyer owns asset: backfill DB records → "completed"      |
|    - If store owns asset: retry transfer (up to 3 total)         |
|    - If max retries: restore store ownership → "needs_refund"    |
|                                                                   |
|  Phase 2: Process refunds ("needs_refund")                       |
|    - Check store wallet balance (needs gas reserve)              |
|    - AVAX: sendAvax(storeKey, buyer, amount)                     |
|    - BATTLE: transferBattleTokens(buyer, amount, storeKey)       |
|    - On success: "refunded" + Discord notification               |
|    - On failure: retry (up to 10 attempts, then critical alert)  |
|                                                                   |
|  Phase 3: Cleanup                                                |
|    - Release stuck failsafe locks (> 10 min)                    |
|    - Escalate stuck "processing" → "pending" (> 15 min)         |
+------------------------------------------------------------------+
```

### PurchaseAttempt Lifecycle

```
                    Payment verified
                           |
              +------------+------------+
              |                         |
        Claim succeeds            Claim fails (sold out)
              |                         |
              v                         v
        +-----------+           +---------------+
        |  pending  |           | needs_refund  |
        +-----------+           +-------+-------+
              |                         |
              v                  Refund attempt
        +-------------+         (auto or failsafe)
        | processing  |                |
        +------+------+         +------+------+
               |                |             |
        Transfer attempt    Success       Failure
        (3 retries)            |             |
               |            refunded   needs_refund
        +------+------+    (done)     (retry next cycle)
        |             |
     Success       Failure
        |             |
   completed       pending
    (done!)    (failsafe picks up)
```

### Key Design Principles

1. **"Revert to pending, let failsafe handle it"**: Every transfer failure sets status back to `"pending"`. The failsafe cron resolves it.

2. **Never rollback DB ownership on transfer failure**: If a weapon/NFT is claimed in MongoDB but transfer fails, KEEP the DB claim. Rolling back opens a window where another buyer can claim the same asset, causing one buyer to lose funds. Only rollback when transitioning to refund.

3. **Chain is source of truth**: The failsafe always checks on-chain ownership (`ownerOf()`) before deciding to retry vs refund. If the transfer actually succeeded despite a timeout error, it backfills DB records.

4. **Store wallets need gas reserves**: Refunds require gas for on-chain transactions. Store wallets must maintain spare AVAX beyond received payments.

5. **Separate retry counters**: Transfer retries (max 3) and refund retries (max 10) are tracked independently.

### Failure Mode Coverage

| Failure Mode | Before Failsafe | After Failsafe |
|-------------|-----------------|----------------|
| Paid, sold out | 404, funds stuck | Immediate refund attempt + failsafe backup |
| Paid, transfer fails | 500, funds stuck | 3 in-request retries → failsafe retries → auto-refund |
| Server crash before transfer | No record | PurchaseAttempt exists, failsafe completes or refunds |
| Server crash after transfer | Asset moved, no record | Failsafe detects on-chain ownership, backfills records |
| Refund fails (wallet empty) | N/A | Retries up to 10x, then Discord critical alert |
| Same txHash resubmitted | Check was broken | Fixed: checks PurchaseAttempt + Transaction.metadata |

### Key Files

| File | Purpose |
|------|---------|
| `models/purchaseAttemptModel.js` | Purchase attempt lifecycle tracking |
| `jobs/purchaseFailsafeJob.js` | Failsafe cron: retry + refund |
| `utils/contractUtils.js` | `getWeaponNftOwner(tokenId)` for on-chain weapon ownership |

---

## Key Files

| File | Purpose |
|------|---------|
| `controllers/armoryController.js` | Weapon + NFT browsing and purchase (with failsafe integration) |
| `controllers/pointsController.js` | Points balance + conversion |
| `routes/armoryRoutes.js` | Armory routes (all public) |
| `routes/pointsRoutes.js` | Points routes (all public) |
| `models/weaponNftModel.js` | Weapon NFT data + ownership |
| `models/chainboiNftModel.js` | ChainBoi NFT data + ownership |
| `models/purchaseAttemptModel.js` | Purchase attempt lifecycle tracking |
| `models/settingsModel.js` | nftPrice, armory settings |
| `models/transactionModel.js` | Records purchases, conversions, and refunds |
