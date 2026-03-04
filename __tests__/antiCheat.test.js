const { SECURITY, MAX_POINTS_PER_MATCH } = require("../config/constants");

// Mock SecurityProfile
const mockSave = jest.fn().mockResolvedValue(true);
const mockFindOneAndUpdate = jest.fn();

jest.mock("../models/securityProfileModel", () => ({
  findOneAndUpdate: (...args) => mockFindOneAndUpdate(...args),
}));

const {
  validateScore,
  checkVelocity,
  getOrCreateSecurityProfile,
  updateThreatScore,
  enforceThresholds,
  checkDailyEarnings,
  checkBanStatus,
} = require("../middleware/antiCheat");

describe("antiCheat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- validateScore ---
  describe("validateScore", () => {
    test("returns valid for normal score", () => {
      const result = validateScore(100);
      expect(result.valid).toBe(true);
    });

    test("returns valid for zero score", () => {
      const result = validateScore(0);
      expect(result.valid).toBe(true);
    });

    test("returns valid for max score", () => {
      const result = validateScore(MAX_POINTS_PER_MATCH);
      expect(result.valid).toBe(true);
    });

    test("rejects score exceeding max", () => {
      const result = validateScore(MAX_POINTS_PER_MATCH + 1);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("exceeds maximum");
    });

    test("rejects negative score", () => {
      const result = validateScore(-10);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("negative");
    });

    test("rejects NaN", () => {
      const result = validateScore(NaN);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("not a valid number");
    });

    test("rejects string", () => {
      const result = validateScore("100");
      expect(result.valid).toBe(false);
    });

    test("rejects undefined", () => {
      const result = validateScore(undefined);
      expect(result.valid).toBe(false);
    });

    test("rejects null", () => {
      const result = validateScore(null);
      expect(result.valid).toBe(false);
    });
  });

  // --- checkVelocity ---
  describe("checkVelocity", () => {
    test("accepts normal velocity", () => {
      const result = checkVelocity(100, 60); // ~1.67 pts/sec
      expect(result.valid).toBe(true);
    });

    test("rejects excessive velocity", () => {
      const result = checkVelocity(5000, 10); // 500 pts/sec
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("velocity too high");
    });

    test("rejects zero duration", () => {
      const result = checkVelocity(100, 0);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("Invalid session duration");
    });

    test("rejects negative duration", () => {
      const result = checkVelocity(100, -5);
      expect(result.valid).toBe(false);
    });

    test("accepts exactly at threshold (10 pts/sec)", () => {
      const result = checkVelocity(100, 10); // exactly 10 pts/sec
      expect(result.valid).toBe(true);
    });

    test("rejects just above threshold", () => {
      const result = checkVelocity(101, 10); // 10.1 pts/sec
      expect(result.valid).toBe(false);
    });
  });

  // --- getOrCreateSecurityProfile ---
  describe("getOrCreateSecurityProfile", () => {
    test("calls findOneAndUpdate with correct args", async () => {
      const mockProfile = { uid: "test-uid", threatScore: 0 };
      mockFindOneAndUpdate.mockResolvedValue(mockProfile);

      const result = await getOrCreateSecurityProfile("test-uid");

      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { uid: "test-uid" },
        { $setOnInsert: { uid: "test-uid" } },
        { upsert: true, new: true }
      );
      expect(result).toEqual(mockProfile);
    });
  });

  // --- enforceThresholds ---
  describe("enforceThresholds", () => {
    test("sets active status below cooldown threshold", () => {
      const profile = { threatScore: 50 };
      enforceThresholds(profile);
      expect(profile.status).toBe("active");
    });

    test("sets cooldown at cooldown threshold", () => {
      const profile = { threatScore: SECURITY.THREAT_THRESHOLDS.COOLDOWN };
      enforceThresholds(profile);
      expect(profile.status).toBe("cooldown");
    });

    test("sets temp_ban at temporary ban threshold", () => {
      const profile = { threatScore: SECURITY.THREAT_THRESHOLDS.TEMPORARY_BAN };
      enforceThresholds(profile);
      expect(profile.status).toBe("temp_ban");
      expect(profile.banExpiresAt).toBeInstanceOf(Date);
    });

    test("sets perm_ban at permanent ban threshold", () => {
      const profile = { threatScore: SECURITY.THREAT_THRESHOLDS.PERMANENT_BAN };
      enforceThresholds(profile);
      expect(profile.status).toBe("perm_ban");
      expect(profile.banExpiresAt).toBeNull();
    });

    test("perm_ban overrides even if above all thresholds", () => {
      const profile = { threatScore: 999 };
      enforceThresholds(profile);
      expect(profile.status).toBe("perm_ban");
    });
  });

  // --- updateThreatScore ---
  describe("updateThreatScore", () => {
    test("increments threat score and logs violation", async () => {
      const profile = {
        threatScore: 0,
        violationLog: [],
        save: mockSave,
      };

      await updateThreatScore(profile, 5, "test reason");

      expect(profile.threatScore).toBe(5);
      expect(profile.violationLog).toHaveLength(1);
      expect(profile.violationLog[0].type).toBe("test reason");
      expect(mockSave).toHaveBeenCalled();
    });

    test("trims violation log at 100 entries", async () => {
      const profile = {
        threatScore: 0,
        violationLog: new Array(100).fill({ type: "old", details: "old", timestamp: new Date() }),
        save: mockSave,
      };

      await updateThreatScore(profile, 5, "new violation");

      expect(profile.violationLog.length).toBe(100);
      expect(profile.violationLog[99].type).toBe("new violation");
    });

    test("enforces thresholds after update", async () => {
      const profile = {
        threatScore: SECURITY.THREAT_THRESHOLDS.PERMANENT_BAN - 5,
        violationLog: [],
        save: mockSave,
      };

      await updateThreatScore(profile, 10, "big violation");

      expect(profile.status).toBe("perm_ban");
    });
  });

  // --- checkDailyEarnings ---
  describe("checkDailyEarnings", () => {
    test("allows earnings under limit", () => {
      const profile = {
        dailyEarnings: 0,
        dailyEarningsResetAt: new Date(),
      };

      const result = checkDailyEarnings(profile, 1000);
      expect(result.allowed).toBe(true);
      expect(result.cappedAmount).toBe(1000);
    });

    test("caps earnings at remaining limit", () => {
      const profile = {
        dailyEarnings: SECURITY.DAILY_EARNINGS_LIMIT - 500,
        dailyEarningsResetAt: new Date(),
      };

      const result = checkDailyEarnings(profile, 1000);
      expect(result.allowed).toBe(true);
      expect(result.cappedAmount).toBe(500);
    });

    test("disallows earnings when limit exhausted", () => {
      const profile = {
        dailyEarnings: SECURITY.DAILY_EARNINGS_LIMIT,
        dailyEarningsResetAt: new Date(),
      };

      const result = checkDailyEarnings(profile, 1000);
      expect(result.allowed).toBe(false);
      expect(result.cappedAmount).toBe(0);
    });

    test("resets daily earnings on new day", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const profile = {
        dailyEarnings: SECURITY.DAILY_EARNINGS_LIMIT,
        dailyEarningsResetAt: yesterday,
      };

      const result = checkDailyEarnings(profile, 1000);
      expect(result.allowed).toBe(true);
      expect(result.cappedAmount).toBe(1000);
      expect(profile.dailyEarnings).toBe(0);
    });

    test("handles null dailyEarningsResetAt", () => {
      const profile = {
        dailyEarnings: 0,
        dailyEarningsResetAt: null,
      };

      const result = checkDailyEarnings(profile, 1000);
      expect(result.allowed).toBe(true);
    });
  });

  // --- checkBanStatus ---
  describe("checkBanStatus", () => {
    test("returns not banned for active user", async () => {
      const profile = { status: "active" };
      const result = await checkBanStatus(profile);
      expect(result.banned).toBe(false);
    });

    test("returns banned for perm_ban", async () => {
      const profile = { status: "perm_ban" };
      const result = await checkBanStatus(profile);
      expect(result.banned).toBe(true);
      expect(result.reason).toContain("permanently banned");
    });

    test("returns banned for active temp_ban", async () => {
      const futureDate = new Date(Date.now() + 86400000);
      const profile = { status: "temp_ban", banExpiresAt: futureDate };
      const result = await checkBanStatus(profile);
      expect(result.banned).toBe(true);
      expect(result.reason).toContain("temporarily banned");
    });

    test("resets expired temp_ban to active", async () => {
      const pastDate = new Date(Date.now() - 86400000);
      const profile = {
        status: "temp_ban",
        banExpiresAt: pastDate,
        save: mockSave,
      };

      const result = await checkBanStatus(profile);
      expect(result.banned).toBe(false);
      expect(profile.status).toBe("active");
      expect(profile.banExpiresAt).toBeNull();
      expect(mockSave).toHaveBeenCalled();
    });

    test("cooldown status is not banned", async () => {
      const profile = { status: "cooldown" };
      const result = await checkBanStatus(profile);
      expect(result.banned).toBe(false);
    });
  });
});
