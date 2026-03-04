const SecurityProfile = require("../models/securityProfileModel");
const { SECURITY, MAX_POINTS_PER_MATCH } = require("../config/constants");

/**
 * Validate a score is within acceptable bounds
 * @param {number} score - The score to validate
 * @returns {{ valid: boolean, reason: string }}
 */
const validateScore = function (score) {
  if (typeof score !== "number" || isNaN(score)) {
    return { valid: false, reason: "Score is not a valid number" };
  }
  if (score < 0) {
    return { valid: false, reason: "Score cannot be negative" };
  }
  if (score > MAX_POINTS_PER_MATCH) {
    return { valid: false, reason: `Score exceeds maximum of ${MAX_POINTS_PER_MATCH}` };
  }
  return { valid: true, reason: "Score is valid" };
};

/**
 * Check score velocity (score per time ratio)
 * @param {number} scoreDelta - Points earned
 * @param {number} durationSeconds - Session duration in seconds
 * @returns {{ valid: boolean, reason: string }}
 */
const checkVelocity = function (scoreDelta, durationSeconds) {
  if (durationSeconds <= 0) {
    return { valid: false, reason: "Invalid session duration" };
  }
  // Max ~10 points per second is suspicious
  const maxPointsPerSecond = 10;
  const velocity = scoreDelta / durationSeconds;
  if (velocity > maxPointsPerSecond) {
    return { valid: false, reason: `Score velocity too high: ${velocity.toFixed(2)} pts/sec` };
  }
  return { valid: true, reason: "Velocity is acceptable" };
};

/**
 * Get or create a security profile for a user
 * @param {string} uid - Firebase UID
 * @returns {Promise<Object>} SecurityProfile document
 */
const getOrCreateSecurityProfile = async function (uid) {
  const profile = await SecurityProfile.findOneAndUpdate(
    { uid },
    { $setOnInsert: { uid } },
    { upsert: true, new: true }
  );
  return profile;
};

/**
 * Update threat score and log violation
 * @param {Object} securityProfile - SecurityProfile document
 * @param {number} increment - Amount to add to threat score
 * @param {string} reason - Reason for the increment
 * @returns {Promise<Object>} Updated SecurityProfile
 */
const updateThreatScore = async function (securityProfile, increment, reason) {
  securityProfile.threatScore += increment;
  securityProfile.violationLog.push({
    type: reason,
    details: `Threat +${increment}, total: ${securityProfile.threatScore}`,
    timestamp: new Date(),
  });

  // Keep violation log from growing unbounded (last 100 entries)
  if (securityProfile.violationLog.length > 100) {
    securityProfile.violationLog = securityProfile.violationLog.slice(-100);
  }

  enforceThresholds(securityProfile);
  await securityProfile.save();
  return securityProfile;
};

/**
 * Check and enforce threat score thresholds
 * @param {Object} securityProfile - SecurityProfile document
 */
const enforceThresholds = function (securityProfile) {
  const { COOLDOWN, TEMPORARY_BAN, PERMANENT_BAN } = SECURITY.THREAT_THRESHOLDS;

  if (securityProfile.threatScore >= PERMANENT_BAN) {
    securityProfile.status = "perm_ban";
    securityProfile.banExpiresAt = null; // permanent
  } else if (securityProfile.threatScore >= TEMPORARY_BAN) {
    securityProfile.status = "temp_ban";
    securityProfile.banExpiresAt = new Date(
      Date.now() + SECURITY.TEMP_BAN_HOURS * 60 * 60 * 1000
    );
  } else if (securityProfile.threatScore >= COOLDOWN) {
    securityProfile.status = "cooldown";
  } else {
    securityProfile.status = "active";
  }
};

/**
 * Check if daily earnings limit has been reached
 * @param {Object} securityProfile - SecurityProfile document
 * @param {number} pointsEarned - Points to add
 * @returns {{ allowed: boolean, cappedAmount: number }}
 */
const checkDailyEarnings = function (securityProfile, pointsEarned) {
  // Reset daily earnings if past midnight
  const now = new Date();
  const resetAt = securityProfile.dailyEarningsResetAt || new Date(0);
  if (now.toDateString() !== resetAt.toDateString()) {
    securityProfile.dailyEarnings = 0;
    securityProfile.dailyEarningsResetAt = now;
  }

  const remaining = SECURITY.DAILY_EARNINGS_LIMIT - securityProfile.dailyEarnings;
  if (remaining <= 0) {
    return { allowed: false, cappedAmount: 0 };
  }

  const cappedAmount = Math.min(pointsEarned, remaining);
  return { allowed: true, cappedAmount };
};

/**
 * Check if a user is currently banned (checks temp ban expiry)
 * @param {Object} securityProfile - SecurityProfile document
 * @returns {{ banned: boolean, reason: string }}
 */
const checkBanStatus = async function (securityProfile) {
  if (securityProfile.status === "perm_ban") {
    return { banned: true, reason: "Account permanently banned for repeated violations" };
  }

  if (securityProfile.status === "temp_ban") {
    if (securityProfile.banExpiresAt && securityProfile.banExpiresAt > new Date()) {
      return { banned: true, reason: "Account temporarily banned. Try again later." };
    }
    // Ban expired, reset status
    securityProfile.status = "active";
    securityProfile.banExpiresAt = null;
    await securityProfile.save();
  }

  return { banned: false, reason: "" };
};

module.exports = {
  validateScore,
  checkVelocity,
  getOrCreateSecurityProfile,
  updateThreatScore,
  enforceThresholds,
  checkDailyEarnings,
  checkBanStatus,
};
