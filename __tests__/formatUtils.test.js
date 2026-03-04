const {
  formatNumber,
  formatDynamicAmount,
  formatCompactAmount,
  formatLargeNumber,
} = require("../utils/formatUtils");

describe("formatNumber", () => {
  test("formats basic numbers", () => {
    expect(formatNumber(1234.5)).toBe("1,234.50");
  });

  test("formats with custom decimals", () => {
    expect(formatNumber(1234.5678, 4)).toBe("1,234.5678");
    expect(formatNumber(1234.5678, 0)).toBe("1,235");
  });

  test("handles NaN", () => {
    expect(formatNumber(NaN)).toBe("0");
    expect(formatNumber(NaN, 2, "currency")).toBe("$0.00");
  });

  test("handles non-number input", () => {
    expect(formatNumber("abc")).toBe("0");
    expect(formatNumber(undefined)).toBe("0");
    expect(formatNumber(null)).toBe("0");
  });

  test("formats zero", () => {
    expect(formatNumber(0)).toBe("0.00");
  });

  test("formats negative numbers", () => {
    const result = formatNumber(-1234.56);
    expect(result).toContain("1,234.56");
  });
});

describe("formatDynamicAmount", () => {
  test("formats amounts >= 1 with 2 decimals", () => {
    expect(formatDynamicAmount(1234.56)).toBe("1,234.56");
    expect(formatDynamicAmount(1)).toBe("1.00");
  });

  test("formats zero", () => {
    expect(formatDynamicAmount(0)).toBe("0.00");
  });

  test("handles NaN and non-numbers", () => {
    expect(formatDynamicAmount(NaN)).toBe("0.00");
    expect(formatDynamicAmount("abc")).toBe("0.00");
    expect(formatDynamicAmount(undefined)).toBe("0.00");
  });

  test("formats small amounts with significant digits", () => {
    const result = formatDynamicAmount(0.5);
    expect(typeof result).toBe("string");
    expect(parseFloat(result)).toBeCloseTo(0.5, 1);
  });

  test("formats very small amounts", () => {
    const result = formatDynamicAmount(0.001);
    expect(typeof result).toBe("string");
    expect(parseFloat(result)).toBeGreaterThan(0);
  });
});

describe("formatCompactAmount", () => {
  test("formats zero", () => {
    expect(formatCompactAmount(0)).toBe("0");
  });

  test("handles NaN", () => {
    expect(formatCompactAmount(NaN)).toBe("0");
  });

  test("formats small numbers < 1", () => {
    const result = formatCompactAmount(0.5);
    expect(parseFloat(result)).toBeCloseTo(0.5, 1);
  });

  test("formats very small numbers in scientific notation", () => {
    const result = formatCompactAmount(0.00001);
    expect(result).toContain("e");
  });

  test("formats numbers < 1000", () => {
    const result = formatCompactAmount(999);
    expect(result).toBe("999");
  });

  test("formats thousands with K suffix", () => {
    const result = formatCompactAmount(1500);
    expect(result).toBe("1.5K");
  });

  test("formats millions with M suffix", () => {
    const result = formatCompactAmount(2500000);
    expect(result).toBe("2.5M");
  });

  test("formats billions with B suffix", () => {
    const result = formatCompactAmount(1000000000);
    expect(result).toBe("1B");
  });
});

describe("formatLargeNumber", () => {
  test("formats small numbers without suffix", () => {
    expect(formatLargeNumber(500)).toBe("500.00");
  });

  test("formats thousands with K", () => {
    const result = formatLargeNumber(1500);
    expect(result).toBe("1.50K");
  });

  test("formats with currency prefix", () => {
    const result = formatLargeNumber(1500, 2, "currency");
    expect(result).toContain("$");
  });

  test("handles NaN", () => {
    expect(formatLargeNumber(NaN)).toBe("0");
    expect(formatLargeNumber(NaN, 2, "currency")).toBe("$0");
  });

  test("handles zero", () => {
    expect(formatLargeNumber(0)).toBe("0.00");
  });
});
