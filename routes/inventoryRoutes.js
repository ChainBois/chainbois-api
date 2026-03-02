const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");

// Placeholder - implemented in Phase 6
router.get("/:address", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/:address/nfts", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/:address/weapons", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/:address/history", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

module.exports = router;
