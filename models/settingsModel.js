const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    tournamentSchedule: {
      startDay: { type: Number, default: 3 },
      startHour: { type: Number, default: 12 },
      durationHours: { type: Number, default: 120 },
      cooldownHours: { type: Number, default: 48 },
    },
    prizePools: {
      type: Map,
      of: Number,
      default: () => new Map([["1", 2], ["2", 4], ["3", 6], ["4", 8], ["5", 10], ["6", 12], ["7", 14]]),
    },
    levelUpCosts: {
      type: Map,
      of: Number,
      default: () => new Map([
        ["1", 0.001], ["2", 0.002], ["3", 0.003], ["4", 0.004], ["5", 0.005], ["6", 0.006], ["7", 0.007],
      ]),
    },
    battleTokenDecimals: { type: Number, default: 18, min: 0, max: 18 },
    maxPointsPerMatch: { type: Number, default: 5000, min: 0 },
    burnRate: { type: Number, default: 0.5, min: 0, max: 1 },
    teamRevenueSplit: { type: Number, default: 0.25, min: 0, max: 1 },
    awardPoolSplit: { type: Number, default: 0.75, min: 0, max: 1 },
    armoryClosedDuringCooldown: { type: Boolean, default: true },
    contracts: {
      battleToken: { type: String, default: "" },
      chainboisNft: { type: String, default: "" },
      weaponNft: { type: String, default: "" },
    },
    nftPrice: { type: Number, default: 0.001 },
    dynamicTokenomics: { type: Boolean, default: true },
    downloads: { type: Number, default: 0, min: 0 },
    trailer: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Enforce singleton: only one settings document allowed
settingsSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Settings").countDocuments();
    if (count > 0) {
      return next(new Error("Only one Settings document is allowed"));
    }
  }
  next();
});

const Settings = mongoose.model("Settings", settingsSchema);

// --- Cached Settings singleton (TTL: 60s) ---
let _cachedSettings = null;
let _cachedAt = 0;
const SETTINGS_TTL_MS = 60000;

/**
 * Get the cached Settings singleton. Fetches from DB at most once per minute.
 * Falls back to direct DB query if cache is stale.
 * @returns {Promise<Object>} The settings document
 */
Settings.getCached = async function () {
  const now = Date.now();
  if (_cachedSettings && now - _cachedAt < SETTINGS_TTL_MS) {
    return _cachedSettings;
  }
  _cachedSettings = await Settings.findOne().lean();
  _cachedAt = now;
  return _cachedSettings;
};

/** Invalidate the cache (call after updates) */
Settings.invalidateCache = function () {
  _cachedSettings = null;
  _cachedAt = 0;
};

module.exports = Settings;
