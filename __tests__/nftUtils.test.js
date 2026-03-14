// Mock dependencies before requiring module
jest.mock("../utils/avaxUtils", () => ({
  getErc721Balances: jest.fn(),
}));
jest.mock("../utils/contractUtils", () => ({
  getNftLevel: jest.fn(),
}));

const { getErc721Balances } = require("../utils/avaxUtils");
const { getNftLevel } = require("../utils/contractUtils");
const { lookupNftAssets } = require("../utils/nftUtils");

describe("nftUtils", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.CHAINBOIS_NFT_ADDRESS = "0xChainBoisNFT";
    process.env.WEAPON_NFT_ADDRESS = "0xWeaponNFT";
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

  test("detects ChainBois NFT and gets level", async () => {
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "42" }]);
    getNftLevel.mockResolvedValueOnce(3);
    getErc721Balances.mockResolvedValueOnce([]);

    const result = await lookupNftAssets("0xabc");

    expect(result.hasNft).toBe(true);
    expect(result.nfts).toHaveLength(1);
    expect(result.nfts[0].tokenId).toBe(42);
    expect(result.nfts[0].level).toBe(3);
    expect(getErc721Balances).toHaveBeenCalledWith("0xabc", "0xChainBoisNFT");
    expect(getNftLevel).toHaveBeenCalledWith(42);
  });

  test("returns multiple NFTs when user owns several", async () => {
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "1" }, { tokenId: "5" }]);
    getNftLevel.mockResolvedValueOnce(2);
    getNftLevel.mockResolvedValueOnce(5);
    getErc721Balances.mockResolvedValueOnce([]);

    const result = await lookupNftAssets("0xabc");

    expect(result.hasNft).toBe(true);
    expect(result.nfts).toHaveLength(2);
    expect(result.nfts[0]).toEqual({ tokenId: 1, level: 2 });
    expect(result.nfts[1]).toEqual({ tokenId: 5, level: 5 });
  });

  test("returns level 0 when getNftLevel fails", async () => {
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "1" }]);
    getNftLevel.mockRejectedValueOnce(new Error("contract error"));
    getErc721Balances.mockResolvedValueOnce([]);

    const result = await lookupNftAssets("0xabc");

    expect(result.hasNft).toBe(true);
    expect(result.nfts[0].level).toBe(0);
  });

  test("returns no NFT when balance is empty", async () => {
    getErc721Balances.mockResolvedValueOnce([]);
    getErc721Balances.mockResolvedValueOnce([]);

    const result = await lookupNftAssets("0xabc");
    expect(result.hasNft).toBe(false);
    expect(result.nfts).toEqual([]);
  });

  test("detects weapon NFTs with metadata names", async () => {
    getErc721Balances.mockResolvedValueOnce([]);
    getErc721Balances.mockResolvedValueOnce([
      { tokenId: "10", metadata: { name: "AK-47" } },
      { tokenId: "20", metadata: { name: "Sword" } },
    ]);

    const result = await lookupNftAssets("0xabc");
    expect(result.weapons).toHaveLength(2);
    expect(result.weapons[0]).toEqual({ tokenId: 10, name: "AK-47" });
    expect(result.weapons[1]).toEqual({ tokenId: 20, name: "Sword" });
  });

  test("uses fallback name when weapon metadata missing", async () => {
    getErc721Balances.mockResolvedValueOnce([]);
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "10" }]);

    const result = await lookupNftAssets("0xabc");
    expect(result.weapons[0].name).toBe("Weapon #10");
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
