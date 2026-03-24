const { ethers } = require("ethers");
const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const Wallet = require("../models/walletModel");
const {
  mintChainboiNft,
  mintWeaponNft,
  getChainboisTotalSupply,
  getWeaponTotalSupply,
  CHAINBOIS_NFT_ABI,
  WEAPON_NFT_ABI,
} = require("../utils/contractUtils");
const { decrypt } = require("../utils/cryptUtils");
const { sendDiscordAlert } = require("../utils/discordService");
const {
  WALLET_ROLES,
  WALLET_HEALTH,
  WEAPON_CATEGORIES,
  WEAPON_DEFINITIONS,
  getChainBoiImageUri,
  getWeaponImageUri,
} = require("../config/constants");

const MINT_DELAY_MS = 3000;

let isRunning = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Parse tokenId from a mint receipt's Transfer event.
 */
const getTokenIdFromReceipt = function (receipt, abi) {
  const iface = new ethers.Interface(abi);
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog({ topics: log.topics, data: log.data });
      if (parsed && parsed.name === "Transfer") {
        return Number(parsed.args.tokenId);
      }
    } catch {
      // Not a matching event, skip
    }
  }
  return null;
};

/**
 * Auto-replenish NFT and weapon inventory when store wallets run low.
 * Runs every 30 minutes. Mints new tokens from the deployer wallet
 * to the nft_store / weapon_store wallets.
 *
 * Thresholds from WALLET_HEALTH config:
 * - NFTs: mint when count < warning threshold (5)
 * - Weapons: mint when any category count < warning threshold (2)
 */
const inventoryReplenishJob = async function () {
  if (isRunning) {
    console.log("[Replenish] Skipping — previous run still active");
    return;
  }
  isRunning = true;

  try {
    const deployerWallet = await Wallet.findOne({ role: WALLET_ROLES.DEPLOYER }).select("+key +iv");
    if (!deployerWallet) {
      console.error("[Replenish] Deployer wallet not found");
      return;
    }

    const deployerKey = await decrypt(deployerWallet.key, deployerWallet.iv);

    await replenishNfts(deployerKey);
    await replenishWeapons(deployerKey);
  } catch (error) {
    console.error("[Replenish] Job error:", error.message);
  } finally {
    isRunning = false;
  }
};

/**
 * Mint ChainBoi NFTs to nft_store if inventory is below warning threshold.
 */
const replenishNfts = async function (deployerKey) {
  const nftStore = await Wallet.findOne({ role: WALLET_ROLES.NFT_STORE }).lean();
  if (!nftStore) return;

  const storeAddress = nftStore.address.toLowerCase();
  const count = await ChainboiNft.countDocuments({ ownerAddress: storeAddress });
  const threshold = WALLET_HEALTH.NFT_THRESHOLDS.warning;

  if (count >= threshold) {
    return;
  }

  const toMint = threshold - count;
  console.log(`[Replenish] NFT inventory low (${count}/${threshold}). Minting ${toMint} ChainBois...`);

  const nftContractAddr = (process.env.CHAINBOIS_NFT_ADDRESS || "").toLowerCase();
  let minted = 0;

  for (let i = 0; i < toMint; i++) {
    try {
      const receipt = await mintChainboiNft(nftStore.address, deployerKey);

      // Extract tokenId from Transfer event in receipt (safe against race conditions)
      let tokenId = getTokenIdFromReceipt(receipt, CHAINBOIS_NFT_ABI);
      // Fallback to totalSupply if event parsing fails
      if (tokenId === null) {
        try {
          tokenId = await getChainboisTotalSupply();
        } catch { /* ignore */ }
      }

      if (tokenId !== null) {
        await ChainboiNft.create({
          tokenId,
          contractAddress: nftContractAddr,
          ownerAddress: storeAddress,
          imageUri: getChainBoiImageUri(tokenId),
          metadataUri: `${process.env.API_BASE_URL || "https://test-2.ghettopigeon.com"}/api/v1/metadata/${tokenId}.json`,
        });
      }

      minted++;
      console.log(`[Replenish] Minted ChainBoi #${tokenId} (${minted}/${toMint})`);

      // Pause between mints to avoid nonce issues
      if (i < toMint - 1) {
        await sleep(MINT_DELAY_MS);
      }
    } catch (e) {
      console.error(`[Replenish] Failed to mint ChainBoi ${i + 1}/${toMint}:`, e.message);
      break; // Stop on error (likely gas/nonce issue)
    }
  }

  if (minted > 0) {
    console.log(`[Replenish] Minted ${minted} ChainBoi NFTs to nft_store`);
    try {
      await sendDiscordAlert({
        subject: "Inventory Replenishment",
        status: "warning",
        poolType: "NFT Store",
        walletAddress: nftStore.address,
        currentBalance: count + minted,
        requiredAmount: threshold,
        unitName: `ChainBoi NFTs (minted ${minted})`,
      });
    } catch (e) {
      console.error("[Replenish] Discord alert failed:", e.message);
    }
  }
};

/**
 * Mint weapons to weapon_store for any category below warning threshold.
 * Picks one random weapon per category that needs replenishment.
 */
const replenishWeapons = async function (deployerKey) {
  const weaponStore = await Wallet.findOne({ role: WALLET_ROLES.WEAPON_STORE }).lean();
  if (!weaponStore) return;

  const storeAddress = weaponStore.address.toLowerCase();
  const weaponContractAddr = (process.env.WEAPON_NFT_ADDRESS || "").toLowerCase();
  const threshold = WALLET_HEALTH.WEAPON_CATEGORY_THRESHOLDS.warning;

  // Count weapons per category in store
  const inventory = await WeaponNft.aggregate([
    { $match: { ownerAddress: storeAddress } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const categoryMap = {};
  for (const item of inventory) {
    categoryMap[item._id] = item.count;
  }

  // Find categories below threshold
  const needsMint = [];
  for (const category of WEAPON_CATEGORIES) {
    const current = categoryMap[category] || 0;
    if (current < threshold) {
      const toMint = threshold - current;
      for (let i = 0; i < toMint; i++) {
        // Pick a random weapon from this category
        const matching = WEAPON_DEFINITIONS.filter((w) => w.category === category);
        if (matching.length > 0) {
          const idx = Math.floor(Math.random() * matching.length);
          needsMint.push({ category, weaponDef: matching[idx], current });
        }
      }
    }
  }

  if (needsMint.length === 0) return;

  console.log(`[Replenish] ${needsMint.length} weapons to mint across low categories...`);
  let minted = 0;

  for (const { category, weaponDef } of needsMint) {
    try {
      const receipt = await mintWeaponNft(weaponStore.address, weaponDef.name, deployerKey);

      // Extract tokenId from Transfer event in receipt (safe against race conditions)
      let tokenId = getTokenIdFromReceipt(receipt, WEAPON_NFT_ABI);
      // Fallback to totalSupply if event parsing fails
      if (tokenId === null) {
        try {
          tokenId = await getWeaponTotalSupply();
        } catch { /* ignore */ }
      }

      if (tokenId !== null) {
        await WeaponNft.create({
          tokenId,
          contractAddress: weaponContractAddr,
          ownerAddress: storeAddress,
          weaponName: weaponDef.name,
          category: weaponDef.category,
          price: weaponDef.price || 20,
          supply: 1,
          imageUri: getWeaponImageUri(weaponDef.name),
        });
      }

      minted++;
      console.log(`[Replenish] Minted ${weaponDef.name} (${category}) #${tokenId}`);

      // Pause between mints
      await sleep(MINT_DELAY_MS);
    } catch (e) {
      console.error(`[Replenish] Failed to mint ${weaponDef.name} (${category}):`, e.message);
      break; // Stop on error
    }
  }

  if (minted > 0) {
    console.log(`[Replenish] Minted ${minted} weapons to weapon_store`);
    try {
      await sendDiscordAlert({
        subject: "Inventory Replenishment",
        status: "warning",
        poolType: "Weapon Store",
        walletAddress: weaponStore.address,
        currentBalance: minted,
        requiredAmount: threshold,
        unitName: `Weapons (minted ${minted})`,
      });
    } catch (e) {
      console.error("[Replenish] Discord alert failed:", e.message);
    }
  }
};

module.exports = { inventoryReplenishJob };
