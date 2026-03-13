/**
 * Tests for metadataController.js - Dynamic NFT metadata endpoint
 */

// Mock dependencies before imports
jest.mock("../models/chainboiNftModel", () => ({
  findOne: jest.fn(),
}));
jest.mock("../utils/contractUtils", () => ({
  getNftLevel: jest.fn(),
}));
jest.mock("../utils/cloudinaryUtils", () => ({
  getBadgeOverlayUrl: jest.fn(),
}));

const { getTokenMetadata } = require("../controllers/metadataController");
const ChainboiNft = require("../models/chainboiNftModel");
const { getNftLevel } = require("../utils/contractUtils");
const { getBadgeOverlayUrl } = require("../utils/cloudinaryUtils");

// Helper to await catchAsync handlers (catchAsync does not return the inner promise)
const callHandler = (handler, req, res, next) => {
  return new Promise((resolve) => {
    const wrappedNext = (...args) => { next(...args); resolve(); };
    const origJson = res.json;
    res.json = function (...args) { origJson(...args); resolve(); return res; };
    res.json.mock = origJson.mock;
    handler(req, res, wrappedNext);
  });
};

const createMocks = (params = {}, query = {}) => {
  const req = {
    params,
    query,
    path: "/api/v1/metadata/1.json",
    method: "GET",
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getTokenMetadata", () => {
  test("returns dynamic metadata for existing NFT", async () => {
    getNftLevel.mockResolvedValue(3);
    ChainboiNft.findOne.mockResolvedValue({
      tokenId: 1,
      traits: [
        { trait_type: "Background", value: "Combat Red" },
        { trait_type: "Skin", value: "Pale Recruit" },
      ],
      inGameStats: { kills: 42, score: 12500, gamesPlayed: 15 },
      imageUri: "ipfs://abc/1.png",
    });
    getBadgeOverlayUrl.mockReturnValue("https://res.cloudinary.com/test/image/upload/l_chainbois-badges:captain,g_south_east,w_150,o_90/chainbois/1.png");

    const { req, res, next } = createMocks({ tokenId: "1" });
    await callHandler(getTokenMetadata, req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0];
    expect(data.name).toBe("ChainBoi #1");
    expect(data.image).toContain("cloudinary.com");
    expect(data.collection).toBe("ChainBois Genesis");
    expect(data.attributes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ trait_type: "Level", value: 3 }),
        expect.objectContaining({ trait_type: "Rank", value: "Captain" }),
        expect.objectContaining({ trait_type: "Kills", value: 42 }),
        expect.objectContaining({ trait_type: "Games Played", value: 15 }),
        expect.objectContaining({ trait_type: "Score", value: 12500 }),
        expect.objectContaining({ trait_type: "Background", value: "Combat Red" }),
      ])
    );
  });

  test("strips .json suffix from tokenId param", async () => {
    getNftLevel.mockResolvedValue(0);
    ChainboiNft.findOne.mockResolvedValue(null);
    getBadgeOverlayUrl.mockReturnValue("");

    const { req, res, next } = createMocks({ tokenId: "5.json" });
    await callHandler(getTokenMetadata, req, res, next);

    expect(getNftLevel).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("returns 400 for invalid tokenId", async () => {
    const { req, res, next } = createMocks({ tokenId: "abc" });
    await callHandler(getTokenMetadata, req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(next.mock.calls[0][0].message).toBe("Invalid token ID");
  });

  test("returns 404 when token does not exist on-chain", async () => {
    getNftLevel.mockRejectedValue(new Error("Token not found"));

    const { req, res, next } = createMocks({ tokenId: "999" });
    await callHandler(getTokenMetadata, req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });

  test("falls back to IPFS image when Cloudinary not configured", async () => {
    getNftLevel.mockResolvedValue(2);
    ChainboiNft.findOne.mockResolvedValue({
      tokenId: 1,
      traits: [{ trait_type: "Background", value: "Sky Blue" }],
      inGameStats: { kills: 0, score: 0, gamesPlayed: 0 },
      imageUri: "ipfs://abc/1.png",
    });
    getBadgeOverlayUrl.mockReturnValue(""); // Cloudinary not configured

    const { req, res, next } = createMocks({ tokenId: "1" });
    await callHandler(getTokenMetadata, req, res, next);

    const data = res.json.mock.calls[0][0];
    expect(data.image).toBe("ipfs://abc/1.png");
  });

  test("returns default stats when no MongoDB record", async () => {
    getNftLevel.mockResolvedValue(0);
    ChainboiNft.findOne.mockResolvedValue(null);
    getBadgeOverlayUrl.mockReturnValue("");

    const { req, res, next } = createMocks({ tokenId: "99" });
    await callHandler(getTokenMetadata, req, res, next);

    const data = res.json.mock.calls[0][0];
    const killsAttr = data.attributes.find((a) => a.trait_type === "Kills");
    expect(killsAttr.value).toBe(0);
    const levelAttr = data.attributes.find((a) => a.trait_type === "Level");
    expect(levelAttr.value).toBe(0);
    expect(levelAttr.max_value).toBe(7);
  });

  test("includes external_url with tokenId", async () => {
    getNftLevel.mockResolvedValue(1);
    ChainboiNft.findOne.mockResolvedValue(null);
    getBadgeOverlayUrl.mockReturnValue("");

    const { req, res, next } = createMocks({ tokenId: "7" });
    await callHandler(getTokenMetadata, req, res, next);

    const data = res.json.mock.calls[0][0];
    expect(data.external_url).toBe("https://chainbois-true.vercel.app/nft/7");
  });
});
