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
        "nft_purchase",
        "trait_airdrop",
        "rarity_airdrop",
        "refund",
        "token_burn",
        "token_recycle",
        "claim",
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
      min: 0,
    },
    currency: {
      type: String,
      enum: ["AVAX", "BATTLE", "NFT"],
      default: "AVAX",
    },
    txHash: {
      type: String,
      default: null,
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

// Normalize addresses to lowercase before save
transactionSchema.pre("save", function (next) {
  if (this.fromAddress) this.fromAddress = this.fromAddress.toLowerCase();
  if (this.toAddress) this.toAddress = this.toAddress.toLowerCase();
  next();
});

transactionSchema.index({ toAddress: 1, type: 1, createdAt: -1 });
transactionSchema.index({ fromAddress: 1, createdAt: -1 });
transactionSchema.index({ txHash: 1 }, { unique: true, sparse: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
