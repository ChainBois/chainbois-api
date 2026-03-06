/**
 * Sync all NFT metadata to MongoDB ChainboiNft collection.
 *
 * Reads cleaned metadata JSON files, fetches on-chain owner/level,
 * and upserts into the ChainboiNft collection.
 *
 * Usage:
 *   node scripts/syncNftsToMongo.js
 *
 * Requires: MONGODB_URI, CHAINBOIS_NFT_ADDRESS, AVAX_RPC_URL in .env
 */
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const path = require("path");
const connectDB = require("../config/db");
const ChainboiNft = require("../models/chainboiNftModel");
const { getNftLevel, getNftOwner } = require("../utils/contractUtils");
const { reindexNftMetadata } = require("../utils/avaxUtils");
const { RANK_NAMES } = require("../config/constants");

const METADATA_DIR = path.join(__dirname, "..", "assets", "nft-collection", "metadata");

const main = async function () {
  await connectDB();

  if (!process.env.CHAINBOIS_NFT_ADDRESS) {
    console.error("CHAINBOIS_NFT_ADDRESS not set in .env");
    process.exit(1);
  }

  const files = fs.readdirSync(METADATA_DIR)
    .filter((f) => f.endsWith(".json") && f !== "_metadata.json")
    .sort((a, b) => parseInt(a) - parseInt(b));

  console.log(`Syncing ${files.length} NFTs to MongoDB...\n`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const fileName of files) {
    const tokenId = parseInt(path.basename(fileName, ".json"));
    const filePath = path.join(METADATA_DIR, fileName);
    const metadata = JSON.parse(fs.readFileSync(filePath, "utf8"));

    try {
      const [owner, level] = await Promise.all([
        getNftOwner(tokenId),
        getNftLevel(tokenId),
      ]);

      const existing = await ChainboiNft.findOne({ tokenId });

      const doc = await ChainboiNft.findOneAndUpdate(
        { tokenId },
        {
          contractAddress: process.env.CHAINBOIS_NFT_ADDRESS.toLowerCase(),
          ownerAddress: owner.toLowerCase(),
          level,
          badge: (RANK_NAMES[level] || "trainee").toLowerCase().replace(/ /g, "_"),
          traits: metadata.attributes,
          inGameStats: existing ? existing.inGameStats : { kills: 0, score: 0, gamesPlayed: 0 },
          metadataUri: metadata.image ? metadata.image.replace(/\/\d+\.png$/, `/${tokenId}.json`) : "",
          imageUri: metadata.image || "",
        },
        { upsert: true, new: true }
      );

      if (existing) {
        updated++;
      } else {
        created++;
      }

      process.stdout.write(`  Token #${tokenId}: owner=${owner.slice(0, 10)}..., level=${level}, rank=${RANK_NAMES[level] || "Trainee"}\n`);
    } catch (e) {
      console.error(`  Token #${tokenId}: ERROR - ${e.message}`);
      errors++;
    }
  }

  // Trigger Glacier reindex for all synced tokens so explorer shows updated metadata
  console.log(`\nTriggering Glacier reindex for ${created + updated} tokens...`);
  let reindexed = 0;
  for (const fileName of files) {
    const tokenId = parseInt(path.basename(fileName, ".json"));
    try {
      await reindexNftMetadata(process.env.CHAINBOIS_NFT_ADDRESS, String(tokenId));
      reindexed++;
    } catch (e) {
      // Non-fatal — reindex may fail if Glacier API is down
    }
  }
  console.log(`Reindexed ${reindexed}/${files.length} tokens on Glacier.`);

  console.log(`\n========================================`);
  console.log(`Sync Complete`);
  console.log(`========================================`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Errors:  ${errors}`);
  console.log(`  Reindexed: ${reindexed}`);

  process.exit(0);
};

main().catch((error) => {
  console.error("Sync failed:", error);
  process.exit(1);
});
