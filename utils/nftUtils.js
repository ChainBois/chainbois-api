const { getErc721Balances } = require("./avaxUtils");
const { getNftLevel } = require("./contractUtils");

/**
 * Look up NFT assets for an address and return asset data
 * Shared by authController and gameController
 * @param {string} address - Wallet address (lowercase)
 * @returns {Promise<Object>} { hasNft, nfts: [...], weapons: [...] }
 *   nfts: array of { tokenId, level }
 *   weapons: array of { tokenId, name }
 */
const lookupNftAssets = async function (address) {
  const result = { hasNft: false, nfts: [], weapons: [] };

  try {
    const nftAddress = process.env.CHAINBOIS_NFT_ADDRESS;
    if (!nftAddress) return result;

    const nftBalances = await getErc721Balances(address, nftAddress);

    if (nftBalances && nftBalances.length > 0) {
      result.hasNft = true;

      // Fetch levels in parallel for all owned NFTs
      result.nfts = await Promise.all(
        nftBalances.map(async (nft) => {
          const tokenId = parseInt(nft.tokenId);
          let level = 0;
          try {
            level = await getNftLevel(tokenId);
          } catch (e) {
            console.error(`Failed to get NFT level for token ${tokenId}:`, e.message);
          }
          return { tokenId, level };
        })
      );
    }

    // Check for weapon NFTs
    const weaponAddress = process.env.WEAPON_NFT_ADDRESS;
    if (weaponAddress) {
      try {
        const weaponBalances = await getErc721Balances(address, weaponAddress);
        if (weaponBalances && weaponBalances.length > 0) {
          result.weapons = weaponBalances.map((w) => ({
            tokenId: parseInt(w.tokenId),
            name: w.metadata && w.metadata.name ? w.metadata.name : `Weapon #${w.tokenId}`,
          }));
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
