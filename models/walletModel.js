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
    },
    iv: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "prize_pool", "nft_store", "weapon_store"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
