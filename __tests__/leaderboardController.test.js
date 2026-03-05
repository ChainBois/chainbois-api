// Mock catchAsync to be a passthrough (so await works in tests)
jest.mock("../utils/catchAsync", () => (fn) => fn);

// Mock User model
const mockUserFindOne = jest.fn();
const mockUserCountDocuments = jest.fn();
const mockChainLean = jest.fn();
const mockChain = {
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  lean: mockChainLean,
};
const mockUserFind = jest.fn(() => mockChain);

jest.mock("../models/userModel", () => ({
  find: (...args) => mockUserFind(...args),
  findOne: (...args) => mockUserFindOne(...args),
  countDocuments: (...args) => mockUserCountDocuments(...args),
}));

// Mock ScoreChange model
const mockScoreChangeAggregate = jest.fn();

jest.mock("../models/scoreChangeModel", () => ({
  aggregate: (...args) => mockScoreChangeAggregate(...args),
}));

const { getLeaderboard, getUserRank, parseTimePeriod } = require("../controllers/leaderboardController");

// Helper to create mock req/res/next
const createMocks = (overrides = {}) => {
  const req = {
    params: {},
    query: {},
    user: { uid: "test_uid" },
    ...overrides,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
};

describe("leaderboardController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Re-setup chain mocks after clearAllMocks
    mockChain.sort.mockReturnThis();
    mockChain.skip.mockReturnThis();
    mockChain.limit.mockReturnThis();
    mockChain.select.mockReturnThis();
  });

  describe("parseTimePeriod", () => {
    test("returns null for 'all'", () => {
      expect(parseTimePeriod("all")).toBeNull();
    });

    test("returns undefined for invalid period", () => {
      expect(parseTimePeriod("invalid")).toBeUndefined();
    });

    test("returns date range for '24hours'", () => {
      const result = parseTimePeriod("24hours");
      expect(result).toBeDefined();
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      const diff = result.endDate - result.startDate;
      expect(diff).toBeGreaterThan(24 * 60 * 60 * 1000 - 1000);
      expect(diff).toBeLessThan(24 * 60 * 60 * 1000 + 1000);
    });

    test("returns date range for 'week'", () => {
      const result = parseTimePeriod("week");
      expect(result).toBeDefined();
      const diff = result.endDate - result.startDate;
      expect(diff).toBeGreaterThan(7 * 24 * 60 * 60 * 1000 - 1000);
    });
  });

  describe("getLeaderboard", () => {
    test("default period 'all' uses User model", async () => {
      const { req, res, next } = createMocks();

      mockUserCountDocuments.mockResolvedValue(2);
      mockChainLean.mockResolvedValue([
        { uid: "user1", username: "Player1", score: 1000 },
        { uid: "user2", username: "Player2", score: 500 },
      ]);

      await getLeaderboard(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.period).toBe("all");
      expect(response.leaderboard).toHaveLength(2);
      expect(response.leaderboard[0].uid).toBe("user1");
      expect(response.leaderboard[0].rank).toBe(1);
      expect(response.leaderboard[1].rank).toBe(2);
      expect(response.totalUsers).toBe(2);
      expect(mockScoreChangeAggregate).not.toHaveBeenCalled();
    });

    test("period 'week' uses ScoreChange aggregation", async () => {
      const { req, res, next } = createMocks({
        params: { period: "week" },
      });

      mockScoreChangeAggregate.mockResolvedValue([
        {
          metadata: [{ total: 1 }],
          data: [
            { _id: "user1", username: "Player1", scoreGained: 800, currentScore: 1500 },
          ],
        },
      ]);

      await getLeaderboard(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.period).toBe("week");
      expect(response.leaderboard).toHaveLength(1);
      expect(response.leaderboard[0].uid).toBe("user1");
      expect(response.leaderboard[0].scoreGained).toBe(800);
      expect(response.startDate).toBeDefined();
      expect(response.endDate).toBeDefined();
    });

    test("pagination works correctly", async () => {
      const { req, res, next } = createMocks({
        query: { page: "2", limit: "1" },
      });

      mockUserCountDocuments.mockResolvedValue(3);
      mockChainLean.mockResolvedValue([
        { uid: "user2", username: "Player2", score: 500 },
      ]);

      await getLeaderboard(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.currentPage).toBe(2);
      expect(response.totalPages).toBe(3);
      expect(response.leaderboard[0].rank).toBe(2);
    });

    test("invalid period returns 400", async () => {
      const { req, res, next } = createMocks({
        params: { period: "invalid" },
      });

      await getLeaderboard(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain("Invalid period");
    });
  });

  describe("getUserRank", () => {
    test("returns rank for valid uid with 'all' period", async () => {
      const { req, res, next } = createMocks({
        params: { uid: "user1" },
      });

      mockUserFindOne.mockResolvedValue({
        uid: "user1",
        username: "Player1",
        score: 1000,
      });
      mockUserCountDocuments.mockResolvedValue(2);

      await getUserRank(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.uid).toBe("user1");
      expect(response.rank).toBe(3);
      expect(response.scoreGained).toBe(1000);
      expect(response.currentScore).toBe(1000);
    });

    test("returns 404 for unknown uid", async () => {
      const { req, res, next } = createMocks({
        params: { uid: "nonexistent" },
      });

      mockUserFindOne.mockResolvedValue(null);

      await getUserRank(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("User not found");
    });

    test("returns rank for time-period query", async () => {
      const { req, res, next } = createMocks({
        params: { uid: "user1" },
        query: { period: "week" },
      });

      mockUserFindOne.mockResolvedValue({
        uid: "user1",
        username: "Player1",
        score: 1000,
      });

      mockScoreChangeAggregate
        .mockResolvedValueOnce([
          { _id: "user1", scoreGained: 500, currentScore: 1000 },
        ])
        .mockResolvedValueOnce([{ count: 3 }]);

      await getUserRank(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.rank).toBe(4);
      expect(response.scoreGained).toBe(500);
      expect(response.period).toBe("week");
    });

    test("invalid period returns 400", async () => {
      const { req, res, next } = createMocks({
        params: { uid: "user1" },
        query: { period: "invalid" },
      });

      await getUserRank(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(400);
    });
  });
});
