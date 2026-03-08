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
      enum: ["assault", "smg", "lmg", "marksman", "handgun", "launcher", "shotgun", "melee"],
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
      min: 0,
    },
    supply: {
      type: Number,
      default: 0,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
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

// Normalize addresses to lowercase before save
weaponNftSchema.pre("save", function (next) {
  if (this.ownerAddress) this.ownerAddress = this.ownerAddress.toLowerCase();
  if (this.contractAddress) this.contractAddress = this.contractAddress.toLowerCase();
  next();
});

weaponNftSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.ownerAddress) update.ownerAddress = update.ownerAddress.toLowerCase();
  if (update.$set && update.$set.ownerAddress) update.$set.ownerAddress = update.$set.ownerAddress.toLowerCase();
  next();
});

weaponNftSchema.index({ category: 1, blueprintTier: 1 });

const WeaponNft = mongoose.model("WeaponNft", weaponNftSchema);
module.exports = WeaponNft;
