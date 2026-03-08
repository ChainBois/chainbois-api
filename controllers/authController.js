const { ethers } = require("ethers");
const validator = require("validator");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getFirebaseAuth, getFirebaseDb } = require("../config/firebase");
const { lookupNftAssets } = require("../utils/nftUtils");
const { getOrCreateSecurityProfile, checkBanStatus } = require("../middleware/antiCheat");
const { FIREBASE_PATHS, PLAYER_TYPE } = require("../config/constants");

/**
 * Sanitize a string for safe storage
 * Trims whitespace and limits length (no HTML escaping - game usernames shouldn't have entities)
 */
const sanitizeString = function (str) {
  if (!str || typeof str !== "string") return "";
  return validator.trim(str).substring(0, 100);
};

/**
 * Build a consistent user response object
 */
const buildUserResponse = function (user) {
  return {
    uid: user.uid,
    username: user.username,
    address: user.address,
    playerType: user.playerType,
    pointsBalance: user.pointsBalance,
    battleTokenBalance: user.battleTokenBalance,
    level: user.level,
    score: user.score,
    highScore: user.highScore,
    gamesPlayed: user.gamesPlayed,
    hasNft: user.hasNft,
    nftTokenId: user.nftTokenId,
    isBanned: user.isBanned,
    lastLogin: user.lastLogin,
  };
};

/**
 * POST /api/v1/auth/create-user
 * Create a new Firebase user (public endpoint, no auth required)
 */
const createUser = catchAsync(async (req, res, next) => {
  const { email, password, username } = req.body;

  // Validate inputs
  if (!email || !validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email address", 400));
  }
  if (!password || password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }
  if (!username || username.trim().length === 0) {
    return next(new AppError("Username is required", 400));
  }
  if (username.trim().length > 100) {
    return next(new AppError("Username is too long (max 100 characters)", 400));
  }

  const sanitizedUsername = sanitizeString(username);

  // Create user in Firebase Auth
  let userRecord;
  try {
    userRecord = await getFirebaseAuth().createUser({
      email,
      password,
      emailVerified: false,
    });
  } catch (e) {
    if (e.code === "auth/email-already-exists") {
      return next(new AppError("Email is already registered", 400));
    }
    throw e;
  }

  // Write to Firebase Realtime DB using update (safe for retries)
  const db = getFirebaseDb();
  await db.ref(`${FIREBASE_PATHS.USERS}/${userRecord.uid}`).update({
    username: sanitizedUsername,
    Score: 0,
    hasNFT: false,
    level: 0,
  });

  res.status(201).json({
    success: true,
    data: { uid: userRecord.uid },
  });
});

/**
 * POST /api/v1/auth/login
 * Login with Firebase token + wallet address
 */
const login = catchAsync(async (req, res, next) => {
  const { address } = req.body;
  const uid = req.user.uid;

  // Validate wallet address
  if (!address || !ethers.isAddress(address)) {
    return next(new AppError("Please provide a valid EVM wallet address", 400));
  }

  const normalizedAddress = address.toLowerCase();

  // Check for address already in use by another user
  const existingUser = await User.findOne({ address: normalizedAddress, uid: { $ne: uid } });
  if (existingUser) {
    return next(new AppError("This wallet address is already linked to another account", 400));
  }

  // Check ban status
  const securityProfile = await getOrCreateSecurityProfile(uid);
  const banCheck = await checkBanStatus(securityProfile);
  if (banCheck.banned) {
    return next(new AppError(banCheck.reason, 403));
  }

  // Get Firebase user data for username
  let firebaseUsername = "";
  try {
    const db = getFirebaseDb();
    const snapshot = await db.ref(`${FIREBASE_PATHS.USERS}/${uid}`).once("value");
    const fbData = snapshot.val();
    if (fbData && fbData.username) {
      firebaseUsername = fbData.username;
    }
  } catch (e) {
    console.error("Failed to read Firebase user data:", e.message);
  }

  // Find or create user in MongoDB (address-primary, uid fallback for web2→web3 upgrade)
  let user = await User.findOne({ address: normalizedAddress });
  if (!user) {
    user = await User.findOne({ uid });
  }
  const previousAddress = user ? user.address : null;

  if (!user) {
    user = await User.create({
      uid,
      address: normalizedAddress,
      playerType: PLAYER_TYPE.WEB2,
      username: firebaseUsername,
    });
  } else {
    // Update address if changed (log address change for audit)
    if (user.address !== normalizedAddress) {
      if (previousAddress) {
        console.log(`Address change for uid ${uid}: ${previousAddress} -> ${normalizedAddress}`);
      }
      user.address = normalizedAddress;
    }
    if (firebaseUsername && !user.username) {
      user.username = firebaseUsername;
    }
  }

  // Check NFTs on-chain (only if contract is configured)
  let assets = { hasNft: user.hasNft, nftTokenId: user.nftTokenId, level: user.level, weapons: [] };
  if (process.env.CHAINBOIS_NFT_ADDRESS) {
    assets = await lookupNftAssets(normalizedAddress);

    user.hasNft = assets.hasNft;
    user.nftTokenId = assets.nftTokenId;
    user.level = assets.level;

    // Upgrade web2 -> web3 if user now has NFT
    if (user.playerType === PLAYER_TYPE.WEB2 && assets.hasNft) {
      user.playerType = PLAYER_TYPE.WEB3;
    }
    // Downgrade web3 -> web2 if NFT was transferred away
    if (user.playerType === PLAYER_TYPE.WEB3 && !assets.hasNft) {
      user.playerType = PLAYER_TYPE.WEB2;
      user.nftTokenId = null;
    }
  }

  user.lastLogin = new Date();
  await user.save();

  // Write asset data to Firebase for Unity game
  if (process.env.CHAINBOIS_NFT_ADDRESS) {
    try {
      const db = getFirebaseDb();
      const fbUpdate = {
        hasNFT: assets.hasNft,
        level: assets.level,
        weapons: assets.weapons.length > 0 ? assets.weapons.map((w) => w.name) : null,
      };
      await db.ref(`${FIREBASE_PATHS.USERS}/${uid}`).update(fbUpdate);
    } catch (e) {
      console.error("Failed to update Firebase with asset data:", e.message);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      user: buildUserResponse(user),
      assets: {
        hasNft: assets.hasNft,
        nftTokenId: assets.nftTokenId,
        level: assets.level,
      },
      weapons: assets.weapons,
    },
  });
});

/**
 * GET /api/v1/auth/me
 * Get current user profile
 */
const me = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ uid: req.user.uid });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: { user: buildUserResponse(user) },
  });
});

/**
 * POST /api/v1/auth/logout
 * End user session and clear Firebase game data
 */
const logout = catchAsync(async (req, res, next) => {
  const uid = req.user.uid;

  // Revoke Firebase refresh tokens (invalidates all sessions)
  try {
    await getFirebaseAuth().revokeRefreshTokens(uid);
  } catch (e) {
    console.error("Failed to revoke Firebase tokens:", e.message);
  }

  // Clear game-session data in Firebase so Unity resets
  try {
    const db = getFirebaseDb();
    await db.ref(`${FIREBASE_PATHS.USERS}/${uid}`).update({
      hasNFT: false,
      level: 0,
      weapons: null,
    });
  } catch (e) {
    console.error("Failed to update Firebase on logout:", e.message);
  }

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/**
 * GET /api/v1/auth/check-user/:email
 * Check if a user already exists in Firebase Auth (public, no auth required)
 */
const checkUser = catchAsync(async (req, res, next) => {
  const { email } = req.params;

  if (!email || !validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email address", 400));
  }

  let exists = false;
  try {
    await getFirebaseAuth().getUserByEmail(email);
    exists = true;
  } catch (e) {
    if (e.code !== "auth/user-not-found") {
      throw e;
    }
  }

  res.status(200).json({
    success: true,
    data: { exists },
  });
});

module.exports = {
  createUser,
  login,
  me,
  logout,
  checkUser,
};
