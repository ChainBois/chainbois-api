// Mock dependencies
const mockOnce = jest.fn();
const mockUpdate = jest.fn().mockResolvedValue();
const mockRef = jest.fn(() => ({
  once: mockOnce,
  update: mockUpdate,
}));

jest.mock("../config/firebase", () => ({
  getFirebaseDb: () => ({
    ref: (...args) => mockRef(...args),
  }),
}));

const mockCreate = jest.fn();
const mockDistinct = jest.fn();

jest.mock("../models/userModel", () => ({
  create: (...args) => mockCreate(...args),
  distinct: (...args) => mockDistinct(...args),
}));

jest.mock("../models/platformMetricsModel", () => ({
  incrementUsers: jest.fn().mockResolvedValue(),
}));

const { syncNewUsersJob } = require("../jobs/syncNewUsersJob");

describe("syncNewUsersJob", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDistinct.mockResolvedValue([]);
  });

  test("handles null Firebase snapshot", async () => {
    mockOnce.mockResolvedValue({ val: () => null });
    await syncNewUsersJob();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("skips users with short UIDs", async () => {
    mockOnce.mockResolvedValue({
      val: () => ({ short: { username: "test", Score: 100 } }),
    });

    await syncNewUsersJob();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("skips users already in MongoDB", async () => {
    const uid = "abcdefghijklmnopqrstuvwxyz12";
    mockDistinct.mockResolvedValue([uid]);
    mockOnce.mockResolvedValue({
      val: () => ({ [uid]: { username: "test", Score: 100 } }),
    });

    await syncNewUsersJob();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("creates new user from Firebase data", async () => {
    const uid = "abcdefghijklmnopqrstuvwxyz12";
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: { username: "player1", Score: 500 },
      }),
    });
    mockCreate.mockResolvedValue({});

    await syncNewUsersJob();

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        uid,
        username: "player1",
        playerType: "web2",
        address: null,
        score: 500,
        pointsBalance: 0,
        hasNft: false,
        level: 0,
      })
    );
  });

  test("writes defaults back to Firebase", async () => {
    const uid = "abcdefghijklmnopqrstuvwxyz12";
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: { username: "player1", Score: 0 },
      }),
    });
    mockCreate.mockResolvedValue({});

    await syncNewUsersJob();

    expect(mockRef).toHaveBeenCalledWith(`users/${uid}`);
    expect(mockUpdate).toHaveBeenCalledWith({ level: 0, hasNFT: false, hasnft: false });
  });

  test("handles duplicate key error gracefully", async () => {
    const uid = "abcdefghijklmnopqrstuvwxyz12";
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: { username: "player1", Score: 0 },
      }),
    });
    mockCreate.mockRejectedValue({ code: 11000 });

    // Should not throw
    await syncNewUsersJob();
  });

  test("handles non-duplicate create errors gracefully", async () => {
    const uid = "abcdefghijklmnopqrstuvwxyz12";
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: { username: "test", Score: 0 },
      }),
    });
    mockCreate.mockRejectedValue(new Error("DB connection error"));

    // Should not throw
    await syncNewUsersJob();
  });

  test("skips non-object userData", async () => {
    const uid = "abcdefghijklmnopqrstuvwxyz12";
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: "not an object",
      }),
    });

    await syncNewUsersJob();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("truncates long usernames to 100 chars", async () => {
    const uid = "abcdefghijklmnopqrstuvwxyz12";
    const longName = "a".repeat(200);
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: { username: longName, Score: 0 },
      }),
    });
    mockCreate.mockResolvedValue({});

    await syncNewUsersJob();

    const createArg = mockCreate.mock.calls[0][0];
    expect(createArg.username.length).toBe(100);
  });

  test("handles missing username gracefully", async () => {
    const uid = "abcdefghijklmnopqrstuvwxyz12";
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: { Score: 100 },
      }),
    });
    mockCreate.mockResolvedValue({});

    await syncNewUsersJob();

    const createArg = mockCreate.mock.calls[0][0];
    expect(createArg.username).toBe("");
  });

  test("handles Firebase read error gracefully", async () => {
    mockOnce.mockRejectedValue(new Error("Firebase down"));
    await syncNewUsersJob(); // Should not throw
  });
});
