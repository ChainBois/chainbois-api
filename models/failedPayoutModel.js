const mongoose = require("mongoose");

const failedPayoutSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["AVAX", "BATTLE"],
      required: true,
    },
    reason: {
      type: String,
      default: "",
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    lastRetry: {
      type: Date,
      default: null,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedTxHash: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

failedPayoutSchema.index({ resolved: 1, retryCount: 1 });

const FailedPayout = mongoose.model("FailedPayout", failedPayoutSchema);
module.exports = FailedPayout;
