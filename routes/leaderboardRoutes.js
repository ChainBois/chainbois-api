const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");

// Placeholder - implemented in Phase 4
router.get("/", (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

// Static routes BEFORE parameterized routes
router.get("/rank/:address", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/:period", (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

module.exports = router;
