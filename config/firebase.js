const admin = require("firebase-admin");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

let initialized = false;
let initFailed = false;

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
    initFailed = true;
    console.error("Firebase initialization failed:", error.message);
    console.error("Ensure config/chainbois-firebase-config.json exists");
    throw error;
  }
};

const getFirebaseDb = function () {
  if (initFailed) throw new Error("Firebase was not initialized successfully");
  if (!initialized) initFirebase();
  return admin.database();
};

const getFirebaseAuth = function () {
  if (initFailed) throw new Error("Firebase was not initialized successfully");
  if (!initialized) initFirebase();
  return admin.auth();
};

module.exports = {
  initFirebase,
  getFirebaseDb,
  getFirebaseAuth,
  admin,
};
