const { retryFailedPayouts } = require("../services/prizeService");

/**
 * Failed payout retry job. Runs every 6 hours.
 * Retries prize payouts that failed during tournament distribution.
 */
const failedPayoutJob = async function () {
  try {
    await retryFailedPayouts();
  } catch (error) {
    console.error("failedPayoutJob error:", error.message);
  }
};

module.exports = { failedPayoutJob };
