const { getUnlockedContent } = require("../controllers/gameController");
const { CHARACTERS_UNLOCK, BASE_WEAPONS_UNLOCK, MAX_LEVEL } = require("../config/constants");

describe("gameController", () => {
  describe("getUnlockedContent", () => {
    test("level 0 without NFT gets base characters and weapons", () => {
      const result = getUnlockedContent(0, false);
      expect(result.characters).toEqual(CHARACTERS_UNLOCK[0]);
      expect(result.weapons).toEqual(BASE_WEAPONS_UNLOCK);
    });

    test("level 0 with NFT gets same as without", () => {
      const result = getUnlockedContent(0, true);
      expect(result.characters).toEqual(CHARACTERS_UNLOCK[0]);
    });

    test("level 3 with NFT gets levels 0-3 characters", () => {
      const result = getUnlockedContent(3, true);
      const expected = [
        ...CHARACTERS_UNLOCK[0],
        ...CHARACTERS_UNLOCK[1],
        ...CHARACTERS_UNLOCK[2],
        ...CHARACTERS_UNLOCK[3],
      ];
      expect(result.characters).toEqual(expected);
      expect(result.characters).toHaveLength(16);
    });

    test("level 7 (max) with NFT gets all characters", () => {
      const result = getUnlockedContent(7, true);
      let expectedCount = 0;
      for (let i = 0; i <= 7; i++) {
        expectedCount += CHARACTERS_UNLOCK[i].length;
      }
      expect(result.characters).toHaveLength(expectedCount);
      expect(result.characters).toHaveLength(32);
    });

    test("level above max gets capped to max", () => {
      const result = getUnlockedContent(99, true);
      const maxResult = getUnlockedContent(MAX_LEVEL, true);
      expect(result.characters).toEqual(maxResult.characters);
    });

    test("high level without NFT only gets level 0", () => {
      const result = getUnlockedContent(5, false);
      expect(result.characters).toEqual(CHARACTERS_UNLOCK[0]);
    });

    test("weapons are always base weapons", () => {
      const r0 = getUnlockedContent(0, false);
      const r7 = getUnlockedContent(7, true);
      expect(r0.weapons).toEqual(BASE_WEAPONS_UNLOCK);
      expect(r7.weapons).toEqual(BASE_WEAPONS_UNLOCK);
    });

    test("returned weapons array is a copy (not same reference)", () => {
      const r1 = getUnlockedContent(0, false);
      const r2 = getUnlockedContent(0, false);
      expect(r1.weapons).not.toBe(r2.weapons);
      expect(r1.weapons).toEqual(r2.weapons);
    });
  });
});
