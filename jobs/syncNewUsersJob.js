const User = require("../models/userModel");
const PlatformMetrics = require("../models/platformMetricsModel");
const { getFirebaseDb } = require("../config/firebase");
const { FIREBASE_PATHS } = require("../config/constants");

/**
 * Update web2 user metrics from Firebase.
 * Runs daily at midnight UTC.
 *
 * Counts Firebase RTDB users that don't have a matching MongoDB record.
 * These are game-only players (registered via Unity) who haven't visited
 * the website yet. They remain invisible to the leaderboard and points
 * system until they connect a wallet through the website — at that point
 * the login endpoint creates their MongoDB record and syncs their data.
 *
 * This job only updates the platform metrics count (web2 vs web3).
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

    // Count Firebase users not in MongoDB (game-only / web2 players)
    let web2Count = 0;
    for (const firebaseId of Object.keys(firebaseUsers)) {
      if (!firebaseId || typeof firebaseId !== "string" || firebaseId.length < 20) {
        continue;
      }
      if (!existingUidSet.has(firebaseId)) {
        web2Count++;
      }
    }

    // Set the web2 count directly (not increment — this is a snapshot count)
    const web3Count = existingUidSet.size;
    await PlatformMetrics.updateOne(
      {},
      {
        $set: {
          "users.web2": web2Count,
          "users.web3": web3Count,
          "users.total": web2Count + web3Count,
        },
      },
      { upsert: true },
    );

    console.log(`Platform metrics updated: ${web2Count} web2, ${web3Count} web3, ${web2Count + web3Count} total`);
  } catch (error) {
    console.error("syncNewUsersJob error:", error.message);
  }
};

module.exports = { syncNewUsersJob };
