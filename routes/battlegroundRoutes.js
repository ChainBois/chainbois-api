const express = require("express");
const router = express.Router();
const battlegroundController = require("../controllers/battlegroundController");

// Static routes BEFORE parameterized routes
router.get("/", battlegroundController.listTournaments);
router.get("/history", battlegroundController.getHistory);

// Parameterized routes
router.get("/:level", battlegroundController.getTournamentDetail);
router.get("/:level/leaderboard", battlegroundController.getTournamentLeaderboard);
router.get("/:level/countdown", battlegroundController.getCountdown);
router.get("/:level/winners", battlegroundController.getWinners);

module.exports = router;
