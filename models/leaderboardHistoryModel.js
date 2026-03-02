const mongoose = require("mongoose");

const leaderboardHistorySchema = new mongoose.Schema(
  {
    weekNumber: {
      type: Number,
      required: true,
    },
    tournamentLevel: {
      type: Number,
      required: true,
    },
    winners: [
      {
        rank: Number,
        address: String,
        username: String,
        highScore: Number,
        prizeAmount: Number,
        prizeCurrency: { type: String, enum: ["AVAX", "BATTLE"] },
        txHash: { type: String, default: "" },
      },
    ],
    totalPayout: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

leaderboardHistorySchema.index({ weekNumber: -1, tournamentLevel: 1 });

const LeaderboardHistory = mongoose.model("LeaderboardHistory", leaderboardHistorySchema);
module.exports = LeaderboardHistory;
