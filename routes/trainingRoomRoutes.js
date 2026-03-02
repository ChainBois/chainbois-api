const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");

// Placeholder - implemented in Phase 3
router.get("/nfts/:address", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/nft/:tokenId", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.post("/level-up", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/level-up/cost", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/eligibility/:tokenId", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

module.exports = router;
