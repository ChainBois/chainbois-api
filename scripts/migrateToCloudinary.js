/**
 * Migrate NFT images and badge overlays to Cloudinary.
 *
 * Usage:
 *   node scripts/migrateToCloudinary.js images <dir>    # Upload NFT images
 *   node scripts/migrateToCloudinary.js badges <dir>    # Upload badge overlays
 *   node scripts/migrateToCloudinary.js all <images-dir> <badges-dir>
 *
 * Requires: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env
 */
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const { initCloudinary } = require("../config/cloudinary");
const { uploadNftImages, uploadBadgeOverlays } = require("../utils/cloudinaryUtils");

const main = async function () {
  const command = process.argv[2];

  if (!command || !["images", "badges", "all"].includes(command)) {
    console.error("Usage:");
    console.error("  node scripts/migrateToCloudinary.js images <images-dir>");
    console.error("  node scripts/migrateToCloudinary.js badges <badges-dir>");
    console.error("  node scripts/migrateToCloudinary.js all <images-dir> <badges-dir>");
    process.exit(1);
  }

  const cld = initCloudinary();
  if (!cld) {
    console.error("Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env");
    process.exit(1);
  }

  if (command === "images" || command === "all") {
    const imagesDir = command === "all" ? process.argv[3] : process.argv[3];
    if (!imagesDir || !fs.existsSync(imagesDir)) {
      console.error(`Images directory not found: ${imagesDir}`);
      process.exit(1);
    }

    console.log("--- Uploading NFT images to Cloudinary ---");
    const count = await uploadNftImages(imagesDir);
    console.log(`Uploaded ${count} NFT images.\n`);
  }

  if (command === "badges" || command === "all") {
    const badgesDir = command === "all" ? process.argv[4] : process.argv[3];
    if (!badgesDir || !fs.existsSync(badgesDir)) {
      console.error(`Badges directory not found: ${badgesDir}`);
      process.exit(1);
    }

    console.log("--- Uploading badge overlays to Cloudinary ---");
    const count = await uploadBadgeOverlays(badgesDir);
    console.log(`Uploaded ${count} badge overlays.\n`);
  }

  console.log("Cloudinary migration complete.");
};

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
