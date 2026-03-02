const admin = require("firebase-admin");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

let initialized = false;

const initFirebase = function () {
  if (initialized) return;

  const serviceAccountPath = path.resolve(
    __dirname,
    "chainbois-firebase-config.json"
  );

  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    initialized = true;
    console.log("Firebase Admin initialized");
  } catch (error) {
    console.error("Firebase initialization failed:", error.message);
    console.error("Ensure config/chainbois-firebase-config.json exists");
  }
};

const getFirebaseDb = function () {
  if (!initialized) initFirebase();
  return admin.database();
};

const getFirebaseAuth = function () {
  if (!initialized) initFirebase();
  return admin.auth();
};

module.exports = {
  initFirebase,
  getFirebaseDb,
  getFirebaseAuth,
  admin,
};
