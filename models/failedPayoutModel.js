const mongoose = require("mongoose");

const failedPayoutSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      default: null,
    },
    address: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
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
      min: 0,
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

// Normalize address to lowercase before save
failedPayoutSchema.pre("save", function (next) {
  if (this.address) this.address = this.address.toLowerCase();
  next();
});

failedPayoutSchema.index({ resolved: 1, retryCount: 1 });

const FailedPayout = mongoose.model("FailedPayout", failedPayoutSchema);
module.exports = FailedPayout;
