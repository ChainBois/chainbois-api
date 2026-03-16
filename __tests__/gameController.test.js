const { getUnlockedContent } = require("../controllers/gameController");
const { BASE_WEAPONS_UNLOCK } = require("../config/constants");

describe("gameController", () => {
  describe("getUnlockedContent", () => {
    test("returns base weapons for level 0 without NFT", () => {
      const result = getUnlockedContent(0, false);
      expect(result.weapons).toEqual(BASE_WEAPONS_UNLOCK);
    });

    test("returns base weapons for level 0 with NFT", () => {
      const result = getUnlockedContent(0, true);
      expect(result.weapons).toEqual(BASE_WEAPONS_UNLOCK);
    });

    test("returns base weapons for high level with NFT", () => {
      const result = getUnlockedContent(7, true);
      expect(result.weapons).toEqual(BASE_WEAPONS_UNLOCK);
    });

    test("does not return characters", () => {
      const result = getUnlockedContent(3, true);
      expect(result.characters).toBeUndefined();
    });

    test("returned weapons array is a copy (not same reference)", () => {
      const r1 = getUnlockedContent(0, false);
      const r2 = getUnlockedContent(0, false);
      expect(r1.weapons).not.toBe(r2.weapons);
      expect(r1.weapons).toEqual(r2.weapons);
    });
  });
});
