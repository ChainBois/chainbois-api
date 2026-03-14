const User = require("../models/userModel");
const SecurityProfile = require("../models/securityProfileModel");
const WeeklyLeaderboard = require("../models/weeklyLeaderboardModel");
const ScoreChange = require("../models/scoreChangeModel");
const Tournament = require("../models/tournamentModel");
const ChainboiNft = require("../models/chainboiNftModel");
const { getFirebaseDb } = require("../config/firebase");
const {
  FIREBASE_PATHS,
  MAX_POINTS_PER_MATCH,
  SECURITY,
} = require("../config/constants");
const {
  updateThreatScore,
  checkBanStatus,
  checkDailyEarnings,
} = require("../middleware/antiCheat");
const { getWeekInfo } = require("../utils/weekUtils");

/**
 * Sync scores from Firebase Realtime DB to MongoDB.
 * Runs every 5 minutes on primary PM2 instance.
 *
 * Firebase.Score is CUMULATIVE - the game only increments it.
 * We track the difference (delta) since last sync to award points.
 */
const syncScoresJob = async function () {
  try {
    const db = getFirebaseDb();
    const snapshot = await db.ref(FIREBASE_PATHS.USERS).once("value");
    const firebaseUsers = snapshot.val();

    if (!firebaseUsers) {
      return;
    }

    // Filter valid Firebase IDs
    const firebaseEntries = Object.entries(firebaseUsers).filter(
      ([id, data]) => id && typeof id === "string" && id.length >= 20 && data && typeof data === "object"
    );

    if (firebaseEntries.length === 0) return;

    const firebaseIds = firebaseEntries.map(([id]) => id);

    // Batch-fetch all MongoDB users and security profiles in parallel
    const [users, securityProfiles, activeTournaments] = await Promise.all([
      User.find({ uid: { $in: firebaseIds } }),
      SecurityProfile.find({ uid: { $in: firebaseIds } }),
      Tournament.find({ status: "active" }).lean(),
    ]);

    // Index into Maps for O(1) lookup
    const userMap = new Map(users.map((u) => [u.uid, u]));
    const profileMap = new Map(securityProfiles.map((p) => [p.uid, p]));

    // Build level-to-tournament map
    const tournamentByLevel = {};
    for (const t of activeTournaments) {
      tournamentByLevel[t.level] = { weekNumber: t.weekNumber, year: t.year };
    }
    const calendarWeek = getWeekInfo();

    let updatedCount = 0;
    const updatedLevels = new Set();
    const nftStatsBulk = []; // Collect NFT stat updates for bulk write

    for (const [firebaseId, userData] of firebaseEntries) {
      try {
        const user = userMap.get(firebaseId);
        if (!user) continue;

        // Get or create security profile (create inline if missing from batch)
        let securityProfile = profileMap.get(firebaseId);
        if (!securityProfile) {
          securityProfile = await SecurityProfile.findOneAndUpdate(
            { uid: firebaseId },
            { $setOnInsert: { uid: firebaseId } },
            { upsert: true, new: true }
          );
        }

        // Check ban status
        const banCheck = await checkBanStatus(securityProfile);
        if (banCheck.banned) {
          if (!user.isBanned) {
            user.isBanned = true;
            await user.save();
          }
          continue;
        }
        if (user.isBanned && !banCheck.banned) {
          user.isBanned = false;
          await user.save();
        }

        // Parse Firebase score (cumulative)
        const firebaseScore = parseInt(userData.Score) || 0;
        const previousScore = user.score || 0;
        const scoreDelta = firebaseScore - previousScore;

        if (scoreDelta <= 0) continue;

        // Cap delta
        let cappedDelta = Math.min(scoreDelta, MAX_POINTS_PER_MATCH);

        // Flag suspicious scores
        if (scoreDelta > MAX_POINTS_PER_MATCH) {
          securityProfile.threatScore += SECURITY.THREAT_INCREMENTS.VELOCITY_EXPLOIT;
          securityProfile.violationLog.push({
            type: `Score delta ${scoreDelta} exceeds max ${MAX_POINTS_PER_MATCH}`,
            details: `Threat +${SECURITY.THREAT_INCREMENTS.VELOCITY_EXPLOIT}, total: ${securityProfile.threatScore}`,
            timestamp: new Date(),
          });
          if (securityProfile.violationLog.length > 100) {
            securityProfile.violationLog = securityProfile.violationLog.slice(-100);
          }
        }

        // Check daily earnings limit
        const earningsCheck = checkDailyEarnings(securityProfile, cappedDelta);
        if (!earningsCheck.allowed) {
          await securityProfile.save();
          continue;
        }
        cappedDelta = earningsCheck.cappedAmount;

        // Save security profile once
        securityProfile.dailyEarnings += cappedDelta;
        await securityProfile.save();

        // Update user
        user.score = firebaseScore;
        user.highScore = Math.max(user.highScore, firebaseScore);
        user.gamesPlayed += 1;
        user.pointsBalance += cappedDelta;
        user.lastScoreSync = new Date();
        await user.save();

        // Collect NFT stat updates for batch write
        if (user.address && user.hasNft) {
          nftStatsBulk.push({
            updateMany: {
              filter: { ownerAddress: user.address.toLowerCase() },
              update: {
                $set: {
                  "inGameStats.score": user.score,
                  "inGameStats.gamesPlayed": user.gamesPlayed,
                },
              },
            },
          });
        }

        // Upsert weekly leaderboard entry
        const userLevel = user.level || 0;
        const tournamentWeek = tournamentByLevel[userLevel];
        const weekInfo = tournamentWeek || calendarWeek;

        try {
          await WeeklyLeaderboard.findOneAndUpdate(
            {
              uid: firebaseId,
              year: weekInfo.year,
              weekNumber: weekInfo.weekNumber,
              tournamentLevel: userLevel,
            },
            {
              $set: {
                address: user.address,
                username: user.username,
              },
              $max: { highScore: firebaseScore },
              $inc: { totalScore: cappedDelta, gamesPlayed: 1 },
            },
            { upsert: true, new: true }
          );

          if (tournamentWeek) {
            updatedLevels.add(userLevel);
          }
        } catch (e) {
          console.error(`Failed to update leaderboard for ${firebaseId}:`, e.message);
        }

        // Record score change
        try {
          await ScoreChange.create({
            uid: firebaseId,
            address: user.address,
            username: user.username,
            score: firebaseScore,
            previousScore,
            scoreChange: cappedDelta,
          });
        } catch (e) {
          console.error(`Failed to create score change for ${firebaseId}:`, e.message);
        }

        updatedCount++;
      } catch (userError) {
        console.error(`Error processing user ${firebaseId}:`, userError.message);
        continue;
      }
    }

    // Batch write NFT stat updates
    if (nftStatsBulk.length > 0) {
      try {
        await ChainboiNft.bulkWrite(nftStatsBulk);
      } catch (e) {
        console.error("Failed to bulk update NFT stats:", e.message);
      }
    }

    if (updatedCount > 0) {
      console.log(`Score sync complete: ${updatedCount} users updated`);

      // Emit real-time leaderboard updates via Socket.IO
      try {
        const { getIO } = require("../config/socketio");
        const io = getIO();
        if (io && updatedLevels.size > 0) {
          const ns = io.of("/tournaments");
          for (const level of updatedLevels) {
            const tw = tournamentByLevel[level];
            if (!tw) continue;
            const top10 = await WeeklyLeaderboard.find({
              year: tw.year,
              weekNumber: tw.weekNumber,
              tournamentLevel: level,
            })
              .sort({ highScore: -1 })
              .limit(10)
              .select("uid username highScore totalScore gamesPlayed")
              .lean();

            ns.to(`level:${level}`).emit("leaderboard:update", {
              level,
              leaderboard: top10.map((e, i) => ({ rank: i + 1, ...e })),
            });
          }
        }
      } catch (e) {
        // Socket.IO emission is non-fatal
      }
    }
  } catch (error) {
    console.error("syncScoresJob error:", error.message);
  }
};

module.exports = { syncScoresJob };
