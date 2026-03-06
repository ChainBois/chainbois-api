const express = require("express");
const router = express.Router();
const metadataController = require("../controllers/metadataController");

// Public endpoint (no auth) - marketplaces need to access this
router.get("/:tokenId", metadataController.getTokenMetadata);

module.exports = router;
