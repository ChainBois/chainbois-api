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
        ["1", 1], ["2", 1], ["3", 2], ["4", 2], ["5", 3], ["6", 3], ["7", 5],
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
module.exports = Settings;
