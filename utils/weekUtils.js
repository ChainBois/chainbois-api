/**
 * Get week number and year for a given date (or now).
 * Used by syncScoresJob, tournamentJob, and prize distribution.
 *
 * @param {Date} [date] - Date to calculate for (defaults to now)
 * @returns {{ weekNumber: number, year: number }}
 */
const getWeekInfo = function (date) {
  const d = date || new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d - startOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return { weekNumber, year: d.getFullYear() };
};

module.exports = { getWeekInfo };
