const { ethers } = require("ethers");
const User = require("../models/userModel");
const Settings = require("../models/settingsModel");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const ChainboiNft = require("../models/chainboiNftModel");
const Tournament = require("../models/tournamentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getFirebaseDb } = require("../config/firebase");
const { getNftLevel, setNftLevel, getNftOwner } = require("../utils/contractUtils");
const { getErc721Balances, verifyPayment, reindexNftMetadata } = require("../utils/avaxUtils");
const { decrypt } = require("../utils/cryptUtils");
const { getUnlockedContent } = require("./gameController");
const {
  MAX_LEVEL,
  RANK_NAMES,
  FIREBASE_PATHS,
  TRANSACTION_TYPES,
  WALLET_ROLES,
} = require("../config/constants");

/**
 * GET /api/v1/training/nfts/:address
 * List all ChainBoi NFTs owned by an address
 */
const getNfts = catchAsync(async (req, res, next) => {
  const { address } = req.params;

  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  if (!process.env.CHAINBOIS_NFT_ADDRESS) {
    return next(new AppError("NFT contract not configured", 503));
  }

  const normalizedAddress = address.toLowerCase();
  const nftBalances = await getErc721Balances(normalizedAddress, process.env.CHAINBOIS_NFT_ADDRESS);

  if (!nftBalances || nftBalances.length === 0) {
    return res.status(200).json({
      success: true,
      data: { count: 0, nfts: [] },
    });
  }

  // Fetch levels in parallel for all owned NFTs
  const nfts = await Promise.all(
    nftBalances.map(async (nft) => {
      const tokenId = parseInt(nft.tokenId);
      let level = 0;
      try {
        level = await getNftLevel(tokenId);
      } catch (e) {
        console.error(`Failed to get level for token ${tokenId}:`, e.message);
      }

      const { characters, weapons } = getUnlockedContent(level, true);
      const localNft = await ChainboiNft.findOne({ tokenId });

      return {
        tokenId,
        contractAddress: process.env.CHAINBOIS_NFT_ADDRESS,
        level,
        rank: RANK_NAMES[level] || "Private",
        badge: (RANK_NAMES[level] || "Private").toLowerCase().replace(/ /g, "_"),
        imageUri: localNft ? localNft.imageUri : "",
        metadataUri: localNft ? localNft.metadataUri : "",
        characters,
        weapons,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: { count: nfts.length, nfts },
  });
});

/**
 * GET /api/v1/training/nft/:tokenId
 * Get full details of a single NFT
 */
const getNftDetail = catchAsync(async (req, res, next) => {
  const parsedTokenId = parseInt(req.params.tokenId);
  if (isNaN(parsedTokenId) || parsedTokenId < 1) {
    return next(new AppError("tokenId must be a valid positive integer", 400));
  }

  if (!process.env.CHAINBOIS_NFT_ADDRESS) {
    return next(new AppError("NFT contract not configured", 503));
  }

  // Verify token exists by checking owner
  let owner;
  try {
    owner = await getNftOwner(parsedTokenId);
  } catch (e) {
    return next(new AppError("Token does not exist", 404));
  }

  let level = 0;
  try {
    level = await getNftLevel(parsedTokenId);
  } catch (e) {
    return next(new AppError("Failed to get NFT level from contract", 500));
  }
  const { characters, weapons } = getUnlockedContent(level, true);
  const localNft = await ChainboiNft.findOne({ tokenId: parsedTokenId });

  // Get next level cost from settings
  let nextLevelCost = null;
  const isMaxLevel = level >= MAX_LEVEL;
  if (!isMaxLevel) {
    const settings = await Settings.findOne();
    if (settings && settings.levelUpCosts) {
      nextLevelCost = settings.levelUpCosts.get(String(level + 1)) || null;
    }
  }

  res.status(200).json({
    success: true,
    data: {
      tokenId: parsedTokenId,
      contractAddress: process.env.CHAINBOIS_NFT_ADDRESS,
      owner: owner.toLowerCase(),
      level,
      rank: RANK_NAMES[level] || "Private",
      badge: (RANK_NAMES[level] || "Private").toLowerCase().replace(/ /g, "_"),
      traits: localNft ? localNft.traits : [],
      imageUri: localNft ? localNft.imageUri : "",
      metadataUri: localNft ? localNft.metadataUri : "",
      inGameStats: localNft ? localNft.inGameStats : { kills: 0, score: 0, gamesPlayed: 0 },
      characters,
      weapons,
      nextLevelCost,
      isMaxLevel,
    },
  });
});

/**
 * POST /api/v1/training/level-up
 * Pay AVAX to level up an NFT on-chain
 */
const levelUp = catchAsync(async (req, res, next) => {
  const { tokenId, txHash } = req.body;

  // 1. Validate inputs
  if (tokenId === undefined || tokenId === null) {
    return next(new AppError("tokenId is required", 400));
  }
  const parsedTokenId = parseInt(tokenId);
  if (isNaN(parsedTokenId) || parsedTokenId < 1) {
    return next(new AppError("tokenId must be a valid positive integer", 400));
  }

  if (!txHash) {
    return next(new AppError("txHash is required", 400));
  }
  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    return next(new AppError("txHash must be a valid transaction hash", 400));
  }

  if (!process.env.CHAINBOIS_NFT_ADDRESS) {
    return next(new AppError("NFT contract not configured", 503));
  }

  // 2. Find authenticated user
  const user = await User.findOne({ uid: req.user.uid });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.address) {
    return next(new AppError("No wallet address linked. Please login first.", 400));
  }

  // 3. Replay protection
  const existingTx = await Transaction.findOne({ txHash: txHash.toLowerCase() });
  if (existingTx) {
    return next(new AppError("This transaction has already been used", 409));
  }

  // 4. Verify on-chain ownership
  let owner;
  try {
    owner = await getNftOwner(parsedTokenId);
  } catch (e) {
    return next(new AppError("Failed to verify NFT ownership. Token may not exist.", 400));
  }
  if (owner.toLowerCase() !== user.address.toLowerCase()) {
    return next(new AppError("You do not own this NFT", 403));
  }

  // 5. Get current level and check max
  const currentLevel = await getNftLevel(parsedTokenId);
  if (currentLevel >= MAX_LEVEL) {
    return next(new AppError("NFT is already at maximum level", 400));
  }
  const newLevel = currentLevel + 1;

  // 6. Get cost from settings
  const settings = await Settings.findOne();
  if (!settings || !settings.levelUpCosts) {
    return next(new AppError("Level-up costs not configured", 503));
  }
  const cost = settings.levelUpCosts.get(String(newLevel));
  if (cost === undefined || cost === null) {
    return next(new AppError(`Level-up cost not configured for level ${newLevel}`, 503));
  }

  // 7. Get prize_pool wallet address (payment receiver)
  const prizePoolWallet = await Wallet.findOne({ role: WALLET_ROLES.PRIZE_POOL });
  if (!prizePoolWallet) {
    return next(new AppError("Prize pool wallet not configured", 503));
  }

  // 8. Verify AVAX payment
  const costInWei = ethers.parseEther(String(cost));
  const paymentResult = await verifyPayment(
    txHash,
    user.address,
    prizePoolWallet.address,
    costInWei.toString(),
    300
  );
  if (!paymentResult.valid) {
    return next(new AppError(paymentResult.reason, 400));
  }

  // 9. Create pending transaction record
  const transaction = await Transaction.create({
    type: TRANSACTION_TYPES.LEVEL_UP,
    fromAddress: user.address,
    toAddress: prizePoolWallet.address,
    amount: cost,
    currency: "AVAX",
    txHash: txHash.toLowerCase(),
    status: "pending",
    metadata: {
      description: `ChainBoi #${parsedTokenId} leveled up from ${RANK_NAMES[currentLevel] || "Private"} (Lv.${currentLevel}) to ${RANK_NAMES[newLevel] || "Private"} (Lv.${newLevel}).`,
      tokenId: parsedTokenId,
      fromLevel: currentLevel,
      toLevel: newLevel,
    },
  });

  // 10. Decrypt deployer wallet and set level on-chain
  const deployerWallet = await Wallet.findOne({ role: WALLET_ROLES.DEPLOYER }).select("+key +iv");
  if (!deployerWallet) {
    transaction.status = "failed";
    transaction.metadata.error = "Deployer wallet not configured";
    await transaction.save();
    return next(new AppError("Deployer wallet not configured", 503));
  }

  let deployerKey;
  try {
    deployerKey = await decrypt(deployerWallet.key, deployerWallet.iv);
  } catch (e) {
    transaction.status = "failed";
    transaction.metadata.error = "Failed to decrypt deployer key";
    await transaction.save();
    return next(new AppError("Server configuration error", 500));
  }

  let receipt;
  try {
    receipt = await setNftLevel(parsedTokenId, newLevel, deployerKey);
  } catch (e) {
    transaction.status = "failed";
    transaction.metadata.error = e.message;
    await transaction.save();
    return next(new AppError("Failed to update NFT level on-chain", 500));
  }

  // 11. Update transaction to confirmed
  transaction.status = "confirmed";
  transaction.metadata.contractTxHash = receipt.hash;
  await transaction.save();

  // 12. Update MongoDB records
  user.level = newLevel;
  await user.save();

  await ChainboiNft.findOneAndUpdate(
    { tokenId: parsedTokenId },
    {
      level: newLevel,
      badge: (RANK_NAMES[newLevel] || "Private").toLowerCase().replace(/ /g, "_"),
      ownerAddress: user.address.toLowerCase(),
      contractAddress: process.env.CHAINBOIS_NFT_ADDRESS.toLowerCase(),
    },
    { upsert: true, new: true }
  );

  // 13. Sync to Firebase (non-fatal)
  const { characters, weapons } = getUnlockedContent(newLevel, true);
  try {
    const db = getFirebaseDb();
    await db.ref(`${FIREBASE_PATHS.USERS}/${req.user.uid}`).update({
      hasNFT: true,
      level: newLevel,
      characters: characters,
      weapons: weapons.length > 0 ? weapons : null,
    });
  } catch (e) {
    console.error("Failed to sync level-up to Firebase:", e.message);
  }

  // 14. Trigger metadata reindex (non-fatal)
  try {
    await reindexNftMetadata(process.env.CHAINBOIS_NFT_ADDRESS, String(parsedTokenId));
  } catch (e) {
    console.error("Failed to trigger metadata reindex:", e.message);
  }

  res.status(200).json({
    success: true,
    data: {
      tokenId: parsedTokenId,
      previousLevel: currentLevel,
      newLevel,
      rank: RANK_NAMES[newLevel] || "Private",
      cost,
      contractTxHash: receipt.hash,
      characters,
      weapons,
    },
  });
});

/**
 * GET /api/v1/training/level-up/cost
 * Get level-up cost (specific level or full table)
 */
const getLevelUpCost = catchAsync(async (req, res, next) => {
  const settings = await Settings.findOne();
  if (!settings || !settings.levelUpCosts) {
    return next(new AppError("Level-up costs not configured", 503));
  }

  const { tokenId, currentLevel } = req.query;

  // If tokenId provided, fetch level from chain
  if (tokenId) {
    const parsedTokenId = parseInt(tokenId);
    if (isNaN(parsedTokenId) || parsedTokenId < 1) {
      return next(new AppError("tokenId must be a valid positive integer", 400));
    }

    let level;
    try {
      level = await getNftLevel(parsedTokenId);
    } catch (e) {
      return next(new AppError("Failed to get NFT level. Token may not exist.", 400));
    }

    if (level >= MAX_LEVEL) {
      return res.status(200).json({
        success: true,
        data: {
          currentLevel: level,
          nextLevel: null,
          cost: null,
          currency: "AVAX",
          isMaxLevel: true,
          rank: RANK_NAMES[level] || "Private",
          nextRank: null,
        },
      });
    }

    const nextLevel = level + 1;
    return res.status(200).json({
      success: true,
      data: {
        currentLevel: level,
        nextLevel,
        cost: settings.levelUpCosts.get(String(nextLevel)),
        currency: "AVAX",
        isMaxLevel: false,
        rank: RANK_NAMES[level] || "Private",
        nextRank: RANK_NAMES[nextLevel] || null,
      },
    });
  }

  // If currentLevel provided, return cost for next level
  if (currentLevel !== undefined) {
    const parsedLevel = parseInt(currentLevel);
    if (isNaN(parsedLevel) || parsedLevel < 0 || parsedLevel > MAX_LEVEL) {
      return next(new AppError(`currentLevel must be between 0 and ${MAX_LEVEL}`, 400));
    }

    if (parsedLevel >= MAX_LEVEL) {
      return res.status(200).json({
        success: true,
        data: {
          currentLevel: parsedLevel,
          nextLevel: null,
          cost: null,
          currency: "AVAX",
          isMaxLevel: true,
          rank: RANK_NAMES[parsedLevel] || "Private",
          nextRank: null,
        },
      });
    }

    const nextLevel = parsedLevel + 1;
    return res.status(200).json({
      success: true,
      data: {
        currentLevel: parsedLevel,
        nextLevel,
        cost: settings.levelUpCosts.get(String(nextLevel)),
        currency: "AVAX",
        isMaxLevel: false,
        rank: RANK_NAMES[parsedLevel] || "Private",
        nextRank: RANK_NAMES[nextLevel] || null,
      },
    });
  }

  // No params: return full cost table
  const costs = {};
  for (const [key, value] of settings.levelUpCosts) {
    costs[key] = value;
  }

  res.status(200).json({
    success: true,
    data: {
      costs,
      currency: "AVAX",
      maxLevel: MAX_LEVEL,
    },
  });
});

/**
 * GET /api/v1/training/eligibility/:tokenId
 * Check which tournaments an NFT qualifies for
 */
const getEligibility = catchAsync(async (req, res, next) => {
  const parsedTokenId = parseInt(req.params.tokenId);
  if (isNaN(parsedTokenId) || parsedTokenId < 1) {
    return next(new AppError("tokenId must be a valid positive integer", 400));
  }

  let level;
  try {
    level = await getNftLevel(parsedTokenId);
  } catch (e) {
    return next(new AppError("Failed to get NFT level. Token may not exist.", 404));
  }

  // Eligible for tournaments at levels 1 through nftLevel
  const eligibleLevels = [];
  for (let i = 1; i <= level; i++) {
    eligibleLevels.push(i);
  }

  // Find active and upcoming tournaments the NFT qualifies for
  const tournaments = level > 0
    ? await Tournament.find({
        level: { $lte: level },
        status: { $in: ["upcoming", "active"] },
      }).sort({ level: 1, startTime: 1 }).lean()
    : [];

  const activeTournaments = tournaments.filter((t) => t.status === "active");
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming");

  res.status(200).json({
    success: true,
    data: {
      tokenId: parsedTokenId,
      level,
      rank: RANK_NAMES[level] || "Private",
      eligibleLevels,
      activeTournaments: activeTournaments.map((t) => ({
        tournamentId: t._id,
        level: t.level,
        status: t.status,
        prizePool: t.prizePool,
        startTime: t.startTime,
        endTime: t.endTime,
      })),
      upcomingTournaments: upcomingTournaments.map((t) => ({
        tournamentId: t._id,
        level: t.level,
        status: t.status,
        prizePool: t.prizePool,
        startTime: t.startTime,
        endTime: t.endTime,
      })),
    },
  });
});

module.exports = {
  getNfts,
  getNftDetail,
  levelUp,
  getLevelUpCost,
  getEligibility,
};
