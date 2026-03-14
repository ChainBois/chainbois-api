// Mock Firebase
const mockOnce = jest.fn();
const mockRef = jest.fn(() => ({ once: mockOnce }));

jest.mock("../config/firebase", () => ({
  getFirebaseDb: () => ({ ref: (...args) => mockRef(...args) }),
}));

// Mock User model
const mockUserFind = jest.fn();
const mockUserSave = jest.fn().mockResolvedValue();

jest.mock("../models/userModel", () => ({
  find: (...args) => mockUserFind(...args),
}));

// Mock SecurityProfile model
const mockSPFind = jest.fn();
const mockSPFindOneAndUpdate = jest.fn();

jest.mock("../models/securityProfileModel", () => ({
  find: (...args) => mockSPFind(...args),
  findOneAndUpdate: (...args) => mockSPFindOneAndUpdate(...args),
}));

// Mock WeeklyLeaderboard
const mockLbFindOneAndUpdate = jest.fn().mockResolvedValue({});

jest.mock("../models/weeklyLeaderboardModel", () => ({
  findOneAndUpdate: (...args) => mockLbFindOneAndUpdate(...args),
}));

// Mock ScoreChange
const mockScoreChangeCreate = jest.fn().mockResolvedValue({});

jest.mock("../models/scoreChangeModel", () => ({
  create: (...args) => mockScoreChangeCreate(...args),
}));

// Mock Tournament model
const mockTournamentFind = jest.fn();
jest.mock("../models/tournamentModel", () => ({
  find: (...args) => mockTournamentFind(...args),
}));

// Mock ChainboiNft model
const mockNftBulkWrite = jest.fn().mockResolvedValue({ modifiedCount: 0 });
jest.mock("../models/chainboiNftModel", () => ({
  bulkWrite: (...args) => mockNftBulkWrite(...args),
}));

// Mock weekUtils
jest.mock("../utils/weekUtils", () => ({
  getWeekInfo: () => ({ weekNumber: 10, year: 2026 }),
}));

// Mock antiCheat
const mockCheckBanStatus = jest.fn();
const mockCheckDailyEarnings = jest.fn();
const mockSPSave = jest.fn().mockResolvedValue();

jest.mock("../middleware/antiCheat", () => ({
  updateThreatScore: jest.fn(),
  checkBanStatus: (...args) => mockCheckBanStatus(...args),
  checkDailyEarnings: (...args) => mockCheckDailyEarnings(...args),
}));

const { syncScoresJob } = require("../jobs/syncScoresJob");

const uid = "abcdefghijklmnopqrstuvwxyz12";

const makeUser = (overrides = {}) => ({
  uid,
  score: 0,
  highScore: 0,
  gamesPlayed: 0,
  pointsBalance: 0,
  level: 0,
  isBanned: false,
  hasNft: true,
  address: "0xabc",
  username: "player1",
  lastScoreSync: null,
  save: mockUserSave,
  ...overrides,
});

const makeSecurityProfile = (overrides = {}) => ({
  uid,
  threatScore: 0,
  dailyEarnings: 0,
  dailyEarningsResetAt: new Date(),
  violationLog: [],
  save: mockSPSave,
  ...overrides,
});

// Helper to set up batch mocks: User.find returns users, SP.find returns profiles
const setupBatchMocks = (users, profiles) => {
  mockUserFind.mockResolvedValue(users);
  mockSPFind.mockResolvedValue(profiles || []);
  mockTournamentFind.mockReturnValue({ lean: () => Promise.resolve([]) });
};

describe("syncScoresJob", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTournamentFind.mockReturnValue({ lean: () => Promise.resolve([]) });
  });

  test("handles null Firebase snapshot", async () => {
    mockOnce.mockResolvedValue({ val: () => null });
    await syncScoresJob();
    expect(mockUserFind).not.toHaveBeenCalled();
  });

  test("skips users not in MongoDB", async () => {
    mockOnce.mockResolvedValue({
      val: () => ({ [uid]: { Score: 100 } }),
    });
    setupBatchMocks([], []);

    await syncScoresJob();
    expect(mockCheckBanStatus).not.toHaveBeenCalled();
  });

  test("skips banned users and marks them in MongoDB", async () => {
    const user = makeUser({ isBanned: false });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 100 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: true, reason: "banned" });

    await syncScoresJob();

    expect(user.isBanned).toBe(true);
    expect(mockUserSave).toHaveBeenCalled();
  });

  test("clears isBanned when ban expires", async () => {
    const user = makeUser({ isBanned: true, score: 0 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 0 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });

    await syncScoresJob();

    expect(user.isBanned).toBe(false);
    expect(mockUserSave).toHaveBeenCalled();
  });

  test("skips when no score change", async () => {
    const user = makeUser({ score: 500 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 500 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });

    await syncScoresJob();

    expect(mockLbFindOneAndUpdate).not.toHaveBeenCalled();
    expect(mockScoreChangeCreate).not.toHaveBeenCalled();
  });

  test("processes valid score delta", async () => {
    const user = makeUser({ score: 100 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 600 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 500 });

    await syncScoresJob();

    expect(user.score).toBe(600);
    expect(user.highScore).toBe(600);
    expect(user.pointsBalance).toBe(500);
    expect(user.gamesPlayed).toBe(1);
    expect(sp.dailyEarnings).toBe(500);
    expect(mockSPSave).toHaveBeenCalled();
    expect(mockUserSave).toHaveBeenCalled();
    expect(mockLbFindOneAndUpdate).toHaveBeenCalled();
    expect(mockScoreChangeCreate).toHaveBeenCalledWith({
      uid,
      address: "0xabc",
      username: "player1",
      score: 600,
      previousScore: 100,
      scoreChange: 500,
    });
  });

  test("caps delta at MAX_POINTS_PER_MATCH", async () => {
    const user = makeUser({ score: 0 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 10000 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 5000 });

    await syncScoresJob();

    expect(user.pointsBalance).toBe(5000);
    expect(sp.threatScore).toBe(5);
    expect(sp.violationLog).toHaveLength(1);
    expect(mockScoreChangeCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        scoreChange: 5000,
        score: 10000,
        previousScore: 0,
      })
    );
  });

  test("skips when daily earnings disallowed", async () => {
    const user = makeUser({ score: 0 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 500 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: false, cappedAmount: 0 });

    await syncScoresJob();

    expect(user.score).toBe(0);
    expect(mockSPSave).toHaveBeenCalled();
    expect(mockLbFindOneAndUpdate).not.toHaveBeenCalled();
    expect(mockScoreChangeCreate).not.toHaveBeenCalled();
  });

  test("upserts weekly leaderboard with year and weekNumber", async () => {
    const user = makeUser({ score: 0, level: 2 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 1000 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 1000 });

    await syncScoresJob();

    const lbCall = mockLbFindOneAndUpdate.mock.calls[0];
    expect(lbCall[0].uid).toBe(uid);
    expect(lbCall[0].year).toBe(2026);
    expect(lbCall[0].weekNumber).toBe(10);
    expect(lbCall[0].tournamentLevel).toBe(2);
    expect(lbCall[1].$max.highScore).toBe(1000);
    expect(lbCall[1].$inc.totalScore).toBe(1000);
    expect(lbCall[2].upsert).toBe(true);
  });

  test("handles per-user errors without aborting job", async () => {
    const uid2 = "zyxwvutsrqponmlkjihgfedcba21";
    const user1 = makeUser({ uid, score: 0, save: jest.fn().mockRejectedValue(new Error("DB error")) });
    const user2 = makeUser({ uid: uid2, score: 0 });
    const sp1 = makeSecurityProfile({ uid });
    const sp2 = makeSecurityProfile({ uid: uid2 });

    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: { Score: 100 },
        [uid2]: { Score: 200 },
      }),
    });
    setupBatchMocks([user1, user2], [sp1, sp2]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 200 });

    await syncScoresJob(); // Should not throw
  });

  test("skips score decrease (should not happen)", async () => {
    const user = makeUser({ score: 1000 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 500 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });

    await syncScoresJob();

    expect(user.score).toBe(1000);
    expect(mockLbFindOneAndUpdate).not.toHaveBeenCalled();
    expect(mockScoreChangeCreate).not.toHaveBeenCalled();
  });

  test("handles Firebase error gracefully", async () => {
    mockOnce.mockRejectedValue(new Error("Firebase down"));
    await syncScoresJob(); // Should not throw
  });

  test("syncs in-game stats to ChainboiNft via bulkWrite after score update", async () => {
    const user = makeUser({ score: 100, gamesPlayed: 5, hasNft: true, address: "0xABC" });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 600 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 500 });

    await syncScoresJob();

    expect(mockNftBulkWrite).toHaveBeenCalledWith([
      {
        updateMany: {
          filter: { ownerAddress: "0xabc" },
          update: {
            $set: {
              "inGameStats.score": 600,
              "inGameStats.gamesPlayed": 6,
            },
          },
        },
      },
    ]);
  });

  test("skips NFT stats sync when user has no NFT", async () => {
    const user = makeUser({ score: 0, hasNft: false });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 500 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 500 });

    await syncScoresJob();

    expect(mockNftBulkWrite).not.toHaveBeenCalled();
  });

  test("skips NFT stats sync when user has no address", async () => {
    const user = makeUser({ score: 0, address: "", hasNft: true });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 500 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 500 });

    await syncScoresJob();

    expect(mockNftBulkWrite).not.toHaveBeenCalled();
  });

  test("NFT stats bulkWrite failure does not break score sync", async () => {
    const user = makeUser({ score: 0, hasNft: true });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 500 } }) });
    setupBatchMocks([user], [sp]);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 500 });
    mockNftBulkWrite.mockRejectedValueOnce(new Error("NFT DB error"));

    await syncScoresJob();

    expect(user.score).toBe(500);
    expect(mockUserSave).toHaveBeenCalled();
    expect(mockLbFindOneAndUpdate).toHaveBeenCalled();
    expect(mockScoreChangeCreate).toHaveBeenCalled();
  });

  test("creates security profile on the fly when not in batch", async () => {
    const user = makeUser();
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 100 } }) });
    // User exists but no security profile in batch
    setupBatchMocks([user], []);
    mockSPFindOneAndUpdate.mockResolvedValue(sp);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 100 });

    await syncScoresJob();

    expect(mockSPFindOneAndUpdate).toHaveBeenCalledWith(
      { uid },
      { $setOnInsert: { uid } },
      { upsert: true, new: true }
    );
    expect(user.score).toBe(100);
  });
});
