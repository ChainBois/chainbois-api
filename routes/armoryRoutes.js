const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");

// Placeholder - implemented in Phase 5
router.get("/weapons", (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/weapons/:category", (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/weapon/:weaponId", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.post("/purchase/weapon", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

router.get("/balance/:address", decodeToken, (req, res) => {
  res.status(501).json({ success: false, message: "Not yet implemented" });
});

module.exports = router;
