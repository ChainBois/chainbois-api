const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const Settings = require("../models/settingsModel");
const Tournament = require("../models/tournamentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { transferNft, transferWeaponNft, getBattleBalance } = require("../utils/contractUtils");
const { getProvider } = require("../utils/avaxUtils");
const { decrypt } = require("../utils/cryptUtils");
const { getFirebaseDb } = require("../config/firebase");
const {
  WEAPON_CATEGORIES,
  WEAPON_DEFINITIONS,
  TRANSACTION_TYPES,
  WALLET_ROLES,
  FIREBASE_PATHS,
} = require("../config/constants");
const { ethers } = require("ethers");
const BattleTokenABI = require("../abis/BattleToken.json").abi;

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
    .select("tokenId weaponName category blueprintTier price imageUri")
    .lean();

  // Group by category
  const grouped = {};
  for (const cat of WEAPON_CATEGORIES) {
    grouped[cat] = [];
  }
  for (const w of weapons) {
    if (grouped[w.category]) {
      grouped[w.category].push({
        tokenId: w.tokenId,
        weaponName: w.weaponName,
        category: w.category,
        tier: w.blueprintTier,
        price: w.price,
        imageUri: w.imageUri || "",
      });
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
    .select("tokenId weaponName category blueprintTier price imageUri")
    .lean();

  const data = weapons.map((w) => ({
    tokenId: w.tokenId,
    weaponName: w.weaponName,
    category: w.category,
    tier: w.blueprintTier,
    price: w.price,
    imageUri: w.imageUri || "",
  }));

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
    data: {
      tokenId: weapon.tokenId,
      weaponName: weapon.weaponName,
      category: weapon.category,
      tier: weapon.blueprintTier,
      price: weapon.price,
      currency: "BATTLE",
      available: isAvailable,
      description: def ? def.description : "",
      imageUri: weapon.imageUri || "",
      paymentAddress: weaponStoreWallet.address,
    },
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

  const settings = await Settings.findOne();
  const nftPrice = settings && settings.nftPrice != null ? settings.nftPrice : 0.001;

  const nfts = await ChainboiNft.find({
    ownerAddress: nftStoreWallet.address.toLowerCase(),
  })
    .select("tokenId level badge imageUri")
    .lean();

  res.status(200).json({
    success: true,
    data: {
      nfts: nfts.map((n) => ({
        tokenId: n.tokenId,
        level: n.level,
        badge: n.badge,
        imageUri: n.imageUri || "",
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

  const settings = await Settings.findOne();
  const nftPrice = settings && settings.nftPrice != null ? settings.nftPrice : 0.001;
  const isAvailable = nft.ownerAddress === nftStoreWallet.address.toLowerCase();

  res.status(200).json({
    success: true,
    data: {
      tokenId: nft.tokenId,
      level: nft.level,
      badge: nft.badge,
      traits: nft.traits || [],
      imageUri: nft.imageUri || "",
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
  const settings = await Settings.findOne();
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

  // 5. Check txHash not already used
  const existingTx = await Transaction.findOne({ txHash });
  if (existingTx) {
    return next(new AppError("This transaction has already been used", 409));
  }

  // 6. Atomically claim an available weapon (prevents race conditions)
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
    // Rollback ownership claim
    await WeaponNft.findByIdAndUpdate(weapon._id, { ownerAddress: weaponStoreWallet.address.toLowerCase() });
    return next(new AppError("Transaction not found or failed on-chain", 400));
  }

  const battleInterface = new ethers.Interface(BattleTokenABI);
  let paymentVerified = false;
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
        break;
      }
    } catch { /* not a Transfer event */ }
  }

  if (!paymentVerified) {
    // Rollback ownership claim
    await WeaponNft.findByIdAndUpdate(weapon._id, { ownerAddress: weaponStoreWallet.address.toLowerCase() });
    return next(new AppError("Payment not verified: must be a $BATTLE transfer to the weapon store wallet for the correct amount", 400));
  }

  // 8. Transfer weapon NFT on-chain from weapon_store to user
  let weaponStoreKey;
  try {
    weaponStoreKey = await decrypt(weaponStoreWallet.key, weaponStoreWallet.iv);
  } catch (e) {
    // Rollback ownership claim
    await WeaponNft.findByIdAndUpdate(weapon._id, { ownerAddress: weaponStoreWallet.address.toLowerCase() });
    return next(new AppError("Wallet decryption failed. Contact support.", 500));
  }

  let transferReceipt;
  try {
    transferReceipt = await transferWeaponNft(
      weaponStoreWallet.address,
      normalizedAddress,
      weapon.tokenId,
      weaponStoreKey
    );
  } catch (e) {
    // Rollback ownership claim
    await WeaponNft.findByIdAndUpdate(weapon._id, { ownerAddress: weaponStoreWallet.address.toLowerCase() });
    return next(new AppError(`Weapon transfer failed: ${e.message}`, 500));
  }

  if (!transferReceipt || !transferReceipt.hash) {
    await WeaponNft.findByIdAndUpdate(weapon._id, { ownerAddress: weaponStoreWallet.address.toLowerCase() });
    return next(new AppError("Weapon transfer did not return a valid receipt", 500));
  }

  // 9. Record transaction (non-fatal — asset already transferred on-chain)
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
        weaponName: weapon.weaponName,
        weaponTokenId: weapon.tokenId,
        category: weapon.category,
        paymentTxHash: txHash,
      },
    });
  } catch (e) {
    console.error(`Failed to record weapon purchase transaction: ${e.message}`, {
      weaponTokenId: weapon.tokenId,
      buyer: normalizedAddress,
      transferTxHash: transferReceipt.hash,
    });
  }

  // 10. Sync to Firebase so game sees the weapon
  if (user.uid) {
    try {
      const db = getFirebaseDb();
      await db.ref(`${FIREBASE_PATHS.USERS}/${user.uid}/weapons/${weapon.weaponName.replace(/[.#$/[\]]/g, "_")}`).set({
        tokenId: weapon.tokenId,
        name: weapon.weaponName,
        category: weapon.category,
        acquiredAt: new Date().toISOString(),
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
      paymentTxHash: txHash,
    },
  });
});

/**
 * POST /api/v1/armory/purchase/nft
 * Verify AVAX payment tx, transfer ChainBoi NFT (no auth — wallet identifies user)
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

  // 1. Find or create user by wallet address
  let user = await User.findOne({ address: normalizedAddress });
  if (!user) {
    return next(new AppError("No account found for this wallet. Please login first.", 404));
  }

  // 2. Get nft_store wallet
  const nftStoreWallet = await Wallet.findOne({ role: WALLET_ROLES.NFT_STORE }).select("+key +iv");
  if (!nftStoreWallet) {
    return next(new AppError("NFT store is temporarily unavailable", 503));
  }

  // 3. Get price from settings
  const settings = await Settings.findOne();
  const nftPrice = settings && settings.nftPrice != null ? settings.nftPrice : 0.001;

  // 4. Check txHash not already used
  const existingTx = await Transaction.findOne({ txHash });
  if (existingTx) {
    return next(new AppError("This transaction has already been used", 409));
  }

  // 5. Verify on-chain AVAX payment to nft_store BEFORE claiming NFT
  const provider = getProvider();
  const tx = await provider.getTransaction(txHash);
  if (!tx) {
    return next(new AppError("Transaction not found", 400));
  }

  const txReceipt = await provider.getTransactionReceipt(txHash);
  if (!txReceipt || txReceipt.status !== 1) {
    return next(new AppError("Transaction failed on-chain", 400));
  }

  // Verify: sender is buyer, recipient is nft_store, amount >= price
  if (tx.from.toLowerCase() !== normalizedAddress) {
    return next(new AppError("Transaction sender does not match your wallet", 400));
  }
  if (!tx.to || tx.to.toLowerCase() !== nftStoreWallet.address.toLowerCase()) {
    return next(new AppError("Payment must be sent to the NFT store wallet", 400));
  }

  const expectedAmount = ethers.parseEther(String(nftPrice));
  if (tx.value < expectedAmount) {
    return next(new AppError(`Insufficient payment. Expected at least ${nftPrice} AVAX`, 400));
  }

  // 6. Atomically claim an available NFT (prevents race conditions)
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
    return next(new AppError("No NFTs available for purchase", 404));
  }

  // 7. Transfer NFT on-chain
  let nftStoreKey;
  try {
    nftStoreKey = await decrypt(nftStoreWallet.key, nftStoreWallet.iv);
  } catch (e) {
    // Rollback ownership claim
    await ChainboiNft.findByIdAndUpdate(availableNft._id, { ownerAddress: nftStoreWallet.address.toLowerCase() });
    return next(new AppError("Wallet decryption failed. Contact support.", 500));
  }

  let transferReceipt;
  try {
    transferReceipt = await transferNft(
      nftStoreWallet.address,
      normalizedAddress,
      availableNft.tokenId,
      nftStoreKey
    );
  } catch (e) {
    // Rollback ownership claim
    await ChainboiNft.findByIdAndUpdate(availableNft._id, { ownerAddress: nftStoreWallet.address.toLowerCase() });
    return next(new AppError(`NFT transfer failed: ${e.message}`, 500));
  }

  if (!transferReceipt || !transferReceipt.hash) {
    await ChainboiNft.findByIdAndUpdate(availableNft._id, { ownerAddress: nftStoreWallet.address.toLowerCase() });
    return next(new AppError("NFT transfer did not return a valid receipt", 500));
  }

  // 8. Update user
  user.hasNft = true;
  user.nftTokenId = availableNft.tokenId;
  await user.save();

  // 9. Record transaction (non-fatal — asset already transferred on-chain)
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
        tokenId: availableNft.tokenId,
        paymentTxHash: txHash,
      },
    });
  } catch (e) {
    console.error(`Failed to record NFT purchase transaction: ${e.message}`, {
      nftTokenId: availableNft.tokenId,
      buyer: normalizedAddress,
      transferTxHash: transferReceipt.hash,
    });
  }

  // 10. Sync to Firebase so game sees the NFT
  if (user.uid) {
    try {
      const db = getFirebaseDb();
      await db.ref(`${FIREBASE_PATHS.USERS}/${user.uid}`).update({
        hasNFT: true,
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
      paymentTxHash: txHash,
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
