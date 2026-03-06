/**
 * Tests for rarityService.js - Rarity scoring algorithm
 */
const { calculateRarityScore, getRarityTier } = require("../services/rarityService");

describe("calculateRarityScore", () => {
  const totalSupply = 50;

  test("higher score for rarer trait combinations", () => {
    const traitFrequencies = {
      "background:Combat Red": 5,   // rare
      "background:Sky Blue": 20,    // common
      "skin:Pale Recruit": 25,
      "weapon:War Bow": 2,          // very rare
      "weapon:Nail Bat": 15,        // common
    };
    const traitCountFrequencies = { 3: 40, 2: 10 };

    const rareNft = {
      background: "Combat Red",
      skin: "Pale Recruit",
      weapon: "War Bow",
    };

    const commonNft = {
      background: "Sky Blue",
      skin: "Pale Recruit",
      weapon: "Nail Bat",
    };

    const rareScore = calculateRarityScore(rareNft, traitFrequencies, traitCountFrequencies, totalSupply);
    const commonScore = calculateRarityScore(commonNft, traitFrequencies, traitCountFrequencies, totalSupply);

    expect(rareScore).toBeGreaterThan(commonScore);
  });

  test("trait count affects score", () => {
    const traitFrequencies = {
      "background:A": 10,
      "skin:B": 10,
      "weapon:C": 10,
    };
    // NFTs with 3 traits are common, 2 traits are rare
    const traitCountFrequencies = { 3: 45, 2: 5 };

    const threeTraitNft = {
      background: "A",
      skin: "B",
      weapon: "C",
    };

    const twoTraitNft = {
      background: "A",
      skin: "B",
      weapon: "",
    };

    const score3 = calculateRarityScore(threeTraitNft, traitFrequencies, traitCountFrequencies, totalSupply);
    const score2 = calculateRarityScore(twoTraitNft, traitFrequencies, traitCountFrequencies, totalSupply);

    // 2-trait NFT should have higher base score from trait count rarity
    // but lower individual trait sum
    expect(score3).not.toEqual(score2);
  });

  test("handles missing trait count frequency gracefully", () => {
    const traitFrequencies = { "background:A": 10 };
    const traitCountFrequencies = {}; // empty

    const nft = { background: "A" };
    const score = calculateRarityScore(nft, traitFrequencies, traitCountFrequencies, totalSupply);

    // Should not throw; uses default of 1
    expect(score).toBeGreaterThan(0);
  });

  test("unique trait (freq=1) gives highest individual component", () => {
    const traitFrequencies = {
      "background:Unique": 1,
      "background:Common": 50,
    };
    const traitCountFrequencies = { 1: 50 };

    const uniqueNft = { background: "Unique" };
    const commonNft = { background: "Common" };

    const uniqueScore = calculateRarityScore(uniqueNft, traitFrequencies, traitCountFrequencies, totalSupply);
    const commonScore = calculateRarityScore(commonNft, traitFrequencies, traitCountFrequencies, totalSupply);

    expect(uniqueScore).toBeGreaterThan(commonScore);
  });
});

describe("getRarityTier", () => {
  test("returns legendary for top 1%", () => {
    expect(getRarityTier(0.5)).toBe("legendary");
    expect(getRarityTier(1)).toBe("legendary");
  });

  test("returns epic for top 1-5%", () => {
    expect(getRarityTier(1.1)).toBe("epic");
    expect(getRarityTier(5)).toBe("epic");
  });

  test("returns rare for top 5-20%", () => {
    expect(getRarityTier(5.1)).toBe("rare");
    expect(getRarityTier(20)).toBe("rare");
  });

  test("returns uncommon for top 20-50%", () => {
    expect(getRarityTier(20.1)).toBe("uncommon");
    expect(getRarityTier(50)).toBe("uncommon");
  });

  test("returns common for bottom 50%", () => {
    expect(getRarityTier(50.1)).toBe("common");
    expect(getRarityTier(100)).toBe("common");
  });
});
