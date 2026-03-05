const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");
const leaderboardController = require("../controllers/leaderboardController");

// Static routes BEFORE parameterized routes
router.get("/rank/:uid", decodeToken, leaderboardController.getUserRank);

// Public endpoints
router.get("/", leaderboardController.getLeaderboard);
router.get("/:period", leaderboardController.getLeaderboard);

module.exports = router;
