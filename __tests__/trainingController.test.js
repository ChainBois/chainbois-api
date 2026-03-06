// Mock all external dependencies before requiring anything
jest.mock("../utils/contractUtils", () => ({
  getNftLevel: jest.fn(),
  setNftLevel: jest.fn(),
  getNftOwner: jest.fn(),
}));

jest.mock("../utils/avaxUtils", () => ({
  getErc721Balances: jest.fn(),
  verifyPayment: jest.fn(),
  reindexNftMetadata: jest.fn(),
}));

jest.mock("../utils/cryptUtils", () => ({
  decrypt: jest.fn(),
}));

jest.mock("../config/firebase", () => ({
  getFirebaseDb: jest.fn(),
  getFirebaseAuth: jest.fn(),
}));

jest.mock("../models/userModel", () => ({ findOne: jest.fn() }));
jest.mock("../models/settingsModel", () => ({ findOne: jest.fn() }));
jest.mock("../models/walletModel", () => ({ findOne: jest.fn() }));
jest.mock("../models/transactionModel", () => ({ findOne: jest.fn(), create: jest.fn() }));
jest.mock("../models/chainboiNftModel", () => ({ findOne: jest.fn(), findOneAndUpdate: jest.fn() }));
jest.mock("../models/tournamentModel", () => ({ find: jest.fn() }));

const { getNftLevel, setNftLevel, getNftOwner } = require("../utils/contractUtils");
const { getErc721Balances, verifyPayment, reindexNftMetadata } = require("../utils/avaxUtils");
const { decrypt } = require("../utils/cryptUtils");
const { getFirebaseDb } = require("../config/firebase");
const User = require("../models/userModel");
const Settings = require("../models/settingsModel");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const ChainboiNft = require("../models/chainboiNftModel");
const Tournament = require("../models/tournamentModel");

const { getNfts, getNftDetail, levelUp, getLevelUpCost, getEligibility } = require("../controllers/trainingController");

// catchAsync does not return the inner promise, so we need to wait for it
const callHandler = (handler, req, res, next) => {
  return new Promise((resolve) => {
    const origNext = next;
    const wrappedNext = (...args) => {
      origNext(...args);
      resolve();
    };
    const origJson = res.json.bind(res);
    const jsonMock = res.json;
    // Intercept json to detect completion, but keep the jest mock working
    res.json = function (...args) {
      jsonMock(...args);
      resolve();
      return res;
    };
    // Preserve the mock interface so tests can check calls
    res.json.mock = jsonMock.mock;
    handler(req, res, wrappedNext);
  });
};

const originalEnv = { ...process.env };

// Helper to create mock req/res/next
const createMocks = (overrides = {}) => {
  const req = {
    params: {},
    body: {},
    query: {},
    path: "/api/v1/training/test",
    method: "GET",
    user: { uid: "testuid123" },
    ...overrides,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
};

// Helper to create a Settings mock with levelUpCosts as a Map
const createSettingsMock = () => {
  const costsMap = new Map([
    ["1", 1], ["2", 1], ["3", 2], ["4", 2], ["5", 3], ["6", 3], ["7", 5],
  ]);
  return { levelUpCosts: costsMap };
};

// Mock Firebase db
const mockFbUpdate = jest.fn().mockResolvedValue();
const mockFbRef = jest.fn().mockReturnValue({ update: mockFbUpdate });
const mockDb = { ref: mockFbRef };

beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...originalEnv };
  process.env.CHAINBOIS_NFT_ADDRESS = "0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5";
  getFirebaseDb.mockReturnValue(mockDb);
});

afterAll(() => {
  process.env = originalEnv;
});

// ==================== getNfts ====================

describe("getNfts", () => {
  test("rejects invalid address", async () => {
    const { req, res, next } = createMocks({ params: { address: "not-an-address" } });
    await callHandler(getNfts, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("returns 503 if NFT contract not configured", async () => {
    delete process.env.CHAINBOIS_NFT_ADDRESS;
    const { req, res, next } = createMocks({
      params: { address: "0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0" },
    });
    await callHandler(getNfts, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 503 }));
  });

  test("returns empty array when no NFTs found", async () => {
    getErc721Balances.mockResolvedValueOnce([]);
    const { req, res, next } = createMocks({
      params: { address: "0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0" },
    });
    await callHandler(getNfts, req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0].data;
    expect(data.count).toBe(0);
    expect(data.nfts).toEqual([]);
  });

  test("returns enriched NFTs with levels and characters", async () => {
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "1" }, { tokenId: "5" }]);
    getNftLevel.mockResolvedValueOnce(2).mockResolvedValueOnce(0);
    ChainboiNft.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    const { req, res, next } = createMocks({
      params: { address: "0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0" },
    });
    await callHandler(getNfts, req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0].data;
    expect(data.count).toBe(2);
    expect(data.nfts[0].tokenId).toBe(1);
    expect(data.nfts[0].level).toBe(2);
    expect(data.nfts[0].rank).toBe("Sergeant");
    expect(data.nfts[0].characters.length).toBeGreaterThan(0);
    expect(data.nfts[1].tokenId).toBe(5);
    expect(data.nfts[1].level).toBe(0);
    expect(data.nfts[1].rank).toBe("Private");
  });

  test("handles getNftLevel failure gracefully", async () => {
    getErc721Balances.mockResolvedValueOnce([{ tokenId: "1" }]);
    getNftLevel.mockRejectedValueOnce(new Error("contract error"));
    ChainboiNft.findOne.mockResolvedValueOnce(null);

    const { req, res, next } = createMocks({
      params: { address: "0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0" },
    });
    await callHandler(getNfts, req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0].data;
    expect(data.nfts[0].level).toBe(0);
  });
});

// ==================== getNftDetail ====================

describe("getNftDetail", () => {
  test("rejects invalid tokenId", async () => {
    const { req, res, next } = createMocks({ params: { tokenId: "abc" } });
    await callHandler(getNftDetail, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("rejects tokenId of 0", async () => {
    const { req, res, next } = createMocks({ params: { tokenId: "0" } });
    await callHandler(getNftDetail, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("returns 404 when token does not exist", async () => {
    getNftOwner.mockRejectedValueOnce(new Error("ERC721: invalid token ID"));
    const { req, res, next } = createMocks({ params: { tokenId: "999" } });
    await callHandler(getNftDetail, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });

  test("returns full NFT detail with level and characters", async () => {
    getNftOwner.mockResolvedValueOnce("0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0");
    getNftLevel.mockResolvedValueOnce(3);
    ChainboiNft.findOne.mockResolvedValue({
      traits: [{ trait_type: "Background", value: "Blue" }],
      imageUri: "ipfs://img",
      metadataUri: "ipfs://meta",
      inGameStats: { kills: 10, score: 500, gamesPlayed: 5 },
    });
    Settings.findOne.mockResolvedValue(createSettingsMock());

    const { req, res, next } = createMocks({ params: { tokenId: "1" } });
    await callHandler(getNftDetail, req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0].data;
    expect(data.tokenId).toBe(1);
    expect(data.level).toBe(3);
    expect(data.rank).toBe("Captain");
    expect(data.owner).toBe("0x469622d0fb5ed43b2e7c45e98d355f2cf03816a0");
    expect(data.nextLevelCost).toBe(2);
    expect(data.isMaxLevel).toBe(false);
    expect(data.characters).toContain("Captain_A");
  });

  test("shows isMaxLevel true when at level 7", async () => {
    getNftOwner.mockResolvedValueOnce("0xabc");
    getNftLevel.mockResolvedValueOnce(7);
    ChainboiNft.findOne.mockResolvedValueOnce(null);

    const { req, res, next } = createMocks({ params: { tokenId: "1" } });
    await callHandler(getNftDetail, req, res, next);

    const data = res.json.mock.calls[0][0].data;
    expect(data.isMaxLevel).toBe(true);
    expect(data.nextLevelCost).toBe(null);
    expect(data.rank).toBe("Field Marshal");
  });
});

// ==================== levelUp ====================

describe("levelUp", () => {
  const validTxHash = "0x" + "a".repeat(64);
  const userAddress = "0x469622d0fb5ed43b2e7c45e98d355f2cf03816a0";

  const setupHappyPath = () => {
    User.findOne.mockResolvedValue({
      uid: "testuid123",
      address: userAddress,
      level: 2,
      save: jest.fn().mockResolvedValue(),
    });
    Transaction.findOne.mockResolvedValue(null);
    Transaction.create.mockResolvedValue({
      status: "pending",
      metadata: {},
      save: jest.fn().mockResolvedValue(),
    });
    getNftOwner.mockResolvedValue(userAddress);
    getNftLevel.mockResolvedValue(2);
    Settings.findOne.mockResolvedValue(createSettingsMock());
    Wallet.findOne.mockImplementation((query) => {
      if (query && query.role === "prize_pool") {
        return Promise.resolve({ address: "0xprizepool" });
      }
      if (query && query.role === "deployer") {
        return {
          select: jest.fn().mockResolvedValue({ key: "enckey", iv: "enciv" }),
        };
      }
      return Promise.resolve(null);
    });
    verifyPayment.mockResolvedValue({ valid: true, reason: "Payment verified" });
    decrypt.mockResolvedValue("0xdeployerPrivateKey");
    setNftLevel.mockResolvedValue({ hash: "0xcontracttxhash" });
    ChainboiNft.findOneAndUpdate.mockResolvedValue({});
    reindexNftMetadata.mockResolvedValue({});
  };

  test("rejects missing tokenId", async () => {
    const { req, res, next } = createMocks({ body: { txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("rejects missing txHash", async () => {
    const { req, res, next } = createMocks({ body: { tokenId: 1 } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("rejects invalid txHash format", async () => {
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: "0xbadtx" } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("rejects invalid tokenId", async () => {
    const { req, res, next } = createMocks({ body: { tokenId: -1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("returns 404 when user not found", async () => {
    User.findOne.mockResolvedValue(null);
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });

  test("returns 400 when user has no wallet address", async () => {
    User.findOne.mockResolvedValue({ uid: "test", address: null });
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("returns 409 for replay txHash", async () => {
    User.findOne.mockResolvedValue({ uid: "test", address: userAddress, save: jest.fn() });
    Transaction.findOne.mockResolvedValue({ txHash: validTxHash });
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 409 }));
  });

  test("returns 403 when user does not own NFT", async () => {
    User.findOne.mockResolvedValue({ uid: "test", address: userAddress, save: jest.fn() });
    Transaction.findOne.mockResolvedValue(null);
    getNftOwner.mockResolvedValue("0xdifferentowner");
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  test("returns 400 when NFT is already max level", async () => {
    User.findOne.mockResolvedValue({ uid: "test", address: userAddress, save: jest.fn() });
    Transaction.findOne.mockResolvedValue(null);
    getNftOwner.mockResolvedValue(userAddress);
    getNftLevel.mockResolvedValue(7);
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("returns 400 when payment verification fails", async () => {
    setupHappyPath();
    verifyPayment.mockResolvedValue({ valid: false, reason: "Insufficient payment amount" });
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 400,
      message: "Insufficient payment amount",
    }));
  });

  test("returns 500 when contract call fails", async () => {
    const txRecord = { status: "pending", metadata: {}, save: jest.fn().mockResolvedValue() };
    setupHappyPath();
    Transaction.create.mockResolvedValue(txRecord);
    setNftLevel.mockRejectedValue(new Error("gas estimation failed"));
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));
    // Verify transaction was marked as failed
    expect(txRecord.status).toBe("failed");
    expect(txRecord.save).toHaveBeenCalled();
  });

  test("happy path: level up from 2 to 3", async () => {
    setupHappyPath();
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0].data;
    expect(data.tokenId).toBe(1);
    expect(data.previousLevel).toBe(2);
    expect(data.newLevel).toBe(3);
    expect(data.rank).toBe("Captain");
    expect(data.cost).toBe(2);
    expect(data.contractTxHash).toBe("0xcontracttxhash");
    expect(data.characters).toContain("Captain_A");

    // Verify contract was called correctly
    expect(setNftLevel).toHaveBeenCalledWith(1, 3, "0xdeployerPrivateKey");

    // Verify Firebase was synced
    expect(mockFbRef).toHaveBeenCalledWith("users/testuid123");
    expect(mockFbUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ level: 3 })
    );
  });

  test("succeeds even when Firebase sync fails", async () => {
    setupHappyPath();
    mockFbUpdate.mockRejectedValueOnce(new Error("Firebase unavailable"));
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("succeeds even when metadata reindex fails", async () => {
    setupHappyPath();
    reindexNftMetadata.mockRejectedValueOnce(new Error("reindex failed"));
    const { req, res, next } = createMocks({ body: { tokenId: 1, txHash: validTxHash } });
    await callHandler(levelUp, req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// ==================== getLevelUpCost ====================

describe("getLevelUpCost", () => {
  test("returns 503 when settings not configured", async () => {
    Settings.findOne.mockResolvedValue(null);
    const { req, res, next } = createMocks();
    await callHandler(getLevelUpCost, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 503 }));
  });

  test("returns full cost table with no params", async () => {
    Settings.findOne.mockResolvedValue(createSettingsMock());
    const { req, res, next } = createMocks();
    await callHandler(getLevelUpCost, req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0].data;
    expect(data.costs).toEqual({ "1": 1, "2": 1, "3": 2, "4": 2, "5": 3, "6": 3, "7": 5 });
    expect(data.maxLevel).toBe(7);
    expect(data.currency).toBe("AVAX");
  });

  test("returns cost for specific currentLevel", async () => {
    Settings.findOne.mockResolvedValue(createSettingsMock());
    const { req, res, next } = createMocks({ query: { currentLevel: "2" } });
    await callHandler(getLevelUpCost, req, res, next);

    const data = res.json.mock.calls[0][0].data;
    expect(data.currentLevel).toBe(2);
    expect(data.nextLevel).toBe(3);
    expect(data.cost).toBe(2);
    expect(data.rank).toBe("Sergeant");
    expect(data.nextRank).toBe("Captain");
    expect(data.isMaxLevel).toBe(false);
  });

  test("returns isMaxLevel when currentLevel is 7", async () => {
    Settings.findOne.mockResolvedValue(createSettingsMock());
    const { req, res, next } = createMocks({ query: { currentLevel: "7" } });
    await callHandler(getLevelUpCost, req, res, next);

    const data = res.json.mock.calls[0][0].data;
    expect(data.isMaxLevel).toBe(true);
    expect(data.cost).toBe(null);
    expect(data.rank).toBe("Field Marshal");
  });

  test("returns cost by tokenId", async () => {
    Settings.findOne.mockResolvedValue(createSettingsMock());
    getNftLevel.mockResolvedValue(4);
    const { req, res, next } = createMocks({ query: { tokenId: "1" } });
    await callHandler(getLevelUpCost, req, res, next);

    const data = res.json.mock.calls[0][0].data;
    expect(data.currentLevel).toBe(4);
    expect(data.nextLevel).toBe(5);
    expect(data.cost).toBe(3);
    expect(data.rank).toBe("Major");
    expect(data.nextRank).toBe("Colonel");
  });

  test("rejects invalid currentLevel", async () => {
    Settings.findOne.mockResolvedValue(createSettingsMock());
    const { req, res, next } = createMocks({ query: { currentLevel: "10" } });
    await callHandler(getLevelUpCost, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("rejects invalid tokenId", async () => {
    Settings.findOne.mockResolvedValue(createSettingsMock());
    const { req, res, next } = createMocks({ query: { tokenId: "abc" } });
    await callHandler(getLevelUpCost, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });
});

// ==================== getEligibility ====================

describe("getEligibility", () => {
  test("rejects invalid tokenId", async () => {
    const { req, res, next } = createMocks({ params: { tokenId: "abc" } });
    await callHandler(getEligibility, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("returns 404 when token does not exist", async () => {
    getNftLevel.mockRejectedValueOnce(new Error("invalid token"));
    const { req, res, next } = createMocks({ params: { tokenId: "999" } });
    await callHandler(getEligibility, req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
  });

  test("returns eligible levels for level 3 NFT", async () => {
    getNftLevel.mockResolvedValue(3);
    Tournament.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          { _id: "t1", level: 1, status: "active", prizePool: 2, startTime: new Date(), endTime: new Date() },
          { _id: "t2", level: 2, status: "upcoming", prizePool: 4, startTime: new Date(), endTime: new Date() },
        ]),
      }),
    });

    const { req, res, next } = createMocks({ params: { tokenId: "1" } });
    await callHandler(getEligibility, req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    const data = res.json.mock.calls[0][0].data;
    expect(data.level).toBe(3);
    expect(data.rank).toBe("Captain");
    expect(data.eligibleLevels).toEqual([1, 2, 3]);
    expect(data.activeTournaments.length).toBe(1);
    expect(data.upcomingTournaments.length).toBe(1);
  });

  test("returns empty eligibility for level 0 NFT", async () => {
    getNftLevel.mockResolvedValue(0);

    const { req, res, next } = createMocks({ params: { tokenId: "1" } });
    await callHandler(getEligibility, req, res, next);

    const data = res.json.mock.calls[0][0].data;
    expect(data.eligibleLevels).toEqual([]);
    expect(data.activeTournaments).toEqual([]);
    expect(data.upcomingTournaments).toEqual([]);
  });
});
