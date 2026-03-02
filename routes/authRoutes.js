const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

// Placeholder - implemented in Phase 1
router.post("/create-user", authLimiter, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.post("/login", authLimiter, decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/me", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.post("/logout", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

module.exports = router;
