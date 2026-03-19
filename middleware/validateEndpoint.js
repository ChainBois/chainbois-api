const AppError = require("../utils/appError");

// Valid endpoint patterns for this API
const validPatterns = [
  // Auth
  /^\/api\/v1\/auth\/(create-user|login|simulate|me|logout)$/,
  /^\/api\/v1\/auth\/check-user\/.+$/,
  // Game
  /^\/api\/v1\/game\/(verify-assets|set-avatar|info)$/,
  /^\/api\/v1\/game\/download\/(win|apk)$/,
  // Training
  /^\/api\/v1\/training\/(nfts|nft|level-up|eligibility)(\/.*)?$/,
  // Tournaments
  /^\/api\/v1\/tournaments(\/.*)?$/,
  // Armory
  /^\/api\/v1\/armory(\/.*)?$/,
  // Points
  /^\/api\/v1\/points(\/.*)?$/,
  // Inventory
  /^\/api\/v1\/inventory(\/.*)?$/,
  // Leaderboard
  /^\/api\/v1\/leaderboard(\/.*)?$/,
  // Metadata (public, for marketplaces)
  /^\/api\/v1\/metadata\/(weapon\/)?\d+(\.json)?$/,
  // Airdrop
  /^\/api\/v1\/airdrop(\/.*)?$/,
  // Claim
  /^\/api\/v1\/claim(\/.*)?$/,
  // Metrics
  /^\/api\/v1\/metrics\/(platform|compute)$/,
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

  // Strip trailing slash for consistent matching
  const normalizedPath = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  const isValid = validPatterns.some((pattern) => pattern.test(normalizedPath));

  if (!isValid) {
    return next(new AppError("This endpoint does not exist", 404));
  }

  return next();
};

module.exports = validateEndpoint;
