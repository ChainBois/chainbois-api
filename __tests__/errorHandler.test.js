const AppError = require("../utils/appError");
const errorHandler = require("../middleware/errorHandler");

// Helper to create mock req/res/next
const createMocks = () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
};

describe("errorHandler", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe("development mode", () => {
    test("returns full error details in dev mode", () => {
      process.env.NODE_ENV = "development";
      const { req, res, next } = createMocks();
      const err = new AppError("Dev error", 400);

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Dev error",
          stack: expect.any(String),
        })
      );
    });

    test("defaults to 500 if no statusCode", () => {
      process.env.NODE_ENV = "development";
      const { req, res, next } = createMocks();
      const err = new Error("Plain error");

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("production mode", () => {
    test("returns operational error message", () => {
      process.env.NODE_ENV = "production";
      const { req, res, next } = createMocks();
      const err = new AppError("Not found", 404);

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Not found",
      });
    });

    test("returns generic message for non-operational errors", () => {
      process.env.NODE_ENV = "production";
      const { req, res, next } = createMocks();
      const err = new Error("Something unexpected");
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Something went wrong",
      });
      consoleSpy.mockRestore();
    });

    test("handles CastError", () => {
      process.env.NODE_ENV = "production";
      const { req, res, next } = createMocks();
      const err = new Error("Cast error");
      err.name = "CastError";
      err.path = "_id";
      err.value = "invalid-id";

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("Invalid _id"),
        })
      );
    });

    test("handles duplicate key error (code 11000)", () => {
      process.env.NODE_ENV = "production";
      const { req, res, next } = createMocks();
      const err = new Error('E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "test@test.com" }');
      err.code = 11000;

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("Duplicate field value"),
        })
      );
    });

    test("handles duplicate key error with no quoted value in message", () => {
      process.env.NODE_ENV = "production";
      const { req, res, next } = createMocks();
      const err = new Error("E11000 duplicate key error");
      err.code = 11000;

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("unknown"),
        })
      );
    });

    test("handles ValidationError", () => {
      process.env.NODE_ENV = "production";
      const { req, res, next } = createMocks();
      const err = new Error("Validation failed");
      err.name = "ValidationError";
      err.errors = {
        email: { message: "Email is required" },
        name: { message: "Name is required" },
      };

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining("Invalid input data"),
        })
      );
    });
  });
});
