const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      select: false,
    },
    iv: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "prize_pool", "nft_store", "weapon_store", "deployer", "test"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Normalize address to lowercase before save
walletSchema.pre("save", function (next) {
  if (this.address) this.address = this.address.toLowerCase();
  next();
});

walletSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.address) update.address = update.address.toLowerCase();
  if (update.$set && update.$set.address) update.$set.address = update.$set.address.toLowerCase();
  next();
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
