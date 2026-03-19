const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getFirebaseDb } = require("../config/firebase");
const { lookupNftAssets } = require("../utils/nftUtils");
const { getNftLevel, getNftOwner } = require("../utils/contractUtils");
const { FIREBASE_PATHS, PLAYER_TYPE } = require("../config/constants");

/**
 * POST /api/v1/game/verify-assets
 * Verify user's on-chain assets and sync to Firebase
 */
const verifyAssets = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ uid: req.user.uid });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.address) {
    return next(new AppError("No wallet address linked. Please login first.", 400));
  }

  if (!process.env.CHAINBOIS_NFT_ADDRESS) {
    return next(new AppError("NFT contract not configured", 503));
  }

  // Use shared NFT lookup (returns full enriched data)
  const assets = await lookupNftAssets(user.address);

  // Update user in MongoDB
  user.hasNft = assets.hasNft;
  if (assets.nfts.length > 0) {
    user.nftTokenId = assets.nfts[0].tokenId;
    user.level = Math.max(...assets.nfts.map((n) => n.level));
  } else {
    user.nftTokenId = null;
    user.level = 0;
  }

  if (user.playerType === PLAYER_TYPE.WEB2 && assets.hasNft) {
    user.playerType = PLAYER_TYPE.WEB3;
  }
  if (user.playerType === PLAYER_TYPE.WEB3 && !assets.hasNft) {
    user.playerType = PLAYER_TYPE.WEB2;
    user.nftTokenId = null;
  }

  await user.save();

  // Sync to Firebase for Unity
  try {
    const db = getFirebaseDb();
    const fbUpdate = {
      hasNFT: assets.hasNft,
      hasnft: assets.hasNft,
      level: user.level,
      weapons: assets.weapons.length > 0 ? assets.weapons.map((w) => w.weaponName) : null,
    };
    await db.ref(`${FIREBASE_PATHS.USERS}/${req.user.uid}`).update(fbUpdate);
  } catch (e) {
    console.error("Failed to update Firebase:", e.message);
  }

  res.status(200).json({
    success: true,
    data: {
      hasNft: assets.hasNft,
      nftTokenId: assets.nfts.length > 0 ? assets.nfts[0].tokenId : null,
      level: user.level,
      assets: assets.nfts,
      ownedWeaponNfts: assets.weapons,
    },
  });
});

/**
 * POST /api/v1/game/set-avatar
 * Set the user's active ChainBois NFT avatar
 */
const setAvatar = catchAsync(async (req, res, next) => {
  const { tokenId } = req.body;
  if (tokenId === undefined || tokenId === null) {
    return next(new AppError("tokenId is required", 400));
  }

  const parsedTokenId = parseInt(tokenId);
  if (isNaN(parsedTokenId) || parsedTokenId < 0) {
    return next(new AppError("tokenId must be a valid non-negative integer", 400));
  }

  const user = await User.findOne({ uid: req.user.uid });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.address) {
    return next(new AppError("No wallet address linked", 400));
  }

  if (!process.env.CHAINBOIS_NFT_ADDRESS) {
    return next(new AppError("NFT contract not configured", 503));
  }

  // Verify on-chain ownership
  let owner;
  try {
    owner = await getNftOwner(parsedTokenId);
  } catch (e) {
    return next(new AppError("Failed to verify NFT ownership. Token may not exist.", 400));
  }

  if (owner.toLowerCase() !== user.address.toLowerCase()) {
    return next(new AppError("You do not own this NFT", 403));
  }

  // Get level from contract
  let level = 0;
  try {
    level = await getNftLevel(parsedTokenId);
  } catch (e) {
    console.error("Failed to get NFT level:", e.message);
  }

  // Update user
  user.nftTokenId = parsedTokenId;
  user.hasNft = true;
  user.level = level;
  if (user.playerType === PLAYER_TYPE.WEB2) {
    user.playerType = PLAYER_TYPE.WEB3;
  }
  await user.save();

  // Update Firebase
  try {
    const db = getFirebaseDb();
    await db.ref(`${FIREBASE_PATHS.USERS}/${req.user.uid}`).update({
      hasNFT: true,
      hasnft: true,
      level: level,
    });
  } catch (e) {
    console.error("Failed to update Firebase:", e.message);
  }

  res.status(200).json({
    success: true,
    data: {
      tokenId: parsedTokenId,
      level,
    },
  });
});

module.exports = {
  verifyAssets,
  setAvatar,
};
