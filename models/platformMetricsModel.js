const mongoose = require("mongoose");

const platformMetricsSchema = new mongoose.Schema(
  {
    users: {
      total: { type: Number, default: 0 },
      web2: { type: Number, default: 0 },
      web3: { type: Number, default: 0 },
    },
    gameActivity: {
      totalGamesPlayed: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
    },
    nftEconomy: {
      totalNftsOwned: { type: Number, default: 0 },
      nftsByLevel: {
        type: Map,
        of: Number,
        default: () => new Map(),
      },
    },
    tokenEconomy: {
      totalBattleDistributed: { type: Number, default: 0 },
      totalPointsConverted: { type: Number, default: 0 },
    },
    trainingMetrics: {
      totalLevelUps: { type: Number, default: 0 },
    },
    battlegroundMetrics: {
      totalTournaments: { type: Number, default: 0 },
      completedTournaments: { type: Number, default: 0 },
      totalParticipants: { type: Number, default: 0 },
      totalPrizeDistributed: { type: Number, default: 0 },
    },
    weaponMetrics: {
      totalWeaponsSold: { type: Number, default: 0 },
    },
    tokenomics: {
      totalBurned: { type: Number, default: 0 },
      totalRecycled: { type: Number, default: 0 },
      currentHealthTier: { type: String, default: "ABUNDANT" },
      currentMultiplier: { type: Number, default: 1.0 },
      rewardsBalance: { type: Number, default: 0 },
      totalSupplyRemaining: { type: Number, default: 10_000_000 },
      lastSweepDate: { type: Date },
      burnCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Get the singleton metrics document, or create it if it doesn't exist.
 */
platformMetricsSchema.statics.getOrCreate = async function () {
  let metrics = await this.findOne();
  if (!metrics) {
    metrics = await this.create({});
  }
  return metrics;
};

/**
 * Atomically increment user counts.
 * @param {"web2"|"web3"} type - The player type to increment
 */
platformMetricsSchema.statics.incrementUsers = async function (type) {
  const inc = { "users.total": 1 };
  if (type === "web2") {
    inc["users.web2"] = 1;
  } else if (type === "web3") {
    inc["users.web3"] = 1;
  }
  await this.updateOne({}, { $inc: inc }, { upsert: true });
};

/**
 * Atomically increment total level-ups.
 */
platformMetricsSchema.statics.incrementLevelUps = async function () {
  await this.updateOne(
    {},
    { $inc: { "trainingMetrics.totalLevelUps": 1 } },
    { upsert: true }
  );
};

/**
 * Atomically increment weapons sold count.
 */
platformMetricsSchema.statics.incrementWeaponsSold = async function () {
  await this.updateOne(
    {},
    { $inc: { "weaponMetrics.totalWeaponsSold": 1 } },
    { upsert: true }
  );
};

/**
 * Atomically increment tournament counts.
 */
platformMetricsSchema.statics.incrementTournaments = async function () {
  await this.updateOne(
    {},
    { $inc: { "battlegroundMetrics.totalTournaments": 1 } },
    { upsert: true }
  );
};

/**
 * Record game activity — increment games played/total score and update highest score.
 * @param {number} score - The score from this game session
 */
platformMetricsSchema.statics.recordGameActivity = async function (score) {
  await this.updateOne(
    {},
    {
      $inc: {
        "gameActivity.totalGamesPlayed": 1,
        "gameActivity.totalScore": score,
      },
      $max: { "gameActivity.highestScore": score },
    },
    { upsert: true }
  );
};

const PlatformMetrics = mongoose.model("PlatformMetrics", platformMetricsSchema);
module.exports = PlatformMetrics;
