/**
 * Send assets to a specified wallet for testing.
 *
 * Sends: 2 ChainBoi NFTs, 1 weapon per category (8 total), 1 AVAX, 1000 BATTLE
 *
 * Usage: node scripts/sendAssetsToWallet.js <address>
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Wallet = require("../models/walletModel");
const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const { sendAvax } = require("../utils/avaxUtils");
const {
  transferNft,
  transferWeaponNft,
  transferBattleTokens,
} = require("../utils/contractUtils");
const { decrypt } = require("../utils/cryptUtils");
const { WEAPON_CATEGORIES } = require("../config/constants");

const TARGET = process.argv[2];
if (!TARGET) {
  console.error("Usage: node scripts/sendAssetsToWallet.js <address>");
  process.exit(1);
}

const main = async function () {
  await connectDB();

  const nftStore = await Wallet.findOne({ role: "nft_store" }).select("+key +iv");
  const weaponStore = await Wallet.findOne({ role: "weapon_store" }).select("+key +iv");
  const rewardsWallet = await Wallet.findOne({ role: "rewards" }).select("+key +iv");

  if (!nftStore || !weaponStore || !rewardsWallet) {
    console.error("Missing required wallets (nft_store, weapon_store, rewards)");
    process.exit(1);
  }

  const nftStoreKey = await decrypt(nftStore.key, nftStore.iv);
  const weaponStoreKey = await decrypt(weaponStore.key, weaponStore.iv);
  const rewardsKey = await decrypt(rewardsWallet.key, rewardsWallet.iv);

  const target = TARGET.toLowerCase();

  // 1. Send 2 ChainBoi NFTs
  console.log("\n=== Sending 2 ChainBoi NFTs ===");
  const availableNfts = await ChainboiNft.find({
    ownerAddress: nftStore.address.toLowerCase(),
  }).sort({ tokenId: 1 }).limit(2);

  for (const nft of availableNfts) {
    try {
      console.log(`  Transferring ChainBoi #${nft.tokenId}...`);
      const receipt = await transferNft(nftStore.address, target, nft.tokenId, nftStoreKey);
      await ChainboiNft.findByIdAndUpdate(nft._id, { ownerAddress: target });
      console.log(`  ✓ ChainBoi #${nft.tokenId} sent (tx: ${receipt.hash})`);
    } catch (e) {
      console.error(`  ✗ ChainBoi #${nft.tokenId} failed: ${e.message}`);
    }
  }

  // 2. Send 1 weapon from each category (8 categories)
  console.log("\n=== Sending 1 Weapon per Category ===");
  for (const category of WEAPON_CATEGORIES) {
    const weapon = await WeaponNft.findOne({
      category,
      ownerAddress: weaponStore.address.toLowerCase(),
    });
    if (!weapon) {
      console.log(`  - No ${category} weapon available, skipping`);
      continue;
    }
    try {
      console.log(`  Transferring ${weapon.weaponName} (${category}, token #${weapon.tokenId})...`);
      const receipt = await transferWeaponNft(weaponStore.address, target, weapon.tokenId, weaponStoreKey);
      await WeaponNft.findByIdAndUpdate(weapon._id, { ownerAddress: target });
      console.log(`  ✓ ${weapon.weaponName} sent (tx: ${receipt.hash})`);
    } catch (e) {
      console.error(`  ✗ ${weapon.weaponName} failed: ${e.message}`);
    }
  }

  // 3. Send 1 AVAX (from deployer — has the gas)
  console.log("\n=== Sending 1 AVAX ===");
  try {
    const receipt = await sendAvax(process.env.DEPLOYER_PRIVATE_KEY, target, "1");
    console.log(`  ✓ 1 AVAX sent (tx: ${receipt.hash})`);
  } catch (e) {
    console.error(`  ✗ AVAX send failed: ${e.message}`);
  }

  // 4. Send 1000 BATTLE tokens
  console.log("\n=== Sending 1000 BATTLE ===");
  try {
    const receipt = await transferBattleTokens(target, "1000", rewardsKey);
    console.log(`  ✓ 1000 BATTLE sent (tx: ${receipt.hash})`);
  } catch (e) {
    console.error(`  ✗ BATTLE send failed: ${e.message}`);
  }

  console.log("\n=== Done ===");
  await mongoose.disconnect();
};

main().catch((e) => {
  console.error("Script failed:", e);
  process.exit(1);
});
