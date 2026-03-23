const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const PurchaseAttempt = require("../models/purchaseAttemptModel");
const Settings = require("../models/settingsModel");
const Tournament = require("../models/tournamentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { transferNft, transferWeaponNft, getBattleBalance, BATTLE_TOKEN_ABI } = require("../utils/contractUtils");
const { getProvider, sendAvax, getAvaxBalance, verifyPayment } = require("../utils/avaxUtils");
const { decrypt } = require("../utils/cryptUtils");
const { withRetry } = require("../utils/retryHelper");
const { getFirebaseDb } = require("../config/firebase");
const {
  WEAPON_CATEGORIES,
  WEAPON_DEFINITIONS,
  TRANSACTION_TYPES,
  WALLET_ROLES,
  FIREBASE_PATHS,
  PURCHASE_FAILSAFE,
  PLAYER_TYPE,
  buildCurrentTraits,
  RANK_NAMES,
  buildWeaponResponse,
} = require("../config/constants");
const { ethers } = require("ethers");

/**
 * GET /api/v1/armory/weapons
 * All weapons grouped by category (public)
 */
const listWeapons = catchAsync(async (req, res) => {
  const weaponStoreWallet = await Wallet.findOne({ role: WALLET_ROLES.WEAPON_STORE });
  if (!weaponStoreWallet) {
    return res.status(200).json({ success: true, data: {} });
  }

  const weapons = await WeaponNft.find({
    ownerAddress: weaponStoreWallet.address.toLowerCase(),
  })
    .select("tokenId weaponName category blueprintTier price imageUri metadataUri")
    .lean();

  // Group by category
  const grouped = {};
  for (const cat of WEAPON_CATEGORIES) {
    grouped[cat] = [];
  }
  for (const w of weapons) {
    if (grouped[w.category]) {
      grouped[w.category].push(buildWeaponResponse(w, { price: w.price }));
    }
  }

  res.status(200).json({ success: true, data: grouped });
});

/**
 * GET /api/v1/armory/weapons/:category
 * Weapons in a specific category (public)
 */
const listWeaponsByCategory = catchAsync(async (req, res, next) => {
  const category = req.params.category.toLowerCase();
  if (!WEAPON_CATEGORIES.includes(category)) {
    return next(new AppError(`Invalid category. Must be one of: ${WEAPON_CATEGORIES.join(", ")}`, 400));
  }

  const weaponStoreWallet = await Wallet.findOne({ role: WALLET_ROLES.WEAPON_STORE });
  if (!weaponStoreWallet) {
    return res.status(200).json({ success: true, data: [] });
  }

  const weapons = await WeaponNft.find({
    category,
    ownerAddress: weaponStoreWallet.address.toLowerCase(),
  })
    .select("tokenId weaponName category blueprintTier price imageUri metadataUri")
    .lean();

  const data = weapons.map((w) => buildWeaponResponse(w, { price: w.price }));

  res.status(200).json({ success: true, data });
});

/**
 * GET /api/v1/armory/weapon/:weaponId
 * Single weapon details + payment address (public)
 */
const getWeaponDetail = catchAsync(async (req, res, next) => {
  const tokenId = parseInt(req.params.weaponId);
  if (isNaN(tokenId) || tokenId < 1) {
    return next(new AppError("Invalid weapon ID", 400));
  }

  const weapon = await WeaponNft.findOne({ tokenId }).lean();
  if (!weapon) {
    return next(new AppError("Weapon not found", 404));
  }

  const weaponStoreWallet = await Wallet.findOne({ role: WALLET_ROLES.WEAPON_STORE });
  if (!weaponStoreWallet) {
    return next(new AppError("Armory is temporarily unavailable", 503));
  }

  const def = WEAPON_DEFINITIONS.find((d) => d.name === weapon.weaponName);
  const isAvailable = weapon.ownerAddress === weaponStoreWallet.address.toLowerCase();

  res.status(200).json({
    success: true,
    data: buildWeaponResponse(weapon, {
      price: weapon.price,
      currency: "BATTLE",
      available: isAvailable,
      description: def ? def.description : "",
      paymentAddress: weaponStoreWallet.address,
    }),
  });
});

/**
 * GET /api/v1/armory/nfts
 * Available ChainBoi NFTs for sale (public)
 */
const listNfts = catchAsync(async (req, res) => {
  const nftStoreWallet = await Wallet.findOne({ role: WALLET_ROLES.NFT_STORE });
  if (!nftStoreWallet) {
    return res.status(200).json({ success: true, data: { nfts: [], price: 0, available: 0 } });
  }

  const settings = await Settings.getCached();
  const nftPrice = settings && settings.nftPrice != null ? settings.nftPrice : 0.001;

  const nfts = await ChainboiNft.find({
    ownerAddress: nftStoreWallet.address.toLowerCase(),
  })
    .select("tokenId level badge imageUri metadataUri traits")
    .lean();

  res.status(200).json({
    success: true,
    data: {
      nfts: nfts.map((n) => ({
        tokenId: n.tokenId,
        contractAddress: process.env.CHAINBOIS_NFT_ADDRESS,
        level: n.level,
        badge: n.badge,
        imageUri: n.imageUri || "",
        metadataUri: n.metadataUri || "",
        traits: buildCurrentTraits(n.traits, { level: n.level, rank: RANK_NAMES[n.level] || "Private" }),
      })),
      price: nftPrice,
      currency: "AVAX",
      available: nfts.length,
      paymentAddress: nftStoreWallet.address,
    },
  });
});

/**
 * GET /api/v1/armory/nft/:tokenId
 * Single NFT detail + payment address (public)
 */
const getNftDetail = catchAsync(async (req, res, next) => {
  const tokenId = parseInt(req.params.tokenId);
  if (isNaN(tokenId) || tokenId < 1) {
    return next(new AppError("Invalid token ID", 400));
  }

  const nft = await ChainboiNft.findOne({ tokenId }).lean();
  if (!nft) {
    return next(new AppError("NFT not found", 404));
  }

  const nftStoreWallet = await Wallet.findOne({ role: WALLET_ROLES.NFT_STORE });
  if (!nftStoreWallet) {
    return next(new AppError("Armory is temporarily unavailable", 503));
  }

  const settings = await Settings.getCached();
  const nftPrice = settings && settings.nftPrice != null ? settings.nftPrice : 0.001;
  const isAvailable = nft.ownerAddress === nftStoreWallet.address.toLowerCase();

  res.status(200).json({
    success: true,
    data: {
      tokenId: nft.tokenId,
      contractAddress: process.env.CHAINBOIS_NFT_ADDRESS,
      level: nft.level,
      badge: nft.badge,
      traits: buildCurrentTraits(nft.traits, { level: nft.level, rank: RANK_NAMES[nft.level] || "Private" }),
      imageUri: nft.imageUri || "",
      metadataUri: nft.metadataUri || "",
      price: nftPrice,
      currency: "AVAX",
      available: isAvailable,
      paymentAddress: nftStoreWallet.address,
    },
  });
});

/**
 * POST /api/v1/armory/purchase/weapon
 * Verify $BATTLE payment tx, transfer weapon NFT (no auth — wallet identifies user)
 * Includes failsafe: PurchaseAttempt tracking, retry, auto-refund.
 *
 * Body: { address: string, weaponName: string, txHash: string }
 */
const purchaseWeapon = catchAsync(async (req, res, next) => {
  const { address, weaponName, txHash } = req.body;
  if (!address || !weaponName || !txHash) {
    return next(new AppError("address, weaponName, and txHash are required", 400));
  }
  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  const normalizedAddress = address.toLowerCase();

  // 1. Find user by wallet address
  const user = await User.findOne({ address: normalizedAddress });
  if (!user) {
    return next(new AppError("No account found for this wallet. Please login first.", 404));
  }

  // 2. Check user owns a ChainBoi NFT
  if (!user.hasNft) {
    return next(new AppError("You must own a ChainBoi NFT to purchase weapons", 403));
  }

  // 3. Check armory is not closed during cooldown
  const settings = await Settings.getCached();
  if (settings && settings.armoryClosedDuringCooldown) {
    const cooldownTournament = await Tournament.findOne({ status: "cooldown" });
    if (cooldownTournament) {
      return next(new AppError("Armory is closed during tournament cooldown", 423));
    }
  }

  // 4. Find weapon_store wallet
  const weaponStoreWallet = await Wallet.findOne({ role: WALLET_ROLES.WEAPON_STORE }).select("+key +iv");
  if (!weaponStoreWallet) {
    return next(new AppError("Armory is temporarily unavailable", 503));
  }

  // 5. Replay protection — check Transaction AND PurchaseAttempt
  const normalizedTxHash = txHash.toLowerCase();
  const existingTx = await Transaction.findOne({
    $or: [{ txHash: normalizedTxHash }, { "metadata.paymentTxHash": normalizedTxHash }],
  });
  if (existingTx) {
    return next(new AppError("This transaction has already been used", 409));
  }

  const existingAttempt = await PurchaseAttempt.findOne({ paymentTxHash: normalizedTxHash });
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

  // 6. Atomically claim an available weapon (BEFORE verification — prevents double-sells)
  const weapon = await WeaponNft.findOneAndUpdate(
    {
      weaponName,
      ownerAddress: weaponStoreWallet.address.toLowerCase(),
    },
    { ownerAddress: normalizedAddress },
    { new: true }
  );
  if (!weapon) {
    return next(new AppError("Weapon not available or out of stock", 404));
  }

  // 7. Verify on-chain $BATTLE payment
  const provider = getProvider();
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt || receipt.status !== 1) {
    // Rollback — payment not valid, no PurchaseAttempt needed
    try {
      await WeaponNft.findByIdAndUpdate(weapon._id, { ownerAddress: weaponStoreWallet.address.toLowerCase() });
    } catch (rollbackErr) {
      console.error(`Rollback failed after invalid payment (weapon ${weapon._id}): ${rollbackErr.message}`);
    }
    return next(new AppError("Transaction not found or failed on-chain", 400));
  }

  const battleInterface = new ethers.Interface(BATTLE_TOKEN_ABI);
  let paymentVerified = false;
  let actualPaymentAmount = String(weapon.price);
  const expectedAmount = ethers.parseEther(String(weapon.price));

  for (const log of receipt.logs) {
    try {
      const parsed = battleInterface.parseLog(log);
      if (
        parsed &&
        parsed.name === "Transfer" &&
        parsed.args.from.toLowerCase() === normalizedAddress &&
        parsed.args.to.toLowerCase() === weaponStoreWallet.address.toLowerCase() &&
        parsed.args.value >= expectedAmount
      ) {
        paymentVerified = true;
        actualPaymentAmount = ethers.formatEther(parsed.args.value);
        break;
      }
    } catch { /* not a Transfer event */ }
  }

  if (!paymentVerified) {
    // Rollback — payment not valid, no PurchaseAttempt needed
    try {
      await WeaponNft.findByIdAndUpdate(weapon._id, { ownerAddress: weaponStoreWallet.address.toLowerCase() });
    } catch (rollbackErr) {
      console.error(`Rollback failed after payment verification failure (weapon ${weapon._id}): ${rollbackErr.message}`);
    }
    return next(new AppError("Payment not verified: must be a $BATTLE transfer to the weapon store wallet for the correct amount", 400));
  }

  // 8. Create PurchaseAttempt IMMEDIATELY after payment verification (crash safety)
  let attempt;
  try {
    attempt = await PurchaseAttempt.create({
      type: "weapon_purchase",
      buyerAddress: normalizedAddress,
      paymentTxHash: normalizedTxHash,
      paymentAmount: actualPaymentAmount,
      paymentCurrency: "BATTLE",
      storeWalletAddress: weaponStoreWallet.address,
      weaponTokenId: weapon.tokenId,
      weaponName: weapon.weaponName,
      status: "processing",
      processingStartedAt: new Date(),
    });
  } catch (e) {
    // CRITICAL: Without PurchaseAttempt, failsafe cannot track this purchase.
    // Rollback DB ownership and return error — user must retry.
    console.error(`Failed to create PurchaseAttempt, rolling back: ${e.message}`);
    await WeaponNft.findByIdAndUpdate(weapon._id, { ownerAddress: weaponStoreWallet.address.toLowerCase() });
    return next(new AppError("Purchase tracking failed. Please try again.", 500));
  }

  // 9. Transfer weapon NFT on-chain with retry
  let weaponStoreKey;
  try {
    weaponStoreKey = await decrypt(weaponStoreWallet.key, weaponStoreWallet.iv);
  } catch (e) {
    // Do NOT rollback DB ownership — failsafe will handle it
    attempt.status = "pending";
    attempt.failureReason = "Wallet decryption failed";
    await attempt.save();
    return next(new AppError("Transfer in progress. If not received, it will be retried automatically.", 500));
  }

  let transferReceipt;
  try {
    transferReceipt = await withRetry(
      () => transferWeaponNft(weaponStoreWallet.address, normalizedAddress, weapon.tokenId, weaponStoreKey),
      PURCHASE_FAILSAFE.TRANSFER_MAX_RETRIES,
      PURCHASE_FAILSAFE.TRANSFER_RETRY_DELAY_MS
    );
  } catch (e) {
    // Do NOT rollback DB ownership — failsafe will handle it
    attempt.status = "pending";
    attempt.failureReason = e.message;
    await attempt.save();
    return next(new AppError("Transfer in progress. If not received, it will be retried automatically.", 500));
  }

  if (!transferReceipt || !transferReceipt.hash) {
    attempt.status = "pending";
    attempt.failureReason = "Transfer did not return a valid receipt";
    await attempt.save();
    return next(new AppError("Transfer in progress. If not received, it will be retried automatically.", 500));
  }

  // 10. Success — update PurchaseAttempt
  attempt.status = "completed";
  attempt.transferTxHash = transferReceipt.hash;
  await attempt.save();

  // 11. Record transaction (non-fatal)
  try {
    await Transaction.create({
      type: TRANSACTION_TYPES.WEAPON_PURCHASE,
      fromAddress: weaponStoreWallet.address,
      toAddress: normalizedAddress,
      amount: weapon.price,
      currency: "BATTLE",
      txHash: transferReceipt.hash,
      status: "confirmed",
      metadata: {
        description: `Weapon purchased: ${weapon.weaponName} (${weapon.category}).`,
        weaponName: weapon.weaponName,
        weaponTokenId: weapon.tokenId,
        category: weapon.category,
        paymentTxHash: normalizedTxHash,
      },
    });
  } catch (e) {
    console.error(`Failed to record weapon purchase transaction: ${e.message}`, {
      weaponTokenId: weapon.tokenId,
      buyer: normalizedAddress,
      transferTxHash: transferReceipt.hash,
    });
  }

  // 12. Sync to Firebase so game sees the weapon (flat array, same format as login/verify-assets)
  if (user.uid) {
    try {
      const db = getFirebaseDb();
      const userWeapons = await WeaponNft.find({ ownerAddress: normalizedAddress }).select("weaponName").lean();
      const weaponNames = userWeapons.map((w) => w.weaponName);
      await db.ref(`${FIREBASE_PATHS.USERS}/${user.uid}`).update({
        weapons: weaponNames.length > 0 ? weaponNames : null,
      });
    } catch (e) {
      console.error(`Firebase weapon sync failed for ${user.uid}: ${e.message}`);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      message: "Weapon purchased successfully",
      weapon: {
        tokenId: weapon.tokenId,
        weaponName: weapon.weaponName,
        category: weapon.category,
      },
      transferTxHash: transferReceipt.hash,
      paymentTxHash: normalizedTxHash,
    },
  });
});

/**
 * POST /api/v1/armory/purchase/nft
 * Verify AVAX payment tx, transfer ChainBoi NFT (no auth — wallet identifies user)
 * Includes failsafe: PurchaseAttempt tracking, retry, auto-refund on sold-out.
 *
 * Body: { address: string, tokenId: number (optional — picks any if omitted), txHash: string }
 */
const purchaseNft = catchAsync(async (req, res, next) => {
  const { address, txHash } = req.body;
  const requestedTokenId = req.body.tokenId ? parseInt(req.body.tokenId) : null;

  if (!address || !txHash) {
    return next(new AppError("address and txHash are required", 400));
  }
  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  const normalizedAddress = address.toLowerCase();

  // 1. Find user by wallet address
  const user = await User.findOne({ address: normalizedAddress });
  if (!user) {
    return next(new AppError("No account found for this wallet. Please login first.", 404));
  }

  // 2. Get nft_store wallet
  const nftStoreWallet = await Wallet.findOne({ role: WALLET_ROLES.NFT_STORE }).select("+key +iv");
  if (!nftStoreWallet) {
    return next(new AppError("NFT store is temporarily unavailable", 503));
  }

  // 3. Get price from settings
  const settings = await Settings.getCached();
  const nftPrice = settings && settings.nftPrice != null ? settings.nftPrice : 0.001;

  // 4. Replay protection — check Transaction AND PurchaseAttempt
  const normalizedTxHash = txHash.toLowerCase();
  const existingTx = await Transaction.findOne({
    $or: [{ txHash: normalizedTxHash }, { "metadata.paymentTxHash": normalizedTxHash }],
  });
  if (existingTx) {
    return next(new AppError("This transaction has already been used", 409));
  }

  const existingAttempt = await PurchaseAttempt.findOne({ paymentTxHash: normalizedTxHash });
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

  // 5. Verify on-chain AVAX payment to nft_store (using verifyPayment for staleness check)
  const expectedAmount = ethers.parseEther(String(nftPrice));
  const paymentResult = await verifyPayment(txHash, normalizedAddress, nftStoreWallet.address, expectedAmount.toString());
  if (!paymentResult.valid) {
    return next(new AppError(paymentResult.reason, 400));
  }

  // Capture actual payment amount (may be > price if user overpaid)
  const provider = getProvider();
  const tx = await provider.getTransaction(txHash);
  const actualPaymentAmount = ethers.formatEther(tx.value);

  // 6. Atomically claim an available NFT
  const nftQuery = { ownerAddress: nftStoreWallet.address.toLowerCase() };
  if (requestedTokenId) {
    nftQuery.tokenId = requestedTokenId;
  }
  const availableNft = await ChainboiNft.findOneAndUpdate(
    nftQuery,
    { ownerAddress: normalizedAddress },
    { new: true }
  );

  if (!availableNft) {
    // SOLD OUT — create PurchaseAttempt and attempt immediate refund
    let attempt;
    try {
      attempt = await PurchaseAttempt.create({
        type: "nft_purchase",
        buyerAddress: normalizedAddress,
        paymentTxHash: normalizedTxHash,
        paymentAmount: actualPaymentAmount,
        paymentCurrency: "AVAX",
        storeWalletAddress: nftStoreWallet.address,
        status: "needs_refund",
        failureReason: "No NFTs available for purchase (sold out)",
      });
    } catch (e) {
      console.error(`Failed to create PurchaseAttempt for refund: ${e.message}`);
    }

    // Attempt immediate refund
    try {
      const nftStoreKey = await decrypt(nftStoreWallet.key, nftStoreWallet.iv);
      const storeBalance = await getAvaxBalance(nftStoreWallet.address);
      if (parseFloat(storeBalance) >= parseFloat(actualPaymentAmount) + 0.001) {
        const refundReceipt = await sendAvax(nftStoreKey, normalizedAddress, actualPaymentAmount);
        if (refundReceipt && refundReceipt.hash) {
          if (attempt) {
            attempt.status = "refunded";
            attempt.refundTxHash = refundReceipt.hash;
            await attempt.save();
          }

          try {
            await Transaction.create({
              type: TRANSACTION_TYPES.REFUND,
              fromAddress: nftStoreWallet.address,
              toAddress: normalizedAddress,
              amount: parseFloat(actualPaymentAmount),
              currency: "AVAX",
              txHash: refundReceipt.hash,
              status: "confirmed",
              metadata: { description: `Refund: NFT sold out. ${actualPaymentAmount} AVAX returned.`, reason: "NFT sold out", paymentTxHash: normalizedTxHash },
            });
          } catch (txErr) {
            console.error(`Failed to record refund transaction: ${txErr.message}`);
          }

          return next(new AppError(
            `No NFTs available. Your payment of ${actualPaymentAmount} AVAX has been refunded (tx: ${refundReceipt.hash})`,
            404
          ));
        }
      }
    } catch (refundErr) {
      console.error(`Immediate refund failed, failsafe will retry: ${refundErr.message}`);
    }

    return next(new AppError(
      "No NFTs available for purchase. Your payment will be refunded automatically.",
      404
    ));
  }

  // 7. Create PurchaseAttempt (AFTER claim, so we have tokenId)
  let attempt;
  try {
    attempt = await PurchaseAttempt.create({
      type: "nft_purchase",
      buyerAddress: normalizedAddress,
      paymentTxHash: normalizedTxHash,
      paymentAmount: actualPaymentAmount,
      paymentCurrency: "AVAX",
      storeWalletAddress: nftStoreWallet.address,
      tokenId: availableNft.tokenId,
      status: "processing",
      processingStartedAt: new Date(),
    });
  } catch (e) {
    // CRITICAL: Without PurchaseAttempt, failsafe cannot track this purchase.
    // Rollback DB ownership and return error — user must retry.
    console.error(`Failed to create PurchaseAttempt, rolling back: ${e.message}`);
    await ChainboiNft.findOneAndUpdate(
      { tokenId: availableNft.tokenId },
      { ownerAddress: nftStoreWallet.address.toLowerCase() }
    );
    return next(new AppError("Purchase tracking failed. Please try again.", 500));
  }

  // 8. Transfer NFT on-chain with retry
  let nftStoreKey;
  try {
    nftStoreKey = await decrypt(nftStoreWallet.key, nftStoreWallet.iv);
  } catch (e) {
    // Do NOT rollback DB ownership — failsafe will handle it
    attempt.status = "pending";
    attempt.failureReason = "Wallet decryption failed";
    await attempt.save();
    return next(new AppError("Transfer in progress. If not received, it will be retried automatically.", 500));
  }

  let transferReceipt;
  try {
    transferReceipt = await withRetry(
      () => transferNft(nftStoreWallet.address, normalizedAddress, availableNft.tokenId, nftStoreKey),
      PURCHASE_FAILSAFE.TRANSFER_MAX_RETRIES,
      PURCHASE_FAILSAFE.TRANSFER_RETRY_DELAY_MS
    );
  } catch (e) {
    // Do NOT rollback DB ownership — failsafe will handle it
    attempt.status = "pending";
    attempt.failureReason = e.message;
    await attempt.save();
    return next(new AppError("Transfer in progress. If not received, it will be retried automatically.", 500));
  }

  if (!transferReceipt || !transferReceipt.hash) {
    attempt.status = "pending";
    attempt.failureReason = "Transfer did not return a valid receipt";
    await attempt.save();
    return next(new AppError("Transfer in progress. If not received, it will be retried automatically.", 500));
  }

  // 9. Success — update PurchaseAttempt
  attempt.status = "completed";
  attempt.transferTxHash = transferReceipt.hash;
  await attempt.save();

  // 10. Update user (upgrade to web3 if currently web2, preserve level if already has NFT)
  try {
    const isFirstNft = !user.hasNft;
    user.hasNft = true;
    user.nftTokenId = availableNft.tokenId;
    if (isFirstNft) {
      user.level = 0;
    }
    if (user.playerType === PLAYER_TYPE.WEB2) {
      user.playerType = PLAYER_TYPE.WEB3;
    }
    await user.save();
  } catch (e) {
    // NFT already transferred on-chain — log but don't fail the request
    console.error(`Failed to update user after NFT purchase (NFT already transferred): ${e.message}`, {
      address: normalizedAddress,
      tokenId: availableNft.tokenId,
      transferTxHash: transferReceipt.hash,
    });
  }

  // 11. Record transaction (non-fatal)
  try {
    await Transaction.create({
      type: TRANSACTION_TYPES.NFT_PURCHASE,
      fromAddress: nftStoreWallet.address,
      toAddress: normalizedAddress,
      amount: nftPrice,
      currency: "AVAX",
      txHash: transferReceipt.hash,
      status: "confirmed",
      metadata: {
        description: `ChainBoi #${availableNft.tokenId} purchased successfully.`,
        tokenId: availableNft.tokenId,
        paymentTxHash: normalizedTxHash,
      },
    });
  } catch (e) {
    console.error(`Failed to record NFT purchase transaction: ${e.message}`, {
      nftTokenId: availableNft.tokenId,
      buyer: normalizedAddress,
      transferTxHash: transferReceipt.hash,
    });
  }

  // 12. Sync to Firebase so game sees the NFT
  if (user.uid) {
    try {
      const db = getFirebaseDb();
      await db.ref(`${FIREBASE_PATHS.USERS}/${user.uid}`).update({
        hasNFT: true,
        hasnft: true,
        nftTokenId: availableNft.tokenId,
        level: 0,
      });
    } catch (e) {
      console.error(`Firebase NFT sync failed for ${user.uid}: ${e.message}`);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      message: "ChainBoi NFT purchased successfully!",
      tokenId: availableNft.tokenId,
      transferTxHash: transferReceipt.hash,
      paymentTxHash: normalizedTxHash,
    },
  });
});

/**
 * GET /api/v1/armory/balance/:address
 * Get points + $BATTLE balance for a wallet (public)
 */
const getBalance = catchAsync(async (req, res, next) => {
  const address = req.params.address.toLowerCase();
  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  const user = await User.findOne({ address });
  const pointsBalance = user ? user.pointsBalance : 0;

  let battleBalance = "0";
  try {
    battleBalance = await getBattleBalance(address);
  } catch (e) {
    console.error(`Failed to fetch $BATTLE balance: ${e.message}`);
  }

  res.status(200).json({
    success: true,
    data: {
      address,
      pointsBalance,
      battleBalance: parseFloat(battleBalance),
      battleBalanceRaw: battleBalance,
    },
  });
});

module.exports = {
  listWeapons,
  listWeaponsByCategory,
  getWeaponDetail,
  listNfts,
  getNftDetail,
  purchaseWeapon,
  purchaseNft,
  getBalance,
};
