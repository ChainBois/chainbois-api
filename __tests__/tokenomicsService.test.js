const {
  getTokenomicsRates,
  getConversionAmount,
  getConversionRate,
  getAdjustedAirdropAmount,
  getSweepSplit,
} = require("../services/tokenomicsService");

describe("tokenomicsService", () => {
  describe("getTokenomicsRates", () => {
    test("returns ABUNDANT at >75% supply", () => {
      const result = getTokenomicsRates(8_000_000);
      expect(result.tier).toBe("ABUNDANT");
      expect(result.multiplier).toBe(1.0);
      expect(result.burnRate).toBe(0.5);
      expect(result.recycleRate).toBe(0.5);
    });

    test("returns HEALTHY at 50-75% supply", () => {
      const result = getTokenomicsRates(6_000_000);
      expect(result.tier).toBe("HEALTHY");
      expect(result.multiplier).toBe(0.75);
      expect(result.burnRate).toBe(0.4);
    });

    test("returns MODERATE at 30-50% supply", () => {
      const result = getTokenomicsRates(4_000_000);
      expect(result.tier).toBe("MODERATE");
      expect(result.multiplier).toBe(0.5);
      expect(result.burnRate).toBe(0.3);
    });

    test("returns SCARCE at 15-30% supply", () => {
      const result = getTokenomicsRates(2_000_000);
      expect(result.tier).toBe("SCARCE");
      expect(result.multiplier).toBe(0.3);
      expect(result.burnRate).toBe(0.2);
    });

    test("returns CRITICAL at <15% supply", () => {
      const result = getTokenomicsRates(1_000_000);
      expect(result.tier).toBe("CRITICAL");
      expect(result.multiplier).toBe(0.15);
      expect(result.burnRate).toBe(0.1);
    });

    test("returns CRITICAL at 0 balance", () => {
      const result = getTokenomicsRates(0);
      expect(result.tier).toBe("CRITICAL");
      expect(result.healthPercent).toBe(0);
    });

    test("returns correct healthPercent", () => {
      const result = getTokenomicsRates(5_000_000);
      expect(result.healthPercent).toBe(50);
    });

    test("handles exact boundary (75%)", () => {
      const result = getTokenomicsRates(7_500_000);
      expect(result.tier).toBe("ABUNDANT");
    });

    test("handles just below boundary (74.99%)", () => {
      const result = getTokenomicsRates(7_499_000);
      expect(result.tier).toBe("HEALTHY");
    });
  });

  describe("getConversionAmount", () => {
    test("1:1 at ABUNDANT", () => {
      const result = getConversionAmount(1000, 9_000_000);
      expect(result).toBe(1000);
    });

    test("reduced at SCARCE", () => {
      const result = getConversionAmount(1000, 2_000_000);
      expect(result).toBe(300);
    });

    test("minimum 1 BATTLE", () => {
      const result = getConversionAmount(1, 500_000);
      expect(result).toBeGreaterThanOrEqual(1);
    });

    test("floors result to integer", () => {
      const result = getConversionAmount(7, 6_000_000);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBe(5); // 7 * 0.75 = 5.25 -> 5
    });
  });

  describe("getConversionRate", () => {
    test("returns 1.0 at ABUNDANT", () => {
      expect(getConversionRate(9_000_000)).toBe(1.0);
    });

    test("returns 0.3 at SCARCE", () => {
      expect(getConversionRate(2_000_000)).toBe(0.3);
    });
  });

  describe("getAdjustedAirdropAmount", () => {
    test("full amount at ABUNDANT", () => {
      expect(getAdjustedAirdropAmount(500, 9_000_000)).toBe(500);
    });

    test("reduced at MODERATE", () => {
      expect(getAdjustedAirdropAmount(500, 4_000_000)).toBe(250);
    });

    test("minimum 1", () => {
      expect(getAdjustedAirdropAmount(1, 500_000)).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getSweepSplit", () => {
    test("50/50 at ABUNDANT", () => {
      const result = getSweepSplit(100, 9_000_000);
      expect(result.burnAmount).toBe(50);
      expect(result.recycleAmount).toBe(50);
      expect(result.tier).toBe("ABUNDANT");
    });

    test("10/90 at CRITICAL", () => {
      const result = getSweepSplit(100, 500_000);
      expect(result.burnAmount).toBe(10);
      expect(result.recycleAmount).toBe(90);
      expect(result.tier).toBe("CRITICAL");
    });

    test("burn + recycle = sweep total", () => {
      const result = getSweepSplit(1000, 6_000_000);
      expect(result.burnAmount + result.recycleAmount).toBeCloseTo(1000);
    });

    test("returns burnRate", () => {
      const result = getSweepSplit(100, 4_000_000);
      expect(result.burnRate).toBe(0.3);
    });
  });
});
