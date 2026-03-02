const mongoose = require("mongoose");

const chainboiNftSchema = new mongoose.Schema(
  {
    tokenId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    contractAddress: {
      type: String,
      required: true,
    },
    ownerAddress: {
      type: String,
      required: true,
      index: true,
    },
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 7,
    },
    traits: [
      {
        trait_type: String,
        value: mongoose.Schema.Types.Mixed,
      },
    ],
    badge: {
      type: String,
      default: "trainee",
    },
    inGameStats: {
      kills: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      gamesPlayed: { type: Number, default: 0 },
    },
    metadataUri: {
      type: String,
      default: "",
    },
    imageUri: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

chainboiNftSchema.index({ ownerAddress: 1, level: 1 });

const ChainboiNft = mongoose.model("ChainboiNft", chainboiNftSchema);
module.exports = ChainboiNft;
