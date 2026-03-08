const express = require("express");
const router = express.Router();
const pointsController = require("../controllers/pointsController");

// All public — user identified by wallet address
router.post("/convert", pointsController.convertPoints);
router.get("/history/:address", pointsController.getPointsHistory);
router.get("/:address", pointsController.getPointsBalance);

module.exports = router;
