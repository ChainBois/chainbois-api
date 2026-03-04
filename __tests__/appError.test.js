const AppError = require("../utils/appError");

describe("AppError", () => {
  test("creates error with message and statusCode", () => {
    const err = new AppError("Not found", 404);
    expect(err.message).toBe("Not found");
    expect(err.statusCode).toBe(404);
    expect(err.success).toBe(false);
    expect(err.isOperational).toBe(true);
  });

  test("is an instance of Error", () => {
    const err = new AppError("Test", 400);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });

  test("has a stack trace", () => {
    const err = new AppError("Stack test", 500);
    expect(err.stack).toBeDefined();
    expect(err.stack).toContain("Stack test");
  });

  test("handles various status codes", () => {
    expect(new AppError("Bad Request", 400).statusCode).toBe(400);
    expect(new AppError("Unauthorized", 401).statusCode).toBe(401);
    expect(new AppError("Forbidden", 403).statusCode).toBe(403);
    expect(new AppError("Server Error", 500).statusCode).toBe(500);
  });

  test("handles empty message", () => {
    const err = new AppError("", 400);
    expect(err.message).toBe("");
    expect(err.statusCode).toBe(400);
  });
});
