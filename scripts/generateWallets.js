/**
 * Generate platform wallets, encrypt keys, and save to MongoDB.
 *
 * Usage:
 *   node scripts/generateWallets.js
 *
 * Requires: MONGODB_URI, KEY, ALGORITHM in .env
 * Idempotent: skips wallets that already exist.
 */
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const Wallet = require("../models/walletModel");
const { createWallet } = require("../utils/avaxUtils");
const { encrypt, validateCryptoEnv } = require("../utils/cryptUtils");

const PLATFORM_WALLETS = [
  { role: "deployer" },
  { role: "nft_store" },
  { role: "weapon_store" },
  { role: "prize_pool" },
];

const main = async function () {
  validateCryptoEnv();

  const dbUri = process.env.NETWORK === "prod"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI;

  if (!dbUri) {
    console.error("MONGODB_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(dbUri);
  console.log("Connected to MongoDB\n");

  const results = [];

  for (const { role } of PLATFORM_WALLETS) {
    // Check if wallet already exists
    const existing = await Wallet.findOne({ role });
    if (existing) {
      console.log(`[${role}] Already exists: ${existing.address}`);
      results.push({ role, address: existing.address, status: "existing" });
      continue;
    }

    // Generate new wallet
    const wallet = createWallet();
    const encrypted = await encrypt(wallet.privateKey);

    await Wallet.create({
      address: wallet.address,
      key: encrypted.data,
      iv: encrypted.iv,
      role,
    });

    console.log(`[${role}] Created: ${wallet.address}`);
    results.push({ role, address: wallet.address, status: "created" });

    // Print deployer private key ONCE for Hardhat config
    if (role === "deployer") {
      console.log("\n  *** IMPORTANT: Copy this deployer private key to your .env ***");
      console.log(`  DEPLOYER_PRIVATE_KEY=${wallet.privateKey}`);
      console.log("  *** This is the only time this key will be displayed ***\n");
    }
  }

  console.log("\n========================================");
  console.log("Platform Wallet Summary");
  console.log("========================================");
  for (const { role, address, status } of results) {
    console.log(`  ${role.padEnd(15)} ${address} (${status})`);
  }

  console.log("\nNext steps:");
  console.log("  1. Copy DEPLOYER_PRIVATE_KEY to your .env (if newly created)");
  console.log("  2. Fund the deployer wallet with testnet AVAX:");
  console.log("     https://faucet.avax.network/");
  console.log("  3. Run: npx hardhat run scripts/deploy.js --network fuji");

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
