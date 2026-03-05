/**
 * Upload weapon images and metadata to IPFS via Pinata.
 * Uses pre-existing images in build/weapons/images/
 *
 * Usage: node scripts/uploadWeaponsToIpfs.js
 */
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const path = require("path");
const { uploadFileArray, formatConfig } = require("pinata");
const { Blob } = require("buffer");

const WEAPONS_DATA = require("../assets/weapons/ghetto-warzones-weapons.json");
const DEPLOYMENTS_DIR = path.join(__dirname, "..", "deployments");

const getPinataConfig = function () {
  const jwt = process.env.PINATA_JWT;
  const gateway = process.env.PINATA_GATEWAY || "gateway.pinata.cloud";
  if (!jwt) {
    console.error("PINATA_JWT not set in .env");
    process.exit(1);
  }
  return formatConfig({ pinataJwt: jwt, pinataGateway: gateway });
};

const uploadDirectory = async function (config, dirPath, name) {
  const files = fs.readdirSync(dirPath).filter((f) => !f.startsWith("."));
  console.log(`Uploading ${files.length} files from ${dirPath}...`);

  const fileObjects = [];
  for (const fileName of files) {
    const filePath = path.join(dirPath, fileName);
    const content = fs.readFileSync(filePath);
    const blob = new Blob([content]);
    const mimeType = fileName.endsWith(".json") ? "application/json" : "image/jpeg";
    const file = new File([blob], fileName, { type: mimeType });
    fileObjects.push(file);
  }

  const result = await uploadFileArray(config, fileObjects, "public", {
    metadata: { name },
  });

  console.log(`Uploaded: ipfs://${result.cid}`);
  return result.cid;
};

const main = async function () {
  const config = getPinataConfig();
  const buildDir = path.join(__dirname, "..", "build", "weapons");
  const imagesDir = path.join(buildDir, "images");
  const jsonDir = path.join(buildDir, "json");

  const imageFiles = fs.readdirSync(imagesDir).filter((f) => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));
  console.log(`Found ${imageFiles.length} weapon images.\n`);

  // 1. Upload images
  console.log("--- Uploading weapon images ---");
  const imagesCid = await uploadDirectory(config, imagesDir, "chainbois-weapon-images");

  // 2. Create metadata using ghetto-warzones data
  console.log("\nCreating weapon metadata...");
  fs.mkdirSync(jsonDir, { recursive: true });

  // Map image files to weapon data by order
  imageFiles.sort();
  imageFiles.forEach((fileName, idx) => {
    const tokenId = idx + 1;
    const weapon = WEAPONS_DATA[idx];
    const metadata = {
      name: `${weapon.name}`,
      description: weapon.description,
      image: `ipfs://${imagesCid}/${fileName}`,
      attributes: [
        { trait_type: "Weapon Name", value: weapon.name },
        { trait_type: "Category", value: weapon.category },
        { trait_type: "Type", value: weapon.type },
        { trait_type: "Game ID", value: weapon.gameId },
        { trait_type: "Supply", value: weapon.supply },
      ],
    };
    fs.writeFileSync(path.join(jsonDir, `${tokenId}.json`), JSON.stringify(metadata, null, 2));
    console.log(`  ${tokenId}. ${weapon.name} (${weapon.category})`);
  });

  // 3. Upload metadata
  console.log("\n--- Uploading weapon metadata ---");
  const metadataCid = await uploadDirectory(config, jsonDir, "chainbois-weapon-metadata");

  // 4. Save deployment info
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
  }
  const network = process.env.AVAX_CHAIN_ID === "43114" ? "mainnet" : "fuji";
  const ipfsInfo = {
    collection: "weapons",
    imagesCid,
    metadataCid,
    baseUri: `ipfs://${metadataCid}/`,
    weaponNames: WEAPONS_DATA.map((w) => w.name),
    uploadedAt: new Date().toISOString(),
  };
  const ipfsPath = path.join(DEPLOYMENTS_DIR, `${network}-ipfs-weapons.json`);
  fs.writeFileSync(ipfsPath, JSON.stringify(ipfsInfo, null, 2));

  console.log(`\n========================================`);
  console.log(`Weapons IPFS Upload Complete`);
  console.log(`========================================`);
  console.log(`  Images CID:   ${imagesCid}`);
  console.log(`  Metadata CID: ${metadataCid}`);
  console.log(`  Base URI:     ipfs://${metadataCid}/`);
  console.log(`  Weapons:      ${imageFiles.length}`);
  console.log(`  Saved to:     ${ipfsPath}`);
};

main().catch((error) => {
  console.error("Upload failed:", error);
  process.exit(1);
});
