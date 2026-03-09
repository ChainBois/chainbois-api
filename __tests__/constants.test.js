const constants = require("../config/constants");

describe("constants", () => {
  test("PLAYER_TYPE has web2 and web3", () => {
    expect(constants.PLAYER_TYPE.WEB2).toBe("web2");
    expect(constants.PLAYER_TYPE.WEB3).toBe("web3");
  });

  test("ROLES has user and admin", () => {
    expect(constants.ROLES.USER).toBe("user");
    expect(constants.ROLES.ADMIN).toBe("admin");
  });

  test("MAX_LEVEL is 7", () => {
    expect(constants.MAX_LEVEL).toBe(7);
  });

  test("TOURNAMENT schedule is valid", () => {
    expect(constants.TOURNAMENT.START_DAY).toBeGreaterThanOrEqual(0);
    expect(constants.TOURNAMENT.START_DAY).toBeLessThanOrEqual(6);
    expect(constants.TOURNAMENT.START_HOUR).toBeGreaterThanOrEqual(0);
    expect(constants.TOURNAMENT.START_HOUR).toBeLessThanOrEqual(23);
    expect(constants.TOURNAMENT.DURATION_HOURS).toBeGreaterThan(0);
    expect(constants.TOURNAMENT.COOLDOWN_HOURS).toBeGreaterThan(0);
  });

  test("PRIZE_POOLS has levels 1-7", () => {
    for (let i = 1; i <= 7; i++) {
      expect(constants.PRIZE_POOLS[i]).toBeDefined();
      expect(constants.PRIZE_POOLS[i]).toBeGreaterThan(0);
    }
  });

  test("PRIZE_DISTRIBUTION sums to 1.0", () => {
    const sum =
      constants.PRIZE_DISTRIBUTION.FIRST +
      constants.PRIZE_DISTRIBUTION.SECOND +
      constants.PRIZE_DISTRIBUTION.THIRD;
    expect(sum).toBeCloseTo(1.0);
  });

  test("TEAM_REVENUE_SPLIT + AWARD_POOL_SPLIT = 1.0", () => {
    expect(constants.TEAM_REVENUE_SPLIT + constants.AWARD_POOL_SPLIT).toBeCloseTo(1.0);
  });

  test("WEAPON_CATEGORIES is a non-empty array", () => {
    expect(Array.isArray(constants.WEAPON_CATEGORIES)).toBe(true);
    expect(constants.WEAPON_CATEGORIES.length).toBeGreaterThan(0);
  });

  test("SECURITY thresholds are in ascending order", () => {
    const { COOLDOWN, TEMPORARY_BAN, PERMANENT_BAN } = constants.SECURITY.THREAT_THRESHOLDS;
    expect(COOLDOWN).toBeLessThan(TEMPORARY_BAN);
    expect(TEMPORARY_BAN).toBeLessThan(PERMANENT_BAN);
  });

  test("SYNC intervals are valid cron expressions", () => {
    // SYNC_NEW_USERS_INTERVAL: daily at midnight "0 0 * * *"
    // SYNC_SCORES_INTERVAL: every N minutes "*/N * * * *"
    expect(constants.SYNC_NEW_USERS_INTERVAL).toMatch(/^\d+\s+\d+\s+\*\s+\*\s+\*$/);
    expect(constants.SYNC_SCORES_INTERVAL).toMatch(/^\*\/\d+ \* \* \* \*$/);
  });

  test("WALLET_ROLES has all expected roles", () => {
    expect(constants.WALLET_ROLES.ADMIN).toBe("admin");
    expect(constants.WALLET_ROLES.PRIZE_POOL).toBe("prize_pool");
    expect(constants.WALLET_ROLES.NFT_STORE).toBe("nft_store");
    expect(constants.WALLET_ROLES.WEAPON_STORE).toBe("weapon_store");
  });

  test("TRANSACTION_TYPES has all expected types", () => {
    const types = Object.values(constants.TRANSACTION_TYPES);
    expect(types).toContain("level_up");
    expect(types).toContain("weapon_purchase");
    expect(types).toContain("points_conversion");
    expect(types).toContain("prize_payout");
    expect(types).toContain("nft_transfer");
    expect(types).toContain("nft_purchase");
  });

  test("POINTS_TO_BATTLE_RATIO is 1:1", () => {
    expect(constants.POINTS_TO_BATTLE_RATIO).toBe(1);
  });
});
