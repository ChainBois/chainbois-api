const mongoose = require("mongoose");

const nftRaritySchema = new mongoose.Schema(
  {
    tokenId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: "",
    },
    traits: {
      type: Map,
      of: String,
      default: {},
    },
    traitCount: {
      type: Number,
      default: 0,
    },
    rarityScore: {
      type: Number,
      required: true,
      index: true,
    },
    rank: {
      type: Number,
      required: true,
      index: true,
    },
    percentile: {
      type: Number,
      required: true,
    },
    rarityTier: {
      type: String,
      enum: ["legendary", "epic", "rare", "uncommon", "common"],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const NftRarity = mongoose.model("NftRarity", nftRaritySchema);
module.exports = NftRarity;
