const Wallet = require("../models/walletModel");
const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const Tournament = require("../models/tournamentModel");
const { getAvaxBalance } = require("../utils/avaxUtils");
const { getBattleBalance } = require("../utils/contractUtils");
const { sendDiscordAlert } = require("../utils/discordService");
const { getTokenomicsRates } = require("../services/tokenomicsService");
const {
  WALLET_ROLES,
  WALLET_HEALTH,
  WEAPON_CATEGORIES,
  PRIZE_POOLS,
  TOURNAMENT_STATUS,
} = require("../config/constants");

// In-memory alert deduplication: key -> { lastAlertTime, severity }
const alertTracker = new Map();

const shouldAlert = function (key, severity) {
  const now = Date.now();
  const cooldownMs = WALLET_HEALTH.ALERT_COOLDOWN_HOURS * 60 * 60 * 1000;
  const existing = alertTracker.get(key);

  if (!existing) return true;

  // Escalation: always alert if severity increased
  if (severity === "critical" && existing.severity === "warning") return true;

  // Cooldown: only re-alert after cooldown period
  return (now - existing.lastAlertTime) >= cooldownMs;
};

const recordAlert = function (key, severity) {
  alertTracker.set(key, { lastAlertTime: Date.now(), severity });
  // Evict old entries to prevent memory leak
  if (alertTracker.size > 500) {
    const oldest = alertTracker.keys().next().value;
    alertTracker.delete(oldest);
  }
};

/**
 * Check AVAX gas balance for all platform wallets.
 */
const checkGasBalances = async function (issues) {
  const wallets = await Wallet.find({
    role: { $in: Object.values(WALLET_ROLES).filter((r) => r !== "test" && r !== "admin") },
  }).lean();

  for (const wallet of wallets) {
    const thresholds = WALLET_HEALTH.GAS_THRESHOLDS[wallet.role];
    if (!thresholds) continue;

    try {
      const balance = parseFloat(await getAvaxBalance(wallet.address));

      if (balance < thresholds.critical) {
        issues.push({
          severity: "critical",
          type: "gas",
          wallet: wallet.role,
          address: wallet.address,
          balance,
          threshold: thresholds.critical,
          message: `${wallet.role} AVAX balance CRITICAL: ${balance} AVAX (< ${thresholds.critical})`,
        });
      } else if (balance < thresholds.warning) {
        issues.push({
          severity: "warning",
          type: "gas",
          wallet: wallet.role,
          address: wallet.address,
          balance,
          threshold: thresholds.warning,
          message: `${wallet.role} AVAX balance LOW: ${balance} AVAX (< ${thresholds.warning})`,
        });
      }
    } catch (e) {
      console.error(`[WalletHealth] Failed to check gas for ${wallet.role}: ${e.message}`);
    }
  }
};

/**
 * Check $BATTLE balance in rewards wallet.
 */
const checkBattleBalance = async function (issues) {
  const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS }).lean();
  if (!rewardsWallet) return;

  try {
    const balance = parseFloat(await getBattleBalance(rewardsWallet.address));
    const rates = getTokenomicsRates(balance);

    console.log(`[WalletHealth] Rewards BATTLE: ${balance.toLocaleString()} | Tier: ${rates.tier} | Multiplier: ${rates.multiplier}`);

    if (balance < WALLET_HEALTH.BATTLE_THRESHOLDS.critical) {
      issues.push({
        severity: "critical",
        type: "battle_balance",
        wallet: "rewards",
        address: rewardsWallet.address,
        balance,
        threshold: WALLET_HEALTH.BATTLE_THRESHOLDS.critical,
        message: `Rewards BATTLE CRITICAL: ${balance.toLocaleString()} (< ${WALLET_HEALTH.BATTLE_THRESHOLDS.critical.toLocaleString()})`,
      });
    } else if (balance < WALLET_HEALTH.BATTLE_THRESHOLDS.warning) {
      issues.push({
        severity: "warning",
        type: "battle_balance",
        wallet: "rewards",
        address: rewardsWallet.address,
        balance,
        threshold: WALLET_HEALTH.BATTLE_THRESHOLDS.warning,
        message: `Rewards BATTLE LOW: ${balance.toLocaleString()} (< ${WALLET_HEALTH.BATTLE_THRESHOLDS.warning.toLocaleString()})`,
      });
    }
  } catch (e) {
    console.error(`[WalletHealth] Failed to check BATTLE balance: ${e.message}`);
  }
};

/**
 * Check NFT inventory in nft_store.
 */
const checkNftInventory = async function (issues) {
  const nftStore = await Wallet.findOne({ role: WALLET_ROLES.NFT_STORE }).lean();
  if (!nftStore) return;

  try {
    const count = await ChainboiNft.countDocuments({
      ownerAddress: nftStore.address.toLowerCase(),
    });

    console.log(`[WalletHealth] NFT inventory: ${count} available`);

    if (count <= WALLET_HEALTH.NFT_THRESHOLDS.critical) {
      issues.push({
        severity: "critical",
        type: "nft_inventory",
        wallet: "nft_store",
        address: nftStore.address,
        balance: count,
        threshold: WALLET_HEALTH.NFT_THRESHOLDS.critical,
        message: `NFT inventory SOLD OUT: ${count} remaining`,
      });
    } else if (count < WALLET_HEALTH.NFT_THRESHOLDS.warning) {
      issues.push({
        severity: "warning",
        type: "nft_inventory",
        wallet: "nft_store",
        address: nftStore.address,
        balance: count,
        threshold: WALLET_HEALTH.NFT_THRESHOLDS.warning,
        message: `NFT inventory LOW: ${count} remaining (< ${WALLET_HEALTH.NFT_THRESHOLDS.warning})`,
      });
    }
  } catch (e) {
    console.error(`[WalletHealth] Failed to check NFT inventory: ${e.message}`);
  }
};

/**
 * Check weapon inventory per category in weapon_store.
 */
const checkWeaponInventory = async function (issues) {
  const weaponStore = await Wallet.findOne({ role: WALLET_ROLES.WEAPON_STORE }).lean();
  if (!weaponStore) return;

  try {
    const inventory = await WeaponNft.aggregate([
      { $match: { ownerAddress: weaponStore.address.toLowerCase() } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const categoryMap = {};
    for (const item of inventory) {
      categoryMap[item._id] = item.count;
    }

    const soldOutCategories = [];
    const lowCategories = [];

    for (const category of WEAPON_CATEGORIES) {
      const count = categoryMap[category] || 0;

      if (count <= WALLET_HEALTH.WEAPON_CATEGORY_THRESHOLDS.critical) {
        soldOutCategories.push(category);
      } else if (count < WALLET_HEALTH.WEAPON_CATEGORY_THRESHOLDS.warning) {
        lowCategories.push(`${category}(${count})`);
      }
    }

    console.log(`[WalletHealth] Weapon inventory: ${JSON.stringify(categoryMap)}`);

    if (soldOutCategories.length > 0) {
      issues.push({
        severity: "critical",
        type: "weapon_inventory",
        wallet: "weapon_store",
        address: weaponStore.address,
        balance: 0,
        threshold: 0,
        message: `Weapons SOLD OUT in: ${soldOutCategories.join(", ")}`,
      });
    }

    if (lowCategories.length > 0) {
      issues.push({
        severity: "warning",
        type: "weapon_inventory",
        wallet: "weapon_store",
        address: weaponStore.address,
        balance: 0,
        threshold: WALLET_HEALTH.WEAPON_CATEGORY_THRESHOLDS.warning,
        message: `Weapons LOW in: ${lowCategories.join(", ")}`,
      });
    }
  } catch (e) {
    console.error(`[WalletHealth] Failed to check weapon inventory: ${e.message}`);
  }
};

/**
 * Check prize_pool has enough AVAX for active/upcoming tournaments.
 */
const checkPrizePoolFunding = async function (issues) {
  const prizePoolWallet = await Wallet.findOne({ role: WALLET_ROLES.PRIZE_POOL }).lean();
  if (!prizePoolWallet) return;

  try {
    const activeTournaments = await Tournament.find({
      status: { $in: [TOURNAMENT_STATUS.ACTIVE, TOURNAMENT_STATUS.UPCOMING] },
    }).lean();

    if (activeTournaments.length === 0) return;

    // Sum expected AVAX prizes (1st + 2nd place: 85% of prize pool)
    let totalRequired = 0;
    for (const t of activeTournaments) {
      const poolSize = PRIZE_POOLS[t.level] || 0;
      totalRequired += poolSize * 0.85; // 50% + 35%
    }

    const balance = parseFloat(await getAvaxBalance(prizePoolWallet.address));

    console.log(`[WalletHealth] Prize pool: ${balance} AVAX | Required for ${activeTournaments.length} tournament(s): ${totalRequired} AVAX`);

    if (totalRequired > 0 && balance < totalRequired) {
      const deficit = totalRequired - balance;
      issues.push({
        severity: balance < totalRequired * 0.5 ? "critical" : "warning",
        type: "prize_pool",
        wallet: "prize_pool",
        address: prizePoolWallet.address,
        balance,
        threshold: totalRequired,
        message: `Prize pool deficit: ${balance} AVAX available, ${totalRequired} AVAX needed (deficit: ${deficit.toFixed(4)})`,
      });
    }
  } catch (e) {
    console.error(`[WalletHealth] Failed to check prize pool: ${e.message}`);
  }
};

/**
 * Send consolidated Discord alert for health issues.
 */
const sendHealthAlert = async function (issues) {
  for (const issue of issues) {
    const alertKey = `${issue.wallet}_${issue.type}_${issue.severity}`;

    if (!shouldAlert(alertKey, issue.severity)) {
      continue;
    }

    try {
      await sendDiscordAlert({
        subject: issue.message,
        status: issue.severity,
        poolType: `${issue.type} (${issue.wallet})`,
        walletAddress: issue.address,
        currentBalance: issue.balance,
        requiredAmount: issue.threshold,
        unitName: issue.type === "gas" ? "AVAX" : issue.type === "battle_balance" ? "BATTLE" : "units",
      });
      recordAlert(alertKey, issue.severity);
    } catch (e) {
      // Non-blocking
    }
  }
};

/**
 * Main wallet health check job — runs hourly.
 */
const walletHealthJob = async function () {
  console.log("[WalletHealth] Starting health check...");
  const issues = [];

  try {
    await checkGasBalances(issues);
    await checkBattleBalance(issues);
    await checkNftInventory(issues);
    await checkWeaponInventory(issues);
    await checkPrizePoolFunding(issues);
  } catch (e) {
    console.error("[WalletHealth] Job failed:", e.message);
    return;
  }

  if (issues.length === 0) {
    console.log("[WalletHealth] All checks passed");
  } else {
    console.log(`[WalletHealth] ${issues.length} issue(s) found`);
    for (const issue of issues) {
      console.log(`  [${issue.severity.toUpperCase()}] ${issue.message}`);
    }
    await sendHealthAlert(issues);
  }
};

module.exports = { walletHealthJob };
