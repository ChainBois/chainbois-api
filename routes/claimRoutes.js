const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");

// Placeholder - implemented in Phase 2
router.get("/status", (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.post("/", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

module.exports = router;
