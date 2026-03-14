const express = require("express");
const router = express.Router();
const armoryController = require("../controllers/armoryController");
const { purchaseLimiter } = require("../middleware/rateLimiter");

// All public — user identified by wallet address
router.get("/weapons", armoryController.listWeapons);
router.get("/weapons/:category", armoryController.listWeaponsByCategory);
router.get("/weapon/:weaponId", armoryController.getWeaponDetail);
router.get("/nfts", armoryController.listNfts);
router.get("/nft/:tokenId", armoryController.getNftDetail);
router.post("/purchase/weapon", purchaseLimiter, armoryController.purchaseWeapon);
router.post("/purchase/nft", purchaseLimiter, armoryController.purchaseNft);
router.get("/balance/:address", armoryController.getBalance);

module.exports = router;
