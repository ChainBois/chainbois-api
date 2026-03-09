const express = require("express");
const router = express.Router();
const metricsController = require("../controllers/metricsController");

router.get("/platform", metricsController.getPlatformMetrics);
router.post("/compute", metricsController.computeMetrics);

module.exports = router;
