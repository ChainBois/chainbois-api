const AppError = require("../utils/appError");

// Valid endpoint patterns for this API
const validPatterns = [
  // Auth
  /^\/api\/v1\/auth\/(create-user|login|me|logout)$/,
  // Game
  /^\/api\/v1\/game\/(verify-assets|set-avatar|end-session)$/,
  /^\/api\/v1\/game\/characters\/0x[a-fA-F0-9]{40}$/,
  // Training
  /^\/api\/v1\/training\/(nfts|nft|level-up|eligibility)/,
  // Tournaments
  /^\/api\/v1\/tournaments/,
  // Armory
  /^\/api\/v1\/armory/,
  // Points
  /^\/api\/v1\/points/,
  // Claim
  /^\/api\/v1\/claim/,
  // Inventory
  /^\/api\/v1\/inventory/,
  // Leaderboard
  /^\/api\/v1\/leaderboard/,
  // Health & Settings
  /^\/api\/v1\/health$/,
  /^\/api\/v1\/settings$/,
];

const validateEndpoint = function (req, res, next) {
  const path = req.path;

  // Skip validation for non-API routes
  if (!path.startsWith("/api/")) {
    return next();
  }

  const isValid = validPatterns.some((pattern) => pattern.test(path));

  if (!isValid) {
    return next(new AppError("This endpoint does not exist", 403));
  }

  return next();
};

module.exports = validateEndpoint;
