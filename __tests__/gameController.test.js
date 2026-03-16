const { verifyAssets, setAvatar } = require("../controllers/gameController");

describe("gameController", () => {
  test("exports verifyAssets and setAvatar", () => {
    expect(typeof verifyAssets).toBe("function");
    expect(typeof setAvatar).toBe("function");
  });

  test("does not export getUnlockedContent (removed)", () => {
    const exports = require("../controllers/gameController");
    expect(exports.getUnlockedContent).toBeUndefined();
  });
});
