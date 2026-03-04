// Mock Firebase
const mockOnce = jest.fn();
const mockRef = jest.fn(() => ({ once: mockOnce }));

jest.mock("../config/firebase", () => ({
  getFirebaseDb: () => ({ ref: (...args) => mockRef(...args) }),
}));

// Mock User model
const mockUserFindOne = jest.fn();
const mockUserSave = jest.fn().mockResolvedValue();

jest.mock("../models/userModel", () => ({
  findOne: (...args) => mockUserFindOne(...args),
}));

// Mock WeeklyLeaderboard
const mockLbFindOneAndUpdate = jest.fn().mockResolvedValue({});

jest.mock("../models/weeklyLeaderboardModel", () => ({
  findOneAndUpdate: (...args) => mockLbFindOneAndUpdate(...args),
}));

// Mock antiCheat
const mockGetOrCreateSP = jest.fn();
const mockCheckBanStatus = jest.fn();
const mockCheckDailyEarnings = jest.fn();
const mockSPSave = jest.fn().mockResolvedValue();

jest.mock("../middleware/antiCheat", () => ({
  getOrCreateSecurityProfile: (...args) => mockGetOrCreateSP(...args),
  updateThreatScore: jest.fn(),
  checkBanStatus: (...args) => mockCheckBanStatus(...args),
  checkDailyEarnings: (...args) => mockCheckDailyEarnings(...args),
}));

const { syncScoresJob } = require("../jobs/syncScoresJob");

const makeUser = (overrides = {}) => ({
  uid: "abcdefghijklmnopqrstuvwxyz12",
  score: 0,
  highScore: 0,
  gamesPlayed: 0,
  pointsBalance: 0,
  level: 0,
  isBanned: false,
  address: "0xabc",
  username: "player1",
  lastScoreSync: null,
  save: mockUserSave,
  ...overrides,
});

const makeSecurityProfile = (overrides = {}) => ({
  uid: "abcdefghijklmnopqrstuvwxyz12",
  threatScore: 0,
  dailyEarnings: 0,
  dailyEarningsResetAt: new Date(),
  violationLog: [],
  save: mockSPSave,
  ...overrides,
});

describe("syncScoresJob", () => {
  const uid = "abcdefghijklmnopqrstuvwxyz12";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles null Firebase snapshot", async () => {
    mockOnce.mockResolvedValue({ val: () => null });
    await syncScoresJob();
    expect(mockUserFindOne).not.toHaveBeenCalled();
  });

  test("skips users not in MongoDB", async () => {
    mockOnce.mockResolvedValue({
      val: () => ({ [uid]: { Score: 100 } }),
    });
    mockUserFindOne.mockResolvedValue(null);

    await syncScoresJob();
    expect(mockGetOrCreateSP).not.toHaveBeenCalled();
  });

  test("skips banned users and marks them in MongoDB", async () => {
    const user = makeUser({ isBanned: false });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 100 } }) });
    mockUserFindOne.mockResolvedValue(user);
    mockGetOrCreateSP.mockResolvedValue(sp);
    mockCheckBanStatus.mockResolvedValue({ banned: true, reason: "banned" });

    await syncScoresJob();

    expect(user.isBanned).toBe(true);
    expect(mockUserSave).toHaveBeenCalled();
  });

  test("clears isBanned when ban expires", async () => {
    const user = makeUser({ isBanned: true, score: 0 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 0 } }) });
    mockUserFindOne.mockResolvedValue(user);
    mockGetOrCreateSP.mockResolvedValue(sp);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });

    await syncScoresJob();

    expect(user.isBanned).toBe(false);
    expect(mockUserSave).toHaveBeenCalled();
  });

  test("skips when no score change", async () => {
    const user = makeUser({ score: 500 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 500 } }) });
    mockUserFindOne.mockResolvedValue(user);
    mockGetOrCreateSP.mockResolvedValue(sp);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });

    await syncScoresJob();

    // User.save called only for isBanned check, not for score update
    expect(mockLbFindOneAndUpdate).not.toHaveBeenCalled();
  });

  test("processes valid score delta", async () => {
    const user = makeUser({ score: 100 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 600 } }) });
    mockUserFindOne.mockResolvedValue(user);
    mockGetOrCreateSP.mockResolvedValue(sp);
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
  });

  test("caps delta at MAX_POINTS_PER_MATCH", async () => {
    const user = makeUser({ score: 0 });
    const sp = makeSecurityProfile();
    // Score jumped by 10000 (> 5000 max)
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 10000 } }) });
    mockUserFindOne.mockResolvedValue(user);
    mockGetOrCreateSP.mockResolvedValue(sp);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 5000 });

    await syncScoresJob();

    expect(user.pointsBalance).toBe(5000);
    // Threat score should be incremented for suspicious delta
    expect(sp.threatScore).toBe(5); // VELOCITY_EXPLOIT increment
    expect(sp.violationLog).toHaveLength(1);
  });

  test("skips when daily earnings disallowed", async () => {
    const user = makeUser({ score: 0 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 500 } }) });
    mockUserFindOne.mockResolvedValue(user);
    mockGetOrCreateSP.mockResolvedValue(sp);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: false, cappedAmount: 0 });

    await syncScoresJob();

    expect(user.score).toBe(0); // Not updated
    expect(mockSPSave).toHaveBeenCalled(); // Still saves for daily reset
    expect(mockLbFindOneAndUpdate).not.toHaveBeenCalled();
  });

  test("upserts weekly leaderboard with year and weekNumber", async () => {
    const user = makeUser({ score: 0, level: 2 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 1000 } }) });
    mockUserFindOne.mockResolvedValue(user);
    mockGetOrCreateSP.mockResolvedValue(sp);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 1000 });

    await syncScoresJob();

    const lbCall = mockLbFindOneAndUpdate.mock.calls[0];
    expect(lbCall[0].uid).toBe(uid);
    expect(lbCall[0].year).toBe(new Date().getFullYear());
    expect(lbCall[0].weekNumber).toBeGreaterThan(0);
    expect(lbCall[0].tournamentLevel).toBe(2);
    expect(lbCall[1].$max.highScore).toBe(1000);
    expect(lbCall[1].$inc.totalScore).toBe(1000);
    expect(lbCall[2].upsert).toBe(true);
  });

  test("handles per-user errors without aborting job", async () => {
    const uid2 = "zyxwvutsrqponmlkjihgfedcba21";
    const user1 = makeUser({ uid, score: 0, save: jest.fn().mockRejectedValue(new Error("DB error")) });
    const user2 = makeUser({ uid: uid2, score: 0 });
    const sp = makeSecurityProfile();

    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: { Score: 100 },
        [uid2]: { Score: 200 },
      }),
    });
    mockUserFindOne
      .mockResolvedValueOnce(user1)
      .mockResolvedValueOnce(user2);
    mockGetOrCreateSP.mockResolvedValue(sp);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });
    mockCheckDailyEarnings.mockReturnValue({ allowed: true, cappedAmount: 200 });

    await syncScoresJob(); // Should not throw

    // Second user should still be processed
    expect(mockUserFindOne).toHaveBeenCalledTimes(2);
  });

  test("skips score decrease (should not happen)", async () => {
    const user = makeUser({ score: 1000 });
    const sp = makeSecurityProfile();
    mockOnce.mockResolvedValue({ val: () => ({ [uid]: { Score: 500 } }) });
    mockUserFindOne.mockResolvedValue(user);
    mockGetOrCreateSP.mockResolvedValue(sp);
    mockCheckBanStatus.mockResolvedValue({ banned: false, reason: "" });

    await syncScoresJob();

    expect(user.score).toBe(1000); // Unchanged
    expect(mockLbFindOneAndUpdate).not.toHaveBeenCalled();
  });

  test("handles Firebase error gracefully", async () => {
    mockOnce.mockRejectedValue(new Error("Firebase down"));
    await syncScoresJob(); // Should not throw
  });
});
