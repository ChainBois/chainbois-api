require("dotenv").config();

const mongoose = require("mongoose");
const { ethers } = require("ethers");
const connectDB = require("../config/db");
const Wallet = require("../models/walletModel");
const avaxUtils = require("../utils/avaxUtils");
const contractUtils = require("../utils/contractUtils");

const main = async function () {
  await connectDB();

  console.log("\n=== 1. ALL WALLETS ===");
  const wallets = await Wallet.find({}).select("role address balance");
  for (const w of wallets) {
    console.log(`  [${w.role}] ${w.address} (cached balance: ${w.balance})`);
  }

  // Build a lookup by role
  const byRole = {};
  for (const w of wallets) {
    byRole[w.role] = w.address;
  }

  console.log("\n=== 2. DEPLOYER WALLET - AVAX BALANCE ===");
  if (byRole.deployer) {
    const avaxBal = await avaxUtils.getAvaxBalance(byRole.deployer);
    console.log(`  Deployer (${byRole.deployer}): ${avaxBal} AVAX`);
  } else {
    console.log("  No deployer wallet found");
  }

  console.log("\n=== 3. REWARDS WALLET - BATTLE BALANCE ===");
  if (byRole.rewards) {
    const battleBal = await contractUtils.getBattleBalance(byRole.rewards);
    console.log(`  Rewards (${byRole.rewards}): ${battleBal} BATTLE`);
  } else {
    console.log("  No rewards wallet found");
  }

  console.log("\n=== 4. NFT_STORE WALLET - BATTLE + AVAX BALANCES ===");
  if (byRole.nft_store) {
    const avaxBal = await avaxUtils.getAvaxBalance(byRole.nft_store);
    const battleBal = await contractUtils.getBattleBalance(byRole.nft_store);
    console.log(`  NFT Store (${byRole.nft_store}):`);
    console.log(`    AVAX:   ${avaxBal}`);
    console.log(`    BATTLE: ${battleBal}`);
  } else {
    console.log("  No nft_store wallet found");
  }

  console.log("\n=== 5. WEAPON_STORE WALLET - BATTLE + AVAX BALANCES ===");
  if (byRole.weapon_store) {
    const avaxBal = await avaxUtils.getAvaxBalance(byRole.weapon_store);
    const battleBal = await contractUtils.getBattleBalance(byRole.weapon_store);
    console.log(`  Weapon Store (${byRole.weapon_store}):`);
    console.log(`    AVAX:   ${avaxBal}`);
    console.log(`    BATTLE: ${battleBal}`);
  } else {
    console.log("  No weapon_store wallet found");
  }

  console.log("\n=== 6. BATTLE TOKEN TOTAL SUPPLY ===");
  const contract = contractUtils.getBattleTokenContract();
  const supply = await contract.totalSupply();
  console.log("  Total BATTLE supply:", ethers.formatEther(supply));

  console.log("\n=== 7. CHAINBOIS NFT TOTAL SUPPLY ===");
  const cbSupply = await contractUtils.getChainboisTotalSupply();
  console.log("  ChainBois NFTs minted:", cbSupply);

  console.log("\n=== 8. WEAPON NFT TOTAL SUPPLY ===");
  const wpnSupply = await contractUtils.getWeaponTotalSupply();
  console.log("  Weapon NFTs minted:", wpnSupply);

  console.log("\n=== 9. CHAINBOI NFT OWNERSHIP BREAKDOWN ===");
  const nftStoreAddr = byRole.nft_store ? byRole.nft_store.toLowerCase() : null;
  let cbStoreCount = 0;
  let cbOtherCount = 0;
  const cbOtherOwners = {};
  for (let i = 1; i <= cbSupply; i++) {
    try {
      const owner = await contractUtils.getNftOwner(i);
      const ownerLower = owner.toLowerCase();
      if (nftStoreAddr && ownerLower === nftStoreAddr) {
        cbStoreCount++;
      } else {
        cbOtherCount++;
        cbOtherOwners[ownerLower] = (cbOtherOwners[ownerLower] || 0) + 1;
      }
    } catch (err) {
      console.log(`  Token #${i}: error - ${err.message}`);
    }
  }
  console.log(`  Owned by nft_store: ${cbStoreCount}`);
  console.log(`  Owned by others:    ${cbOtherCount}`);
  if (Object.keys(cbOtherOwners).length > 0) {
    for (const [addr, count] of Object.entries(cbOtherOwners)) {
      // Check if this address matches any known wallet role
      const matchedRole = wallets.find((w) => w.address.toLowerCase() === addr);
      const label = matchedRole ? ` (${matchedRole.role})` : "";
      console.log(`    ${addr}${label}: ${count} NFTs`);
    }
  }

  console.log("\n=== 10. WEAPON NFT OWNERSHIP BREAKDOWN ===");
  const wpnStoreAddr = byRole.weapon_store ? byRole.weapon_store.toLowerCase() : null;
  let wpnStoreCount = 0;
  let wpnOtherCount = 0;
  const wpnOtherOwners = {};
  for (let i = 1; i <= wpnSupply; i++) {
    try {
      const owner = await contractUtils.getWeaponNftOwner(i);
      const ownerLower = owner.toLowerCase();
      if (wpnStoreAddr && ownerLower === wpnStoreAddr) {
        wpnStoreCount++;
      } else {
        wpnOtherCount++;
        wpnOtherOwners[ownerLower] = (wpnOtherOwners[ownerLower] || 0) + 1;
      }
    } catch (err) {
      console.log(`  Weapon #${i}: error - ${err.message}`);
    }
  }
  console.log(`  Owned by weapon_store: ${wpnStoreCount}`);
  console.log(`  Owned by others:       ${wpnOtherCount}`);
  if (Object.keys(wpnOtherOwners).length > 0) {
    for (const [addr, count] of Object.entries(wpnOtherOwners)) {
      const matchedRole = wallets.find((w) => w.address.toLowerCase() === addr);
      const label = matchedRole ? ` (${matchedRole.role})` : "";
      console.log(`    ${addr}${label}: ${count} Weapon NFTs`);
    }
  }

  console.log("\n=== DONE ===\n");
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error("FATAL:", err);
  mongoose.disconnect().then(() => process.exit(1));
});
