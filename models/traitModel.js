const mongoose = require("mongoose");

const traitSchema = new mongoose.Schema(
  {
    traitType: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    usedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

traitSchema.index({ traitType: 1, value: 1 }, { unique: true });
traitSchema.index({ used: 1 });

const Trait = mongoose.model("Trait", traitSchema);
module.exports = Trait;
