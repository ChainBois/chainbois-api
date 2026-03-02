const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "level_up",
        "weapon_purchase",
        "points_conversion",
        "prize_payout",
        "nft_transfer",
        "nft_claim",
      ],
      required: true,
    },
    fromAddress: {
      type: String,
      default: "",
    },
    toAddress: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      enum: ["AVAX", "BATTLE"],
      required: true,
    },
    txHash: {
      type: String,
      default: "",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ toAddress: 1, type: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
