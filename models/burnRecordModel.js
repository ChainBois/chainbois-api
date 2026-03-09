const mongoose = require("mongoose");

const burnRecordSchema = new mongoose.Schema(
  {
    weekNumber: { type: Number, required: true },
    year: { type: Number, required: true },
    sweepAmount: { type: Number, required: true },
    burnAmount: { type: Number, required: true },
    recycleAmount: { type: Number, required: true },
    burnTxHash: { type: String, default: "" },
    recycleTxHash: { type: String, default: "" },
    healthTier: { type: String, required: true },
    rewardsBalanceBefore: { type: Number, default: 0 },
    rewardsBalanceAfter: { type: Number, default: 0 },
    totalSupplyAfter: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

burnRecordSchema.index({ year: 1, weekNumber: 1 });

const BurnRecord = mongoose.model("BurnRecord", burnRecordSchema);
module.exports = BurnRecord;
