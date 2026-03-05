const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");
const { purchaseLimiter } = require("../middleware/rateLimiter");
const trainingController = require("../controllers/trainingController");

router.get("/nfts/:address", decodeToken, trainingController.getNfts);
router.get("/nft/:tokenId", decodeToken, trainingController.getNftDetail);
router.post("/level-up", decodeToken, purchaseLimiter, trainingController.levelUp);
router.get("/level-up/cost", decodeToken, trainingController.getLevelUpCost);
router.get("/eligibility/:tokenId", decodeToken, trainingController.getEligibility);

module.exports = router;
