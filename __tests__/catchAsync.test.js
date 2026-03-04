const catchAsync = require("../utils/catchAsync");

describe("catchAsync", () => {
  test("calls the wrapped function with req, res, next", async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const wrapped = catchAsync(fn);
    const req = { path: "/test", method: "GET" };
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  test("calls next with error on async rejection", async () => {
    const error = new Error("async error");
    const fn = jest.fn().mockRejectedValue(error);
    const wrapped = catchAsync(fn);
    const req = { path: "/test", method: "GET", query: {}, body: {}, params: {} };
    const res = {};
    const next = jest.fn();

    // Suppress console.error during test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await wrapped(req, res, next);
    consoleSpy.mockRestore();

    expect(next).toHaveBeenCalledWith(error);
  });

  test("does not call next on success", async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const wrapped = catchAsync(fn);
    const req = {};
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);
    // next should only be called by fn if it's part of the middleware chain
    // catchAsync itself should not call next on success
    expect(next).not.toHaveBeenCalled();
  });

  test("sanitizes sensitive fields in error logging", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("fail"));
    const wrapped = catchAsync(fn);
    const req = {
      path: "/test",
      method: "POST",
      query: { token: "secret123" },
      body: { password: "mypass", name: "visible" },
      params: { privateKey: "0x123" },
    };
    const res = {};
    const next = jest.fn();

    const logArgs = [];
    const consoleSpy = jest.spyOn(console, "error").mockImplementation((...args) => {
      logArgs.push(args);
    });

    await wrapped(req, res, next);
    consoleSpy.mockRestore();

    // Check that the sanitized objects passed to console.error do NOT contain raw sensitive values
    const bodyLog = logArgs.find((args) => args[0] === "Body:");
    expect(bodyLog).toBeDefined();
    const sanitizedBody = bodyLog[1];
    expect(sanitizedBody.password).toBe("[REDACTED]");
    expect(sanitizedBody.name).toBe("visible");

    const queryLog = logArgs.find((args) => args[0] === "Query:");
    expect(queryLog).toBeDefined();
    const sanitizedQuery = queryLog[1];
    expect(sanitizedQuery.token).toBe("[REDACTED]");

    const paramsLog = logArgs.find((args) => args[0] === "Params:");
    expect(paramsLog).toBeDefined();
    const sanitizedParams = paramsLog[1];
    expect(sanitizedParams.privateKey).toBe("[REDACTED]");
  });

  test("handles arrays in sanitization", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("fail"));
    const wrapped = catchAsync(fn);
    const req = {
      path: "/test",
      method: "POST",
      query: null,
      body: [{ name: "item1", password: "secret" }, { name: "item2" }],
      params: {},
    };
    const res = {};
    const next = jest.fn();

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await wrapped(req, res, next);
    consoleSpy.mockRestore();

    expect(next).toHaveBeenCalled();
  });
});
