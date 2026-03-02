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
      default: { 1: 2, 2: 4, 3: 6, 4: 8, 5: 10, 6: 12, 7: 14 },
    },
    levelUpCost: { type: Number, default: 1 },
    maxPointsPerMatch: { type: Number, default: 5000 },
    burnRate: { type: Number, default: 0.5 },
    teamRevenueSplit: { type: Number, default: 0.25 },
    awardPoolSplit: { type: Number, default: 0.75 },
    armoryClosedDuringCooldown: { type: Boolean, default: true },
    contracts: {
      battleToken: { type: String, default: "" },
      chainboisNft: { type: String, default: "" },
      weaponNft: { type: String, default: "" },
    },
    claimLimit: { type: Number, default: 1 },
    claimEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);
module.exports = Settings;
