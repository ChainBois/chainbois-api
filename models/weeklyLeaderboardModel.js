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
    },
    highScore: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

weeklyLeaderboardSchema.index({ tournamentLevel: 1, highScore: -1 });
weeklyLeaderboardSchema.index({ tournamentLevel: 1, totalScore: -1 });

const WeeklyLeaderboard = mongoose.model("WeeklyLeaderboard", weeklyLeaderboardSchema);
module.exports = WeeklyLeaderboard;
