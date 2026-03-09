const User = require("../models/userModel");
const PlatformMetrics = require("../models/platformMetricsModel");
const { getFirebaseDb } = require("../config/firebase");
const { FIREBASE_PATHS, PLAYER_TYPE } = require("../config/constants");

/**
 * Sync new users from Firebase Realtime DB to MongoDB.
 * Runs daily at midnight UTC (detects web2 players for platform metrics: web2 vs web3 distinction).
 *
 * For users created via the Unity game (who register through Firebase directly),
 * this job creates corresponding MongoDB user records so they appear in the
 * leaderboard, can earn points, etc.
 */
const syncNewUsersJob = async function () {
  try {
    const db = getFirebaseDb();
    const snapshot = await db.ref(FIREBASE_PATHS.USERS).once("value");
    const firebaseUsers = snapshot.val();

    if (!firebaseUsers) {
      return;
    }

    // Get all existing UIDs from MongoDB
    const existingUids = await User.distinct("uid");
    const existingUidSet = new Set(existingUids);

    let syncCount = 0;

    for (const [firebaseId, userData] of Object.entries(firebaseUsers)) {
      try {
        // Validate UID shape
        if (!firebaseId || typeof firebaseId !== "string" || firebaseId.length < 20) {
          continue;
        }

        // Skip if already in MongoDB
        if (existingUidSet.has(firebaseId)) {
          continue;
        }

        // Validate userData is an object
        if (!userData || typeof userData !== "object") {
          continue;
        }

        const username = userData.username && typeof userData.username === "string"
          ? userData.username.substring(0, 100)
          : "";
        const score = parseInt(userData.Score) || 0;

        await User.create({
          uid: firebaseId,
          username,
          playerType: PLAYER_TYPE.WEB2,
          address: null,
          score: Math.max(0, score),
          pointsBalance: 0, // Points start at 0, syncScoresJob handles earning
          hasNft: false,
          level: 0,
        });

        // Write back defaults to Firebase so Unity sees them
        await db.ref(`${FIREBASE_PATHS.USERS}/${firebaseId}`).update({
          level: 0,
          hasNFT: false,
        });

        syncCount++;
        await PlatformMetrics.incrementUsers("web2");
        console.log(`New Web2 user synced: ${firebaseId}`);
      } catch (e) {
        // Duplicate key error means another instance beat us - skip
        if (e.code === 11000) continue;
        console.error(`Failed to sync user ${firebaseId}:`, e.message);
      }
    }

    if (syncCount > 0) {
      console.log(`Synced ${syncCount} new users from Firebase`);
    }
  } catch (error) {
    console.error("syncNewUsersJob error:", error.message);
  }
};

module.exports = { syncNewUsersJob };
