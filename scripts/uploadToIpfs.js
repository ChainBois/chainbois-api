/**
 * Upload NFT images and metadata to IPFS via Pinata.
 *
 * Usage:
 *   node scripts/uploadToIpfs.js chainbois              # Upload ChainBoi collection
 *   node scripts/uploadToIpfs.js weapons <images-zip>   # Upload weapon images
 *
 * Requires: PINATA_JWT in .env
 */
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const path = require("path");
const { uploadFileArray, formatConfig } = require("pinata");
const { Blob } = require("buffer");

const DEPLOYMENTS_DIR = path.join(__dirname, "..", "deployments");

const getPinataConfig = function () {
  const jwt = process.env.PINATA_JWT;
  const gateway = process.env.PINATA_GATEWAY || "gateway.pinata.cloud";

  if (!jwt) {
    console.error("PINATA_JWT not set in .env");
    console.error("Get your JWT from: https://app.pinata.cloud/developers/api-keys");
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
    const file = new File([blob], fileName, {
      type: fileName.endsWith(".json") ? "application/json" : "image/png",
    });
    fileObjects.push(file);
  }

  const result = await uploadFileArray(config, fileObjects, "public", {
    metadata: { name },
  });

  console.log(`Uploaded: ipfs://${result.cid}`);
  return result.cid;
};

const uploadChainbois = async function () {
  const config = getPinataConfig();
  const buildDir = path.join(__dirname, "..", "build", "chainbois");
  const imagesDir = path.join(buildDir, "images");
  const jsonDir = path.join(buildDir, "json");

  if (!fs.existsSync(imagesDir) || !fs.existsSync(jsonDir)) {
    console.error("Build directory not found. Run generateNftArt.js first.");
    process.exit(1);
  }

  // 1. Upload images
  console.log("--- Uploading ChainBoi images ---");
  const imagesCid = await uploadDirectory(config, imagesDir, "chainbois-images");

  // 2. Update metadata JSONs with image URIs
  console.log("\nUpdating metadata with image URIs...");
  const jsonFiles = fs.readdirSync(jsonDir).filter((f) => f.endsWith(".json") && f !== "_metadata.json");

  for (const fileName of jsonFiles) {
    const filePath = path.join(jsonDir, fileName);
    const metadata = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Extract edition number from filename (e.g., "1.json" → "1")
    const edition = path.basename(fileName, ".json");
    metadata.image = `ipfs://${imagesCid}/${edition}.png`;

    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  }
  console.log(`Updated ${jsonFiles.length} metadata files.`);

  // 3. Upload metadata
  console.log("\n--- Uploading ChainBoi metadata ---");
  const metadataCid = await uploadDirectory(config, jsonDir, "chainbois-metadata");

  // Save CIDs
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
  }
  const network = process.env.AVAX_CHAIN_ID === "43114" ? "mainnet" : "fuji";
  const ipfsInfo = {
    collection: "chainbois",
    imagesCid,
    metadataCid,
    baseUri: `ipfs://${metadataCid}/`,
    uploadedAt: new Date().toISOString(),
  };
  const ipfsPath = path.join(DEPLOYMENTS_DIR, `${network}-ipfs-chainbois.json`);
  fs.writeFileSync(ipfsPath, JSON.stringify(ipfsInfo, null, 2));

  console.log(`\n========================================`);
  console.log(`ChainBois IPFS Upload Complete`);
  console.log(`========================================`);
  console.log(`  Images CID:   ${imagesCid}`);
  console.log(`  Metadata CID: ${metadataCid}`);
  console.log(`  Base URI:     ipfs://${metadataCid}/`);
  console.log(`  Saved to:     ${ipfsPath}`);
  console.log(`\nNext: Set baseURI on contract:`);
  console.log(`  The mintChainbois.js script will do this automatically.`);
  console.log(`  Or manually: contract.setBaseURI("ipfs://${metadataCid}/")`);
};

const uploadWeapons = async function () {
  const config = getPinataConfig();
  const weaponsZip = process.argv[3];

  if (!weaponsZip) {
    console.error("Usage: node scripts/uploadToIpfs.js weapons <images-zip>");
    process.exit(1);
  }

  if (!fs.existsSync(weaponsZip)) {
    console.error(`Weapons zip not found: ${weaponsZip}`);
    process.exit(1);
  }

  // Extract weapon images
  const buildDir = path.join(__dirname, "..", "build", "weapons");
  const imagesDir = path.join(buildDir, "images");
  const jsonDir = path.join(buildDir, "json");
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(jsonDir, { recursive: true });

  const { execSync } = require("child_process");
  execSync(`unzip -o "${weaponsZip}" -d "${imagesDir}"`, { stdio: "inherit" });

  // Handle wrapper directory
  const contents = fs.readdirSync(imagesDir).filter((f) => !f.startsWith("."));
  if (contents.length === 1 && fs.statSync(path.join(imagesDir, contents[0])).isDirectory()) {
    const wrapperDir = path.join(imagesDir, contents[0]);
    for (const f of fs.readdirSync(wrapperDir)) {
      fs.renameSync(path.join(wrapperDir, f), path.join(imagesDir, f));
    }
    fs.rmdirSync(wrapperDir);
  }

  const imageFiles = fs.readdirSync(imagesDir).filter((f) => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));
  console.log(`Found ${imageFiles.length} weapon images.`);

  // Upload images
  console.log("\n--- Uploading weapon images ---");
  const imagesCid = await uploadDirectory(config, imagesDir, "weapon-images");

  // Create metadata for each weapon
  console.log("\nCreating weapon metadata...");
  imageFiles.forEach((fileName, idx) => {
    const tokenId = idx + 1;
    const weaponName = path.basename(fileName, path.extname(fileName));
    const metadata = {
      name: `Weapon #${tokenId} - ${weaponName}`,
      description: `ChainBois Weapon: ${weaponName}`,
      image: `ipfs://${imagesCid}/${fileName}`,
      attributes: [{ trait_type: "Weapon Name", value: weaponName }],
    };
    fs.writeFileSync(path.join(jsonDir, `${tokenId}.json`), JSON.stringify(metadata, null, 2));
  });

  // Upload metadata
  console.log("\n--- Uploading weapon metadata ---");
  const metadataCid = await uploadDirectory(config, jsonDir, "weapon-metadata");

  // Save CIDs
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
  }
  const network = process.env.AVAX_CHAIN_ID === "43114" ? "mainnet" : "fuji";
  const ipfsInfo = {
    collection: "weapons",
    imagesCid,
    metadataCid,
    baseUri: `ipfs://${metadataCid}/`,
    weaponNames: imageFiles.map((f) => path.basename(f, path.extname(f))),
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

const main = async function () {
  const command = process.argv[2];

  if (command === "chainbois") {
    await uploadChainbois();
  } else if (command === "weapons") {
    await uploadWeapons();
  } else {
    console.error("Usage:");
    console.error("  node scripts/uploadToIpfs.js chainbois");
    console.error("  node scripts/uploadToIpfs.js weapons <images-zip>");
    process.exit(1);
  }
};

main().catch((error) => {
  console.error("Upload failed:", error);
  process.exit(1);
});
