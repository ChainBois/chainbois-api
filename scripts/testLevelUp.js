/**
 * Test Level-Up: Performs real on-chain level-ups and verifies metadata changes.
 *
 * This script does exactly what the level-up controller does:
 *   1. Sends real AVAX payment (nft_store → prize_pool)
 *   2. Calls setLevel() on-chain (deployer wallet)
 *   3. Updates MongoDB (ChainboiNft)
 *   4. Triggers Glacier reindex
 *   5. Verifies metadata on Glacier API
 *
 * Usage:
 *   node scripts/testLevelUp.js [tokenId] [targetLevel]
 *   node scripts/testLevelUp.js 1 2        # Level up token #1 to level 2
 *   node scripts/testLevelUp.js             # Defaults: token #1, level 1
 */
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const { ethers } = require("ethers");
const axios = require("axios");
const Wallet = require("../models/walletModel");
const ChainboiNft = require("../models/chainboiNftModel");
const Settings = require("../models/settingsModel");
const { getProvider, getAvaxBalance, reindexNftMetadata } = require("../utils/avaxUtils");
const { decrypt, validateCryptoEnv } = require("../utils/cryptUtils");
const { RANK_NAMES } = require("../config/constants");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async function () {
  const tokenId = parseInt(process.argv[2]) || 1;
  const targetLevel = parseInt(process.argv[3]) || 1;

  validateCryptoEnv();
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB\n");

  // Load wallets
  const deployerWallet = await Wallet.findOne({ role: "deployer" }).select("+key +iv");
  const nftStoreWallet = await Wallet.findOne({ role: "nft_store" }).select("+key +iv");
  const prizePoolWallet = await Wallet.findOne({ role: "prize_pool" });

  if (!deployerWallet || !nftStoreWallet || !prizePoolWallet) {
    console.error("Missing required wallets");
    process.exit(1);
  }

  const deployerKey = await decrypt(deployerWallet.key, deployerWallet.iv);
  const nftStoreKey = await decrypt(nftStoreWallet.key, nftStoreWallet.iv);

  const provider = getProvider();
  const deployerSigner = new ethers.Wallet(deployerKey, provider);
  const nftStoreSigner = new ethers.Wallet(nftStoreKey, provider);

  const { abi } = require("../abis/ChainBoisNFT.json");
  const contract = new ethers.Contract(process.env.CHAINBOIS_NFT_ADDRESS, abi, deployerSigner);

  // Check current state
  const currentLevel = Number(await contract.getLevel(tokenId));
  const owner = await contract.ownerOf(tokenId);
  console.log(`Token #${tokenId}`);
  console.log(`  Owner: ${owner}`);
  console.log(`  Current level: ${currentLevel} (${RANK_NAMES[currentLevel]})`);
  console.log(`  Target level: ${targetLevel} (${RANK_NAMES[targetLevel]})`);

  if (currentLevel >= targetLevel) {
    console.log(`\nAlready at level ${currentLevel} >= target ${targetLevel}. Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  // Get costs from settings
  const settings = await Settings.findOne();
  if (!settings) {
    console.error("No settings found in MongoDB");
    process.exit(1);
  }

  // Fund nft_store wallet if needed (for payment txs)
  const nftStoreBalance = await getAvaxBalance(nftStoreWallet.address);
  console.log(`\nNFT Store balance: ${nftStoreBalance} AVAX`);

  let totalCost = 0;
  for (let l = currentLevel + 1; l <= targetLevel; l++) {
    totalCost += settings.levelUpCosts.get(String(l)) || 0;
  }
  const gasBuffer = 0.01; // AVAX for gas fees
  const needed = totalCost + gasBuffer;

  if (parseFloat(nftStoreBalance) < needed) {
    console.log(`Funding nft_store with ${needed} AVAX from deployer...`);
    const fundTx = await deployerSigner.sendTransaction({
      to: nftStoreWallet.address,
      value: ethers.parseEther(String(needed)),
    });
    await fundTx.wait();
    console.log(`  Funded. Tx: ${fundTx.hash}`);
    const newBal = await getAvaxBalance(nftStoreWallet.address);
    console.log(`  New balance: ${newBal} AVAX`);
  }

  // Level up one level at a time
  for (let level = currentLevel + 1; level <= targetLevel; level++) {
    const cost = settings.levelUpCosts.get(String(level));
    const rank = RANK_NAMES[level];
    console.log(`\n--- Level ${level - 1} → ${level} (${rank}) | Cost: ${cost} AVAX ---`);

    // Step 1: Send AVAX payment (nft_store → prize_pool)
    console.log("  [1/5] Sending payment...");
    const paymentTx = await nftStoreSigner.sendTransaction({
      to: prizePoolWallet.address,
      value: ethers.parseEther(String(cost)),
    });
    const paymentReceipt = await paymentTx.wait();
    console.log(`         Payment tx: ${paymentReceipt.hash}`);

    // Step 2: Set level on-chain (deployer calls setLevel)
    console.log("  [2/5] Setting level on-chain...");
    const levelTx = await contract.setLevel(tokenId, level);
    const levelReceipt = await levelTx.wait();
    console.log(`         Level tx: ${levelReceipt.hash}`);

    // Check for MetadataUpdate event
    const metadataEvent = levelReceipt.logs.find((log) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed && parsed.name === "MetadataUpdate";
      } catch { return false; }
    });
    if (metadataEvent) {
      const parsed = contract.interface.parseLog(metadataEvent);
      console.log(`         MetadataUpdate event emitted for tokenId: ${parsed.args[0]}`);
    } else {
      console.log("         WARNING: No MetadataUpdate event found!");
    }

    // Step 3: Update MongoDB
    console.log("  [3/5] Updating MongoDB...");
    const badge = rank.toLowerCase().replace(/ /g, "_");
    await ChainboiNft.findOneAndUpdate(
      { tokenId },
      {
        level,
        badge,
        ownerAddress: owner.toLowerCase(),
        contractAddress: process.env.CHAINBOIS_NFT_ADDRESS.toLowerCase(),
      },
      { upsert: true, new: true }
    );
    console.log(`         MongoDB updated: level=${level}, badge=${badge}`);

    // Step 4: Verify on-chain
    console.log("  [4/5] Verifying on-chain...");
    const verifiedLevel = Number(await contract.getLevel(tokenId));
    console.log(`         On-chain level: ${verifiedLevel} ${verifiedLevel === level ? "✓" : "✗ MISMATCH!"}`);

    // Step 5: Trigger Glacier reindex
    console.log("  [5/5] Triggering Glacier reindex...");
    try {
      await reindexNftMetadata(process.env.CHAINBOIS_NFT_ADDRESS, String(tokenId));
      console.log("         Reindex triggered");
    } catch (e) {
      console.log(`         Reindex: ${e.message || "failed (may be rate-limited)"}`);
    }
  }

  // Final verification
  console.log("\n========================================");
  console.log("Final Verification");
  console.log("========================================");

  const finalLevel = Number(await contract.getLevel(tokenId));
  console.log(`On-chain level: ${finalLevel} (${RANK_NAMES[finalLevel]})`);

  // Check Glacier
  await sleep(3000); // Wait a moment for Glacier to process
  try {
    const glacierUrl = `https://glacier-api.avax.network/v1/chains/${process.env.AVAX_CHAIN_ID}/nfts/collections/${process.env.CHAINBOIS_NFT_ADDRESS}/tokens/${tokenId}`;
    const glacierRes = await axios.get(glacierUrl, { timeout: 10000 });
    const attrs = JSON.parse(glacierRes.data.metadata.attributes);
    const levelAttr = attrs.find((a) => a.trait_type === "Level");
    const rankAttr = attrs.find((a) => a.trait_type === "Rank");
    console.log(`Glacier Level attr: ${levelAttr ? levelAttr.value : "NOT FOUND"}`);
    console.log(`Glacier Rank attr: ${rankAttr ? rankAttr.value : "NOT FOUND"}`);
    console.log(`Glacier tokenUri: ${glacierRes.data.tokenUri}`);

    if (levelAttr && levelAttr.value === 0) {
      console.log("\nNOTE: Glacier still shows Level 0. This is expected —");
      console.log("the IPFS metadata is static. The dynamic metadata endpoint");
      console.log("serves real-time level data. To update IPFS, run:");
      console.log("  node scripts/fixMetadata.js  (update JSON files)");
      console.log("  node scripts/reuploadMetadata.js --set-base-uri");
    }
  } catch (e) {
    console.log(`Glacier check failed: ${e.message}`);
  }

  // Check dynamic metadata endpoint
  try {
    const metaUrl = `https://your-api-domain.com/api/v1/metadata/${tokenId}.json`;
    const metaRes = await axios.get(metaUrl, { timeout: 10000 });
    const attrs = metaRes.data.attributes;
    const levelAttr = attrs.find((a) => a.trait_type === "Level");
    const rankAttr = attrs.find((a) => a.trait_type === "Rank");
    console.log(`\nDynamic API Level: ${levelAttr ? levelAttr.value : "NOT FOUND"}`);
    console.log(`Dynamic API Rank: ${rankAttr ? rankAttr.value : "NOT FOUND"}`);
  } catch (e) {
    console.log(`Dynamic metadata check: ${e.message}`);
  }

  console.log("\nExplorer links:");
  console.log(`  Snowtrace: https://testnet.snowtrace.io/nft/${process.env.CHAINBOIS_NFT_ADDRESS}/${tokenId}?chainid=43113`);
  console.log(`  Glacier:   https://glacier-api.avax.network/v1/chains/43113/nfts/collections/${process.env.CHAINBOIS_NFT_ADDRESS}/tokens/${tokenId}`);

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});
