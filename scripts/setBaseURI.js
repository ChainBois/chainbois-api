/**
 * Set baseURI on ChainBoisNFT contract to point to the dynamic metadata API.
 *
 * Usage:
 *   node scripts/setBaseURI.js
 *
 * This fixes Snowtrace/Glacier not displaying NFT images — without a baseURI,
 * tokenURI() returns an empty string and explorers have nothing to index.
 */
const dotenv = require("dotenv");
dotenv.config();

const { ethers } = require("ethers");
const { getSigner } = require("../utils/avaxUtils");
const { decrypt } = require("../utils/cryptUtils");
const Wallet = require("../models/walletModel");
const mongoose = require("mongoose");

const ChainBoisNFTABI = require("../abis/ChainBoisNFT.json").abi;

const main = async function () {
  const contractAddress = process.env.CHAINBOIS_NFT_ADDRESS;
  if (!contractAddress) {
    console.error("CHAINBOIS_NFT_ADDRESS not set in .env");
    process.exit(1);
  }

  // The dynamic metadata endpoint — must end with /
  const baseURI = process.env.METADATA_BASE_URI;
  if (!baseURI) {
    console.error("METADATA_BASE_URI not set in .env (e.g. https://your-domain.com/api/v1/metadata/)");
    process.exit(1);
  }

  console.log(`Contract: ${contractAddress}`);
  console.log(`BaseURI:  ${baseURI}`);
  console.log();

  // Connect to MongoDB to get deployer key
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const deployerWallet = await Wallet.findOne({ role: "deployer" }).select("+key +iv");
  if (!deployerWallet) {
    console.error("Deployer wallet not found in database");
    process.exit(1);
  }

  const privateKey = await decrypt(deployerWallet.key, deployerWallet.iv);
  const signer = getSigner(privateKey);
  const contract = new ethers.Contract(contractAddress, ChainBoisNFTABI, signer);

  // Set baseURI
  console.log("Calling setBaseURI...");
  const tx = await contract.setBaseURI(baseURI);
  console.log(`Transaction: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Confirmed in block ${receipt.blockNumber}`);

  // Verify
  const tokenURI = await contract.tokenURI(1);
  console.log(`\nVerification — tokenURI(1): ${tokenURI}`);

  // Emit batch metadata update to signal indexers
  console.log("\nEmitting BatchMetadataUpdate(1, 50)...");
  const batchTx = await contract.emitBatchMetadataUpdate(1, 50);
  console.log(`Transaction: ${batchTx.hash}`);
  const batchReceipt = await batchTx.wait();
  console.log(`Confirmed in block ${batchReceipt.blockNumber}`);

  console.log("\nDone! Glacier/Snowtrace should pick up metadata within ~1 hour.");
  console.log("To speed up, manually trigger reindex per token via Glacier API.");

  await mongoose.disconnect();
  process.exit(0);
};

main().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
