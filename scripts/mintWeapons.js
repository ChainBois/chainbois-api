/**
 * Batch mint Weapon NFTs to weapon_store wallet.
 *
 * Usage:
 *   node scripts/mintWeapons.js
 *
 * Reads weapon names from IPFS deployment info or build/weapons/ directory.
 *
 * Requires:
 *   - Deployed WeaponNFT contract (WEAPON_NFT_ADDRESS in .env)
 *   - Platform wallets in DB (deployer, weapon_store)
 *   - Deployer funded with AVAX
 *   - Weapon images uploaded to IPFS (optional)
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
const { getWeaponTotalSupply, getWeaponNftContract } = require("../utils/contractUtils");

const SESSION_FILE = path.join(__dirname, "..", "deployments", "mint-session-weapons.json");

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

const getWeaponNames = function () {
  // Try IPFS deployment info first
  const network = process.env.AVAX_CHAIN_ID === "43114" ? "mainnet" : "fuji";
  const ipfsPath = path.join(__dirname, "..", "deployments", `${network}-ipfs-weapons.json`);
  if (fs.existsSync(ipfsPath)) {
    const info = JSON.parse(fs.readFileSync(ipfsPath, "utf8"));
    if (info.weaponNames && info.weaponNames.length > 0) {
      return info.weaponNames;
    }
  }

  // Fallback: read from build/weapons/images/
  const imagesDir = path.join(__dirname, "..", "build", "weapons", "images");
  if (fs.existsSync(imagesDir)) {
    return fs.readdirSync(imagesDir)
      .filter((f) => /\.(png|jpg|jpeg|gif|webp)$/i.test(f))
      .map((f) => path.basename(f, path.extname(f)));
  }

  console.error("No weapon names found. Upload weapons to IPFS first or provide weapon images.");
  process.exit(1);
};

const main = async function () {
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

  const weaponStoreWallet = await Wallet.findOne({ role: "weapon_store" });
  if (!weaponStoreWallet) { console.error("weapon_store wallet not found"); process.exit(1); }

  const weaponNames = getWeaponNames();
  console.log(`Deployer: ${deployerWallet.address}`);
  console.log(`Weapon Store: ${weaponStoreWallet.address}`);
  console.log(`Weapons to mint: ${weaponNames.length}\n`);
  weaponNames.forEach((n, i) => console.log(`  ${i + 1}. ${n}`));

  // Check current supply
  const currentSupply = await getWeaponTotalSupply();
  console.log(`\nCurrent supply on-chain: ${currentSupply}`);

  if (currentSupply >= weaponNames.length) {
    console.log("All weapons already minted. Nothing to do.");
    await mongoose.disconnect();
    return;
  }

  const remaining = weaponNames.length - currentSupply;
  console.log(`Remaining to mint: ${remaining}\n`);

  // Set up signer
  const provider = getProvider();
  const signer = new ethers.Wallet(deployerKey, provider);
  let currentNonce = await provider.getTransactionCount(signer.address);

  const contract = new ethers.Contract(
    process.env.WEAPON_NFT_ADDRESS,
    require("../abis/WeaponNFT.json").abi,
    signer
  );

  // Set baseURI if IPFS info exists
  const network = process.env.AVAX_CHAIN_ID === "43114" ? "mainnet" : "fuji";
  const ipfsPath = path.join(__dirname, "..", "deployments", `${network}-ipfs-weapons.json`);
  if (fs.existsSync(ipfsPath)) {
    const ipfsInfo = JSON.parse(fs.readFileSync(ipfsPath, "utf8"));
    console.log(`Setting baseURI to ${ipfsInfo.baseUri}...`);
    try {
      const tx = await contract.setBaseURI(ipfsInfo.baseUri, { nonce: currentNonce++ });
      await tx.wait();
      console.log("BaseURI set successfully.\n");
    } catch (err) {
      console.error(`Failed to set baseURI: ${err.message}`);
    }
  }

  // Load or create session
  let session = loadSession();
  if (!session || session.status === "completed") {
    session = {
      status: "in_progress",
      totalTarget: weaponNames.length,
      completed: [],
      failed: [],
      lastUpdate: new Date().toISOString(),
    };
  }

  // Mint weapons
  let minted = 0;
  for (let i = currentSupply; i < weaponNames.length; i++) {
    const weaponName = weaponNames[i];
    const expectedTokenId = i + 1;

    try {
      const tx = await contract.mint(weaponStoreWallet.address, weaponName, { nonce: currentNonce++ });
      const receipt = await tx.wait();

      session.completed.push({
        tokenId: expectedTokenId,
        weaponName,
        txHash: receipt.hash,
        mintedAt: new Date().toISOString(),
      });
      minted++;
      console.log(`Minted #${expectedTokenId} "${weaponName}" tx: ${receipt.hash}`);

      session.lastUpdate = new Date().toISOString();
      saveSession(session);
    } catch (err) {
      console.error(`Failed to mint #${expectedTokenId} "${weaponName}": ${err.message}`);
      session.failed.push({
        tokenId: expectedTokenId,
        weaponName,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      saveSession(session);
    }
  }

  const finalSupply = await getWeaponTotalSupply();
  session.status = finalSupply >= weaponNames.length ? "completed" : "in_progress";
  saveSession(session);

  console.log(`\n========================================`);
  console.log(`Weapon Minting Complete`);
  console.log(`========================================`);
  console.log(`  Target:    ${weaponNames.length}`);
  console.log(`  On-chain:  ${finalSupply}`);
  console.log(`  Minted:    ${minted}`);
  console.log(`  Failed:    ${session.failed.length}`);

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error("Minting failed:", error);
  process.exit(1);
});
