const express = require("express");
const { claimStarterPack, checkClaim } = require("../controllers/claimController");
const { claimLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/starter-pack", claimLimiter, claimStarterPack);
router.get("/check/:address", checkClaim);

module.exports = router;
