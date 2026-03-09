# Plan: Purchase Failsafe & Auto-Refund System

## Problem Statement

When a user sends payment (AVAX for NFTs, $BATTLE for weapons) but the purchase doesn't complete, the user loses funds. Current failure scenarios with no recovery:

| Scenario | NFT Purchase | Weapon Purchase |
|----------|-------------|-----------------|
| Payment verified, all NFTs sold out | User's AVAX stuck in nft_store | N/A (claim-first) |
| Payment verified, NFT transfer fails | User's AVAX stuck in nft_store | User's $BATTLE stuck in weapon_store |
| Server crash mid-transfer | NFT may or may not have transferred, no Transaction record | Same |
| Server crash after transfer, before DB update | NFT transferred but no record, user thinks it failed | Same |

### Additional Bug Found

The current replay protection checks `Transaction.findOne({ txHash })` where `txHash` is the **payment** hash, but Transaction stores the **transfer** hash in `txHash` and the payment hash in `metadata.paymentTxHash`. The check never matches, making replay protection non-functional (though the atomic claim prevents actual double-purchases).

---

## Design: Adapted from Reference Project (ghetto-warzones shuffles)

### Reference Project's 5-Layer Approach (Production-Scale)

The reference uses: distributed locks → MongoDB ACID transactions → reservation windows with TTL → verification tokens → failsafe cron with blockchain scanning → auto-refund + auto-retry.

### ChainBois Adaptation (Hackathon-Scale)

We use the **core principles** without the full complexity:

1. **PurchaseAttempt model** — records every purchase attempt with lifecycle tracking (inspired by ReservedNft)
2. **Create record AFTER payment verification + claim** — ensures we only track legitimate, paid-for attempts
3. **Retry with backoff** — transfer retries in the request (3 attempts) before deferring to cron
4. **Failsafe cron job** — processes stuck/failed attempts every 5 minutes
5. **Auto-refund** — sends payment back from store wallet to buyer
6. **On-chain verification** — checks actual NFT/weapon ownership on-chain before deciding to retry vs refund
7. **Fix replay protection** — check `metadata.paymentTxHash` too

### Key Design Principles (from reference)

> **"Revert to pending, let failsafe handle it."**
> Every failure point sets status back to "pending" rather than "failed". The failsafe cron will detect it, check on-chain state, and either complete the purchase or refund.

> **"Do NOT rollback DB ownership on transfer failure."**
> If a weapon/NFT is claimed in MongoDB but the on-chain transfer fails, KEEP the DB claim. Rolling back opens a window where a second buyer can purchase the same asset, causing one buyer to lose funds permanently. Only rollback when transitioning to refund.

> **"Chain is source of truth."**
> Always check on-chain state (ownerOf) before acting. If the transfer actually succeeded despite a timeout/error, backfill DB records instead of retrying.

> **"Store wallets must maintain gas reserves."**
> Refunds require gas. Store wallets must have spare AVAX beyond received payments. Add balance checks before refund attempts.

---

## Assumptions

- **Single PM2 instance** for cron jobs (existing pattern). Distributed deployment would need Redis/advisory locks.
- **Store wallets have gas reserves** for refunds (document in MANUAL_STEPS).

---

## Files to Create

| File | Purpose |
|------|---------|
| `models/purchaseAttemptModel.js` | Purchase attempt lifecycle tracking |
| `jobs/purchaseFailsafeJob.js` | Failsafe cron: retry transfers + auto-refund |

## Files to Modify

| File | Changes |
|------|---------|
| `controllers/armoryController.js` | Create PurchaseAttempt, retry transfers, handle sold-out refund |
| `utils/contractUtils.js` | Add `getWeaponNftOwner(tokenId)` for on-chain weapon ownership |
| `server.js` | Register purchaseFailsafeJob cron (every 5 min) |
| `config/constants.js` | Add PURCHASE_FAILSAFE constants, TRANSACTION_TYPES.REFUND |
| `models/transactionModel.js` | Add "refund" to type enum |
| `docs/phase5/FLOW.md` | Add failsafe architecture documentation |

---

## Task 1: PurchaseAttempt Model

**File**: `models/purchaseAttemptModel.js`

```javascript
{
  type: {
    type: String,
    enum: ["nft_purchase", "weapon_purchase"],
    required: true,
  },
  buyerAddress: { type: String, required: true },

  // Payment info — store ACTUAL on-chain amount, not expected price
  // (user may overpay; we refund what they actually sent)
  paymentTxHash: { type: String, required: true },
  paymentAmount: { type: String, required: true },   // String! avoids float precision issues
  paymentCurrency: { type: String, enum: ["AVAX", "BATTLE"], required: true },
  storeWalletAddress: { type: String, required: true },

  // Asset info (what they're buying)
  tokenId: { type: Number, default: null },        // ChainBoi NFT tokenId (set after claim)
  weaponTokenId: { type: Number, default: null },   // Weapon NFT tokenId (set after claim)
  weaponName: { type: String, default: "" },

  // Lifecycle
  status: {
    type: String,
    enum: [
      "pending",             // Created, transfer not yet attempted or deferred to failsafe
      "processing",          // Transfer in progress (prevents failsafe from also processing)
      "completed",           // NFT transferred, Transaction recorded, all done
      "needs_refund",        // Transfer impossible (sold out, max retries), refund required
      "refunded",            // Refund sent successfully
    ],
    default: "pending",
  },

  // Transfer tracking
  transferTxHash: { type: String, default: "" },
  refundTxHash: { type: String, default: "" },

  // Transfer retry tracking
  retryCount: { type: Number, default: 0, min: 0 },
  // Refund retry tracking (separate from transfer retries)
  refundRetryCount: { type: Number, default: 0, min: 0 },
  lastRetry: { type: Date, default: null },
  failureReason: { type: String, default: "" },

  // Failsafe tracking
  failsafeProcessing: { type: Boolean, default: false },
  failsafeStartedAt: { type: Date, default: null },
  failsafeAttempts: { type: Number, default: 0 },

  // Processing timestamp (for "processing" stuck detection)
  processingStartedAt: { type: Date, default: null },
}
```

**Indexes**:
- `{ paymentTxHash: 1 }` — unique (non-sparse, paymentTxHash is required)
- `{ status: 1, createdAt: 1 }` — failsafe queries
- `{ buyerAddress: 1, status: 1 }` — user lookup

---

## Task 2: Modified NFT Purchase Flow

**File**: `controllers/armoryController.js` — `purchaseNft`

```
1. Validate inputs (same)
2. Find user by wallet address (same)
3. Get nft_store wallet (same)
4. Get price from settings (same)

5. FIX REPLAY PROTECTION:
   Check Transaction: { $or: [{ txHash }, { "metadata.paymentTxHash": txHash }] }
   Check PurchaseAttempt: { paymentTxHash: txHash }
   → If completed: 409 "already processed"
   → If pending/processing: 409 "being processed, please wait"
   → If needs_refund: 409 "pending refund, please wait"
   → If refunded: 409 "was refunded, submit new payment"

6. Verify on-chain AVAX payment (same checks: sender, recipient, amount)
   ALSO capture actual tx.value (may be > expected price)

7. Atomically claim NFT (same findOneAndUpdate)
   IF SOLD OUT (returns null):
     → Create PurchaseAttempt with status "needs_refund"
       paymentAmount = ethers.formatEther(tx.value) (actual amount, as string)
     → Attempt immediate refund: sendAvax(nftStoreKey, buyer, String(paymentAmount))
       - Check store wallet AVAX balance first (needs gas reserve)
       - On success: status = "refunded", return 404 with refund info
       - On failure: status stays "needs_refund", return 404 (failsafe will refund)

8. CREATE PurchaseAttempt with status "pending"
   (AFTER claim succeeds, so we have tokenId)
   tokenId = availableNft.tokenId
   paymentAmount = ethers.formatEther(tx.value) (actual amount sent, as string)

9. Set PurchaseAttempt status = "processing", processingStartedAt = now

10. Transfer NFT with RETRY (3 attempts, exponential backoff via withRetry)
    On success: → continue to step 11
    On failure: → Set status = "pending", failureReason = error message
                → Return 500: "Transfer in progress. If not received, it will be retried automatically."
                → Do NOT rollback DB ownership (failsafe will handle)

11. Set PurchaseAttempt status = "completed", transferTxHash = receipt.hash
12. Update user: hasNft = true, nftTokenId (same)
13. Record Transaction with metadata.paymentTxHash (same)
14. Sync to Firebase (same)
15. Return success (same)
```

### Crash Safety Analysis

| Crash Point | PurchaseAttempt State | Recovery |
|-------------|----------------------|----------|
| After step 6, before step 7 | No record | User retries with same txHash → works (no PurchaseAttempt or Transaction exists) |
| After step 7 (claim), before step 8 | No record, NFT claimed in DB | Failsafe: can't find record. But NFT is claimed, not transferred. Manual intervention needed. **Mitigation**: steps 7-8 are two fast in-memory + DB operations, crash probability is negligible. |
| After step 8, before step 10 | status = "pending", tokenId set | Failsafe picks up, checks on-chain ownership, retries transfer |
| After step 10 (transfer succeeded), before step 11 | status = "processing" | Failsafe detects "processing" stuck > 15 min, checks on-chain → buyer owns NFT → backfill records |
| After step 11, before step 13 | status = "completed" | Transaction not recorded. Failsafe sees "completed" → idempotent skip. Transaction record is non-critical (it's already logged in PurchaseAttempt). |

---

## Task 3: Modified Weapon Purchase Flow

**File**: `controllers/armoryController.js` — `purchaseWeapon`

```
1-3. Same (validate, find user, check hasNft)
4. Find weapon_store wallet (same)

5. FIX REPLAY PROTECTION (same pattern as NFT — check Transaction + PurchaseAttempt)

6. Atomically claim weapon (same, BEFORE verification — prevents double-sells)

7. Verify $BATTLE payment on-chain (same log parsing)
   IF INVALID: Rollback claim, return error. No PurchaseAttempt (user didn't pay correctly).
   ALSO capture actual transfer amount from logs.

8. CREATE PurchaseAttempt with status "pending" IMMEDIATELY after payment verification
   (BEFORE transfer attempt — critical for crash safety)
   weaponTokenId = weapon.tokenId
   weaponName = weapon.weaponName
   paymentAmount = String(weapon.price) (or actual from parsed log args)

9. Set status = "processing", processingStartedAt = now

10. Transfer weapon NFT with RETRY (3 attempts)
    On success: → continue to step 11
    On failure: → Set status = "pending"
                → Do NOT rollback DB ownership (another buyer could claim it!)
                → Return 500: "Transfer in progress..."

11. Set status = "completed", transferTxHash = receipt.hash
12. Record Transaction (same)
13. Sync to Firebase (same)
14. Return success (same)
```

**Critical fix from review**: On transfer failure (step 10), do NOT rollback weapon DB ownership. The weapon stays "owned" by the buyer in MongoDB. The failsafe will retry the on-chain transfer. Only when transitioning to "needs_refund" does the failsafe restore ownership to the store.

---

## Task 4: Failsafe Cron Job

**File**: `jobs/purchaseFailsafeJob.js`

Runs every **5 minutes** on primary PM2 instance. Three phases:

### Phase 1: Process Stuck Purchases

**Query**: status = "pending", createdAt older than 5 minutes

```
For each stuck PurchaseAttempt:
  1. Acquire lock: findOneAndUpdate(
       { _id, failsafeProcessing: false },
       { $set: { failsafeProcessing: true, failsafeStartedAt: new Date() } }
     )
     If null (already locked): skip

  2. Handle null tokenId/weaponTokenId:
     If no asset was claimed (tokenId is null): set status = "needs_refund"
     (payment received but no claim happened — e.g., crash between payment verification and claim)

  3. Check on-chain ownership:
     - For NFT: getNftOwner(tokenId)
     - For weapon: getWeaponNftOwner(weaponTokenId)  ← NEW function

  4a. If buyer already owns the asset ON-CHAIN:
      → Backfill: create Transaction record, update User, sync Firebase
      → Set status = "completed"
      → This handles "server crashed after successful transfer"

  4b. If store still owns the asset and retryCount < TRANSFER_MAX_RETRIES (3):
      → Decrypt store wallet key
      → Retry transfer (single attempt)
      → On success: set status = "completed", backfill records
      → On failure: increment retryCount, keep status = "pending", store failureReason

  4c. If retryCount >= TRANSFER_MAX_RETRIES:
      → Restore DB ownership to store wallet (so asset becomes available again)
      → Set status = "needs_refund"
      → Log: "Max retries reached, scheduling refund"

  5. finally: Release lock (failsafeProcessing = false), increment failsafeAttempts
```

**NOT targeting "processing" status**: If a purchase is in "processing", the original request handler is likely still running. Only escalate "processing" → "pending" if stuck for > 15 minutes (handled in Phase 3).

### Phase 2: Process Refunds

**Query**: status = "needs_refund", refundRetryCount < REFUND_MAX_RETRIES (10)

```
For each PurchaseAttempt needing refund:
  1. Load store wallet key (nft_store for AVAX, weapon_store for BATTLE)

  2. Check store wallet balance (must cover refund + gas):
     - For AVAX: getAvaxBalance(storeWallet.address) >= paymentAmount + ~0.001 gas
     - For BATTLE: getBattleBalance(storeWallet.address) >= paymentAmount

  3. If insufficient balance: increment refundRetryCount, log warning, skip
     (balance may recover from new purchases/deposits)

  4. Send refund:
     - For AVAX: sendAvax(storeKey, buyerAddress, paymentAmount)
       NOTE: paymentAmount is already a string (stored as String in model)
     - For BATTLE: transferBattleTokens(buyerAddress, paymentAmount, storeKey)
       (pass string directly — full 18-decimal precision preserved)

  5. On success:
     → Set status = "refunded", refundTxHash = receipt.hash
     → Create Transaction with type = "refund"
     → Send Discord notification (info level): "Refund: {amount} {currency} → {buyer}"
     → Log: "Refund sent successfully"

  6. On failure:
     → Increment refundRetryCount, store failureReason
     → If refundRetryCount >= REFUND_MAX_RETRIES:
       → Send Discord CRITICAL alert (needs manual intervention)
       → Log: "CRITICAL: Refund permanently failed after 10 attempts"
```

### Phase 3: Cleanup Stuck States

```
1. Release stuck failsafe locks:
   PurchaseAttempt.updateMany(
     { failsafeProcessing: true, failsafeStartedAt: { $lt: 10 minutes ago } },
     { $set: { failsafeProcessing: false } }
   )

2. Escalate stuck "processing" to "pending":
   PurchaseAttempt.updateMany(
     { status: "processing", processingStartedAt: { $lt: 15 minutes ago } },
     { $set: { status: "pending" } }
   )
   (This handles the case where the request handler crashed mid-processing)
```

---

## Task 5: Add `getWeaponNftOwner` to contractUtils

**File**: `utils/contractUtils.js`

```javascript
const getWeaponNftOwner = async function (tokenId) {
  return withRetry(async () => {
    const contract = getWeaponNftContract();
    const owner = await contract.ownerOf(tokenId);
    return owner;
  });
};
```

Add to module.exports.

---

## Task 6: Constants & Model Updates

### `config/constants.js` additions:
```javascript
PURCHASE_FAILSAFE: {
  TRANSFER_MAX_RETRIES: 3,
  TRANSFER_RETRY_DELAY_MS: 2000,        // 2s base, exponential backoff
  FAILSAFE_INTERVAL: "*/5 * * * *",     // Every 5 minutes
  STUCK_THRESHOLD_MINUTES: 5,            // Process "pending" attempts older than this
  PROCESSING_TIMEOUT_MINUTES: 15,        // Escalate "processing" to "pending" after this
  LOCK_TIMEOUT_MINUTES: 10,              // Release stuck failsafe locks
  REFUND_MAX_RETRIES: 10,               // Max refund attempts before critical alert
},
```

### `models/transactionModel.js`:
Add `"refund"` to the `type` enum array.

### `config/constants.js` TRANSACTION_TYPES:
Add `REFUND: "refund"`.

---

## Task 7: Server Registration

**File**: `server.js`

```javascript
const { purchaseFailsafeJob } = require("./jobs/purchaseFailsafeJob");

cron.schedule("*/5 * * * *", purchaseFailsafeJob); // Every 5 minutes
```

Update console.log to include `purchaseFailsafe` in the list.

---

## Task 8: Fix Replay Protection

Both `purchaseNft` and `purchaseWeapon` replace:
```javascript
const existingTx = await Transaction.findOne({ txHash });
```

With:
```javascript
// Check Transaction records (handles both txHash field and metadata.paymentTxHash)
const existingTx = await Transaction.findOne({
  $or: [{ txHash }, { "metadata.paymentTxHash": txHash }],
});
if (existingTx) {
  return next(new AppError("This transaction has already been used", 409));
}

// Check PurchaseAttempt lifecycle
const existingAttempt = await PurchaseAttempt.findOne({ paymentTxHash: txHash });
if (existingAttempt) {
  if (existingAttempt.status === "completed") {
    return next(new AppError("This payment has already been processed", 409));
  }
  if (existingAttempt.status === "refunded") {
    return next(new AppError("This payment was refunded. Please submit a new payment.", 409));
  }
  if (["pending", "processing"].includes(existingAttempt.status)) {
    return next(new AppError("This payment is being processed. Please wait.", 409));
  }
  if (existingAttempt.status === "needs_refund") {
    return next(new AppError("This payment is pending refund. Please wait.", 409));
  }
}
```

---

## Task 9: Documentation Updates

Add to `docs/phase5/FLOW.md`:
- Purchase Failsafe Architecture section
- PurchaseAttempt lifecycle state diagram
- Failsafe cron flow
- Auto-refund flow
- Failure mode handling table

---

## State Transition Diagram

```
                    User pays AVAX/$BATTLE
                           |
                    API verifies payment
                           |
              +------------+------------+
              |                         |
        Claim succeeds            Claim fails (sold out)
              |                         |
              v                         v
     +--------+--------+      +--------+---------+
     | PurchaseAttempt  |      | PurchaseAttempt   |
     | status: pending  |      | status: needs_refund|
     | tokenId: set     |      | tokenId: null     |
     +--------+--------+      +--------+---------+
              |                         |
              v                         v
     +--------+--------+      Refund attempt
     | status: processing|     (in-request or failsafe)
     +--------+--------+              |
              |                +-------+-------+
     Transfer attempt          |               |
     (3 retries in-request)  Success         Failure
              |                |               |
     +--------+--------+  refunded     needs_refund
     |                  |  (done)      (failsafe retries
  Success            Failure            up to 10 times)
     |                  |
     v                  v
  completed          pending
  (done!)         (failsafe picks up
                   after 5 minutes)
```

**Failsafe cron resolves pending:**
```
                  +--------+--------+
                  | status: pending  |
                  | (older than 5min)|
                  +--------+--------+
                           |
              Check on-chain ownership
              (getNftOwner / getWeaponNftOwner)
                           |
              +------------+------------+
              |                         |
        Buyer owns asset          Store still owns
        (transfer happened          |
         but DB wasn't updated)   tokenId null?
              |                   |          |
              v                  Yes      retryCount < 3?
           completed              |        |          |
           (backfill DB)   needs_refund   Yes         No
                                  |        |           |
                           (refund)  Retry transfer  needs_refund
                                          |         (give up, refund)
                                   +------+------+
                                   |             |
                                Success       Failure
                                   |             |
                                completed     pending
                                           (next cycle)
```

**Failsafe escalation for stuck "processing":**
```
     +--------+--------+
     | status: processing|
     | > 15 minutes old  |
     +--------+--------+
              |
              v
     +--------+--------+
     | status: pending  |  (failsafe Phase 3 escalation)
     +--------+--------+
              |
     (normal failsafe Phase 1 picks up)
```

---

## Failure Mode Coverage

| Failure Mode | Current Behavior | After Failsafe |
|-------------|------------------|----------------|
| Paid, sold out | 404 error, AVAX stuck in nft_store | Immediate refund attempt + failsafe backup |
| Paid, transfer fails (network) | 500 error, AVAX stuck | 3 in-request retries → failsafe retries (3 more) → auto-refund |
| Server crash before transfer | No record, AVAX stuck | PurchaseAttempt exists, failsafe completes or refunds |
| Server crash after transfer | NFT moved but no record | Failsafe detects on-chain ownership, backfills records |
| Server crash after DB update | Transaction not recorded | PurchaseAttempt is "completed", skip. Transaction is non-critical |
| Refund fails (store wallet empty) | N/A (no refund) | Retries up to 10 times. Gas from reserves. Discord alert if permanent |
| User retries same txHash | Currently broken | Fixed: checks PurchaseAttempt + Transaction.metadata |
| User overpays (sends 10x price) | Only price is stored | Stores actual tx.value — refund returns full amount paid |
| Transfer fails + rollback + another buyer claims | Possible double-sell | No DB rollback on failure — asset stays "claimed" until resolved |
| Weapon transfer timeout | 500 error, uncertain state | Failsafe checks on-chain ownerOf for weapons (new utility) |

---

## Execution Order

1. Add `getWeaponNftOwner` to `utils/contractUtils.js`
2. Create `models/purchaseAttemptModel.js`
3. Add constants to `config/constants.js` (PURCHASE_FAILSAFE, TRANSACTION_TYPES.REFUND)
4. Add "refund" to `models/transactionModel.js` enum
5. Modify `controllers/armoryController.js` — purchaseNft
6. Modify `controllers/armoryController.js` — purchaseWeapon
7. Create `jobs/purchaseFailsafeJob.js`
8. Register in `server.js`
9. Update `docs/phase5/FLOW.md`
10. Write tests
11. Recursive review

---

## Existing Code to Reuse

| Function | File | Signature | Used For |
|----------|------|-----------|----------|
| `sendAvax` | `utils/avaxUtils.js` | `sendAvax(fromPrivateKey, toAddress, amountInAvax)` — amountInAvax must be **string** | AVAX refunds from nft_store |
| `transferBattleTokens` | `utils/contractUtils.js` | `transferBattleTokens(toAddress, amount, signerPrivateKey)` — amount auto-converted via `String()` | $BATTLE refunds from weapon_store |
| `getNftOwner` | `utils/contractUtils.js` | `getNftOwner(tokenId)` → address | On-chain ChainBoi ownership |
| `getWeaponNftOwner` | `utils/contractUtils.js` | **NEW** `getWeaponNftOwner(tokenId)` → address | On-chain weapon ownership |
| `transferNft` | `utils/contractUtils.js` | `transferNft(fromAddress, toAddress, tokenId, signerPrivateKey)` | NFT transfer retry |
| `transferWeaponNft` | `utils/contractUtils.js` | `transferWeaponNft(fromAddress, toAddress, tokenId, signerPrivateKey)` | Weapon transfer retry |
| `withRetry` | `utils/retryHelper.js` | `withRetry(asyncFn, maxRetries=3, initialDelay=200)` — exponential backoff | Transfer retries |
| `decrypt` | `utils/cryptUtils.js` | `decrypt(key, iv)` → privateKey | Store wallet key decryption |
| `sendDiscordAlert` | `utils/discordService.js` | `sendDiscordAlert({ subject, status, ... })` | Refund failure alerts |
| `getAvaxBalance` | `utils/avaxUtils.js` | `getAvaxBalance(address)` → balance string | Check store wallet can cover refund + gas |
| `getBattleBalance` | `utils/contractUtils.js` | `getBattleBalance(walletAddress)` → balance string | Check store wallet can cover $BATTLE refund |
| `FailedPayout` pattern | `models/failedPayoutModel.js` | — | Model design reference |
| `retryFailedPayouts` pattern | `services/prizeService.js` | — | Retry/resolve pattern reference |

---

## Review Checklist (Issues Addressed)

| # | Issue | Severity | Resolution |
|---|-------|----------|------------|
| 1 | `sendAvax` requires string amount | CRITICAL | `paymentAmount` stored as String in model |
| 2 | Refund doesn't account for gas | CRITICAL | Balance check before refund; store wallets maintain gas reserves |
| 3 | Race between in-request and failsafe cron | CRITICAL | Failsafe only targets "pending", not "processing". Stuck "processing" escalated after 15 min |
| 4 | Weapon rollback enables double-sell | CRITICAL | No DB rollback on transfer failure. Only rollback when transitioning to refund |
| 5 | No on-chain weapon ownership check | CRITICAL | New `getWeaponNftOwner(tokenId)` function added |
| 6 | Overpayment refund loss | MEDIUM | Store actual `tx.value` (as string), not expected price |
| 7 | `refund_failed` has no retry path | MEDIUM | Removed `refund_failed` status. Status stays `needs_refund`, `refundRetryCount` tracks attempts |
| 8 | Missing `getWeaponNftOwner` in files list | MEDIUM | Added to "Files to Modify" and Task 5 |
| 9 | `sendAvax` param name mismatch | MEDIUM | Corrected in "Existing Code to Reuse" table |
| 10 | Unique index on paymentTxHash | MEDIUM | Confirmed non-sparse since field is required |
| 11 | No staleness check on NFT payment | MEDIUM | Pre-existing bug, out of scope for this plan (note in docs) |
| 12 | Weapon PurchaseAttempt crash window | MEDIUM | Create immediately after payment verification, before transfer |
| 13 | `transferBattleTokens` type handling | LOW | Documented: function auto-converts via `String()` |
| 14 | No Discord notification for successful refunds | LOW | Added info-level Discord notification on refund success |
| 15 | Not suitable for distributed deployment | LOW | Documented assumption: single PM2 instance |
| 16 | `retryCount` dual purpose | LOW | Separate `retryCount` (transfers) and `refundRetryCount` (refunds) |
| 17 | Transaction txHash unique sparse index | LOW | No issue — refund Transactions have unique hashes |
| 18 | Null tokenId if crash before claim | LOW | Failsafe handles null tokenId → transitions to needs_refund |
