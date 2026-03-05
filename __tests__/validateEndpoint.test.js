const validateEndpoint = require("../middleware/validateEndpoint");

const createMocks = (path) => {
  const req = { path };
  const res = {};
  const next = jest.fn();
  return { req, res, next };
};

describe("validateEndpoint", () => {
  test("allows health endpoint", () => {
    const { req, res, next } = createMocks("/api/v1/health");
    validateEndpoint(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("allows settings endpoint", () => {
    const { req, res, next } = createMocks("/api/v1/settings");
    validateEndpoint(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("allows auth endpoints", () => {
    const endpoints = ["/api/v1/auth/create-user", "/api/v1/auth/login", "/api/v1/auth/me", "/api/v1/auth/logout"];
    for (const ep of endpoints) {
      const { req, res, next } = createMocks(ep);
      validateEndpoint(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }
  });

  test("allows check-user endpoint with email", () => {
    const { req, res, next } = createMocks("/api/v1/auth/check-user/test@example.com");
    validateEndpoint(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("allows game endpoints", () => {
    const endpoints = ["/api/v1/game/verify-assets", "/api/v1/game/download/win", "/api/v1/game/download/mac", "/api/v1/game/download/apk"];
    for (const ep of endpoints) {
      const { req, res, next } = createMocks(ep);
      validateEndpoint(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }
  });

  test("allows game character endpoint with address", () => {
    const { req, res, next } = createMocks("/api/v1/game/characters/0x1234567890abcdef1234567890abcdef12345678");
    validateEndpoint(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("allows training endpoints", () => {
    const endpoints = [
      "/api/v1/training/nfts",
      "/api/v1/training/nft",
      "/api/v1/training/level-up",
      "/api/v1/training/level-up/cost",
    ];
    for (const ep of endpoints) {
      const { req, res, next } = createMocks(ep);
      validateEndpoint(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }
  });

  test("allows tournament endpoints", () => {
    const endpoints = ["/api/v1/tournaments", "/api/v1/tournaments/1", "/api/v1/tournaments/history"];
    for (const ep of endpoints) {
      const { req, res, next } = createMocks(ep);
      validateEndpoint(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }
  });

  test("allows armory, points, claim, inventory, leaderboard", () => {
    const endpoints = [
      "/api/v1/armory",
      "/api/v1/armory/weapons",
      "/api/v1/points",
      "/api/v1/points/convert",
      "/api/v1/claim",
      "/api/v1/claim/status",
      "/api/v1/inventory",
      "/api/v1/inventory/0x123/nfts",
      "/api/v1/leaderboard",
      "/api/v1/leaderboard/weekly",
    ];
    for (const ep of endpoints) {
      const { req, res, next } = createMocks(ep);
      validateEndpoint(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }
  });

  test("rejects invalid API endpoint with 404", () => {
    const { req, res, next } = createMocks("/api/v1/nonexistent");
    validateEndpoint(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "This endpoint does not exist",
      })
    );
  });

  test("skips validation for non-API routes", () => {
    const { req, res, next } = createMocks("/some-other-path");
    validateEndpoint(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
