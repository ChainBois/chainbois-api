const PurchaseAttempt = require("../models/purchaseAttemptModel");
const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const { getNftOwner, getWeaponNftOwner, transferNft, transferWeaponNft, transferBattleTokens, getBattleBalance } = require("../utils/contractUtils");
const { sendAvax, getAvaxBalance } = require("../utils/avaxUtils");
const { decrypt } = require("../utils/cryptUtils");
const { getFirebaseDb } = require("../config/firebase");
const { sendDiscordAlert } = require("../utils/discordService");
const {
  PURCHASE_FAILSAFE,
  TRANSACTION_TYPES,
  WALLET_ROLES,
  FIREBASE_PATHS,
} = require("../config/constants");

/**
 * Purchase failsafe cron job. Runs every 5 minutes.
 * Processes stuck purchases, retries transfers, and issues refunds.
 *
 * Phase 1: Process stuck "pending" purchases (retry or complete)
 * Phase 2: Process refunds ("needs_refund")
 * Phase 3: Cleanup stuck locks and escalate stuck "processing"
 */
const purchaseFailsafeJob = async function () {
  try {
    await processStuckPurchases();
    await processRefunds();
    await cleanupStuckStates();
  } catch (error) {
    console.error("purchaseFailsafeJob error:", error.message);
  }
};

// ───────────────────────────────────────────────────────────
// Phase 1: Process stuck "pending" purchases
// ───────────────────────────────────────────────────────────

const processStuckPurchases = async function () {
  const threshold = new Date(Date.now() - PURCHASE_FAILSAFE.STUCK_THRESHOLD_MINUTES * 60 * 1000);

  const stuckAttempts = await PurchaseAttempt.find({
    status: "pending",
    createdAt: { $lte: threshold },
    failsafeProcessing: false,
  }).limit(20);

  if (stuckAttempts.length === 0) return;

  console.log(`Purchase failsafe: processing ${stuckAttempts.length} stuck purchases`);

  for (const attempt of stuckAttempts) {
    try {
      await processStuckPurchase(attempt);
    } catch (e) {
      console.error(`Failsafe error for attempt ${attempt._id}: ${e.message}`);
      // Always release lock on error
      try {
        await PurchaseAttempt.findByIdAndUpdate(attempt._id, {
          $set: { failsafeProcessing: false },
          $inc: { failsafeAttempts: 1 },
        });
      } catch { /* ignore */ }
    }
  }
};

const processStuckPurchase = async function (attempt) {
  // 1. Acquire failsafe lock (re-check status: "pending" to avoid racing with request handler)
  const locked = await PurchaseAttempt.findOneAndUpdate(
    { _id: attempt._id, status: "pending", failsafeProcessing: false },
    { $set: { failsafeProcessing: true, failsafeStartedAt: new Date() } },
    { new: true }
  );
  if (!locked) return; // Another instance has it or status changed

  try {
    // 2. Handle null tokenId (no claim happened — crash between payment and claim)
    if (locked.type === "nft_purchase" && !locked.tokenId) {
      locked.status = "needs_refund";
      locked.failureReason = "No NFT was claimed (crash before claim)";
      locked.failsafeProcessing = false;
      locked.failsafeAttempts += 1;
      await locked.save();
      return;
    }
    if (locked.type === "weapon_purchase" && !locked.weaponTokenId) {
      locked.status = "needs_refund";
      locked.failureReason = "No weapon was claimed (crash before claim)";
      locked.failsafeProcessing = false;
      locked.failsafeAttempts += 1;
      await locked.save();
      return;
    }

    // 3. Check on-chain ownership
    let onChainOwner;
    try {
      if (locked.type === "nft_purchase") {
        onChainOwner = await getNftOwner(locked.tokenId);
      } else {
        onChainOwner = await getWeaponNftOwner(locked.weaponTokenId);
      }
    } catch (e) {
      // Chain query failed — skip this cycle, try again next time
      locked.failsafeProcessing = false;
      locked.failsafeAttempts += 1;
      locked.failureReason = `On-chain check failed: ${e.message}`;
      await locked.save();
      return;
    }

    // 4a. Buyer already owns the asset on-chain → backfill records
    if (onChainOwner.toLowerCase() === locked.buyerAddress.toLowerCase()) {
      locked.failsafeAttempts += 1;
      await backfillPurchaseRecords(locked);
      return;
    }

    // 4b. Store still owns — retry transfer if under max retries
    if (locked.retryCount < PURCHASE_FAILSAFE.TRANSFER_MAX_RETRIES) {
      await retryTransfer(locked);
      return;
    }

    // 4c. Max retries exceeded — restore DB ownership, schedule refund
    await restoreAndScheduleRefund(locked);
  } finally {
    // Always release lock
    try {
      await PurchaseAttempt.findByIdAndUpdate(locked._id, {
        $set: { failsafeProcessing: false },
      });
    } catch { /* ignore */ }
  }
};

const backfillPurchaseRecords = async function (attempt) {
  console.log(`Failsafe: backfilling records for ${attempt.type} attempt ${attempt._id}`);

  attempt.status = "completed";

  // Create Transaction record if missing
  const existingTx = await Transaction.findOne({ "metadata.paymentTxHash": attempt.paymentTxHash });
  if (!existingTx) {
    const txType = attempt.type === "nft_purchase" ? TRANSACTION_TYPES.NFT_PURCHASE : TRANSACTION_TYPES.WEAPON_PURCHASE;
    const itemDesc = attempt.type === "nft_purchase"
      ? `ChainBoi #${attempt.tokenId} purchased (recovered by failsafe).`
      : `Weapon purchased: ${attempt.weaponName || "Unknown"} (recovered by failsafe).`;
    const metadata = { description: itemDesc, paymentTxHash: attempt.paymentTxHash, backfilledByFailsafe: true };
    if (attempt.tokenId) metadata.tokenId = attempt.tokenId;
    if (attempt.weaponTokenId) metadata.weaponTokenId = attempt.weaponTokenId;
    if (attempt.weaponName) metadata.weaponName = attempt.weaponName;

    try {
      await Transaction.create({
        type: txType,
        fromAddress: attempt.storeWalletAddress,
        toAddress: attempt.buyerAddress,
        amount: parseFloat(attempt.paymentAmount),
        currency: attempt.paymentCurrency,
        txHash: attempt.transferTxHash || `failsafe-${attempt._id}`,
        status: "confirmed",
        metadata,
      });
    } catch (e) {
      console.error(`Failsafe backfill Transaction failed: ${e.message}`);
    }
  }

  // Update user if NFT purchase
  if (attempt.type === "nft_purchase" && attempt.tokenId) {
    try {
      const user = await User.findOne({ address: attempt.buyerAddress });
      if (user && !user.hasNft) {
        user.hasNft = true;
        user.nftTokenId = attempt.tokenId;
        await user.save();

        // Sync to Firebase
        if (user.uid) {
          try {
            const db = getFirebaseDb();
            await db.ref(`${FIREBASE_PATHS.USERS}/${user.uid}`).update({
              hasNFT: true,
              nftTokenId: attempt.tokenId,
              level: 0,
            });
          } catch { /* non-fatal */ }
        }
      }
    } catch (e) {
      console.error(`Failsafe user update failed: ${e.message}`);
    }
  }

  // Update user if weapon purchase — sync to Firebase
  if (attempt.type === "weapon_purchase" && attempt.weaponName) {
    try {
      const user = await User.findOne({ address: attempt.buyerAddress });
      if (user && user.uid) {
        const weaponDoc = await WeaponNft.findOne({ tokenId: attempt.weaponTokenId });
        const db = getFirebaseDb();
        await db.ref(`${FIREBASE_PATHS.USERS}/${user.uid}/weapons/${attempt.weaponName.replace(/[.#$/[\]]/g, "_")}`).set({
          tokenId: attempt.weaponTokenId,
          name: attempt.weaponName,
          category: weaponDoc ? weaponDoc.category : "",
          acquiredAt: new Date().toISOString(),
        });
      }
    } catch { /* non-fatal */ }
  }

  await attempt.save();
  console.log(`Failsafe: completed backfill for attempt ${attempt._id}`);
};

const retryTransfer = async function (attempt) {
  console.log(`Failsafe: retrying transfer for attempt ${attempt._id} (retry ${attempt.retryCount + 1}/${PURCHASE_FAILSAFE.TRANSFER_MAX_RETRIES})`);

  // Load the store wallet
  const walletRole = attempt.type === "nft_purchase" ? WALLET_ROLES.NFT_STORE : WALLET_ROLES.WEAPON_STORE;
  const storeWallet = await Wallet.findOne({ role: walletRole }).select("+key +iv");
  if (!storeWallet) {
    attempt.retryCount += 1;
    attempt.failureReason = "Store wallet not found";
    attempt.lastRetry = new Date();
    attempt.failsafeAttempts += 1;
    await attempt.save();
    return;
  }

  let storeKey;
  try {
    storeKey = await decrypt(storeWallet.key, storeWallet.iv);
  } catch (e) {
    attempt.retryCount += 1;
    attempt.failureReason = `Wallet decryption failed: ${e.message}`;
    attempt.lastRetry = new Date();
    attempt.failsafeAttempts += 1;
    await attempt.save();
    return;
  }

  let receipt;
  try {
    if (attempt.type === "nft_purchase") {
      receipt = await transferNft(storeWallet.address, attempt.buyerAddress, attempt.tokenId, storeKey);
    } else {
      receipt = await transferWeaponNft(storeWallet.address, attempt.buyerAddress, attempt.weaponTokenId, storeKey);
    }
  } catch (e) {
    attempt.retryCount += 1;
    attempt.failureReason = e.message;
    attempt.lastRetry = new Date();
    attempt.failsafeAttempts += 1;
    await attempt.save();
    console.error(`Failsafe: transfer retry failed for ${attempt._id}: ${e.message}`);
    return;
  }

  if (!receipt || !receipt.hash) {
    attempt.retryCount += 1;
    attempt.failureReason = "Transfer did not return a valid receipt";
    attempt.lastRetry = new Date();
    attempt.failsafeAttempts += 1;
    await attempt.save();
    return;
  }

  // Transfer succeeded!
  attempt.transferTxHash = receipt.hash;
  attempt.failsafeAttempts += 1;
  await backfillPurchaseRecords(attempt);
  console.log(`Failsafe: transfer succeeded for attempt ${attempt._id} (tx: ${receipt.hash})`);
};

const restoreAndScheduleRefund = async function (attempt) {
  console.log(`Failsafe: max retries reached for attempt ${attempt._id}, scheduling refund`);

  // Restore DB ownership to store
  if (attempt.type === "nft_purchase" && attempt.tokenId) {
    await ChainboiNft.findOneAndUpdate(
      { tokenId: attempt.tokenId },
      { ownerAddress: attempt.storeWalletAddress.toLowerCase() }
    );
  } else if (attempt.type === "weapon_purchase" && attempt.weaponTokenId) {
    await WeaponNft.findOneAndUpdate(
      { tokenId: attempt.weaponTokenId },
      { ownerAddress: attempt.storeWalletAddress.toLowerCase() }
    );
  }

  attempt.status = "needs_refund";
  attempt.failureReason = `Max transfer retries (${PURCHASE_FAILSAFE.TRANSFER_MAX_RETRIES}) exceeded`;
  attempt.failsafeAttempts += 1;
  await attempt.save();
};

// ───────────────────────────────────────────────────────────
// Phase 2: Process refunds
// ───────────────────────────────────────────────────────────

const processRefunds = async function () {
  const refundAttempts = await PurchaseAttempt.find({
    status: "needs_refund",
    refundRetryCount: { $lt: PURCHASE_FAILSAFE.REFUND_MAX_RETRIES },
    failsafeProcessing: false,
  }).limit(10);

  if (refundAttempts.length === 0) return;

  console.log(`Purchase failsafe: processing ${refundAttempts.length} refunds`);

  for (const attempt of refundAttempts) {
    try {
      await processRefund(attempt);
    } catch (e) {
      console.error(`Refund error for attempt ${attempt._id}: ${e.message}`);
      try {
        await PurchaseAttempt.findByIdAndUpdate(attempt._id, {
          $inc: { refundRetryCount: 1 },
          $set: { failureReason: e.message, failsafeProcessing: false },
        });
      } catch { /* ignore */ }
    }
  }
};

const processRefund = async function (attempt) {
  // Acquire atomic lock to prevent double-refund from overlapping cron runs
  const locked = await PurchaseAttempt.findOneAndUpdate(
    { _id: attempt._id, status: "needs_refund", failsafeProcessing: false },
    { $set: { failsafeProcessing: true, failsafeStartedAt: new Date() } },
    { new: true }
  );
  if (!locked) return; // Another instance processing this, or status changed

  const walletRole = locked.type === "nft_purchase" ? WALLET_ROLES.NFT_STORE : WALLET_ROLES.WEAPON_STORE;

  try {
    const storeWallet = await Wallet.findOne({ role: walletRole }).select("+key +iv");
    if (!storeWallet) {
      locked.refundRetryCount += 1;
      locked.failureReason = "Store wallet not found";
      await locked.save();
      return;
    }

    // Check store wallet can cover the refund
    if (locked.paymentCurrency === "AVAX") {
      const balance = await getAvaxBalance(storeWallet.address);
      const needed = parseFloat(locked.paymentAmount) + 0.001; // gas reserve
      if (parseFloat(balance) < needed) {
        locked.refundRetryCount += 1;
        locked.failureReason = `Insufficient AVAX balance: ${balance} < ${needed}`;
        await locked.save();
        console.log(`Failsafe: insufficient balance for refund ${locked._id}, will retry`);
        return;
      }
    } else {
      const balance = await getBattleBalance(storeWallet.address);
      if (parseFloat(balance) < parseFloat(locked.paymentAmount)) {
        locked.refundRetryCount += 1;
        locked.failureReason = `Insufficient BATTLE balance: ${balance} < ${locked.paymentAmount}`;
        await locked.save();
        return;
      }
    }

    let storeKey;
    try {
      storeKey = await decrypt(storeWallet.key, storeWallet.iv);
    } catch (e) {
      locked.refundRetryCount += 1;
      locked.failureReason = `Wallet decryption failed: ${e.message}`;
      await locked.save();
      return;
    }

    // Send refund
    let receipt;
    try {
      if (locked.paymentCurrency === "AVAX") {
        receipt = await sendAvax(storeKey, locked.buyerAddress, locked.paymentAmount);
      } else {
        receipt = await transferBattleTokens(locked.buyerAddress, locked.paymentAmount, storeKey);
      }
    } catch (e) {
      locked.refundRetryCount += 1;
      locked.failureReason = `Refund transfer failed: ${e.message}`;
      await locked.save();

      if (locked.refundRetryCount >= PURCHASE_FAILSAFE.REFUND_MAX_RETRIES) {
        console.error(`CRITICAL: Refund permanently failed for attempt ${locked._id} after ${PURCHASE_FAILSAFE.REFUND_MAX_RETRIES} attempts`);
        sendDiscordAlert({
          subject: "Purchase Refund Permanently Failed",
          status: "critical",
          poolType: locked.paymentCurrency === "AVAX" ? "NFT Store" : "Weapon Store",
          walletAddress: locked.buyerAddress,
          currentBalance: 0,
          requiredAmount: parseFloat(locked.paymentAmount),
          unitName: locked.paymentCurrency,
        }).catch(() => {});
      }
      return;
    }

    if (!receipt || !receipt.hash) {
      locked.refundRetryCount += 1;
      locked.failureReason = "Refund did not return a valid receipt";
      await locked.save();
      return;
    }

    // Refund succeeded
    locked.status = "refunded";
    locked.refundTxHash = receipt.hash;
    await locked.save();

    // Record refund transaction
    try {
      await Transaction.create({
        type: TRANSACTION_TYPES.REFUND,
        fromAddress: storeWallet.address,
        toAddress: locked.buyerAddress,
        amount: parseFloat(locked.paymentAmount),
        currency: locked.paymentCurrency,
        txHash: receipt.hash,
        status: "confirmed",
        metadata: {
          description: `Refund: ${locked.paymentAmount} ${locked.paymentCurrency} returned. Reason: ${locked.failureReason}.`,
          reason: locked.failureReason,
          purchaseAttemptId: locked._id,
          paymentTxHash: locked.paymentTxHash,
        },
      });
    } catch (e) {
      console.error(`Failed to record refund transaction: ${e.message}`);
    }

    console.log(`Failsafe: refund sent for attempt ${locked._id}: ${locked.paymentAmount} ${locked.paymentCurrency} → ${locked.buyerAddress} (tx: ${receipt.hash})`);

    // Info-level Discord notification
    sendDiscordAlert({
      subject: "Purchase Refund Issued",
      status: "info",
      poolType: locked.paymentCurrency === "AVAX" ? "NFT Store" : "Weapon Store",
      walletAddress: locked.buyerAddress,
      currentBalance: 0,
      requiredAmount: parseFloat(locked.paymentAmount),
      unitName: locked.paymentCurrency,
    }).catch(() => {});
  } finally {
    // Always release lock
    try {
      await PurchaseAttempt.findByIdAndUpdate(locked._id, {
        $set: { failsafeProcessing: false },
      });
    } catch { /* ignore */ }
  }
};

// ───────────────────────────────────────────────────────────
// Phase 3: Cleanup stuck states
// ───────────────────────────────────────────────────────────

const cleanupStuckStates = async function () {
  const lockTimeout = new Date(Date.now() - PURCHASE_FAILSAFE.LOCK_TIMEOUT_MINUTES * 60 * 1000);
  const processingTimeout = new Date(Date.now() - PURCHASE_FAILSAFE.PROCESSING_TIMEOUT_MINUTES * 60 * 1000);

  // Release stuck failsafe locks
  const releasedLocks = await PurchaseAttempt.updateMany(
    { failsafeProcessing: true, failsafeStartedAt: { $lte: lockTimeout } },
    { $set: { failsafeProcessing: false } }
  );
  if (releasedLocks.modifiedCount > 0) {
    console.log(`Failsafe: released ${releasedLocks.modifiedCount} stuck failsafe locks`);
  }

  // Escalate stuck "processing" to "pending"
  const escalated = await PurchaseAttempt.updateMany(
    { status: "processing", processingStartedAt: { $lte: processingTimeout } },
    { $set: { status: "pending" } }
  );
  if (escalated.modifiedCount > 0) {
    console.log(`Failsafe: escalated ${escalated.modifiedCount} stuck processing → pending`);
  }
};

module.exports = { purchaseFailsafeJob };
