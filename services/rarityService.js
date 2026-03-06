/**
 * Rarity scoring service for ChainBois NFTs.
 *
 * Adapted from ghetto-pigeons rarityService.js.
 * Formula: rarityScore = 1/(traitCountFreq/totalSupply) + SUM[1/(freq/totalSupply)]
 */
const NftTrait = require("../models/nftTraitModel");
const NftRarity = require("../models/nftRarityModel");
const Trait = require("../models/traitModel");
const ChainboiNft = require("../models/chainboiNftModel");
const { RARITY_TIERS } = require("../config/constants");

const TRAIT_FIELDS = ["background", "skin", "weapon", "suit", "eyes", "mouth", "helmet"];

/**
 * Calculate the rarity score for a single NFT's traits.
 * @param {object} nftTraits - { background, skin, weapon, suit, eyes, mouth, helmet }
 * @param {object} traitFrequencies - Map of "traitType:value" → count
 * @param {object} traitCountFrequencies - Map of traitCount → count
 * @param {number} totalSupply - Total number of NFTs
 * @returns {number} Rarity score (higher = rarer)
 */
const calculateRarityScore = function (nftTraits, traitFrequencies, traitCountFrequencies, totalSupply) {
  let score = 0;

  // Trait count component
  const traitCount = TRAIT_FIELDS.filter((f) => nftTraits[f] && nftTraits[f] !== "").length;
  const traitCountFreq = traitCountFrequencies[traitCount] || 1;
  score += 1 / (traitCountFreq / totalSupply);

  // Individual trait components
  for (const field of TRAIT_FIELDS) {
    const value = nftTraits[field];
    if (!value || value === "") continue;

    const key = `${field}:${value}`;
    const freq = traitFrequencies[key] || 1;
    score += 1 / (freq / totalSupply);
  }

  return score;
};

/**
 * Get rarity tier based on percentile rank.
 * @param {number} percentile - Percentile (0-100, lower = rarer)
 * @returns {string} Rarity tier name
 */
const getRarityTier = function (percentile) {
  if (percentile <= RARITY_TIERS.LEGENDARY) return "legendary";
  if (percentile <= RARITY_TIERS.EPIC) return "epic";
  if (percentile <= RARITY_TIERS.RARE) return "rare";
  if (percentile <= RARITY_TIERS.UNCOMMON) return "uncommon";
  return "common";
};

/**
 * Process the entire collection to calculate rarity scores, ranks, and tiers.
 * Reads from NftTrait, writes to NftRarity, and populates the Trait collection.
 * @returns {object} { processed, traits }
 */
const processCollectionRarity = async function () {
  const allTraits = await NftTrait.find({}).lean();
  const totalSupply = allTraits.length;

  if (totalSupply === 0) {
    throw new Error("No NFT traits found. Run syncNftsToMongo first.");
  }

  // 1. Tally trait frequencies
  const traitFrequencies = {};
  const traitCountFrequencies = {};
  const uniqueTraits = new Set();

  for (const nft of allTraits) {
    let traitCount = 0;
    for (const field of TRAIT_FIELDS) {
      const value = nft[field];
      if (value && value !== "") {
        traitCount++;
        const key = `${field}:${value}`;
        traitFrequencies[key] = (traitFrequencies[key] || 0) + 1;
        uniqueTraits.add(key);
      }
    }
    traitCountFrequencies[traitCount] = (traitCountFrequencies[traitCount] || 0) + 1;
  }

  // 2. Calculate scores for all NFTs
  const scored = allTraits.map((nft) => {
    const score = calculateRarityScore(nft, traitFrequencies, traitCountFrequencies, totalSupply);
    const traitCount = TRAIT_FIELDS.filter((f) => nft[f] && nft[f] !== "").length;
    const traits = {};
    for (const field of TRAIT_FIELDS) {
      if (nft[field]) traits[field] = nft[field];
    }
    return { tokenId: nft.tokenId, score, traitCount, traits };
  });

  // 3. Sort by score descending (highest = rarest → rank 1)
  scored.sort((a, b) => b.score - a.score);

  // 4. Assign ranks, percentiles, and tiers
  const bulkOps = scored.map((item, index) => {
    const rank = index + 1;
    const percentile = (rank / totalSupply) * 100;
    const tier = getRarityTier(percentile);

    return {
      updateOne: {
        filter: { tokenId: item.tokenId },
        update: {
          $set: {
            name: `ChainBoi #${item.tokenId}`,
            traits: item.traits,
            traitCount: item.traitCount,
            rarityScore: Math.round(item.score * 100) / 100,
            rank,
            percentile: Math.round(percentile * 100) / 100,
            rarityTier: tier,
          },
        },
        upsert: true,
      },
    };
  });

  await NftRarity.bulkWrite(bulkOps);

  // 5. Populate Trait collection with unique trait type+value combos
  const traitBulkOps = [];
  for (const key of uniqueTraits) {
    const [traitType, ...valueParts] = key.split(":");
    const value = valueParts.join(":");
    traitBulkOps.push({
      updateOne: {
        filter: { traitType, value },
        update: { $setOnInsert: { traitType, value, used: false, usedDate: null } },
        upsert: true,
      },
    });
  }

  if (traitBulkOps.length > 0) {
    await Trait.bulkWrite(traitBulkOps);
  }

  return {
    processed: totalSupply,
    traits: uniqueTraits.size,
  };
};

/**
 * Populate the NftTrait collection from ChainboiNft documents.
 * Call this before processCollectionRarity().
 * @returns {number} Number of traits populated
 */
const populateNftTraits = async function () {
  const nfts = await ChainboiNft.find({}).lean();
  let count = 0;

  const bulkOps = nfts.map((nft) => {
    const traitDoc = { tokenId: nft.tokenId };
    if (Array.isArray(nft.traits)) {
      for (const attr of nft.traits) {
        const field = attr.trait_type.toLowerCase().replace(/ /g, "_");
        if (TRAIT_FIELDS.includes(field)) {
          traitDoc[field] = attr.value;
        }
      }
    }
    count++;
    return {
      updateOne: {
        filter: { tokenId: nft.tokenId },
        update: { $set: traitDoc },
        upsert: true,
      },
    };
  });

  if (bulkOps.length > 0) {
    await NftTrait.bulkWrite(bulkOps);
  }

  return count;
};

module.exports = {
  calculateRarityScore,
  getRarityTier,
  processCollectionRarity,
  populateNftTraits,
  TRAIT_FIELDS,
};
