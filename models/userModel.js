const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
      index: true,
    },
    playerType: {
      type: String,
      enum: ["web2", "web3"],
      default: "web2",
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    pointsBalance: {
      type: Number,
      default: 0,
    },
    battleTokenBalance: {
      type: Number,
      default: 0,
    },
    hasNft: {
      type: Boolean,
      default: false,
    },
    nftTokenId: {
      type: Number,
      default: null,
    },
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 7,
    },
    score: {
      type: Number,
      default: 0,
    },
    highScore: {
      type: Number,
      default: 0,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
    totalKills: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    hasClaimed: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastScoreSync: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ address: 1, playerType: 1 });
userSchema.index({ score: -1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
