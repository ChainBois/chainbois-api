const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// All public — user identified by wallet address
router.get("/:address", inventoryController.getInventory);
router.get("/:address/nfts", inventoryController.getNfts);
router.get("/:address/weapons", inventoryController.getWeapons);
router.get("/:address/history", inventoryController.getHistory);

module.exports = router;
