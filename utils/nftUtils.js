const { getErc721Balances } = require("./avaxUtils");
const { getNftLevel } = require("./contractUtils");
const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const { RANK_NAMES, buildCurrentTraits, buildWeaponResponse } = require("../config/constants");

/**
 * Look up NFT assets for an address and return full enriched data
 * Shared by authController and gameController
 * @param {string} address - Wallet address
 * @returns {Promise<Object>} { hasNft, nfts: [...], weapons: [...] }
 */

const lookupNftAssets = async function (address) {
  const result = { hasNft: false, nfts: [], weapons: [] };

  try {
    const nftAddress = process.env.CHAINBOIS_NFT_ADDRESS;
    if (!nftAddress) return result;

    const nftBalances = await getErc721Balances(address, nftAddress);

    if (nftBalances && nftBalances.length > 0) {
      result.hasNft = true;

      // Get on-chain token IDs
      const tokenIds = nftBalances.map((nft) => parseInt(nft.tokenId));

      // Batch fetch MongoDB records + on-chain levels in parallel
      const [dbNfts, levels] = await Promise.all([
        ChainboiNft.find({ tokenId: { $in: tokenIds } }).lean(),
        Promise.all(
          tokenIds.map(async (tokenId) => {
            try {
              return await getNftLevel(tokenId);
            } catch (e) {
              console.error(`Failed to get NFT level for token ${tokenId}:`, e.message);
              return 0;
            }
          })
        ),
      ]);

      // Index DB records by tokenId for O(1) lookup
      const dbMap = {};
      for (const nft of dbNfts) {
        dbMap[nft.tokenId] = nft;
      }

      result.nfts = tokenIds.map((tokenId, i) => {
        const level = levels[i];
        const db = dbMap[tokenId] || {};
        return {
          tokenId,
          contractAddress: nftAddress,
          level,
          rank: RANK_NAMES[level] || "Private",
          badge: (RANK_NAMES[level] || "Private").toLowerCase().replace(/ /g, "_"),
          imageUri: db.imageUri || "",
          metadataUri: db.metadataUri || "",
          traits: buildCurrentTraits(db.traits, {
            level,
            rank: RANK_NAMES[level] || "Private",
            inGameStats: db.inGameStats || {},
          }),
          inGameStats: db.inGameStats || { kills: 0, score: 0, gamesPlayed: 0 },
        };
      });
    }

    // Check for weapon NFTs
    const weaponAddress = process.env.WEAPON_NFT_ADDRESS;
    if (weaponAddress) {
      try {
        const weaponBalances = await getErc721Balances(address, weaponAddress);
        if (weaponBalances && weaponBalances.length > 0) {
          const weaponTokenIds = weaponBalances.map((w) => parseInt(w.tokenId));

          // Batch fetch MongoDB weapon records
          const dbWeapons = await WeaponNft.find({ tokenId: { $in: weaponTokenIds } }).lean();
          const wMap = {};
          for (const w of dbWeapons) {
            wMap[w.tokenId] = w;
          }

          result.weapons = weaponTokenIds.map((tokenId) => {
            const db = wMap[tokenId] || {};
            return buildWeaponResponse({
              tokenId,
              contractAddress: weaponAddress,
              weaponName: db.weaponName || `Weapon #${tokenId}`,
              category: db.category || "",
              blueprintTier: db.blueprintTier || "base",
              imageUri: db.imageUri || "",
              metadataUri: db.metadataUri || "",
            });
          });
        }
      } catch (e) {
        console.error("Failed to get weapon NFTs:", e.message);
      }
    }
  } catch (e) {
    console.error("NFT lookup failed:", e.message);
  }

  return result;
};

module.exports = {
  lookupNftAssets,
};
