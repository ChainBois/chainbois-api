const express = require("express");
const router = express.Router();
const metricsController = require("../controllers/metricsController");
const { decodeToken } = require("../middleware/auth");

router.get("/platform", metricsController.getPlatformMetrics);
router.post("/compute", decodeToken, metricsController.computeMetrics);

module.exports = router;
