const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");
const airdropController = require("../controllers/airdropController");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// Admin middleware - uses req.user.uid from Firebase auth
const requireAdmin = async (req, res, next) => {
  const user = await User.findOne({ uid: req.user.uid });
  if (!user || user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }
  next();
};

// Public endpoints
router.get("/rarity", airdropController.getRarityLeaderboard);
router.get("/rarity/:tokenId", airdropController.getRarityByToken);
router.get("/traits-pool", airdropController.getTraitsPool);
router.get("/trait-history", airdropController.getTraitHistory);

// Admin endpoints
router.post("/traits-pool", decodeToken, requireAdmin, airdropController.setupTraitsPool);
router.post("/calculate-rarity", decodeToken, requireAdmin, airdropController.calculateRarity);
router.post("/distribute", decodeToken, requireAdmin, airdropController.triggerDistribution);

module.exports = router;
