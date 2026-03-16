const fs = require("fs");
const path = require("path");
const ChainboiNft = require("../models/chainboiNftModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getNftLevel } = require("../utils/contractUtils");
const { getBadgeOverlayUrl } = require("../utils/cloudinaryUtils");
const { RANK_NAMES } = require("../config/constants");

const METADATA_DIR = path.join(__dirname, "..", "assets", "nft-collection", "metadata");

/**
 * GET /api/v1/metadata/:tokenId.json
 * Dynamic ERC-721 metadata endpoint (public, no auth).
 * Serves real-time level, stats, and Cloudinary badge-overlayed images.
 */
const getTokenMetadata = catchAsync(async (req, res, next) => {
  // Parse tokenId, stripping .json suffix if present
  let tokenIdParam = req.params.tokenId;
  if (tokenIdParam && tokenIdParam.endsWith(".json")) {
    tokenIdParam = tokenIdParam.replace(/\.json$/, "");
  }

  const tokenId = parseInt(tokenIdParam);
  if (isNaN(tokenId) || tokenId < 1) {
    return next(new AppError("Invalid token ID", 400));
  }

  // Fetch on-chain level
  let level;
  try {
    level = await getNftLevel(tokenId);
  } catch (e) {
    return next(new AppError("Token does not exist", 404));
  }

  // Fetch from MongoDB
  const nft = await ChainboiNft.findOne({ tokenId });

  // Fallback to static JSON if no MongoDB record
  let baseTraits = [];
  let name = `ChainBoi #${tokenId}`;
  let description = "ChainBois - Military-themed gaming NFTs on Avalanche. Battle, earn $BATTLE, and rise through the ranks.";

  // Dynamic traits we append ourselves — filter these from base traits to avoid duplicates
  const dynamicTraitTypes = new Set(["Level", "Rank", "Kills", "Score", "Games Played"]);

  if (nft && nft.traits && nft.traits.length > 0) {
    baseTraits = nft.traits
      .filter((t) => !dynamicTraitTypes.has(t.trait_type))
      .map((t) => ({ trait_type: t.trait_type, value: t.value }));
  } else {
    // Try static metadata file (async I/O to avoid blocking event loop)
    const staticPath = path.join(METADATA_DIR, `${tokenId}.json`);
    try {
      const staticData = JSON.parse(await fs.promises.readFile(staticPath, "utf8"));
      baseTraits = (staticData.attributes || []).filter((a) => !dynamicTraitTypes.has(a.trait_type));
      name = staticData.name || name;
      description = staticData.description || description;
    } catch (e) {
      // File doesn't exist or is invalid — use defaults
    }
  }

  // Build dynamic image URL with badge overlay
  const imageUrl = getBadgeOverlayUrl(tokenId, level);
  // Fallback to IPFS if Cloudinary not configured
  const fallbackImage = nft ? nft.imageUri : `ipfs://bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4/${tokenId}.png`;

  // Get in-game stats
  const stats = nft ? nft.inGameStats : { kills: 0, score: 0, gamesPlayed: 0 };

  // Build attributes array: base traits + dynamic game traits
  const attributes = [
    ...baseTraits,
    { trait_type: "Level", value: level, display_type: "number", max_value: 7 },
    { trait_type: "Rank", value: RANK_NAMES[level] || "Private" },
    { trait_type: "Kills", value: stats.kills || 0, display_type: "number" },
    { trait_type: "Games Played", value: stats.gamesPlayed || 0, display_type: "number" },
    { trait_type: "Score", value: stats.score || 0, display_type: "number" },
  ];

  res.status(200).json({
    name,
    description,
    image: imageUrl || fallbackImage,
    external_url: `${process.env.FRONTEND_URL || 'https://chainbois-true.vercel.app'}/nft/${tokenId}`,
    collection: "ChainBois Genesis",
    attributes,
  });
});

/**
 * GET /api/v1/metadata/weapon/:tokenId.json
 * Dynamic ERC-721 metadata endpoint for weapon NFTs (public, no auth).
 */
const getWeaponMetadata = catchAsync(async (req, res, next) => {
  let tokenIdParam = req.params.tokenId;
  if (tokenIdParam && tokenIdParam.endsWith(".json")) {
    tokenIdParam = tokenIdParam.replace(/\.json$/, "");
  }

  const tokenId = parseInt(tokenIdParam);
  if (isNaN(tokenId) || tokenId < 1) {
    return next(new AppError("Invalid token ID", 400));
  }

  const WeaponNft = require("../models/weaponNftModel");
  const weapon = await WeaponNft.findOne({ tokenId }).lean();
  if (!weapon) {
    return next(new AppError("Weapon token does not exist", 404));
  }

  const { WEAPON_DEFINITIONS } = require("../config/constants");
  const def = WEAPON_DEFINITIONS.find((d) => d.name === weapon.weaponName);

  const attributes = [
    { trait_type: "Weapon Name", value: weapon.weaponName },
    { trait_type: "Category", value: weapon.category },
    { trait_type: "Tier", value: weapon.blueprintTier || "base" },
  ];

  res.status(200).json({
    name: weapon.weaponName || `Weapon #${tokenId}`,
    description: def ? def.description : "ChainBois Weapon NFT on Avalanche.",
    image: weapon.imageUri || "",
    external_url: `${process.env.FRONTEND_URL || 'https://chainbois-true.vercel.app'}/weapon/${tokenId}`,
    collection: "ChainBois Weapons",
    attributes,
  });
});

module.exports = {
  getTokenMetadata,
  getWeaponMetadata,
};
