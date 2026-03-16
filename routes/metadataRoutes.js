const express = require("express");
const router = express.Router();
const metadataController = require("../controllers/metadataController");

// Public endpoints (no auth) - marketplaces need to access these
router.get("/weapon/:tokenId", metadataController.getWeaponMetadata);
router.get("/:tokenId", metadataController.getTokenMetadata);

module.exports = router;
