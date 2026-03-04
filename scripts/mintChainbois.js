/**
 * Batch mint ChainBoi NFTs to nft_store wallet.
 *
 * Usage:
 *   node scripts/mintChainbois.js [count]
 *
 * Example:
 *   node scripts/mintChainbois.js 20        # testnet
 *   node scripts/mintChainbois.js 4032      # mainnet
 *
 * Requires:
 *   - Deployed ChainBoisNFT contract (CHAINBOIS_NFT_ADDRESS in .env)
 *   - Platform wallets in DB (deployer, nft_store)
 *   - Deployer funded with AVAX
 *   - IPFS metadata uploaded (optional but recommended - sets baseURI)
 */
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const Wallet = require("../models/walletModel");
const { getProvider, getAvaxBalance } = require("../utils/avaxUtils");
const { decrypt, validateCryptoEnv } = require("../utils/cryptUtils");
const { getChainboisTotalSupply, getChainboisNftContract } = require("../utils/contractUtils");

const BATCH_SIZE = 20;
const BATCH_PAUSE_MS = 3000;
const SESSION_FILE = path.join(__dirname, "..", "deployments", "mint-session-chainbois.json");

const loadSession = function () {
  if (fs.existsSync(SESSION_FILE)) {
    return JSON.parse(fs.readFileSync(SESSION_FILE, "utf8"));
  }
  return null;
};

const saveSession = function (session) {
  const dir = path.dirname(SESSION_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async function () {
  const targetCount = parseInt(process.argv[2]) || 20;
  validateCryptoEnv();

  const dbUri = process.env.NETWORK === "prod"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI;

  await mongoose.connect(dbUri);
  console.log("Connected to MongoDB");

  // Load wallets
  const deployerWallet = await Wallet.findOne({ role: "deployer" }).select("+key +iv");
  if (!deployerWallet) { console.error("Deployer wallet not found"); process.exit(1); }
  const deployerKey = await decrypt(deployerWallet.key, deployerWallet.iv);

  const nftStoreWallet = await Wallet.findOne({ role: "nft_store" });
  if (!nftStoreWallet) { console.error("nft_store wallet not found"); process.exit(1); }

  console.log(`Deployer: ${deployerWallet.address}`);
  console.log(`NFT Store: ${nftStoreWallet.address}`);
  console.log(`Target: ${targetCount} NFTs\n`);

  // Check balance
  const balance = await getAvaxBalance(deployerWallet.address);
  console.log(`Deployer AVAX balance: ${balance}`);

  // Check current supply
  const currentSupply = await getChainboisTotalSupply();
  console.log(`Current supply on-chain: ${currentSupply}`);

  const remaining = targetCount - currentSupply;
  if (remaining <= 0) {
    console.log(`Already minted ${currentSupply} >= ${targetCount}. Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  console.log(`Remaining to mint: ${remaining}\n`);

  // Load or create session
  let session = loadSession();
  if (!session || session.status === "completed") {
    session = {
      status: "in_progress",
      totalTarget: targetCount,
      completed: [],
      failed: [],
      currentBatch: 1,
      lastUpdate: new Date().toISOString(),
    };
  }

  // Set up signer with NonceManager
  const provider = getProvider();
  const signer = new ethers.Wallet(deployerKey, provider);
  const nonce = await provider.getTransactionCount(signer.address);
  let currentNonce = nonce;

  const contract = new ethers.Contract(
    process.env.CHAINBOIS_NFT_ADDRESS,
    require("../abis/ChainBoisNFT.json").abi,
    signer
  );

  // Set baseURI if IPFS info exists
  const network = process.env.AVAX_CHAIN_ID === "43114" ? "mainnet" : "fuji";
  const ipfsPath = path.join(__dirname, "..", "deployments", `${network}-ipfs-chainbois.json`);
  if (fs.existsSync(ipfsPath)) {
    const ipfsInfo = JSON.parse(fs.readFileSync(ipfsPath, "utf8"));
    console.log(`Setting baseURI to ${ipfsInfo.baseUri}...`);
    try {
      const tx = await contract.setBaseURI(ipfsInfo.baseUri, { nonce: currentNonce++ });
      await tx.wait();
      console.log("BaseURI set successfully.\n");
    } catch (err) {
      if (err.message.includes("already known")) {
        console.log("BaseURI already set, continuing.\n");
      } else {
        console.error(`Failed to set baseURI: ${err.message}`);
      }
    }
  }

  // Mint loop
  let minted = 0;
  const completedTokenIds = new Set(session.completed.map((c) => c.tokenId));

  for (let i = 0; i < remaining; i++) {
    const expectedTokenId = currentSupply + i + 1;

    if (completedTokenIds.has(expectedTokenId)) {
      console.log(`Token #${expectedTokenId} already in session, skipping.`);
      continue;
    }

    try {
      const tx = await contract.mint(nftStoreWallet.address, { nonce: currentNonce++ });
      const receipt = await tx.wait();

      // Parse Transfer event to get actual tokenId
      const transferEvent = receipt.logs.find((log) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed && parsed.name === "Transfer";
        } catch { return false; }
      });

      let actualTokenId = expectedTokenId;
      if (transferEvent) {
        const parsed = contract.interface.parseLog(transferEvent);
        actualTokenId = Number(parsed.args.tokenId);
      }

      session.completed.push({
        tokenId: actualTokenId,
        txHash: receipt.hash,
        mintedAt: new Date().toISOString(),
      });
      minted++;

      if (minted % 5 === 0 || minted === remaining) {
        console.log(`Minted #${actualTokenId} (${minted}/${remaining}) tx: ${receipt.hash}`);
      }

      // Save progress after each mint
      session.lastUpdate = new Date().toISOString();
      saveSession(session);

      // Pause between batches
      if (minted % BATCH_SIZE === 0 && minted < remaining) {
        console.log(`Batch ${session.currentBatch} complete. Pausing ${BATCH_PAUSE_MS / 1000}s...`);
        session.currentBatch++;
        await sleep(BATCH_PAUSE_MS);
      }
    } catch (err) {
      console.error(`Failed to mint #${expectedTokenId}: ${err.message}`);
      session.failed.push({
        tokenId: expectedTokenId,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      saveSession(session);
      // Continue with next - don't abort the whole job
    }
  }

  // Retry failed mints
  if (session.failed.length > 0) {
    console.log(`\nRetrying ${session.failed.length} failed mints...`);
    const failedCopy = [...session.failed];
    session.failed = [];

    for (const failed of failedCopy) {
      try {
        const tx = await contract.mint(nftStoreWallet.address, { nonce: currentNonce++ });
        const receipt = await tx.wait();
        session.completed.push({
          tokenId: failed.tokenId,
          txHash: receipt.hash,
          mintedAt: new Date().toISOString(),
        });
        console.log(`Retry success: #${failed.tokenId}`);
      } catch (err) {
        session.failed.push(failed);
        console.error(`Retry failed: #${failed.tokenId}: ${err.message}`);
      }
    }
  }

  // Final verification
  const finalSupply = await getChainboisTotalSupply();
  session.status = finalSupply >= targetCount ? "completed" : "in_progress";
  session.lastUpdate = new Date().toISOString();
  saveSession(session);

  console.log(`\n========================================`);
  console.log(`Minting Complete`);
  console.log(`========================================`);
  console.log(`  Target:    ${targetCount}`);
  console.log(`  On-chain:  ${finalSupply}`);
  console.log(`  Minted:    ${minted}`);
  console.log(`  Failed:    ${session.failed.length}`);
  console.log(`  Status:    ${session.status}`);
  console.log(`  Session:   ${SESSION_FILE}`);

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error("Minting failed:", error);
  process.exit(1);
});
