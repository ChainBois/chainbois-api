const { withRetry, sleep } = require("../utils/retryHelper");

describe("sleep", () => {
  test("resolves after specified ms", async () => {
    const start = Date.now();
    await sleep(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40);
    expect(elapsed).toBeLessThan(200);
  });

  test("resolves with undefined", async () => {
    const result = await sleep(10);
    expect(result).toBeUndefined();
  });
});

describe("withRetry", () => {
  test("returns result on first success", async () => {
    const fn = jest.fn().mockResolvedValue("success");
    const result = await withRetry(fn, 3, 10);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("retries on failure then succeeds", async () => {
    let attempt = 0;
    const fn = jest.fn().mockImplementation(async () => {
      attempt++;
      if (attempt < 3) throw new Error("fail");
      return "success";
    });
    const result = await withRetry(fn, 3, 10);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test("throws after max retries exhausted", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("always fails"));
    await expect(withRetry(fn, 3, 10)).rejects.toThrow("always fails");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test("uses default parameters", async () => {
    const fn = jest.fn().mockResolvedValue("ok");
    const result = await withRetry(fn);
    expect(result).toBe("ok");
  });

  test("retries exactly once when maxRetries is 1", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("fail"));
    await expect(withRetry(fn, 1, 10)).rejects.toThrow("fail");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("preserves the original error on final failure", async () => {
    const originalError = new Error("specific error");
    originalError.code = "CUSTOM_CODE";
    const fn = jest.fn().mockRejectedValue(originalError);
    try {
      await withRetry(fn, 2, 10);
    } catch (e) {
      expect(e).toBe(originalError);
      expect(e.code).toBe("CUSTOM_CODE");
    }
  });
});
