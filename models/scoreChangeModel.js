const mongoose = require("mongoose");

const scoreChangeSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      index: true,
    },
    address: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    previousScore: {
      type: Number,
      required: true,
      min: 0,
    },
    scoreChange: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    year: {
      type: Number,
    },
    month: {
      type: Number,
    },
    week: {
      type: Number,
    },
    day: {
      type: Number,
    },
    hour: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-populate date components from timestamp
scoreChangeSchema.pre("save", function (next) {
  const ts = this.timestamp || new Date();
  this.year = ts.getFullYear();
  this.month = ts.getMonth() + 1;
  const startOfYear = new Date(ts.getFullYear(), 0, 1);
  const pastDays = (ts - startOfYear) / 86400000;
  this.week = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  this.day = ts.getDate();
  this.hour = ts.getHours();
  next();
});

scoreChangeSchema.index({ timestamp: -1, score: -1 });
scoreChangeSchema.index({ year: 1, week: 1, score: -1 });
scoreChangeSchema.index({ uid: 1, timestamp: -1 });

const ScoreChange = mongoose.model("ScoreChange", scoreChangeSchema);
module.exports = ScoreChange;
