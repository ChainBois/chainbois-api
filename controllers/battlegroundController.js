const Tournament = require("../models/tournamentModel");
const WeeklyLeaderboard = require("../models/weeklyLeaderboardModel");
const LeaderboardHistory = require("../models/leaderboardHistoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { MAX_LEVEL, RANK_NAMES } = require("../config/constants");

/**
 * Validate level parameter (1-7)
 */
const parseLevel = function (levelParam) {
  const level = parseInt(levelParam);
  if (isNaN(level) || level < 1 || level > MAX_LEVEL) {
    return null;
  }
  return level;
};

/**
 * GET /api/v1/tournaments
 * List all tournament tiers with current status
 */
const listTournaments = catchAsync(async (req, res) => {
  // Find current/latest tournament per level (prefer active/upcoming)
  const tournaments = await Tournament.find({
    status: { $in: ["upcoming", "active", "cooldown"] },
  })
    .sort({ level: 1 })
    .lean();

  // If some levels have no current tournament, fill from most recent completed
  const tournamentsByLevel = {};
  for (const t of tournaments) {
    if (!tournamentsByLevel[t.level]) {
      tournamentsByLevel[t.level] = t;
    }
  }

  // Fill missing levels from completed tournaments
  for (let level = 1; level <= MAX_LEVEL; level++) {
    if (!tournamentsByLevel[level]) {
      const latest = await Tournament.findOne({ level })
        .sort({ createdAt: -1 })
        .lean();
      if (latest) {
        tournamentsByLevel[level] = latest;
      }
    }
  }

  // Get player counts for active/upcoming tournaments
  const data = [];
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const t = tournamentsByLevel[level];
    if (!t) {
      data.push({
        level,
        status: "none",
        startTime: null,
        endTime: null,
        cooldownEndTime: null,
        prizePool: 0,
        prizeDistribution: null,
        playerCount: 0,
        rank: RANK_NAMES[level] || "",
      });
      continue;
    }

    const playerCount = await WeeklyLeaderboard.countDocuments({
      year: t.year,
      weekNumber: t.weekNumber,
      tournamentLevel: t.level,
    });

    data.push({
      level: t.level,
      status: t.status,
      startTime: t.startTime,
      endTime: t.endTime,
      cooldownEndTime: t.cooldownEndTime,
      prizePool: t.prizePool,
      prizeDistribution: t.prizeDistribution,
      playerCount,
      rank: RANK_NAMES[level] || "",
    });
  }

  res.status(200).json({ success: true, data });
});

/**
 * GET /api/v1/tournaments/:level
 * Get tournament details for a specific level with top 10 leaderboard
 */
const getTournamentDetail = catchAsync(async (req, res, next) => {
  const level = parseLevel(req.params.level);
  if (!level) {
    return next(new AppError(`Invalid level. Must be 1-${MAX_LEVEL}`, 400));
  }

  // Find current tournament (prefer active/upcoming)
  let tournament = await Tournament.findOne({
    level,
    status: { $in: ["upcoming", "active", "cooldown"] },
  }).lean();

  if (!tournament) {
    tournament = await Tournament.findOne({ level })
      .sort({ createdAt: -1 })
      .lean();
  }

  if (!tournament) {
    return next(new AppError(`No tournament found for level ${level}`, 404));
  }

  // Get top 10 leaderboard
  const leaderboard = await WeeklyLeaderboard.find({
    year: tournament.year,
    weekNumber: tournament.weekNumber,
    tournamentLevel: level,
  })
    .sort({ highScore: -1 })
    .limit(10)
    .select("uid username highScore totalScore gamesPlayed")
    .lean();

  const playerCount = await WeeklyLeaderboard.countDocuments({
    year: tournament.year,
    weekNumber: tournament.weekNumber,
    tournamentLevel: level,
  });

  res.status(200).json({
    success: true,
    data: {
      level: tournament.level,
      status: tournament.status,
      startTime: tournament.startTime,
      endTime: tournament.endTime,
      cooldownEndTime: tournament.cooldownEndTime,
      prizePool: tournament.prizePool,
      prizeDistribution: tournament.prizeDistribution,
      winners: tournament.winners,
      playerCount,
      rank: RANK_NAMES[level] || "",
      leaderboard: leaderboard.map((e, i) => ({
        rank: i + 1,
        uid: e.uid,
        username: e.username,
        highScore: e.highScore,
        totalScore: e.totalScore,
        gamesPlayed: e.gamesPlayed,
      })),
    },
  });
});

/**
 * GET /api/v1/tournaments/:level/leaderboard
 * Top players for a tournament level
 */
const getTournamentLeaderboard = catchAsync(async (req, res, next) => {
  const level = parseLevel(req.params.level);
  if (!level) {
    return next(new AppError(`Invalid level. Must be 1-${MAX_LEVEL}`, 400));
  }

  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const skip = (page - 1) * limit;

  // Find active tournament for this level
  let tournament = await Tournament.findOne({
    level,
    status: { $in: ["active", "cooldown"] },
  }).lean();

  if (!tournament) {
    tournament = await Tournament.findOne({ level })
      .sort({ createdAt: -1 })
      .lean();
  }

  if (!tournament) {
    return res.status(200).json({
      success: true,
      data: { level, leaderboard: [], totalPlayers: 0, page, totalPages: 0 },
    });
  }

  const query = {
    year: tournament.year,
    weekNumber: tournament.weekNumber,
    tournamentLevel: level,
  };

  const totalPlayers = await WeeklyLeaderboard.countDocuments(query);
  const entries = await WeeklyLeaderboard.find(query)
    .sort({ highScore: -1 })
    .skip(skip)
    .limit(limit)
    .select("uid username highScore totalScore gamesPlayed")
    .lean();

  res.status(200).json({
    success: true,
    data: {
      level,
      leaderboard: entries.map((e, i) => ({
        rank: skip + i + 1,
        uid: e.uid,
        username: e.username,
        highScore: e.highScore,
        totalScore: e.totalScore,
        gamesPlayed: e.gamesPlayed,
      })),
      totalPlayers,
      page,
      totalPages: Math.ceil(totalPlayers / limit) || 1,
    },
  });
});

/**
 * GET /api/v1/tournaments/:level/countdown
 * Time remaining for a tournament
 */
const getCountdown = catchAsync(async (req, res, next) => {
  const level = parseLevel(req.params.level);
  if (!level) {
    return next(new AppError(`Invalid level. Must be 1-${MAX_LEVEL}`, 400));
  }

  const tournament = await Tournament.findOne({
    level,
    status: { $in: ["upcoming", "active", "cooldown"] },
  }).lean();

  if (!tournament) {
    return res.status(200).json({
      success: true,
      data: { level, status: "none", timeRemaining: 0, startTime: null, endTime: null },
    });
  }

  const now = new Date();
  let timeRemaining = 0;

  if (tournament.status === "upcoming") {
    timeRemaining = Math.max(0, Math.floor((tournament.startTime - now) / 1000));
  } else if (tournament.status === "active") {
    timeRemaining = Math.max(0, Math.floor((tournament.endTime - now) / 1000));
  } else if (tournament.status === "cooldown") {
    timeRemaining = Math.max(0, Math.floor((tournament.cooldownEndTime - now) / 1000));
  }

  res.status(200).json({
    success: true,
    data: {
      level,
      status: tournament.status,
      timeRemaining,
      startTime: tournament.startTime,
      endTime: tournament.endTime,
      cooldownEndTime: tournament.cooldownEndTime,
    },
  });
});

/**
 * GET /api/v1/tournaments/:level/winners
 * Current and past winners for a tournament level
 */
const getWinners = catchAsync(async (req, res, next) => {
  const level = parseLevel(req.params.level);
  if (!level) {
    return next(new AppError(`Invalid level. Must be 1-${MAX_LEVEL}`, 400));
  }

  const weeks = Math.min(Math.max(parseInt(req.query.weeks) || 4, 1), 12);

  // Current tournament winners (if ended)
  const currentTournament = await Tournament.findOne({
    level,
    status: { $in: ["cooldown", "completed"] },
    "winners.0": { $exists: true },
  })
    .sort({ createdAt: -1 })
    .lean();

  // Historical winners
  const history = await LeaderboardHistory.find({ tournamentLevel: level })
    .sort({ year: -1, weekNumber: -1 })
    .limit(weeks)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      level,
      current: currentTournament
        ? {
            weekNumber: currentTournament.weekNumber,
            year: currentTournament.year,
            winners: currentTournament.winners,
            prizePool: currentTournament.prizePool,
          }
        : null,
      history: history.map((h) => ({
        weekNumber: h.weekNumber,
        year: h.year,
        winners: h.winners,
        totalPayout: h.totalPayout,
      })),
    },
  });
});

/**
 * GET /api/v1/tournaments/history
 * Paginated historical tournament data across all levels
 */
const getHistory = catchAsync(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.level) {
    const level = parseInt(req.query.level);
    if (level >= 1 && level <= MAX_LEVEL) {
      filter.tournamentLevel = level;
    }
  }

  const total = await LeaderboardHistory.countDocuments(filter);
  const entries = await LeaderboardHistory.find(filter)
    .sort({ year: -1, weekNumber: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      history: entries,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

module.exports = {
  listTournaments,
  getTournamentDetail,
  getTournamentLeaderboard,
  getCountdown,
  getWinners,
  getHistory,
};
