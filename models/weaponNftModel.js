const mongoose = require("mongoose");

const weaponNftSchema = new mongoose.Schema(
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
    weaponName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["assault", "smg", "lmg", "marksman", "handgun", "launcher", "melee"],
      required: true,
    },
    blueprintTier: {
      type: String,
      enum: ["base", "epic", "legendary", "mythic"],
      default: "base",
    },
    mythicLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    price: {
      type: Number,
      required: true,
    },
    supply: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
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

weaponNftSchema.index({ category: 1, blueprintTier: 1 });
weaponNftSchema.index({ ownerAddress: 1 });

const WeaponNft = mongoose.model("WeaponNft", weaponNftSchema);
module.exports = WeaponNft;
