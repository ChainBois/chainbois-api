const mongoose = require("mongoose");

const weeklyLeaderboardSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      index: true,
    },
    address: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      default: "",
    },
    tournamentLevel: {
      type: Number,
      default: 0,
      min: 0,
    },
    year: {
      type: Number,
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    highScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

weeklyLeaderboardSchema.index({ year: 1, weekNumber: 1, tournamentLevel: 1, uid: 1 }, { unique: true });
weeklyLeaderboardSchema.index({ year: 1, weekNumber: 1, tournamentLevel: 1, highScore: -1 });
weeklyLeaderboardSchema.index({ year: 1, weekNumber: 1, tournamentLevel: 1, totalScore: -1 });

const WeeklyLeaderboard = mongoose.model("WeeklyLeaderboard", weeklyLeaderboardSchema);
module.exports = WeeklyLeaderboard;
