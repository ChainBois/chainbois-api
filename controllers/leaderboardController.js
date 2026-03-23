const User = require("../models/userModel");
const ScoreChange = require("../models/scoreChangeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/**
 * Parse a time period string into startDate/endDate
 * @param {string} period - One of: 30min, 1hour, 24hours, 2days, week, month, year, all
 * @returns {{ startDate: Date, endDate: Date } | null} null for "all"
 */
const parseTimePeriod = function (period) {
  const now = new Date();
  const endDate = now;
  let startDate;

  switch (period) {
    case "30min":
      startDate = new Date(now.getTime() - 30 * 60 * 1000);
      break;
    case "1hour":
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case "24hours":
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "2days":
      startDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      break;
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "year":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case "all":
      return null;
    default:
      return undefined; // invalid period
  }

  return { startDate, endDate };
};

const VALID_PERIODS = ["30min", "1hour", "24hours", "2days", "week", "month", "year", "all"];

/**
 * GET /api/v1/leaderboard
 * GET /api/v1/leaderboard/:period
 * Get leaderboard data, optionally filtered by time period
 */
const getLeaderboard = catchAsync(async (req, res, next) => {
  const period = req.params.period || "all";
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 100, 1), 500);
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const skip = (page - 1) * limit;

  // Validate period
  if (!VALID_PERIODS.includes(period)) {
    return next(new AppError(`Invalid period. Valid periods: ${VALID_PERIODS.join(", ")}`, 400));
  }

  // Custom date range from query params
  let startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  let endDate = req.query.endDate ? new Date(req.query.endDate) : null;

  // Validate custom dates
  if (startDate && isNaN(startDate.getTime())) {
    return next(new AppError("Invalid startDate format", 400));
  }
  if (endDate && isNaN(endDate.getTime())) {
    return next(new AppError("Invalid endDate format", 400));
  }

  // If no custom range, parse period
  if (!startDate && !endDate) {
    const parsed = parseTimePeriod(period);
    if (parsed === undefined) {
      return next(new AppError(`Invalid period. Valid periods: ${VALID_PERIODS.join(", ")}`, 400));
    }
    if (parsed !== null) {
      startDate = parsed.startDate;
      endDate = parsed.endDate;
    }
  }

  let leaderboard;
  let totalUsers;

  if (!startDate && !endDate) {
    // "all" period - query User model directly
    totalUsers = await User.countDocuments({ score: { $gt: 0 } });
    const users = await User.find({ score: { $gt: 0 } })
      .sort({ score: -1 })
      .skip(skip)
      .limit(limit)
      .select("uid username score")
      .lean();

    leaderboard = users.map((u, i) => ({
      uid: u.uid,
      username: u.username,
      scoreGained: u.score,
      currentScore: u.score,
      rank: skip + i + 1,
    }));
  } else {
    // Time-filtered: aggregate ScoreChange
    const matchStage = {
      timestamp: {},
    };
    if (startDate) matchStage.timestamp.$gte = startDate;
    if (endDate) matchStage.timestamp.$lte = endDate;

    const pipeline = [
      { $match: matchStage },
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: "$uid",
          username: { $last: "$username" },
          scoreGained: { $sum: "$scoreChange" },
          currentScore: { $last: "$score" },
        },
      },
      { $sort: { scoreGained: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    const result = await ScoreChange.aggregate(pipeline);
    const metadata = result[0].metadata[0];
    totalUsers = metadata ? metadata.total : 0;

    leaderboard = result[0].data.map((entry, i) => ({
      uid: entry._id,
      username: entry.username,
      scoreGained: entry.scoreGained,
      currentScore: entry.currentScore,
      rank: skip + i + 1,
    }));
  }

  const totalPages = Math.ceil(totalUsers / limit) || 1;

  res.status(200).json({
    success: true,
    data: {
      period,
      startDate: startDate || null,
      endDate: endDate || null,
      currentPage: page,
      totalPages,
      totalUsers,
      leaderboard,
    },
  });
});

/**
 * GET /api/v1/leaderboard/rank/:uid
 * Get a specific user's rank on the leaderboard
 */
const getUserRank = catchAsync(async (req, res, next) => {
  const { uid } = req.params;
  const period = req.query.period || "all";

  if (!VALID_PERIODS.includes(period)) {
    return next(new AppError(`Invalid period. Valid periods: ${VALID_PERIODS.join(", ")}`, 400));
  }

  // Find user
  const user = await User.findOne({ uid });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  let rank;
  let scoreGained;
  let currentScore = user.score;

  if (period === "all") {
    // Count users with higher score
    rank = (await User.countDocuments({ score: { $gt: user.score } })) + 1;
    scoreGained = user.score;
  } else {
    const parsed = parseTimePeriod(period);
    if (parsed === undefined || parsed === null) {
      return next(new AppError(`Invalid period. Valid periods: ${VALID_PERIODS.join(", ")}`, 400));
    }

    const { startDate, endDate } = parsed;

    // Get this user's score gained in period
    const userAgg = await ScoreChange.aggregate([
      {
        $match: {
          uid,
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: "$uid",
          scoreGained: { $sum: "$scoreChange" },
          currentScore: { $last: "$score" },
        },
      },
    ]);

    if (userAgg.length === 0) {
      scoreGained = 0;
    } else {
      scoreGained = userAgg[0].scoreGained;
      currentScore = userAgg[0].currentScore;
    }

    // Count users with higher scoreGained in the same period
    const higherCount = await ScoreChange.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$uid",
          scoreGained: { $sum: "$scoreChange" },
        },
      },
      {
        $match: {
          scoreGained: { $gt: scoreGained },
        },
      },
      { $count: "count" },
    ]);

    rank = (higherCount.length > 0 ? higherCount[0].count : 0) + 1;
  }

  res.status(200).json({
    success: true,
    data: {
      uid,
      period,
      rank,
      scoreGained,
      currentScore,
    },
  });
});

module.exports = {
  getLeaderboard,
  getUserRank,
  parseTimePeriod,
};
