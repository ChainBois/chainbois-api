const NftRarity = require("../models/nftRarityModel");
const NftTrait = require("../models/nftTraitModel");
const Trait = require("../models/traitModel");
const TraitsPool = require("../models/traitsPoolModel");
const ChainboiNft = require("../models/chainboiNftModel");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { transferBattleTokens, getBattleBalance } = require("../utils/contractUtils");
const { decrypt } = require("../utils/cryptUtils");
const { processCollectionRarity, populateNftTraits, TRAIT_FIELDS } = require("../services/rarityService");
const { WALLET_ROLES, TRANSACTION_TYPES } = require("../config/constants");
const { getAdjustedAirdropAmount } = require("../services/tokenomicsService");

/**
 * GET /api/v1/airdrop/rarity
 * Public: paginated rarity leaderboard
 */
const getRarityLeaderboard = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const skip = (page - 1) * limit;

  const [nfts, total] = await Promise.all([
    NftRarity.find({}).sort({ rank: 1 }).skip(skip).limit(limit).lean(),
    NftRarity.countDocuments({}),
  ]);

  res.status(200).json({
    success: true,
    data: {
      nfts: nfts.map((n) => ({
        tokenId: n.tokenId,
        name: n.name,
        rank: n.rank,
        rarityScore: n.rarityScore,
        rarityTier: n.rarityTier,
        percentile: n.percentile,
        traitCount: n.traitCount,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

/**
 * GET /api/v1/airdrop/rarity/:tokenId
 * Public: single NFT rarity
 */
const getRarityByToken = catchAsync(async (req, res, next) => {
  const tokenId = parseInt(req.params.tokenId);
  if (isNaN(tokenId) || tokenId < 1) {
    return next(new AppError("tokenId must be a valid positive integer", 400));
  }

  const rarity = await NftRarity.findOne({ tokenId }).lean();
  if (!rarity) {
    return next(new AppError("Rarity data not found for this token", 404));
  }

  res.status(200).json({
    success: true,
    data: rarity,
  });
});

/**
 * GET /api/v1/airdrop/traits-pool
 * Public: get active trait airdrop pools
 */
const getTraitsPool = catchAsync(async (req, res) => {
  const pools = await TraitsPool.find({}).lean();

  res.status(200).json({
    success: true,
    data: pools.map((p) => ({
      id: p._id,
      poolName: p.poolName,
      tokenName: p.tokenName,
      weeklyDistributionAmount: p.weeklyDistributionAmount,
      status: p.status,
      lastChosenTrait: p.lastChosenTrait,
    })),
  });
});

/**
 * GET /api/v1/airdrop/trait-history
 * Public: distribution history
 */
const getTraitHistory = catchAsync(async (req, res) => {
  const pool = await TraitsPool.findOne({ status: { $in: ["active", "completed"] } })
    .sort({ updatedAt: -1 })
    .lean();

  if (!pool) {
    return res.status(200).json({
      success: true,
      data: { history: [] },
    });
  }

  res.status(200).json({
    success: true,
    data: {
      poolName: pool.poolName,
      history: pool.traitHistory || [],
    },
  });
});

/**
 * POST /api/v1/airdrop/traits-pool
 * Admin: create/configure a trait airdrop pool
 */
const setupTraitsPool = catchAsync(async (req, res, next) => {
  const { poolName, tokenAddress, weeklyDistributionAmount, walletId } = req.body;

  if (!tokenAddress || !weeklyDistributionAmount) {
    return next(new AppError("tokenAddress and weeklyDistributionAmount are required", 400));
  }

  const pool = await TraitsPool.create({
    poolName: poolName || "ChainBois Trait Airdrop",
    tokenAddress,
    weeklyDistributionAmount,
    walletId: walletId || null,
    status: "active",
  });

  res.status(201).json({
    success: true,
    data: pool,
  });
});

/**
 * POST /api/v1/airdrop/calculate-rarity
 * Admin: trigger rarity calculation
 */
const calculateRarity = catchAsync(async (req, res) => {
  // Populate NftTrait from ChainboiNft
  const traitsPopulated = await populateNftTraits();
  console.log(`Populated ${traitsPopulated} NFT traits.`);

  // Process rarity scores
  const result = await processCollectionRarity();

  res.status(200).json({
    success: true,
    data: {
      message: "Rarity calculation complete",
      nftsProcessed: result.processed,
      uniqueTraits: result.traits,
    },
  });
});

/**
 * POST /api/v1/airdrop/distribute
 * Admin: trigger manual trait-based distribution
 */
const triggerDistribution = catchAsync(async (req, res, next) => {
  const result = await executeTraitAirdrop();

  if (!result.success) {
    return next(new AppError(result.message, 400));
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * Core trait airdrop logic (used by both manual trigger and cron job).
 * @returns {object} Result of the airdrop
 */
const executeTraitAirdrop = async function () {
  // 1. Find active pool
  const pool = await TraitsPool.findOne({ status: "active" });
  if (!pool) {
    return { success: false, message: "No active trait airdrop pool found" };
  }

  // 2. Pick random unused trait
  const unusedCount = await Trait.countDocuments({ used: false });
  if (unusedCount === 0) {
    // Reset all traits as unused for the next cycle
    await Trait.updateMany({}, { $set: { used: false, usedDate: null } });
  }

  const randomIndex = Math.floor(Math.random() * (await Trait.countDocuments({ used: false })));
  const chosenTrait = await Trait.findOne({ used: false }).skip(randomIndex);

  if (!chosenTrait) {
    return { success: false, message: "No traits available for airdrop" };
  }

  // 3. Find all NFTs with this trait
  const traitField = chosenTrait.traitType;
  const traitValue = chosenTrait.value;

  if (!TRAIT_FIELDS.includes(traitField)) {
    return { success: false, message: `Unknown trait field: ${traitField}` };
  }

  const matchingNfts = await NftTrait.find({ [traitField]: traitValue }).lean();

  if (matchingNfts.length === 0) {
    // Mark trait as used and try again
    chosenTrait.used = true;
    chosenTrait.usedDate = new Date();
    await chosenTrait.save();
    return { success: false, message: `No NFTs found with trait ${traitField}:${traitValue}` };
  }

  // 4. Look up owners, excluding platform wallets
  const platformWallets = await Wallet.find({
    role: { $in: [WALLET_ROLES.NFT_STORE, WALLET_ROLES.DEPLOYER, WALLET_ROLES.WEAPON_STORE] },
  }).lean();
  const platformAddresses = new Set(platformWallets.map((w) => w.address.toLowerCase()));

  const ownerNftCounts = {};
  for (const nft of matchingNfts) {
    const nftDoc = await ChainboiNft.findOne({ tokenId: nft.tokenId }).lean();
    if (!nftDoc || !nftDoc.ownerAddress) continue;

    const owner = nftDoc.ownerAddress.toLowerCase();
    if (platformAddresses.has(owner)) continue;

    ownerNftCounts[owner] = (ownerNftCounts[owner] || 0) + 1;
  }

  const eligibleOwners = Object.keys(ownerNftCounts);
  if (eligibleOwners.length === 0) {
    chosenTrait.used = true;
    chosenTrait.usedDate = new Date();
    await chosenTrait.save();
    return { success: false, message: "No eligible holders found (all platform wallets)" };
  }

  const totalEligibleNfts = Object.values(ownerNftCounts).reduce((a, b) => a + b, 0);
  const amountPerNft = adjustedAmount / totalEligibleNfts;

  // 5. Distribute $BATTLE from rewards wallet (fixed supply — transfer, not mint)
  const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS }).select("+key +iv");
  if (!rewardsWallet) {
    return { success: false, message: "Rewards wallet not configured" };
  }

  // Calculate dynamic airdrop amount based on rewards health
  const rewardsBalance = await getBattleBalance(rewardsWallet.address);
  const rewardsBalanceNum = parseFloat(rewardsBalance);
  const adjustedAmount = getAdjustedAirdropAmount(pool.weeklyDistributionAmount, rewardsBalanceNum);

  console.log(`[Airdrop] Base: ${pool.weeklyDistributionAmount} | Adjusted: ${adjustedAmount} | Rewards: ${rewardsBalanceNum.toLocaleString()}`);

  if (rewardsBalanceNum < adjustedAmount) {
    return { success: false, message: `Insufficient BATTLE balance: ${rewardsBalance} < ${adjustedAmount}` };
  }

  let rewardsKey;
  try {
    rewardsKey = await decrypt(rewardsWallet.key, rewardsWallet.iv);
  } catch (e) {
    return { success: false, message: "Failed to decrypt rewards wallet key" };
  }

  let totalDistributed = 0;
  const distributions = [];

  for (const owner of eligibleOwners) {
    const nftCount = ownerNftCounts[owner];
    const amount = Math.round(amountPerNft * nftCount * 100) / 100;

    if (amount <= 0) continue;

    try {
      const receipt = await transferBattleTokens(owner, amount, rewardsKey);
      totalDistributed += amount;
      distributions.push({ address: owner, nftCount, amount, txHash: receipt.hash });

      // Record transaction
      await Transaction.create({
        type: TRANSACTION_TYPES.TRAIT_AIRDROP,
        fromAddress: rewardsWallet.address,
        toAddress: owner,
        amount,
        currency: "BATTLE",
        txHash: receipt.hash,
        status: "confirmed",
        metadata: {
          description: `You received ${amount} BATTLE for holding ${nftCount} ChainBoi NFT(s) with the trait: ${traitField} = ${traitValue}.`,
          traitType: traitField,
          traitValue,
          nftCount,
          weeklyPool: pool.weeklyDistributionAmount,
        },
      });
    } catch (e) {
      console.error(`Failed to send airdrop to ${owner}:`, e.message);
    }
  }

  // 6. Update pool and trait records
  const weekNumber = Math.ceil((Date.now() - new Date("2026-01-01").getTime()) / (7 * 24 * 60 * 60 * 1000));
  const historyEntry = {
    traitType: traitField,
    value: traitValue,
    dateChosen: new Date(),
    weekNumber,
    beneficiaryCount: eligibleOwners.length,
    totalDistributed,
  };

  pool.lastChosenTrait = historyEntry;
  pool.traitHistory.push(historyEntry);
  await pool.save();

  chosenTrait.used = true;
  chosenTrait.usedDate = new Date();
  await chosenTrait.save();

  return {
    success: true,
    message: "Trait airdrop complete",
    trait: { type: traitField, value: traitValue },
    matchingNfts: matchingNfts.length,
    eligibleHolders: eligibleOwners.length,
    totalDistributed,
    distributions,
  };
};

module.exports = {
  getRarityLeaderboard,
  getRarityByToken,
  getTraitsPool,
  getTraitHistory,
  setupTraitsPool,
  calculateRarity,
  triggerDistribution,
  executeTraitAirdrop,
};
