const { TOKENOMICS } = require("../config/constants");

const { TOTAL_SUPPLY, HEALTH_TIERS } = TOKENOMICS;

/**
 * Get the current health tier based on rewards wallet balance.
 * @param {number} rewardsBalance - Current $BATTLE in rewards wallet
 * @returns {{ tier: string, multiplier: number, healthPercent: number, burnRate: number, recycleRate: number }}
 */
const getTokenomicsRates = function (rewardsBalance) {
  const healthPercent = (rewardsBalance / TOTAL_SUPPLY) * 100;

  // Find the matching tier (ordered from highest to lowest threshold)
  const tierOrder = ["ABUNDANT", "HEALTHY", "MODERATE", "SCARCE", "CRITICAL"];

  for (const tierName of tierOrder) {
    const tier = HEALTH_TIERS[tierName];
    if (healthPercent >= tier.min) {
      return {
        tier: tierName,
        multiplier: tier.multiplier,
        healthPercent: Math.round(healthPercent * 100) / 100,
        burnRate: tier.burnRate,
        recycleRate: 1 - tier.burnRate,
      };
    }
  }

  // Fallback to CRITICAL
  const critical = HEALTH_TIERS.CRITICAL;
  return {
    tier: "CRITICAL",
    multiplier: critical.multiplier,
    healthPercent: Math.round(healthPercent * 100) / 100,
    burnRate: critical.burnRate,
    recycleRate: 1 - critical.burnRate,
  };
};

/**
 * Calculate how much $BATTLE a user receives for a given points amount.
 * At ABUNDANT (multiplier 1.0): 1000 points -> 1000 BATTLE
 * At SCARCE (multiplier 0.3): 1000 points -> 300 BATTLE
 *
 * @param {number} pointsAmount - Points to convert
 * @param {number} rewardsBalance - Current rewards wallet balance
 * @returns {number} Effective BATTLE amount (floored to integer)
 */
const getConversionAmount = function (pointsAmount, rewardsBalance) {
  const rates = getTokenomicsRates(rewardsBalance);
  const effective = Math.floor(pointsAmount * rates.multiplier);
  return Math.max(effective, 1); // Minimum 1 BATTLE
};

/**
 * Calculate the effective conversion rate (points per 1 BATTLE).
 * @param {number} rewardsBalance - Current rewards wallet balance
 * @returns {number} How many BATTLE tokens you get per point
 */
const getConversionRate = function (rewardsBalance) {
  const rates = getTokenomicsRates(rewardsBalance);
  return rates.multiplier;
};

/**
 * Calculate adjusted airdrop amount for current health.
 * @param {number} baseAmount - The configured weekly distribution amount
 * @param {number} rewardsBalance - Current rewards wallet balance
 * @returns {number} Adjusted amount
 */
const getAdjustedAirdropAmount = function (baseAmount, rewardsBalance) {
  const rates = getTokenomicsRates(rewardsBalance);
  const adjusted = Math.round(baseAmount * rates.multiplier * 100) / 100;
  return Math.max(adjusted, 1); // Minimum 1 BATTLE
};

/**
 * Calculate burn/recycle split for a sweep amount.
 * @param {number} sweepAmount - Total $BATTLE to split
 * @param {number} rewardsBalance - Current rewards wallet balance
 * @returns {{ burnAmount: number, recycleAmount: number, tier: string, burnRate: number }}
 */
const getSweepSplit = function (sweepAmount, rewardsBalance) {
  const rates = getTokenomicsRates(rewardsBalance);
  const burnAmount = Math.round(sweepAmount * rates.burnRate * 100) / 100;
  const recycleAmount = Math.round((sweepAmount - burnAmount) * 100) / 100;

  return {
    burnAmount,
    recycleAmount,
    tier: rates.tier,
    burnRate: rates.burnRate,
  };
};

module.exports = {
  getTokenomicsRates,
  getConversionAmount,
  getConversionRate,
  getAdjustedAirdropAmount,
  getSweepSplit,
};
