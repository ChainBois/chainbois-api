/**
 * Re-upload fixed NFT metadata to IPFS and update contract baseURI.
 *
 * Usage:
 *   node scripts/reuploadMetadata.js                 # Upload only
 *   node scripts/reuploadMetadata.js --set-base-uri  # Upload + set baseURI on contract
 *
 * Requires: PINATA_JWT, MONGODB_URI, CHAINBOIS_NFT_ADDRESS in .env
 * For --set-base-uri: ENCRYPTION_KEY in .env (to decrypt deployer wallet)
 */
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const { uploadFileArray, formatConfig } = require("pinata");
const { Blob } = require("buffer");

const METADATA_DIR = path.join(__dirname, "..", "assets", "nft-collection", "metadata");
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

const uploadMetadata = async function () {
  const config = getPinataConfig();

  const files = fs.readdirSync(METADATA_DIR).filter((f) => f.endsWith(".json") && f !== "_metadata.json");
  console.log(`Uploading ${files.length} metadata files to IPFS...`);

  const fileObjects = [];
  for (const fileName of files) {
    const filePath = path.join(METADATA_DIR, fileName);
    const content = fs.readFileSync(filePath);
    const blob = new Blob([content]);
    const file = new File([blob], fileName, { type: "application/json" });
    fileObjects.push(file);
  }

  const result = await uploadFileArray(config, fileObjects, "public", {
    metadata: { name: "chainbois-metadata-fixed" },
  });

  console.log(`Uploaded: ipfs://${result.cid}`);
  return result.cid;
};

const setBaseUriOnContract = async function (baseUri) {
  const { getProvider } = require("../utils/avaxUtils");
  const { decrypt } = require("../utils/cryptUtils");
  const connectDB = require("../config/db");
  const Wallet = require("../models/walletModel");

  await connectDB();

  const deployerWallet = await Wallet.findOne({ role: "deployer" }).select("+key +iv");
  if (!deployerWallet) {
    console.error("Deployer wallet not found in database.");
    process.exit(1);
  }

  const deployerKey = await decrypt(deployerWallet.key, deployerWallet.iv);
  const provider = getProvider();
  const signer = new ethers.Wallet(deployerKey, provider);

  const contract = new ethers.Contract(
    process.env.CHAINBOIS_NFT_ADDRESS,
    require("../abis/ChainBoisNFT.json").abi,
    signer
  );

  console.log(`Setting baseURI to ${baseUri}...`);
  const tx = await contract.setBaseURI(baseUri);
  await tx.wait();
  console.log(`BaseURI set successfully. Tx: ${tx.hash}`);
};

const main = async function () {
  const setUri = process.argv.includes("--set-base-uri");

  // 1. Upload metadata
  const metadataCid = await uploadMetadata();
  const baseUri = `ipfs://${metadataCid}/`;

  // 2. Save CID to deployments
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
  }
  const network = process.env.AVAX_CHAIN_ID === "43114" ? "mainnet" : "fuji";
  const ipfsPath = path.join(DEPLOYMENTS_DIR, `${network}-ipfs-chainbois.json`);

  let ipfsInfo = {};
  if (fs.existsSync(ipfsPath)) {
    ipfsInfo = JSON.parse(fs.readFileSync(ipfsPath, "utf8"));
  }

  ipfsInfo.metadataCid = metadataCid;
  ipfsInfo.baseUri = baseUri;
  ipfsInfo.lastUpdated = new Date().toISOString();
  fs.writeFileSync(ipfsPath, JSON.stringify(ipfsInfo, null, 2));
  console.log(`\nSaved CID to ${ipfsPath}`);

  // 3. Optionally set baseURI on contract
  if (setUri) {
    await setBaseUriOnContract(baseUri);

    // 4. Reindex all tokens on Glacier so explorer shows updated metadata
    const { reindexNftMetadata } = require("../utils/avaxUtils");
    const { getChainboisTotalSupply } = require("../utils/contractUtils");

    let totalSupply = 50;
    try {
      totalSupply = await getChainboisTotalSupply();
    } catch (e) {
      console.log(`Could not fetch total supply, defaulting to ${totalSupply}`);
    }

    console.log(`\nReindexing ${totalSupply} tokens on Glacier...`);
    let reindexed = 0;
    for (let i = 1; i <= totalSupply; i++) {
      try {
        await reindexNftMetadata(process.env.CHAINBOIS_NFT_ADDRESS, String(i));
        reindexed++;
      } catch (e) {
        // Non-fatal
      }
    }
    console.log(`Reindexed ${reindexed}/${totalSupply} tokens.`);
  } else {
    console.log(`\nTo update the contract baseURI, run:`);
    console.log(`  node scripts/reuploadMetadata.js --set-base-uri`);
    console.log(`Or manually: contract.setBaseURI("${baseUri}")`);
  }

  console.log(`\n========================================`);
  console.log(`Metadata Re-Upload Complete`);
  console.log(`========================================`);
  console.log(`  Metadata CID: ${metadataCid}`);
  console.log(`  Base URI:     ${baseUri}`);
};

main().catch((error) => {
  console.error("Re-upload failed:", error);
  process.exit(1);
});
