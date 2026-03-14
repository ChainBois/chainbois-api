const express = require("express");
const router = express.Router();
const pointsController = require("../controllers/pointsController");
const { purchaseLimiter } = require("../middleware/rateLimiter");

// All public — user identified by wallet address
router.post("/convert", purchaseLimiter, pointsController.convertPoints);
router.get("/history/:address", pointsController.getPointsHistory);
router.get("/:address", pointsController.getPointsBalance);

module.exports = router;
