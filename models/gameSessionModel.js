const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema(
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
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    gameMode: {
      type: String,
      default: "default",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    score: {
      type: Number,
      default: 0,
    },
    kills: {
      type: Number,
      default: 0,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    nftTokenId: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

gameSessionSchema.index({ uid: 1, createdAt: -1 });

const GameSession = mongoose.model("GameSession", gameSessionSchema);
module.exports = GameSession;
