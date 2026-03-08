/**
 * Remove stale `hasNft` fields from Firebase RTDB user records.
 *
 * The canonical field is `hasNFT` (uppercase NFT). Some records may have
 * an older `hasNft` (lowercase) field left over. This script removes it
 * without touching `hasNFT`.
 *
 * Usage:
 *   node scripts/cleanupFirebaseFields.js
 *
 * Requires: FIREBASE_DATABASE_URL in .env and config/chainbois-firebase-config.json
 */
const dotenv = require("dotenv");
dotenv.config();

const { getFirebaseDb } = require("../config/firebase");
const { FIREBASE_PATHS } = require("../config/constants");

const main = async function () {
  const db = getFirebaseDb();

  console.log("Fetching all users from Firebase...");
  const snapshot = await db.ref(FIREBASE_PATHS.USERS).once("value");
  const firebaseUsers = snapshot.val();

  if (!firebaseUsers) {
    console.log("No users found in Firebase. Nothing to clean up.");
    process.exit(0);
  }

  const userIds = Object.keys(firebaseUsers);
  console.log(`Found ${userIds.length} total users in Firebase.\n`);

  let cleanedCount = 0;

  for (const uid of userIds) {
    const userData = firebaseUsers[uid];

    if (!userData || typeof userData !== "object") {
      continue;
    }

    // Only target the lowercase `hasNft` field
    if (!Object.prototype.hasOwnProperty.call(userData, "hasNft")) {
      continue;
    }

    try {
      await db.ref(`${FIREBASE_PATHS.USERS}/${uid}/hasNft`).remove();
      cleanedCount++;
      console.log(`  Removed hasNft from user: ${uid}`);
    } catch (error) {
      console.error(`  Failed to remove hasNft from user ${uid}:`, error.message);
    }
  }

  console.log(`\nCleanup complete. Removed hasNft from ${cleanedCount} user(s).`);
  process.exit(0);
};

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
