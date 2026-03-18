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
    "shotgun",
    "melee",
  ],

  // Character unlock data per level (army ranks)
  CHARACTERS_UNLOCK: {
    0: ["Private_A", "Private_B", "Private_C", "Private_D"],
    1: ["Corporal_A", "Corporal_B", "Corporal_C", "Corporal_D"],
    2: ["Sergeant_A", "Sergeant_B", "Sergeant_C", "Sergeant_D"],
    3: ["Captain_A", "Captain_B", "Captain_C", "Captain_D"],
    4: ["Major_A", "Major_B", "Major_C", "Major_D"],
    5: ["Colonel_A", "Colonel_B", "Colonel_C", "Colonel_D"],
    6: ["Major_General_A", "Major_General_B", "Major_General_C", "Major_General_D"],
    7: ["Field_Marshal_A", "Field_Marshal_B", "Field_Marshal_C", "Field_Marshal_D"],
  },

  // Weapons by category (13 weapons from ghetto-warzones, 8 categories)
  // Testnet: uses ghetto-warzones weapon data (multi-mint NFTs, supply > 1)
  // Mainnet: will expand to 30+ weapons with new art/descriptions
  WEAPONS_BY_CATEGORY: {
    assault: ["AR M4 MK18", "AK74M"],
    smg: ["H&K MP5", "UMP 45"],
    lmg: ["Stoner 96"],
    marksman: ["Barrett M82", "SRS99G-S6 AM"],
    handgun: ["AM-18", "Colt M1911"],
    launcher: ["M32A1 MSGL"],
    shotgun: ["SPAS-12", "Sawed-Off Shotgun"],
    melee: ["M-9 Bayonet"],
  },

  // Base weapons available at level 0 (1 per category: assault, handgun, melee, launcher)
  BASE_WEAPONS_UNLOCK: ["AR M4 MK18", "AM-18", "M-9 Bayonet", "M32A1 MSGL"],

  // Full weapon definitions with metadata from ghetto-warzones (for NFT minting)
  // Multi-mint NFTs: each weapon has supply > 1 (multiple copies)
  WEAPON_DEFINITIONS: [
    { gameId: 10, name: "AM-18", category: "handgun", supply: 75, description: "Semi-automatic precision pistol with 33-round magazine and 1,100-1,200 rounds per minute fire rate." },
    { gameId: 8, name: "AR M4 MK18", category: "assault", supply: 30, description: "A pinnacle of tactical excellence, featuring a 10.3\" barrel, CNC-machined 7075-T6 aluminum receiver, and RIS II picatinny quad rail." },
    { gameId: 11, name: "SPAS-12", category: "shotgun", supply: 30, description: "A versatile combat shotgun known for its dual semi-automatic and pump-action modes, featuring a folding stock and heat shield." },
    { gameId: 9, name: "H&K MP5", category: "smg", supply: 75, description: "A legendary 9mm submachine gun renowned for its reliability and precision. Features a roller-delayed blowback mechanism." },
    { gameId: 12, name: "Barrett M82", category: "marksman", supply: 50, description: "A .50 BMG semi-automatic sniper rifle known for its precision and long-range capabilities." },
    { gameId: 15, name: "Sawed-Off Shotgun", category: "shotgun", supply: 75, description: "A compact double-barrel shotgun with shortened barrel and stock, perfect for close-quarters combat." },
    { gameId: 14, name: "M32A1 MSGL", category: "launcher", supply: 50, description: "A semi-automatic 40mm grenade launcher with a 6-round cylinder, capable of firing all rounds in 3 seconds." },
    { gameId: 20, name: "M-9 Bayonet", category: "melee", supply: 75, description: "A versatile 12-inch multi-purpose tool featuring a durable stainless steel blade with a saw-toothed edge." },
    { gameId: 19, name: "Stoner 96", category: "lmg", supply: 50, description: "A state-of-the-art light machine gun featuring an open-bolt, constant recoil action for enhanced control and accuracy." },
    { gameId: 18, name: "AK74M", category: "assault", supply: 75, description: "Utilizing the 5.45x39mm cartridge, offers superior accuracy and reduced recoil compared to its predecessor, the AK-47." },
    { gameId: 17, name: "SRS99G-S6 AM", category: "marksman", supply: 50, description: "A pinnacle of precision and lethality in sniper rifles featuring modular design and kinetic suppression technology." },
    { gameId: 16, name: "Colt M1911", category: "handgun", supply: 75, description: "A .45 caliber semi-automatic pistol with a 7-round detachable magazine. Designed for reliability and precision in close-quarters combat." },
    { gameId: 13, name: "UMP 45", category: "smg", supply: 75, description: "A lightweight, blowback-operated submachine gun with a cyclic rate of 600-750 rounds per minute." },
  ],

  // Battle token decimals (OZ ERC20 default = 18, contract does not override)
  BATTLE_TOKEN_DECIMALS: 18,

  // Fixed $BATTLE prize amounts for 3rd place per tournament level
  BATTLE_PRIZES_PER_LEVEL: {
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    6: 600,
    7: 700,
  },

  // ChainBois NFT constants
  CHAINBOIS_NFT: {
    TOTAL_SUPPLY: 4032,
    PUBLIC_SUPPLY: 4000,
    RESERVED: 32,
    TESTNET_SUPPLY: 50,
    SYMBOL: "CB",
  },

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
    NFT_PURCHASE: "nft_purchase",
    TRAIT_AIRDROP: "trait_airdrop",
    RARITY_AIRDROP: "rarity_airdrop",
    REFUND: "refund",
    TOKEN_BURN: "token_burn",
    TOKEN_RECYCLE: "token_recycle",
  },

  // Rarity tier thresholds (percentile cutoffs)
  RARITY_TIERS: {
    LEGENDARY: 1,   // top 1%
    EPIC: 5,        // top 1-5%
    RARE: 20,       // top 5-20%
    UNCOMMON: 50,   // top 20-50%
    // COMMON: > 50%
  },

  // Security
  SECURITY: {
    DAILY_EARNINGS_LIMIT: 50000,
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

  // Sync intervals (cron expressions)
  SYNC_NEW_USERS_INTERVAL: "0 0 * * *", // Runs daily at midnight UTC (web2 player detection for platform metrics)
  SYNC_SCORES_INTERVAL: "*/5 * * * *", // Every 5 minutes

  // Rank names by level (for NFT badge/metadata)
  RANK_NAMES: {
    0: "Private",
    1: "Corporal",
    2: "Sergeant",
    3: "Captain",
    4: "Major",
    5: "Colonel",
    6: "Major General",
    7: "Field Marshal",
  },

  // Purchase failsafe system
  PURCHASE_FAILSAFE: {
    TRANSFER_MAX_RETRIES: 3,
    TRANSFER_RETRY_DELAY_MS: 2000,
    FAILSAFE_INTERVAL: "*/5 * * * *",
    STUCK_THRESHOLD_MINUTES: 5,
    PROCESSING_TIMEOUT_MINUTES: 15,
    LOCK_TIMEOUT_MINUTES: 10,
    REFUND_MAX_RETRIES: 10,
  },

  // Dynamic tokenomics
  TOKENOMICS: {
    TOTAL_SUPPLY: 10_000_000,
    SWEEP_MIN_THRESHOLD: 10, // Minimum BATTLE in weapon_store to trigger sweep
    HEALTH_TIERS: {
      ABUNDANT:  { min: 75, multiplier: 1.0,  burnRate: 0.5 },
      HEALTHY:   { min: 50, multiplier: 0.75, burnRate: 0.4 },
      MODERATE:  { min: 30, multiplier: 0.5,  burnRate: 0.3 },
      SCARCE:    { min: 15, multiplier: 0.3,  burnRate: 0.2 },
      CRITICAL:  { min: 0,  multiplier: 0.15, burnRate: 0.1 },
    },
  },

  // Wallet health monitoring thresholds
  WALLET_HEALTH: {
    GAS_THRESHOLDS: {
      deployer:     { critical: 0.1, warning: 0.5 },
      nft_store:    { critical: 0.05, warning: 0.2 },
      weapon_store: { critical: 0.05, warning: 0.2 },
      prize_pool:   { critical: 0.05, warning: 0.2 },
      rewards:      { critical: 0.05, warning: 0.2 },
    },
    BATTLE_THRESHOLDS: {
      critical: 10000,
      warning: 50000,
    },
    NFT_THRESHOLDS: {
      critical: 0,
      warning: 5,
    },
    WEAPON_CATEGORY_THRESHOLDS: {
      critical: 0,
      warning: 2,
    },
    ALERT_COOLDOWN_HOURS: 6,
    // Auto-fund: deployer tops up wallets when gas is low
    AUTO_FUND: {
      ENABLED: true,
      // Target balance to send when topping up (in AVAX)
      TOP_UP_AMOUNTS: {
        nft_store: "0.5",
        weapon_store: "0.5",
        rewards: "0.5",
      },
      // Deployer won't fund others if its own balance drops below this
      DEPLOYER_MIN_RESERVE: 0.5,
    },
  },

  // Wallet roles
  WALLET_ROLES: {
    ADMIN: "admin",
    DEPLOYER: "deployer",
    PRIZE_POOL: "prize_pool",
    NFT_STORE: "nft_store",
    WEAPON_STORE: "weapon_store",
    REWARDS: "rewards",
    TEST: "test",
  },

  // Trait types that are dynamically computed (not static NFT art traits)
  DYNAMIC_TRAIT_TYPES: new Set(["Level", "Rank", "Kills", "Score", "Games Played"]),

  /**
   * Build a complete traits array with current dynamic values.
   * Static art traits are preserved; dynamic traits are replaced with live values.
   * @param {Array} rawTraits - Raw traits from MongoDB (may have stale dynamic values)
   * @param {object} opts - { level, rank, inGameStats }
   * @returns {Array} Complete traits array with current values
   */
  buildCurrentTraits: function (rawTraits, opts) {
    const dynamic = new Set(["Level", "Rank", "Kills", "Score", "Games Played"]);
    const staticTraits = Array.isArray(rawTraits)
      ? rawTraits.filter((t) => !dynamic.has(t.trait_type)).map((t) => ({ trait_type: t.trait_type, value: t.value }))
      : [];
    const { level = 0, rank = "Private", inGameStats = {} } = opts || {};
    return [
      ...staticTraits,
      { trait_type: "Level", value: level },
      { trait_type: "Rank", value: rank },
      { trait_type: "Kills", value: inGameStats.kills || 0 },
      { trait_type: "Score", value: inGameStats.score || 0 },
      { trait_type: "Games Played", value: inGameStats.gamesPlayed || 0 },
    ];
  },
};
