const { ethers } = require("ethers");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { decrypt } = require("../utils/cryptUtils");
const contractUtils = require("../utils/contractUtils");
const Claim = require("../models/claimModel");
const Wallet = require("../models/walletModel");
const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const Transaction = require("../models/transactionModel");
const { WALLET_ROLES, WEAPON_DEFINITIONS, TRANSACTION_TYPES, WEAPON_CATEGORIES, getChainBoiImageUri, getWeaponImageUri } = require("../config/constants");

const BATTLE_CLAIM_AMOUNT = 1000;
const NFT_CLAIM_COUNT = 2;

// MongoDB-based distributed lock (safe for PM2 cluster mode)
const LOCK_TIMEOUT_MS = 180000; // 3 minutes max

/**
 * Parse tokenId from a mint receipt's Transfer event
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
 * Get one random weapon definition per category
 */
const getOnePerCategory = function () {
  const selected = [];
  for (const category of WEAPON_CATEGORIES) {
    const matching = WEAPON_DEFINITIONS.filter((w) => w.category === category);
    if (matching.length > 0) {
      const randomBytes = crypto.randomBytes(4);
      const idx = randomBytes.readUInt32BE(0) % matching.length;
      selected.push(matching[idx]);
    }
  }
  return selected;
};

/**
 * Record a transaction for audit trail
 */
const recordTransaction = async function (type, fromAddress, toAddress, amount, txHash, currency, metadata) {
  try {
    await Transaction.create({
      type,
      fromAddress,
      toAddress,
      amount,
      txHash,
      currency,
      status: "confirmed",
      metadata,
    });
  } catch (err) {
    console.error("Failed to record claim transaction:", err.message);
  }
};

/**
 * POST /api/v1/claim/starter-pack
 * Claim a starter pack: 2 ChainBoi NFTs + 1 weapon per category + 1000 $BATTLE
 * Max 1 claim per wallet address.
 */
const claimStarterPack = catchAsync(async (req, res, next) => {
  const { address } = req.body;

  // 1. Validate address
  if (!address || !ethers.isAddress(address)) {
    return next(new AppError("Valid wallet address is required", 400));
  }

  const normalizedAddress = address.toLowerCase();

  // 2. Check duplicate claim
  const existingClaim = await Claim.findOne({ address: normalizedAddress });
  if (existingClaim) {
    return next(new AppError("This wallet has already claimed a starter pack", 400));
  }

  // 3. Distributed lock: check if any claim is currently processing (prevents nonce collisions across PM2 instances)
  const activeClaim = await Claim.findOne({
    status: "processing",
    createdAt: { $gt: new Date(Date.now() - LOCK_TIMEOUT_MS) },
  });
  if (activeClaim) {
    return next(new AppError("Another claim is being processed. Please try again in a minute.", 429));
  }

  // 4. Create claim record atomically to prevent double-claims (unique index on address)
  let claim;
  try {
    claim = await Claim.create({ address: normalizedAddress, status: "processing" });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError("This wallet has already claimed a starter pack", 400));
    }
    throw err;
  }

  // 5. Load and decrypt platform wallets
  const [nftStoreWallet, weaponStoreWallet, rewardsWallet, deployerWallet] = await Promise.all([
    Wallet.findOne({ role: WALLET_ROLES.NFT_STORE }).select("+key +iv"),
    Wallet.findOne({ role: WALLET_ROLES.WEAPON_STORE }).select("+key +iv"),
    Wallet.findOne({ role: WALLET_ROLES.REWARDS }).select("+key +iv"),
    Wallet.findOne({ role: WALLET_ROLES.DEPLOYER }).select("+key +iv"),
  ]);

  if (!nftStoreWallet || !weaponStoreWallet || !rewardsWallet || !deployerWallet) {
    claim.status = "failed";
    claim.error = "Platform wallets not configured";
    await claim.save();

    return next(new AppError("Platform configuration error", 500));
  }

  const [nftStoreKey, weaponStoreKey, rewardsKey, deployerKey] = await Promise.all([
    decrypt(nftStoreWallet.key, nftStoreWallet.iv),
    decrypt(weaponStoreWallet.key, weaponStoreWallet.iv),
    decrypt(rewardsWallet.key, rewardsWallet.iv),
    decrypt(deployerWallet.key, deployerWallet.iv),
  ]);

  const nftContractAddr = (process.env.CHAINBOIS_NFT_ADDRESS || "").toLowerCase();
  const weaponContractAddr = (process.env.WEAPON_NFT_ADDRESS || "").toLowerCase();

  const results = { nfts: [], weapons: [], battle: null };

  try {
    // 6. Transfer or mint ChainBoi NFTs (NFT_CLAIM_COUNT)
    for (let i = 0; i < NFT_CLAIM_COUNT; i++) {
      const availableNft = await ChainboiNft.findOne({
        ownerAddress: nftStoreWallet.address.toLowerCase(),
      });

      if (availableNft) {
        const receipt = await contractUtils.transferNft(
          nftStoreWallet.address,
          normalizedAddress,
          availableNft.tokenId,
          nftStoreKey
        );
        await ChainboiNft.findByIdAndUpdate(availableNft._id, {
          ownerAddress: normalizedAddress,
        });
        results.nfts.push({
          tokenId: availableNft.tokenId,
          txHash: receipt.hash,
          method: "transfer",
        });
        await recordTransaction(TRANSACTION_TYPES.NFT_PURCHASE, nftStoreWallet.address, normalizedAddress, 0, receipt.hash, "NFT", {
          source: "starter_pack_claim",
          tokenId: availableNft.tokenId,
        });
      } else {
        // nft_store empty — mint directly to user
        const receipt = await contractUtils.mintChainboiNft(normalizedAddress, deployerKey);
        let tokenId = getTokenIdFromReceipt(receipt, contractUtils.CHAINBOIS_NFT_ABI);
        // Fallback: query totalSupply for the latest tokenId
        if (tokenId === null) {
          try {
            tokenId = await contractUtils.getChainboisTotalSupply();
          } catch { /* ignore */ }
        }
        if (tokenId !== null) {
          await ChainboiNft.create({
            tokenId,
            contractAddress: nftContractAddr,
            ownerAddress: normalizedAddress,
            imageUri: getChainBoiImageUri(tokenId),
            metadataUri: `ipfs://${require("../config/constants").CHAINBOIS_IMAGES_CID}/${tokenId}.json`,
          });
        }
        results.nfts.push({
          tokenId,
          txHash: receipt.hash,
          method: "mint",
        });
        await recordTransaction(TRANSACTION_TYPES.NFT_PURCHASE, "mint", normalizedAddress, 0, receipt.hash, "NFT", {
          source: "starter_pack_claim",
          tokenId,
        });
      }
    }

    // 7. Transfer or mint 1 weapon per category
    const weaponDefs = getOnePerCategory();

    for (const weaponDef of weaponDefs) {
      try {
        const availableWeapon = await WeaponNft.findOne({
          ownerAddress: weaponStoreWallet.address.toLowerCase(),
          category: weaponDef.category,
        });

        if (availableWeapon) {
          const receipt = await contractUtils.transferWeaponNft(
            weaponStoreWallet.address,
            normalizedAddress,
            availableWeapon.tokenId,
            weaponStoreKey
          );
          await WeaponNft.findByIdAndUpdate(availableWeapon._id, {
            ownerAddress: normalizedAddress,
          });
          results.weapons.push({
            tokenId: availableWeapon.tokenId,
            name: availableWeapon.weaponName,
            category: weaponDef.category,
            txHash: receipt.hash,
            method: "transfer",
          });
          await recordTransaction(TRANSACTION_TYPES.WEAPON_PURCHASE, weaponStoreWallet.address, normalizedAddress, 0, receipt.hash, "NFT", {
            source: "starter_pack_claim",
            weaponName: availableWeapon.weaponName,
            category: weaponDef.category,
          });
        } else {
          // weapon_store empty for this category — mint directly to user
          const receipt = await contractUtils.mintWeaponNft(
            normalizedAddress,
            weaponDef.name,
            deployerKey
          );
          let tokenId = getTokenIdFromReceipt(receipt, contractUtils.WEAPON_NFT_ABI);
          if (tokenId === null) {
            try {
              tokenId = await contractUtils.getWeaponTotalSupply();
            } catch { /* ignore */ }
          }
          if (tokenId !== null) {
            await WeaponNft.create({
              tokenId,
              contractAddress: weaponContractAddr,
              ownerAddress: normalizedAddress,
              weaponName: weaponDef.name,
              category: weaponDef.category,
              price: 0,
              supply: 1,
              imageUri: getWeaponImageUri(weaponDef.name),
            });
          }
          results.weapons.push({
            tokenId,
            name: weaponDef.name,
            category: weaponDef.category,
            txHash: receipt.hash,
            method: "mint",
          });
          await recordTransaction(TRANSACTION_TYPES.WEAPON_PURCHASE, "mint", normalizedAddress, 0, receipt.hash, "NFT", {
            source: "starter_pack_claim",
            weaponName: weaponDef.name,
            category: weaponDef.category,
          });
        }
      } catch (weaponErr) {
        console.error(`Claim ${claim._id}: weapon ${weaponDef.category} failed:`, weaponErr.message);
        // Continue with remaining weapons
      }
    }

    // 8. Transfer $BATTLE tokens
    const battleReceipt = await contractUtils.transferBattleTokens(
      normalizedAddress,
      BATTLE_CLAIM_AMOUNT,
      rewardsKey
    );
    results.battle = {
      amount: BATTLE_CLAIM_AMOUNT,
      txHash: battleReceipt.hash,
    };
    await recordTransaction(TRANSACTION_TYPES.CLAIM, rewardsWallet.address, normalizedAddress, BATTLE_CLAIM_AMOUNT, battleReceipt.hash, "BATTLE", {
      source: "starter_pack_claim",
    });

    // 9. Update claim record
    claim.status = "completed";
    claim.nftTokenIds = results.nfts.map((n) => n.tokenId).filter(Boolean);
    claim.weapons = results.weapons.map((w) => ({
      tokenId: w.tokenId,
      name: w.name,
      category: w.category,
    }));
    claim.battleAmount = BATTLE_CLAIM_AMOUNT;
    claim.txHashes = {
      nfts: results.nfts.map((n) => n.txHash),
      weapons: results.weapons.map((w) => w.txHash),
      battle: results.battle?.txHash || null,
    };
    await claim.save();



    return res.status(200).json({
      success: true,
      message: "Starter pack claimed successfully!",
      data: results,
    });
  } catch (err) {
    // Partial success handling
    const hasAnything = results.nfts.length > 0 || results.weapons.length > 0 || results.battle;
    claim.status = hasAnything ? "partial" : "failed";
    claim.error = err.message;
    if (results.nfts.length) {
      claim.nftTokenIds = results.nfts.map((n) => n.tokenId).filter(Boolean);
    }
    if (results.weapons.length) {
      claim.weapons = results.weapons.map((w) => ({
        tokenId: w.tokenId,
        name: w.name,
        category: w.category,
      }));
    }
    if (results.battle) claim.battleAmount = results.battle.amount;
    claim.txHashes = {
      nfts: results.nfts.map((n) => n.txHash),
      weapons: results.weapons.map((w) => w.txHash),
      battle: results.battle?.txHash || null,
    };
    await claim.save();



    return next(new AppError(`Claim failed: ${err.message}`, 500));
  }
});

/**
 * GET /api/v1/claim/check/:address
 * Check if a wallet has already claimed, and return claim details if so.
 */
const checkClaim = catchAsync(async (req, res, next) => {
  const { address } = req.params;

  if (!address || !ethers.isAddress(address)) {
    return next(new AppError("Valid wallet address is required", 400));
  }

  const claim = await Claim.findOne({ address: address.toLowerCase() }).lean();

  if (!claim) {
    return res.status(200).json({
      success: true,
      claimed: false,
    });
  }

  return res.status(200).json({
    success: true,
    claimed: true,
    data: {
      status: claim.status,
      nftTokenIds: claim.nftTokenIds,
      weapons: claim.weapons,
      battleAmount: claim.battleAmount,
      txHashes: claim.txHashes,
      claimedAt: claim.createdAt,
    },
  });
});

module.exports = {
  claimStarterPack,
  checkClaim,
};
