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
        rank: { type: Number, min: 1 },
        address: String,
        username: String,
        highScore: { type: Number, min: 0 },
        prizeAmount: { type: Number, min: 0 },
        prizeCurrency: { type: String, enum: ["AVAX", "BATTLE", "NFT"] },
        txHash: { type: String, default: "" },
      },
    ],
    totalPayout: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

leaderboardHistorySchema.index({ weekNumber: -1, tournamentLevel: 1 }, { unique: true });

const LeaderboardHistory = mongoose.model("LeaderboardHistory", leaderboardHistorySchema);
module.exports = LeaderboardHistory;
