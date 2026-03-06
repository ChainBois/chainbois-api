const mongoose = require("mongoose");

const chosenTraitSchema = new mongoose.Schema(
  {
    traitType: { type: String, required: true },
    value: { type: String, required: true },
    dateChosen: { type: Date, required: true },
    weekNumber: { type: Number, required: true },
    beneficiaryCount: { type: Number, default: 0 },
    totalDistributed: { type: Number, default: 0 },
  },
  { _id: false }
);

const traitsPoolSchema = new mongoose.Schema(
  {
    poolName: {
      type: String,
      required: true,
      default: "ChainBois Trait Airdrop",
    },
    tokenAddress: {
      type: String,
      required: true,
    },
    tokenName: {
      type: String,
      default: "BATTLE",
    },
    weeklyDistributionAmount: {
      type: Number,
      required: true,
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "inactive",
    },
    lastChosenTrait: {
      type: chosenTraitSchema,
      default: null,
    },
    traitHistory: {
      type: [chosenTraitSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const TraitsPool = mongoose.model("TraitsPool", traitsPoolSchema);
module.exports = TraitsPool;
