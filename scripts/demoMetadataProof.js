/**
 * Hackathon Demo: Prove NFT Metadata Updates On-Chain
 *
 * This script demonstrates the full metadata update lifecycle for a video demo.
 * It proves that metadata changes are verifiable on-chain, even when explorers
 * haven't refreshed their cache yet.
 *
 * What it does:
 *   1. Shows BEFORE state (on-chain level, tokenURI, dynamic metadata, Glacier cache)
 *   2. Performs a live level-up (setLevel on-chain, emits MetadataUpdate event)
 *   3. Shows AFTER state (updated level, updated metadata, same tokenURI)
 *   4. Decodes the MetadataUpdate event from the transaction receipt as PROOF
 *   5. Triggers Glacier reindex
 *   6. Provides Snowtrace links to verify the transaction
 *
 * Usage:
 *   node scripts/demoMetadataProof.js              # Level up token #2 (0→1)
 *   node scripts/demoMetadataProof.js 3             # Level up token #3
 *   node scripts/demoMetadataProof.js 2 3           # Level up token #2 to level 3
 *   node scripts/demoMetadataProof.js --verify-only # Just show current state, no level-up
 */
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const { ethers } = require("ethers");
const axios = require("axios");
const Wallet = require("../models/walletModel");
const ChainboiNft = require("../models/chainboiNftModel");
const { getProvider, reindexNftMetadata } = require("../utils/avaxUtils");
const { decrypt, validateCryptoEnv } = require("../utils/cryptUtils");
const { RANK_NAMES } = require("../config/constants");

const CONTRACT_ADDRESS = process.env.CHAINBOIS_NFT_ADDRESS;
const CHAIN_ID = process.env.AVAX_CHAIN_ID || "43113";
const BASE_URL = "https://your-api-domain.com/api/v1";
const SNOWTRACE_BASE = "https://testnet.snowtrace.io";

const divider = function (title) {
  console.log(`\n${"=".repeat(60)}`);
  if (title) console.log(`  ${title}`);
  if (title) console.log("=".repeat(60));
};

const fetchDynamicMetadata = async function (tokenId) {
  const url = `${BASE_URL}/metadata/${tokenId}.json`;
  const res = await axios.get(url, { timeout: 10000 });
  return res.data;
};

const fetchGlacierMetadata = async function (tokenId) {
  const url = `https://glacier-api.avax.network/v1/chains/${CHAIN_ID}/nfts/collections/${CONTRACT_ADDRESS}/tokens/${tokenId}`;
  const res = await axios.get(url, { timeout: 10000 });
  return res.data;
};

const getAttr = function (attributes, traitType) {
  const attr = attributes.find((a) => a.trait_type === traitType);
  return attr ? attr.value : "N/A";
};

const main = async function () {
  const verifyOnly = process.argv.includes("--verify-only");
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const tokenId = parseInt(args[0]) || 2;
  const targetLevel = parseInt(args[1]) || null; // auto-detect if not specified

  validateCryptoEnv();
  await mongoose.connect(process.env.MONGODB_URI);

  const provider = getProvider();
  const { abi } = require("../abis/ChainBoisNFT.json");
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

  // =========================================================================
  //  STEP 1: BEFORE STATE
  // =========================================================================
  divider("STEP 1: CURRENT ON-CHAIN STATE");

  const currentLevel = Number(await contract.getLevel(tokenId));
  const tokenUri = await contract.tokenURI(tokenId);
  const owner = await contract.ownerOf(tokenId);
  const supports4906 = await contract.supportsInterface("0x49064906");

  console.log(`  Token ID:             #${tokenId}`);
  console.log(`  Owner:                ${owner}`);
  console.log(`  On-chain Level:       ${currentLevel} (${RANK_NAMES[currentLevel]})`);
  console.log(`  tokenURI() returns:   ${tokenUri}`);
  console.log(`  EIP-4906 supported:   ${supports4906}`);
  console.log(`  Contract:             ${CONTRACT_ADDRESS}`);

  // =========================================================================
  //  STEP 2: DYNAMIC METADATA (what tokenURI points to)
  // =========================================================================
  divider("STEP 2: DYNAMIC METADATA ENDPOINT (real-time)");

  try {
    const meta = await fetchDynamicMetadata(tokenId);
    console.log(`  URL:        ${BASE_URL}/metadata/${tokenId}.json`);
    console.log(`  Name:       ${meta.name}`);
    console.log(`  Level:      ${getAttr(meta.attributes, "Level")}`);
    console.log(`  Rank:       ${getAttr(meta.attributes, "Rank")}`);
    console.log(`  Image:      ${meta.image}`);
    console.log(`  Kills:      ${getAttr(meta.attributes, "Kills")}`);
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
  }

  // =========================================================================
  //  STEP 3: GLACIER CACHED METADATA (what explorer shows)
  // =========================================================================
  divider("STEP 3: GLACIER CACHED METADATA (explorer cache)");

  try {
    const glacier = await fetchGlacierMetadata(tokenId);
    const glacierMeta = glacier.metadata || {};
    let glacierAttrs = [];
    try {
      glacierAttrs = typeof glacierMeta.attributes === "string"
        ? JSON.parse(glacierMeta.attributes)
        : glacierMeta.attributes || [];
    } catch { glacierAttrs = []; }

    console.log(`  Glacier tokenUri:   ${glacier.tokenUri || "N/A"}`);
    console.log(`  Glacier Level:      ${getAttr(glacierAttrs, "Level")}`);
    console.log(`  Glacier Rank:       ${getAttr(glacierAttrs, "Rank")}`);
    console.log(`  Glacier Image:      ${glacierMeta.imageUri || "N/A"}`);

    // Compare
    const dynamicMeta = await fetchDynamicMetadata(tokenId);
    const dynamicLevel = getAttr(dynamicMeta.attributes, "Level");
    const glacierLevel = getAttr(glacierAttrs, "Level");
    if (String(dynamicLevel) !== String(glacierLevel)) {
      console.log(`\n  ** MISMATCH DETECTED **`);
      console.log(`  Dynamic endpoint shows Level ${dynamicLevel}, Glacier cache shows Level ${glacierLevel}`);
      console.log(`  This proves Glacier has stale/cached data.`);
      console.log(`  The on-chain tokenURI() points to the dynamic endpoint (correct).`);
    } else {
      console.log(`\n  Glacier and dynamic endpoint are in sync.`);
    }
  } catch (e) {
    console.log(`  Glacier fetch: ${e.message}`);
  }

  // =========================================================================
  //  STEP 4: SHOW EXISTING ON-CHAIN PROOF (past events)
  // =========================================================================
  divider("STEP 4: EXISTING ON-CHAIN PROOF (past EIP-4906 events)");

  const currentBlock = await provider.getBlockNumber();
  const searchFrom = currentBlock - 86400; // ~48 hours of blocks

  let batchEvents = [];
  let metaEvents = [];
  for (let from = searchFrom; from <= currentBlock; from += 2000) {
    const to = Math.min(from + 1999, currentBlock);
    try {
      const batch = await contract.queryFilter(contract.filters.BatchMetadataUpdate(), from, to);
      batchEvents.push(...batch);
      const meta = await contract.queryFilter(contract.filters.MetadataUpdate(), from, to);
      metaEvents.push(...meta);
    } catch { /* skip */ }
  }

  console.log(`  BatchMetadataUpdate events: ${batchEvents.length}`);
  for (const e of batchEvents) {
    console.log(`    Tx: ${e.transactionHash}`);
    console.log(`    Range: tokens ${Number(e.args[0])} to ${Number(e.args[1])}`);
    console.log(`    View: ${SNOWTRACE_BASE}/tx/${e.transactionHash}`);
  }
  console.log(`  MetadataUpdate events: ${metaEvents.length}`);
  for (const e of metaEvents) {
    console.log(`    Tx: ${e.transactionHash}`);
    console.log(`    Token: #${Number(e.args[0])}`);
    console.log(`    View: ${SNOWTRACE_BASE}/tx/${e.transactionHash}`);
  }

  if (verifyOnly) {
    divider("VERIFICATION COMPLETE (--verify-only mode)");
    console.log(`\n  Verification links:`);
    console.log(`  Snowtrace contract: ${SNOWTRACE_BASE}/address/${CONTRACT_ADDRESS}`);
    console.log(`  Thirdweb dashboard: https://thirdweb.com/avalanche-fuji/${CONTRACT_ADDRESS}`);
    console.log(`  Dynamic metadata:   ${BASE_URL}/metadata/${tokenId}.json`);
    await mongoose.disconnect();
    return;
  }

  // =========================================================================
  //  STEP 5: LIVE LEVEL-UP (on-chain state change + MetadataUpdate event)
  // =========================================================================
  const newLevel = targetLevel || currentLevel + 1;
  if (newLevel > 7) {
    console.log(`\n  Token #${tokenId} is already at max level (${currentLevel}). Pick a different token.`);
    await mongoose.disconnect();
    return;
  }

  divider(`STEP 5: LIVE LEVEL-UP (${currentLevel} -> ${newLevel})`);

  const deployerWallet = await Wallet.findOne({ role: "deployer" }).select("+key +iv");
  if (!deployerWallet) {
    console.error("  Deployer wallet not found in database");
    process.exit(1);
  }
  const deployerKey = await decrypt(deployerWallet.key, deployerWallet.iv);
  const deployerSigner = new ethers.Wallet(deployerKey, provider);
  const signedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, deployerSigner);

  console.log(`  Calling setLevel(${tokenId}, ${newLevel}) on-chain...`);
  const tx = await signedContract.setLevel(tokenId, newLevel);
  console.log(`  Transaction submitted: ${tx.hash}`);
  console.log(`  Waiting for confirmation...`);
  const receipt = await tx.wait();
  console.log(`  CONFIRMED in block ${receipt.blockNumber}`);
  console.log(`  Gas used: ${receipt.gasUsed.toString()}`);

  // =========================================================================
  //  STEP 6: DECODE THE EVENT (on-chain proof of metadata change)
  // =========================================================================
  divider("STEP 6: ON-CHAIN PROOF (MetadataUpdate event in tx receipt)");

  let foundEvent = false;
  for (const log of receipt.logs) {
    try {
      const parsed = signedContract.interface.parseLog(log);
      if (parsed.name === "MetadataUpdate") {
        console.log(`  Event: MetadataUpdate`);
        console.log(`  Token ID: ${Number(parsed.args[0])}`);
        console.log(`  Block: ${receipt.blockNumber}`);
        console.log(`  Tx Hash: ${receipt.hash}`);
        console.log(`\n  This event is PERMANENT on-chain proof that metadata was updated.`);
        console.log(`  Anyone can verify: ${SNOWTRACE_BASE}/tx/${receipt.hash}#eventlog`);
        foundEvent = true;
      }
    } catch { /* not our event */ }
  }
  if (!foundEvent) {
    console.log("  WARNING: MetadataUpdate event not found in receipt!");
  }

  // =========================================================================
  //  STEP 7: AFTER STATE (instant verification)
  // =========================================================================
  divider("STEP 7: AFTER STATE (instant verification)");

  const afterLevel = Number(await contract.getLevel(tokenId));
  console.log(`  On-chain Level (before): ${currentLevel} (${RANK_NAMES[currentLevel]})`);
  console.log(`  On-chain Level (after):  ${afterLevel} (${RANK_NAMES[afterLevel]})`);
  console.log(`  Level changed:           ${currentLevel !== afterLevel ? "YES" : "NO"}`);

  // Fetch updated dynamic metadata
  // Small delay to let the API pick up the on-chain change
  await new Promise((r) => setTimeout(r, 2000));
  try {
    const afterMeta = await fetchDynamicMetadata(tokenId);
    console.log(`\n  Dynamic metadata (AFTER):`);
    console.log(`    Level: ${getAttr(afterMeta.attributes, "Level")}`);
    console.log(`    Rank:  ${getAttr(afterMeta.attributes, "Rank")}`);
    console.log(`    Image: ${afterMeta.image}`);
  } catch (e) {
    console.log(`  Dynamic metadata fetch: ${e.message}`);
  }

  // Update MongoDB to match
  const badge = (RANK_NAMES[newLevel] || "private").toLowerCase().replace(/ /g, "_");
  await ChainboiNft.findOneAndUpdate(
    { tokenId },
    {
      level: newLevel,
      badge,
      ownerAddress: owner.toLowerCase(),
      contractAddress: CONTRACT_ADDRESS.toLowerCase(),
    },
    { upsert: true, new: true }
  );
  console.log(`\n  MongoDB updated: level=${newLevel}, badge=${badge}`);

  // =========================================================================
  //  STEP 8: TRIGGER GLACIER REINDEX
  // =========================================================================
  divider("STEP 8: TRIGGER GLACIER REINDEX");

  try {
    await reindexNftMetadata(CONTRACT_ADDRESS, String(tokenId));
    console.log(`  Glacier reindex triggered for token #${tokenId}`);
    console.log(`  Note: Glacier may take minutes to hours to refresh its cache.`);
  } catch (e) {
    console.log(`  Glacier reindex: ${e.message}`);
    console.log(`  This is normal — Glacier has rate limits/cooldowns.`);
  }

  // =========================================================================
  //  SUMMARY
  // =========================================================================
  divider("DEMO SUMMARY");

  console.log(`  Token #${tokenId} leveled up: ${currentLevel} (${RANK_NAMES[currentLevel]}) -> ${newLevel} (${RANK_NAMES[newLevel]})`);
  console.log(`\n  ON-CHAIN PROOF:`);
  console.log(`  - Transaction:     ${receipt.hash}`);
  console.log(`  - Block:           ${receipt.blockNumber}`);
  console.log(`  - Event:           MetadataUpdate(tokenId=${tokenId})`);
  console.log(`  - Snowtrace tx:    ${SNOWTRACE_BASE}/tx/${receipt.hash}`);
  console.log(`  - Snowtrace logs:  ${SNOWTRACE_BASE}/tx/${receipt.hash}#eventlog`);
  console.log(`\n  VERIFICATION LINKS:`);
  console.log(`  - Dynamic metadata:  ${BASE_URL}/metadata/${tokenId}.json`);
  console.log(`  - Snowtrace NFT:     ${SNOWTRACE_BASE}/nft/${CONTRACT_ADDRESS}/${tokenId}?chainid=${CHAIN_ID}`);
  console.log(`  - Thirdweb:          https://thirdweb.com/avalanche-fuji/${CONTRACT_ADDRESS}`);
  console.log(`  - Glacier API:       https://glacier-api.avax.network/v1/chains/${CHAIN_ID}/nfts/collections/${CONTRACT_ADDRESS}/tokens/${tokenId}`);
  console.log(`\n  FOR THE VIDEO:`);
  console.log(`  1. Open the Snowtrace tx link above -> click "Logs" tab`);
  console.log(`     -> Shows MetadataUpdate event = on-chain proof`);
  console.log(`  2. Open the dynamic metadata URL in browser`);
  console.log(`     -> Shows Level ${newLevel}, Rank "${RANK_NAMES[newLevel]}" = instant update`);
  console.log(`  3. Open Thirdweb dashboard link`);
  console.log(`     -> Visual NFT viewer that reads tokenURI() directly`);

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error("Demo failed:", error.message || error);
  process.exit(1);
});
