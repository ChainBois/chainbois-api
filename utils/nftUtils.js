const { getErc721Balances } = require("./avaxUtils");
const { getNftLevel } = require("./contractUtils");

/**
 * Look up NFT assets for an address and return asset data
 * Shared by authController and gameController
 * @param {string} address - Wallet address (lowercase)
 * @returns {Promise<Object>} { hasNft, nftTokenId, level, weapons }
 */
const lookupNftAssets = async function (address) {
  const result = { hasNft: false, nftTokenId: null, level: 0, weapons: [] };

  try {
    const nftAddress = process.env.CHAINBOIS_NFT_ADDRESS;
    if (!nftAddress) return result;

    const nftBalances = await getErc721Balances(address, nftAddress);

    if (nftBalances && nftBalances.length > 0) {
      const nft = nftBalances[0];
      const tokenId = parseInt(nft.tokenId);

      result.hasNft = true;
      result.nftTokenId = tokenId;

      try {
        result.level = await getNftLevel(tokenId);
      } catch (e) {
        console.error("Failed to get NFT level from contract:", e.message);
      }
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
