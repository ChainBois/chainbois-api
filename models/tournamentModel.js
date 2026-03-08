const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "cooldown", "completed"],
      default: "upcoming",
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    cooldownEndTime: {
      type: Date,
      required: true,
    },
    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },
    prizeDistribution: {
      first: { type: Number, default: 0 },
      second: { type: Number, default: 0 },
      third: { type: Number, default: 0 },
      thirdBattle: { type: Number, default: 0 },
    },
    winners: [
      {
        rank: Number,
        address: String,
        username: String,
        points: Number,
        paid: { type: Boolean, default: false },
        txHash: { type: String, default: "" },
        paidAt: { type: Date, default: null },
      },
    ],
  },
  {
    timestamps: true,
  }
);

tournamentSchema.index({ level: 1, status: 1 });
tournamentSchema.index({ startTime: -1 });
tournamentSchema.index({ year: 1, weekNumber: 1, level: 1 }, { unique: true });

const Tournament = mongoose.model("Tournament", tournamentSchema);
module.exports = Tournament;
