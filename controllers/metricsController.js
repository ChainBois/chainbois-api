const PlatformMetrics = require("../models/platformMetricsModel");
const User = require("../models/userModel");
const ChainboiNft = require("../models/chainboiNftModel");
const Transaction = require("../models/transactionModel");
const Tournament = require("../models/tournamentModel");
const Wallet = require("../models/walletModel");
const BurnRecord = require("../models/burnRecordModel");
const { getBattleBalance, getBattleTotalSupply } = require("../utils/contractUtils");
const { getTokenomicsRates } = require("../services/tokenomicsService");
const { WALLET_ROLES } = require("../config/constants");
const catchAsync = require("../utils/catchAsync");

/**
 * GET /api/v1/metrics/platform
 * Returns the current platform metrics snapshot.
 */
const getPlatformMetrics = catchAsync(async (req, res) => {
  const metrics = await PlatformMetrics.getOrCreate();

  res.status(200).json({
    success: true,
    data: metrics,
  });
});

/**
 * POST /api/v1/metrics/compute
 * Recalculate all platform metrics from source data (aggregation queries).
 * Admin/maintenance endpoint — rebuilds the metrics document from scratch.
 */
const computeMetrics = catchAsync(async (req, res) => {
  // --- Users ---
  const totalUsers = await User.countDocuments();
  const web3Users = await User.countDocuments({
    address: { $exists: true, $ne: null },
  });
  const web2Users = totalUsers - web3Users;

  // --- Game Activity ---
  const gameAgg = await User.aggregate([
    {
      $group: {
        _id: null,
        totalGamesPlayed: { $sum: "$gamesPlayed" },
        totalScore: { $sum: "$score" },
        highestScore: { $max: "$highScore" },
      },
    },
  ]);
  const gameStats = gameAgg[0] || {
    totalGamesPlayed: 0,
    totalScore: 0,
    highestScore: 0,
  };

  // --- NFT Economy ---
  // Find store wallet addresses to exclude from "owned by players"
  const storeWallets = await Wallet.find({
    role: { $in: ["nft_store", "weapon_store"] },
  })
    .select("address")
    .lean();
  const storeAddresses = storeWallets.map((w) => w.address);

  const totalNftsOwned = await ChainboiNft.countDocuments({
    ownerAddress: { $nin: storeAddresses },
  });

  const nftsByLevelAgg = await ChainboiNft.aggregate([
    { $match: { ownerAddress: { $nin: storeAddresses } } },
    { $group: { _id: "$level", count: { $sum: 1 } } },
  ]);
  const nftsByLevel = {};
  for (const entry of nftsByLevelAgg) {
    nftsByLevel[String(entry._id)] = entry.count;
  }

  // --- Token Economy ---
  const battleDistAgg = await Transaction.aggregate([
    {
      $match: {
        type: { $in: ["prize_payout", "points_conversion"] },
        status: "confirmed",
        currency: "BATTLE",
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalBattleDistributed =
    battleDistAgg[0] ? battleDistAgg[0].total : 0;

  const pointsConvAgg = await Transaction.aggregate([
    { $match: { type: "points_conversion", status: "confirmed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalPointsConverted =
    pointsConvAgg[0] ? pointsConvAgg[0].total : 0;

  // --- Training ---
  const totalLevelUps = await Transaction.countDocuments({
    type: "level_up",
    status: "confirmed",
  });

  // --- Battleground ---
  const totalTournaments = await Tournament.countDocuments();
  const completedTournaments = await Tournament.countDocuments({
    status: "completed",
  });

  // Count unique participants from WeeklyLeaderboard for completed tournaments
  const WeeklyLeaderboard = require("../models/weeklyLeaderboardModel");
  const completedTournamentsList = await Tournament.find({ status: "completed" }).select("year weekNumber level").lean();
  let totalParticipants = 0;
  if (completedTournamentsList.length > 0) {
    const participantAgg = await WeeklyLeaderboard.aggregate([
      {
        $match: {
          $or: completedTournamentsList.map((t) => ({
            year: t.year,
            weekNumber: t.weekNumber,
            tournamentLevel: t.level,
          })),
        },
      },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);
    totalParticipants = participantAgg[0] ? participantAgg[0].total : 0;
  }

  const prizeAgg = await Transaction.aggregate([
    { $match: { type: "prize_payout", status: "confirmed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalPrizeDistributed = prizeAgg[0] ? prizeAgg[0].total : 0;

  // --- Weapons ---
  const totalWeaponsSold = await Transaction.countDocuments({
    type: "weapon_purchase",
    status: "confirmed",
  });

  // --- Tokenomics ---
  let tokenomicsData = {};
  try {
    const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS }).lean();
    const burnAgg = await BurnRecord.aggregate([
      { $group: { _id: null, totalBurned: { $sum: "$burnAmount" }, totalRecycled: { $sum: "$recycleAmount" } } },
    ]);
    const burnStats = burnAgg[0] || { totalBurned: 0, totalRecycled: 0 };
    const burnCount = await BurnRecord.countDocuments();
    const lastBurn = await BurnRecord.findOne().sort({ createdAt: -1 }).lean();

    let rewardsBalance = 0;
    let totalSupplyRemaining = 10_000_000;
    let rates = { tier: "ABUNDANT", multiplier: 1.0 };

    if (rewardsWallet) {
      rewardsBalance = parseFloat(await getBattleBalance(rewardsWallet.address));
      rates = getTokenomicsRates(rewardsBalance);
    }

    try {
      totalSupplyRemaining = parseFloat(await getBattleTotalSupply());
    } catch (e) {
      // Fallback
    }

    tokenomicsData = {
      totalBurned: burnStats.totalBurned,
      totalRecycled: burnStats.totalRecycled,
      currentHealthTier: rates.tier,
      currentMultiplier: rates.multiplier,
      rewardsBalance,
      totalSupplyRemaining,
      lastSweepDate: lastBurn ? lastBurn.createdAt : null,
      burnCount,
    };
  } catch (e) {
    console.error("Failed to compute tokenomics metrics:", e.message);
  }

  // --- Upsert the metrics document ---
  const metrics = await PlatformMetrics.findOneAndUpdate(
    {},
    {
      $set: {
        users: { total: totalUsers, web2: web2Users, web3: web3Users },
        gameActivity: {
          totalGamesPlayed: gameStats.totalGamesPlayed,
          totalScore: gameStats.totalScore,
          highestScore: gameStats.highestScore,
        },
        nftEconomy: {
          totalNftsOwned,
          nftsByLevel,
        },
        tokenEconomy: {
          totalBattleDistributed,
          totalPointsConverted,
        },
        trainingMetrics: { totalLevelUps },
        battlegroundMetrics: {
          totalTournaments,
          completedTournaments,
          totalParticipants,
          totalPrizeDistributed,
        },
        weaponMetrics: { totalWeaponsSold },
        tokenomics: tokenomicsData,
      },
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    message: "Metrics recomputed from source data",
    data: metrics,
  });
});

module.exports = {
  getPlatformMetrics,
  computeMetrics,
};
