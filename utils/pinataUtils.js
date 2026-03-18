const axios = require("axios");
const { uploadFileArray, formatConfig } = require("pinata");
const { Blob } = require("buffer");

/**
 * Get Pinata config from env vars.
 * @returns {object} Pinata config object
 */
const getPinataConfig = function () {
  const jwt = process.env.PINATA_JWT;
  const gateway = process.env.PINATA_GATEWAY || "gateway.pinata.cloud";
  if (!jwt) throw new Error("PINATA_JWT not set");
  return formatConfig({ pinataJwt: jwt, pinataGateway: gateway });
};

/**
 * Download an image from a URL and pin it to IPFS via Pinata.
 * @param {string} imageUrl - URL to download (e.g., Cloudinary badge overlay)
 * @param {string} fileName - File name for the pinned file (e.g., "chainboi-1.png")
 * @returns {Promise<string>} IPFS CID of the pinned image
 */
const pinImageFromUrl = async function (imageUrl, fileName) {
  const config = getPinataConfig();

  // Download image
  const response = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 30000 });
  const blob = new Blob([response.data]);
  const file = new File([blob], fileName, { type: "image/png" });

  // Pin to IPFS (uploadFileArray wraps in a directory, so CID/{fileName})
  const result = await uploadFileArray(config, [file], "public", {
    metadata: { name: fileName },
  });

  return { cid: result.cid, fileName };
};

/**
 * Pin a JSON object to IPFS via Pinata.
 * @param {object} jsonData - JSON data to pin
 * @param {string} fileName - File name (e.g., "1.json")
 * @returns {Promise<{cid: string, fileName: string}>} IPFS CID and filename
 */
const pinJsonToIpfs = async function (jsonData, fileName) {
  const config = getPinataConfig();

  const content = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([content]);
  const file = new File([blob], fileName, { type: "application/json" });

  const result = await uploadFileArray(config, [file], "public", {
    metadata: { name: fileName },
  });

  return { cid: result.cid, fileName };
};

module.exports = {
  getPinataConfig,
  pinImageFromUrl,
  pinJsonToIpfs,
};
