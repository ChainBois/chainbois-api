const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");

// Placeholder - implemented in Phase 5

// Static routes BEFORE parameterized routes
router.post("/convert", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/history/:address", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/:address", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

module.exports = router;
