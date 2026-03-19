const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getBattleBalance } = require("../utils/contractUtils");
const { ethers } = require("ethers");
const { RANK_NAMES, TRANSACTION_TYPES, buildCurrentTraits } = require("../config/constants");

/**
 * GET /api/v1/inventory/:address
 * All owned assets categorized (public — wallet address identifies user)
 */
const getInventory = catchAsync(async (req, res, next) => {
  const address = req.params.address.toLowerCase();
  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  // Fetch all owned assets in parallel
  const [chainbois, weapons, user] = await Promise.all([
    ChainboiNft.find({ ownerAddress: address })
      .select("tokenId level badge imageUri metadataUri traits inGameStats contractAddress")
      .lean(),
    WeaponNft.find({ ownerAddress: address })
      .select("tokenId weaponName category blueprintTier imageUri metadataUri contractAddress")
      .lean(),
    User.findOne({ address }).select("pointsBalance").lean(),
  ]);

  let battleBalance = "0";
  try {
    battleBalance = await getBattleBalance(address);
  } catch (e) { /* non-fatal */ }

  res.status(200).json({
    success: true,
    data: {
      address,
      chainbois: chainbois.map((nft) => ({
        tokenId: nft.tokenId,
        contractAddress: nft.contractAddress || process.env.CHAINBOIS_NFT_ADDRESS,
        level: nft.level,
        rank: RANK_NAMES[nft.level] || "Private",
        badge: nft.badge,
        imageUri: nft.imageUri || "",
        metadataUri: nft.metadataUri || "",
        traits: buildCurrentTraits(nft.traits, {
          level: nft.level,
          rank: RANK_NAMES[nft.level] || "Private",
          inGameStats: nft.inGameStats || {},
        }),
        stats: nft.inGameStats || {},
      })),
      weapons: weapons.map((w) => ({
        tokenId: w.tokenId,
        contractAddress: w.contractAddress || process.env.WEAPON_NFT_ADDRESS,
        weaponName: w.weaponName,
        category: w.category,
        tier: w.blueprintTier,
        imageUri: w.imageUri || "",
        metadataUri: w.metadataUri || "",
      })),
      balances: {
        points: user ? user.pointsBalance : 0,
        battle: parseFloat(battleBalance),
        battleRaw: battleBalance,
      },
      counts: {
        chainbois: chainbois.length,
        weapons: weapons.length,
      },
    },
  });
});

/**
 * GET /api/v1/inventory/:address/nfts
 * ChainBoi NFTs only (public)
 */
const getNfts = catchAsync(async (req, res, next) => {
  const address = req.params.address.toLowerCase();
  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  const nfts = await ChainboiNft.find({ ownerAddress: address })
    .select("tokenId level badge imageUri metadataUri traits inGameStats contractAddress")
    .lean();

  res.status(200).json({
    success: true,
    data: nfts.map((nft) => ({
      tokenId: nft.tokenId,
      level: nft.level,
      rank: RANK_NAMES[nft.level] || "Private",
      badge: nft.badge,
      imageUri: nft.imageUri || "",
      traits: buildCurrentTraits(nft.traits, {
        level: nft.level,
        rank: RANK_NAMES[nft.level] || "Private",
        inGameStats: nft.inGameStats || {},
      }),
      stats: nft.inGameStats || {},
      contractAddress: nft.contractAddress,
      metadataUri: nft.metadataUri || `${process.env.API_BASE_URL || "https://test-2.ghettopigeon.com"}/api/v1/metadata/${nft.tokenId}.json`,
    })),
  });
});

/**
 * GET /api/v1/inventory/:address/weapons
 * Weapon NFTs only (public)
 */
const getWeapons = catchAsync(async (req, res, next) => {
  const address = req.params.address.toLowerCase();
  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  const weapons = await WeaponNft.find({ ownerAddress: address })
    .select("tokenId weaponName category blueprintTier imageUri metadataUri contractAddress")
    .lean();

  res.status(200).json({
    success: true,
    data: weapons.map((w) => ({
      tokenId: w.tokenId,
      contractAddress: w.contractAddress || process.env.WEAPON_NFT_ADDRESS,
      weaponName: w.weaponName,
      category: w.category,
      tier: w.blueprintTier,
      imageUri: w.imageUri || "",
      metadataUri: w.metadataUri || "",
    })),
  });
});

/**
 * GET /api/v1/inventory/:address/history
 * Transaction history for a wallet (public)
 */
const getHistory = catchAsync(async (req, res, next) => {
  const address = req.params.address.toLowerCase();
  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const skip = (page - 1) * limit;

  const filter = {
    $or: [{ fromAddress: address }, { toAddress: address }],
  };

  // Optional type filter (validated against known transaction types)
  if (req.query.type) {
    const validTypes = Object.values(TRANSACTION_TYPES);
    if (!validTypes.includes(req.query.type)) {
      return next(new AppError(`Invalid type filter. Must be one of: ${validTypes.join(", ")}`, 400));
    }
    filter.type = req.query.type;
  }

  const total = await Transaction.countDocuments(filter);
  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("type fromAddress toAddress amount currency txHash status metadata createdAt")
    .lean();

  res.status(200).json({
    success: true,
    data: {
      history: transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

module.exports = {
  getInventory,
  getNfts,
  getWeapons,
  getHistory,
};
