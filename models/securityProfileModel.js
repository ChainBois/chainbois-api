const mongoose = require("mongoose");

const securityProfileSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    address: {
      type: String,
      default: null,
    },
    threatScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "cooldown", "temp_ban", "perm_ban"],
      default: "active",
    },
    violationLog: [
      {
        type: { type: String },
        details: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    dailyEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    dailyEarningsResetAt: {
      type: Date,
      default: Date.now,
    },
    sessionStartTimestamp: {
      type: Date,
      default: null,
    },
    banExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SecurityProfile = mongoose.model("SecurityProfile", securityProfileSchema);
module.exports = SecurityProfile;
