const express = require("express");
const router = express.Router();
const { decodeToken } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const authController = require("../controllers/authController");

router.post("/create-user", authLimiter, authController.createUser);
router.get("/check-user/:email", authController.checkUser);
router.post("/login", authLimiter, decodeToken, authController.login);
router.get("/me", decodeToken, authController.me);
router.post("/logout", decodeToken, authController.logout);

module.exports = router;
