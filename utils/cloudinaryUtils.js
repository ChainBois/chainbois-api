const { cloudinary } = require("../config/cloudinary");
const { RANK_NAMES } = require("../config/constants");

/**
 * Get the Cloudinary public ID for an NFT image.
 * @param {number} tokenId
 * @returns {string}
 */
const getNftPublicId = function (tokenId) {
  return `chainbois/${tokenId}`;
};

/**
 * Get the Cloudinary public ID for a rank badge overlay.
 * @param {number} level
 * @returns {string}
 */
const getBadgePublicId = function (level) {
  const rank = (RANK_NAMES[level] || "trainee").toLowerCase().replace(/ /g, "_");
  return `chainbois-badges/${rank}`;
};

/**
 * Construct a Cloudinary URL with badge overlay for an NFT.
 * @param {number} tokenId
 * @param {number} level - Current NFT level (0-7)
 * @returns {string} Full Cloudinary URL with badge overlay, or base URL if level 0
 */
const getBadgeOverlayUrl = function (tokenId, level) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";

  const baseId = getNftPublicId(tokenId);

  // Level 0 (Trainee) has no badge overlay
  if (level === 0) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${baseId}.png`;
  }

  const badgeId = getBadgePublicId(level);
  // Overlay badge in bottom-right corner, 150px wide, 90% opacity
  return `https://res.cloudinary.com/${cloudName}/image/upload/l_${badgeId.replace(/\//g, ":")},g_south_east,w_150,o_90/${baseId}.png`;
};

/**
 * Upload a single file to Cloudinary.
 * @param {string} filePath - Local file path
 * @param {string} publicId - Cloudinary public ID (without extension)
 * @param {string} folder - Optional folder
 * @returns {Promise<object>} Upload result
 */
const uploadToCloudinary = async function (filePath, publicId, folder) {
  const options = {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  };
  if (folder) options.folder = folder;

  return cloudinary.uploader.upload(filePath, options);
};

/**
 * Upload all NFT images from a directory to Cloudinary.
 * @param {string} dirPath - Directory containing NFT images
 * @returns {Promise<number>} Number of images uploaded
 */
const uploadNftImages = async function (dirPath) {
  const fs = require("fs");
  const path = require("path");
  const files = fs.readdirSync(dirPath).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

  let uploaded = 0;
  for (const fileName of files) {
    const tokenId = path.basename(fileName, path.extname(fileName));
    const filePath = path.join(dirPath, fileName);
    await uploadToCloudinary(filePath, tokenId, "chainbois");
    uploaded++;
    if (uploaded % 10 === 0) {
      console.log(`  Uploaded ${uploaded}/${files.length} NFT images`);
    }
  }
  return uploaded;
};

/**
 * Upload badge overlay images to Cloudinary.
 * @param {string} dirPath - Directory containing badge PNGs
 * @returns {Promise<number>} Number of badges uploaded
 */
const uploadBadgeOverlays = async function (dirPath) {
  const fs = require("fs");
  const path = require("path");
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".png"));

  let uploaded = 0;
  for (const fileName of files) {
    const badgeName = path.basename(fileName, ".png");
    const filePath = path.join(dirPath, fileName);
    await uploadToCloudinary(filePath, badgeName, "chainbois-badges");
    uploaded++;
  }
  return uploaded;
};

module.exports = {
  getNftPublicId,
  getBadgePublicId,
  getBadgeOverlayUrl,
  uploadToCloudinary,
  uploadNftImages,
  uploadBadgeOverlays,
};
