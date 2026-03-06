const mongoose = require("mongoose");

const nftTraitSchema = new mongoose.Schema(
  {
    tokenId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    background: { type: String, default: "" },
    skin: { type: String, default: "" },
    weapon: { type: String, default: "" },
    suit: { type: String, default: "" },
    eyes: { type: String, default: "" },
    mouth: { type: String, default: "" },
    helmet: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Index for trait-based airdrop queries
nftTraitSchema.index({ background: 1 });
nftTraitSchema.index({ skin: 1 });
nftTraitSchema.index({ weapon: 1 });
nftTraitSchema.index({ suit: 1 });
nftTraitSchema.index({ eyes: 1 });
nftTraitSchema.index({ mouth: 1 });
nftTraitSchema.index({ helmet: 1 });

const NftTrait = mongoose.model("NftTrait", nftTraitSchema);
module.exports = NftTrait;
