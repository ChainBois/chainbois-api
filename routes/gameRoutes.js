const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");
const gameController = require("../controllers/gameController");
const downloadController = require("../controllers/downloadController");

// Public endpoints (no auth)
router.get("/download/:platform", downloadController.downloadGame);
router.get("/info", downloadController.getGameInfo);

// Protected endpoints (require Firebase auth)
router.post("/verify-assets", decodeToken, gameController.verifyAssets);
router.post("/set-avatar", decodeToken, gameController.setAvatar);

module.exports = router;
