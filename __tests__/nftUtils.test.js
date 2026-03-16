// Mock dependencies before requiring module
jest.mock("../utils/avaxUtils", () => ({
  getErc721Balances: jest.fn(),
}));
jest.mock("../utils/contractUtils", () => ({
  getNftLevel: jest.fn(),
}));
jest.mock("../models/chainboiNftModel", () => ({
  find: jest.fn(),
}));
jest.mock("../models/weaponNftModel", () => ({
  find: jest.fn(),
}));

const { getErc721Balances } = require("../utils/avaxUtils");
const { getNftLevel } = require("../utils/contractUtils");
const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const { lookupNftAssets } = require("../utils/nftUtils");

describe("nftUtils", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.CHAINBOIS_NFT_ADDRESS = "0xChainBoisNFT";
    process.env.WEAPON_NFT_ADDRESS = "0xWeaponNFT";
    ChainboiNft.find.mockReturnValue({ lean: () => Promise.resolve([]) });
    WeaponNft.find.mockReturnValue({ lean: () => Promise.resolve([]) });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("returns default result when CHAINBOIS_NFT_ADDRESS not set", async () => {
    delete process.env.CHAINBOIS_NFT_ADDRESS;
    const result = await lookupNftAssets("0xabc");
    expect(result.hasNft).toBe(false);
    expect(result.nfts).toEqual([]);
    expect(result.weapons).toEqual([]);
    expect(getErc721Balances).not.toHaveBeenCalled();
  });

  test("detects ChainBois NFT and enriches with level and DB data", async () => {
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "42" }]);
    getNftLevel.mockResolvedValueOnce(3);
    getErc721Balances.mockResolvedValueOnce([]);
    ChainboiNft.find.mockReturnValue({
      lean: () => Promise.resolve([{
        tokenId: 42, imageUri: "ipfs://img/42.png", metadataUri: "ipfs://meta/42.json",
        traits: [{ trait_type: "Background", value: "Blue" }],
        inGameStats: { kills: 5, score: 100, gamesPlayed: 2 },
      }]),
    });

    const result = await lookupNftAssets("0xabc");

    expect(result.hasNft).toBe(true);
    expect(result.nfts).toHaveLength(1);
    expect(result.nfts[0].tokenId).toBe(42);
    expect(result.nfts[0].level).toBe(3);
    expect(result.nfts[0].rank).toBe("Captain");
    expect(result.nfts[0].contractAddress).toBe("0xChainBoisNFT");
    expect(result.nfts[0].imageUri).toBe("ipfs://img/42.png");
    expect(result.nfts[0].traits).toEqual([{ trait_type: "Background", value: "Blue" }]);
    expect(result.nfts[0].inGameStats.kills).toBe(5);
  });

  test("returns multiple NFTs with enriched data", async () => {
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "1" }, { tokenId: "5" }]);
    getNftLevel.mockResolvedValueOnce(2);
    getNftLevel.mockResolvedValueOnce(5);
    getErc721Balances.mockResolvedValueOnce([]);
    ChainboiNft.find.mockReturnValue({ lean: () => Promise.resolve([]) });

    const result = await lookupNftAssets("0xabc");

    expect(result.hasNft).toBe(true);
    expect(result.nfts).toHaveLength(2);
    expect(result.nfts[0].tokenId).toBe(1);
    expect(result.nfts[0].level).toBe(2);
    expect(result.nfts[0].contractAddress).toBe("0xChainBoisNFT");
    expect(result.nfts[1].tokenId).toBe(5);
    expect(result.nfts[1].level).toBe(5);
  });

  test("returns level 0 when getNftLevel fails", async () => {
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "1" }]);
    getNftLevel.mockRejectedValueOnce(new Error("contract error"));
    getErc721Balances.mockResolvedValueOnce([]);

    const result = await lookupNftAssets("0xabc");

    expect(result.hasNft).toBe(true);
    expect(result.nfts[0].level).toBe(0);
    expect(result.nfts[0].rank).toBe("Private");
  });

  test("returns no NFT when balance is empty", async () => {
    getErc721Balances.mockResolvedValueOnce([]);
    getErc721Balances.mockResolvedValueOnce([]);

    const result = await lookupNftAssets("0xabc");
    expect(result.hasNft).toBe(false);
    expect(result.nfts).toEqual([]);
  });

  test("detects weapon NFTs and enriches from MongoDB", async () => {
    getErc721Balances.mockResolvedValueOnce([]);
    getErc721Balances.mockResolvedValueOnce([
      { tokenId: "10" },
      { tokenId: "20" },
    ]);
    WeaponNft.find.mockReturnValue({
      lean: () => Promise.resolve([
        { tokenId: 10, weaponName: "AK-47", category: "assault", blueprintTier: "base", imageUri: "ipfs://ak.png", metadataUri: "" },
        { tokenId: 20, weaponName: "Sword", category: "melee", blueprintTier: "epic", imageUri: "ipfs://sword.png", metadataUri: "" },
      ]),
    });

    const result = await lookupNftAssets("0xabc");
    expect(result.weapons).toHaveLength(2);
    expect(result.weapons[0].tokenId).toBe(10);
    expect(result.weapons[0].weaponName).toBe("AK-47");
    expect(result.weapons[0].category).toBe("assault");
    expect(result.weapons[0].contractAddress).toBe("0xWeaponNFT");
    expect(result.weapons[1].weaponName).toBe("Sword");
    expect(result.weapons[1].tier).toBe("epic");
  });

  test("uses fallback name when weapon not in MongoDB", async () => {
    getErc721Balances.mockResolvedValueOnce([]);
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "10" }]);
    WeaponNft.find.mockReturnValue({ lean: () => Promise.resolve([]) });

    const result = await lookupNftAssets("0xabc");
    expect(result.weapons[0].weaponName).toBe("Weapon #10");
  });

  test("skips weapon lookup when WEAPON_NFT_ADDRESS not set", async () => {
    delete process.env.WEAPON_NFT_ADDRESS;
    getErc721Balances.mockResolvedValueOnce([]);

    const result = await lookupNftAssets("0xabc");
    expect(result.weapons).toEqual([]);
    expect(getErc721Balances).toHaveBeenCalledTimes(1);
  });

  test("handles weapon lookup failure gracefully", async () => {
    getErc721Balances.mockResolvedValueOnce([]);
    getErc721Balances.mockRejectedValueOnce(new Error("network error"));

    const result = await lookupNftAssets("0xabc");
    expect(result.weapons).toEqual([]);
  });

  test("handles complete Glacier API failure gracefully", async () => {
    getErc721Balances.mockRejectedValueOnce(new Error("API down"));

    const result = await lookupNftAssets("0xabc");
    expect(result.hasNft).toBe(false);
    expect(result.nfts).toEqual([]);
    expect(result.weapons).toEqual([]);
  });
});
