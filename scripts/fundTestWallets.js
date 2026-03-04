/**
 * Create test user wallets, fund them with AVAX + $BATTLE, and transfer NFTs.
 *
 * Usage:
 *   node scripts/fundTestWallets.js
 *
 * Requires:
 *   - Deployed contracts (BATTLE_TOKEN_ADDRESS, CHAINBOIS_NFT_ADDRESS, WEAPON_NFT_ADDRESS)
 *   - Platform wallets in DB (deployer, nft_store, weapon_store)
 *   - Deployer wallet funded with AVAX
 *   - NFTs already minted to nft_store and weapon_store
 */
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const { ethers } = require("ethers");
const Wallet = require("../models/walletModel");
const { createWallet, sendAvax, getAvaxBalance } = require("../utils/avaxUtils");
const { encrypt, decrypt, validateCryptoEnv } = require("../utils/cryptUtils");
const {
  mintBattleTokens,
  transferNft,
  transferWeaponNft,
  getChainboisTotalSupply,
  getWeaponTotalSupply,
  getBattleBalance,
} = require("../utils/contractUtils");

const TEST_WALLETS = ["test_user_1", "test_user_2", "test_user_3"];
const AVAX_PER_WALLET = "1";
const BATTLE_PER_WALLET = "100";

const getDecryptedKey = async function (role) {
  const wallet = await Wallet.findOne({ role }).select("+key +iv");
  if (!wallet) throw new Error(`Wallet with role '${role}' not found in DB`);
  const privateKey = await decrypt(wallet.key, wallet.iv);
  return { address: wallet.address, privateKey };
};

const main = async function () {
  validateCryptoEnv();

  const dbUri = process.env.NETWORK === "prod"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI;

  await mongoose.connect(dbUri);
  console.log("Connected to MongoDB\n");

  // Load platform wallets
  const deployer = await getDecryptedKey("deployer");
  console.log(`Deployer: ${deployer.address}`);

  const deployerBalance = await getAvaxBalance(deployer.address);
  console.log(`Deployer AVAX balance: ${deployerBalance}\n`);

  const minRequired = parseFloat(AVAX_PER_WALLET) * TEST_WALLETS.length + 0.1;
  if (parseFloat(deployerBalance) < minRequired) {
    console.error(`Deployer needs at least ${minRequired} AVAX. Current: ${deployerBalance}`);
    process.exit(1);
  }

  // Create or load test wallets
  const testWallets = [];
  const existingTestWallets = await Wallet.find({ role: "test" }).sort({ createdAt: 1 });

  for (let idx = 0; idx < TEST_WALLETS.length; idx++) {
    const name = TEST_WALLETS[idx];

    if (existingTestWallets[idx]) {
      const w = await Wallet.findById(existingTestWallets[idx]._id).select("+key +iv");
      const key = await decrypt(w.key, w.iv);
      console.log(`[${name}] Already exists: ${w.address}`);
      testWallets.push({ name, address: w.address, privateKey: key });
      continue;
    }

    const wallet = createWallet();
    const encrypted = await encrypt(wallet.privateKey);
    await Wallet.create({
      address: wallet.address,
      key: encrypted.data,
      iv: encrypted.iv,
      role: "test",
    });
    console.log(`[${name}] Created: ${wallet.address}`);
    testWallets.push({ name, address: wallet.address, privateKey: wallet.privateKey });
  }

  // Fund with AVAX
  console.log("\n--- Funding with AVAX ---");
  for (const tw of testWallets) {
    const balance = await getAvaxBalance(tw.address);
    if (parseFloat(balance) >= parseFloat(AVAX_PER_WALLET) * 0.5) {
      console.log(`[${tw.name}] Already has ${balance} AVAX, skipping`);
      continue;
    }
    console.log(`[${tw.name}] Sending ${AVAX_PER_WALLET} AVAX...`);
    await sendAvax(deployer.privateKey, tw.address, AVAX_PER_WALLET);
    console.log(`[${tw.name}] Funded with ${AVAX_PER_WALLET} AVAX`);
  }

  // Mint $BATTLE tokens
  console.log("\n--- Minting $BATTLE tokens ---");
  for (const tw of testWallets) {
    const balance = await getBattleBalance(tw.address);
    if (parseFloat(balance) >= parseFloat(BATTLE_PER_WALLET) * 0.5) {
      console.log(`[${tw.name}] Already has ${balance} $BATTLE, skipping`);
      continue;
    }
    console.log(`[${tw.name}] Minting ${BATTLE_PER_WALLET} $BATTLE...`);
    await mintBattleTokens(tw.address, BATTLE_PER_WALLET, deployer.privateKey);
    console.log(`[${tw.name}] Minted ${BATTLE_PER_WALLET} $BATTLE`);
  }

  // Transfer 1 ChainBoi NFT to test_user_1
  console.log("\n--- Transferring NFTs ---");
  const nftStore = await getDecryptedKey("nft_store");
  const nftSupply = await getChainboisTotalSupply();

  if (nftSupply > 0) {
    // Transfer tokenId 1 to test_user_1
    const targetUser = testWallets[0];
    console.log(`Transferring ChainBoi NFT #1 to ${targetUser.name} (${targetUser.address})...`);
    try {
      await transferNft(nftStore.address, targetUser.address, 1, nftStore.privateKey);
      console.log(`ChainBoi NFT #1 transferred to ${targetUser.name}`);
    } catch (err) {
      if (err.message.includes("caller is not token owner")) {
        console.log("ChainBoi NFT #1 already transferred (not owned by nft_store)");
      } else {
        console.error(`Failed to transfer ChainBoi NFT: ${err.message}`);
      }
    }
  } else {
    console.log("No ChainBoi NFTs minted yet. Run mintChainbois.js first.");
  }

  // Transfer 1 Weapon NFT to test_user_1
  const weaponStore = await getDecryptedKey("weapon_store");
  const weaponSupply = await getWeaponTotalSupply();

  if (weaponSupply > 0) {
    const targetUser = testWallets[0];
    console.log(`Transferring Weapon NFT #1 to ${targetUser.name} (${targetUser.address})...`);
    try {
      await transferWeaponNft(weaponStore.address, targetUser.address, 1, weaponStore.privateKey);
      console.log(`Weapon NFT #1 transferred to ${targetUser.name}`);
    } catch (err) {
      if (err.message.includes("caller is not token owner")) {
        console.log("Weapon NFT #1 already transferred (not owned by weapon_store)");
      } else {
        console.error(`Failed to transfer Weapon NFT: ${err.message}`);
      }
    }
  } else {
    console.log("No Weapon NFTs minted yet. Run mintWeapons.js first.");
  }

  // Summary
  console.log("\n========================================");
  console.log("Test Wallet Summary");
  console.log("========================================");
  for (const tw of testWallets) {
    const avax = await getAvaxBalance(tw.address);
    const battle = await getBattleBalance(tw.address);
    console.log(`  ${tw.name.padEnd(15)} ${tw.address}`);
    console.log(`  ${"".padEnd(15)} AVAX: ${avax}, $BATTLE: ${battle}`);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
};

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
