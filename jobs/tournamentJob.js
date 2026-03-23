const Tournament = require("../models/tournamentModel");
const Settings = require("../models/settingsModel");
const { distributePrizes } = require("../services/prizeService");
const { getWeekInfo } = require("../utils/weekUtils");
const {
  MAX_LEVEL,
  PRIZE_DISTRIBUTION,
  BATTLE_PRIZES_PER_LEVEL,
} = require("../config/constants");

let isRunning = false;

/**
 * Calculate the next Wednesday 12 PM EST (17:00 UTC) from a given date.
 * If today IS Wednesday and we haven't passed 17:00 UTC, returns today.
 *
 * @param {Date} fromDate
 * @returns {Date}
 */
const getNextWednesday = function (fromDate) {
  const d = new Date(fromDate);
  const day = d.getUTCDay(); // 0=Sun, 3=Wed
  const daysUntilWed = (3 - day + 7) % 7;

  if (daysUntilWed === 0) {
    // Today IS Wednesday
    d.setUTCHours(17, 0, 0, 0);
    if (d > fromDate) return d;
    // Already passed today's start, go to next week
    d.setUTCDate(d.getUTCDate() + 7);
    d.setUTCHours(17, 0, 0, 0);
    return d;
  }

  d.setUTCDate(d.getUTCDate() + daysUntilWed);
  d.setUTCHours(17, 0, 0, 0);
  return d;
};

/**
 * Tournament lifecycle cron job. Runs every hour.
 * Manages: create upcoming -> activate -> end + distribute -> complete cooldown.
 */
const tournamentJob = async function () {
  if (isRunning) return;
  isRunning = true;

  try {
    const now = new Date();
    const settings = await Settings.findOne();
    if (!settings) {
      console.error("tournamentJob: No settings found");
      return;
    }

    const schedule = settings.tournamentSchedule || {};
    const durationHours = schedule.durationHours || 120;
    const cooldownHours = schedule.cooldownHours || 48;

    // Step 1: Create upcoming tournaments for levels that have none
    for (let level = 1; level <= MAX_LEVEL; level++) {
      const existing = await Tournament.findOne({
        level,
        status: { $in: ["upcoming", "active"] },
      });

      if (existing) continue;

      const startTime = getNextWednesday(now);
      const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
      const cooldownEndTime = new Date(endTime.getTime() + cooldownHours * 60 * 60 * 1000);

      const prizePool = settings.prizePools.get(String(level)) || 0;
      const { weekNumber, year } = getWeekInfo(startTime);

      await Tournament.create({
        level,
        weekNumber,
        year,
        status: "upcoming",
        startTime,
        endTime,
        cooldownEndTime,
        prizePool,
        prizeDistribution: {
          first: prizePool * PRIZE_DISTRIBUTION.FIRST,
          second: prizePool * PRIZE_DISTRIBUTION.SECOND,
          third: 0, // 3rd place receives $BATTLE, not AVAX
          thirdBattle: BATTLE_PRIZES_PER_LEVEL[level] || 0,
        },
        winners: [],
      });

      console.log(`Tournament created: L${level} W${weekNumber} starts ${startTime.toISOString()}`);
    }

    // Step 2: Activate upcoming tournaments whose start time has passed
    const toActivate = await Tournament.find({
      status: "upcoming",
      startTime: { $lte: now },
    });

    for (const tournament of toActivate) {
      tournament.status = "active";
      await tournament.save();
      console.log(`Tournament activated: L${tournament.level} W${tournament.weekNumber}`);

      // Emit Socket.IO event
      try {
        const { getIO } = require("../config/socketio");
        const io = getIO();
        if (io) {
          io.of("/tournaments").to(`level:${tournament.level}`).emit("tournament:started", {
            level: tournament.level,
            startTime: tournament.startTime,
            endTime: tournament.endTime,
            prizePool: tournament.prizePool,
          });
        }
      } catch (e) { /* Socket.IO emission is non-fatal */ }
    }

    // Step 3: End active tournaments whose end time has passed + distribute prizes
    const toEnd = await Tournament.find({
      status: "active",
      endTime: { $lte: now },
    });

    for (const tournament of toEnd) {
      console.log(`Tournament ending: L${tournament.level} W${tournament.weekNumber}`);
      tournament.status = "cooldown";

      try {
        const results = await distributePrizes(tournament);

        // Emit Socket.IO event
        try {
          const { getIO } = require("../config/socketio");
          const io = getIO();
          if (io) {
            io.of("/tournaments").to(`level:${tournament.level}`).emit("tournament:ended", {
              level: tournament.level,
              winners: results.winners,
            });
          }
        } catch (e) { /* Socket.IO emission is non-fatal */ }
      } catch (e) {
        console.error(`Prize distribution failed for L${tournament.level}: ${e.message}`);
      }

      // Save cooldown status only if distributePrizes didn't already save (e.g., 0 players or error)
      if (!tournament.winners || tournament.winners.length === 0) {
        await tournament.save();
      }
    }

    // Step 4: Complete cooldown tournaments
    const toComplete = await Tournament.find({
      status: "cooldown",
      cooldownEndTime: { $lte: now },
    });

    for (const tournament of toComplete) {
      tournament.status = "completed";
      await tournament.save();
      console.log(`Tournament completed: L${tournament.level} W${tournament.weekNumber}`);
    }
  } catch (error) {
    console.error("tournamentJob error:", error.message);
  } finally {
    isRunning = false;
  }
};

module.exports = { tournamentJob, getNextWednesday };
