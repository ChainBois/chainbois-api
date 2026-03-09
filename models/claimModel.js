const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    nftTokenIds: {
      type: [Number],
      default: [],
    },
    weapons: [
      {
        tokenId: Number,
        name: String,
        category: String,
      },
    ],
    battleAmount: {
      type: Number,
      default: 0,
    },
    txHashes: {
      nfts: [String],
      weapons: [String],
      battle: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ["processing", "completed", "partial", "failed"],
      default: "processing",
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Claim = mongoose.model("Claim", claimSchema);
module.exports = Claim;
