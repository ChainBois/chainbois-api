module.exports = {
  // Player types
  PLAYER_TYPE: {
    WEB2: "web2",
    WEB3: "web3",
  },

  // User roles
  ROLES: {
    USER: "user",
    ADMIN: "admin",
  },

  // NFT levels
  MAX_LEVEL: 7,
  LEVEL_UP_COST_AVAX: "1", // 1 AVAX per level

  // Characters per level
  CHARACTERS_PER_LEVEL: 4,
  BASE_CHARACTERS: 4,
  BASE_WEAPONS: 4,

  // Points
  MAX_POINTS_PER_MATCH: 5000,
  POINTS_TO_BATTLE_RATIO: 1, // 1:1

  // Tournament
  TOURNAMENT: {
    START_DAY: 3, // Wednesday (0=Sunday)
    START_HOUR: 12, // 12 PM EST
    DURATION_HOURS: 120, // 5 days
    COOLDOWN_HOURS: 48,
    PRIZE_COLLECTION_WINDOW_DAYS: 7,
  },

  // Prize pools per level (in AVAX)
  PRIZE_POOLS: {
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 10,
    6: 12,
    7: 14,
  },

  // Prize distribution
  PRIZE_DISTRIBUTION: {
    FIRST: 0.5, // 50% of pool
    SECOND: 0.35, // 35% of pool
    THIRD: 0.15, // 15% of pool (in $BATTLE)
  },

  // Revenue splits
  TEAM_REVENUE_SPLIT: 0.25, // 25%
  AWARD_POOL_SPLIT: 0.75, // 75%
  BURN_RATE: 0.5, // 50%

  // Weapon categories
  WEAPON_CATEGORIES: [
    "assault",
    "smg",
    "lmg",
    "marksman",
    "handgun",
    "launcher",
    "melee",
  ],

  // Blueprint tiers
  BLUEPRINT_TIERS: ["base", "epic", "legendary", "mythic"],

  // Tournament statuses
  TOURNAMENT_STATUS: {
    UPCOMING: "upcoming",
    ACTIVE: "active",
    COOLDOWN: "cooldown",
    COMPLETED: "completed",
  },

  // Transaction types
  TRANSACTION_TYPES: {
    LEVEL_UP: "level_up",
    WEAPON_PURCHASE: "weapon_purchase",
    POINTS_CONVERSION: "points_conversion",
    PRIZE_PAYOUT: "prize_payout",
    NFT_TRANSFER: "nft_transfer",
    NFT_CLAIM: "nft_claim",
  },

  // Security
  SECURITY: {
    DAILY_EARNINGS_LIMIT: 5000,
    THREAT_THRESHOLDS: {
      COOLDOWN: 100,
      TEMPORARY_BAN: 150,
      PERMANENT_BAN: 250,
    },
    THREAT_INCREMENTS: {
      VELOCITY_EXPLOIT: 5,
      SESSION_ENDURANCE: 25,
      REPEAT_OFFENSE: 20,
      NO_LONGER_HOLDS_NFT: 25,
    },
    MAX_SESSION_HOURS: 12,
    TEMP_BAN_HOURS: 24,
  },

  // Firebase paths
  FIREBASE_PATHS: {
    USERS: "users",
  },

  // Sync intervals (ms)
  SYNC_NEW_USERS_INTERVAL: "*/1 * * * *", // Every 1 minute
  SYNC_SCORES_INTERVAL: "*/5 * * * *", // Every 5 minutes

  // Wallet roles
  WALLET_ROLES: {
    ADMIN: "admin",
    PRIZE_POOL: "prize_pool",
    NFT_STORE: "nft_store",
    WEAPON_STORE: "weapon_store",
  },
};
