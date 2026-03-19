// Mock dependencies
const mockOnce = jest.fn();
const mockRef = jest.fn(() => ({
  once: mockOnce,
}));

jest.mock("../config/firebase", () => ({
  getFirebaseDb: () => ({
    ref: (...args) => mockRef(...args),
  }),
}));

const mockDistinct = jest.fn();

jest.mock("../models/userModel", () => ({
  distinct: (...args) => mockDistinct(...args),
}));

const mockUpdateOne = jest.fn().mockResolvedValue();

jest.mock("../models/platformMetricsModel", () => ({
  updateOne: (...args) => mockUpdateOne(...args),
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
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });

  test("skips users with short UIDs", async () => {
    mockOnce.mockResolvedValue({
      val: () => ({ short: { username: "test", Score: 100 } }),
    });

    await syncNewUsersJob();

    expect(mockUpdateOne).toHaveBeenCalledWith(
      {},
      { $set: { "users.web2": 0, "users.web3": 0, "users.total": 0 } },
      { upsert: true },
    );
  });

  test("counts Firebase users not in MongoDB as web2", async () => {
    const uid1 = "abcdefghijklmnopqrstuvwxyz12";
    const uid2 = "zyxwvutsrqponmlkjihgfedcba12";
    mockDistinct.mockResolvedValue([]);
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid1]: { username: "player1", Score: 500 },
        [uid2]: { username: "player2", Score: 200 },
      }),
    });

    await syncNewUsersJob();

    expect(mockUpdateOne).toHaveBeenCalledWith(
      {},
      { $set: { "users.web2": 2, "users.web3": 0, "users.total": 2 } },
      { upsert: true },
    );
  });

  test("excludes MongoDB users from web2 count", async () => {
    const uid1 = "abcdefghijklmnopqrstuvwxyz12";
    const uid2 = "zyxwvutsrqponmlkjihgfedcba12";
    mockDistinct.mockResolvedValue([uid1]); // uid1 already in MongoDB
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid1]: { username: "player1", Score: 500 },
        [uid2]: { username: "player2", Score: 200 },
      }),
    });

    await syncNewUsersJob();

    expect(mockUpdateOne).toHaveBeenCalledWith(
      {},
      { $set: { "users.web2": 1, "users.web3": 1, "users.total": 2 } },
      { upsert: true },
    );
  });

  test("all Firebase users in MongoDB means zero web2", async () => {
    const uid = "abcdefghijklmnopqrstuvwxyz12";
    mockDistinct.mockResolvedValue([uid]);
    mockOnce.mockResolvedValue({
      val: () => ({
        [uid]: { username: "player1", Score: 100 },
      }),
    });

    await syncNewUsersJob();

    expect(mockUpdateOne).toHaveBeenCalledWith(
      {},
      { $set: { "users.web2": 0, "users.web3": 1, "users.total": 1 } },
      { upsert: true },
    );
  });

  test("handles Firebase read error gracefully", async () => {
    mockOnce.mockRejectedValue(new Error("Firebase down"));
    await syncNewUsersJob(); // Should not throw
  });
});
