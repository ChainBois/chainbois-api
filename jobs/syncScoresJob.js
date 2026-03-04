const User = require("../models/userModel");
const WeeklyLeaderboard = require("../models/weeklyLeaderboardModel");
const { getFirebaseDb } = require("../config/firebase");
const {
  FIREBASE_PATHS,
  MAX_POINTS_PER_MATCH,
  SECURITY,
} = require("../config/constants");
const {
  getOrCreateSecurityProfile,
  updateThreatScore,
  checkBanStatus,
  checkDailyEarnings,
} = require("../middleware/antiCheat");

/**
 * Get current week number (1-52) and year
 * @returns {{ weekNumber: number, year: number }}
 */
const getWeekInfo = function () {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now - startOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return { weekNumber, year: now.getFullYear() };
};

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

    let updatedCount = 0;
    const { weekNumber, year } = getWeekInfo();

    for (const [firebaseId, userData] of Object.entries(firebaseUsers)) {
      // Per-user error isolation - one failure doesn't abort the whole job
      try {
        if (!firebaseId || typeof firebaseId !== "string" || firebaseId.length < 20) {
          continue;
        }
        if (!userData || typeof userData !== "object") {
          continue;
        }

        // Find matching MongoDB user
        const user = await User.findOne({ uid: firebaseId });
        if (!user) {
          continue;
        }

        // Check ban status FIRST
        const securityProfile = await getOrCreateSecurityProfile(firebaseId);
        const banCheck = await checkBanStatus(securityProfile);
        if (banCheck.banned) {
          // Mark user as banned in MongoDB
          if (!user.isBanned) {
            user.isBanned = true;
            await user.save();
          }
          continue;
        }

        // If ban expired, ensure isBanned is cleared on user
        if (user.isBanned && !banCheck.banned) {
          user.isBanned = false;
          await user.save();
        }

        // Parse Firebase score (cumulative)
        const firebaseScore = parseInt(userData.Score) || 0;

        // Calculate delta since last sync
        const previousScore = user.score || 0;
        const scoreDelta = firebaseScore - previousScore;

        // No change or score went down
        if (scoreDelta <= 0) {
          continue;
        }

        // Cap delta at MAX_POINTS_PER_MATCH per sync cycle
        let cappedDelta = Math.min(scoreDelta, MAX_POINTS_PER_MATCH);

        // If delta exceeds max per sync, flag as suspicious but still process capped amount
        if (scoreDelta > MAX_POINTS_PER_MATCH) {
          // Mutate in memory, save once at end
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

        // Update daily earnings and save security profile once
        securityProfile.dailyEarnings += cappedDelta;
        await securityProfile.save();

        // Update user score and stats
        user.score = firebaseScore; // Store the actual cumulative score
        user.highScore = Math.max(user.highScore, firebaseScore);
        user.gamesPlayed += 1; // Counts sync cycles with activity (not actual games)
        user.pointsBalance += cappedDelta;
        user.lastScoreSync = new Date();
        await user.save();

        // Upsert weekly leaderboard entry (includes year for cross-year safety)
        try {
          await WeeklyLeaderboard.findOneAndUpdate(
            {
              uid: firebaseId,
              year,
              weekNumber,
              tournamentLevel: user.level || 0,
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
        } catch (e) {
          console.error(`Failed to update leaderboard for ${firebaseId}:`, e.message);
        }

        updatedCount++;
      } catch (userError) {
        console.error(`Error processing user ${firebaseId}:`, userError.message);
        continue;
      }
    }

    if (updatedCount > 0) {
      console.log(`Score sync complete: ${updatedCount} users updated`);
    }
  } catch (error) {
    console.error("syncScoresJob error:", error.message);
  }
};

module.exports = { syncScoresJob };
