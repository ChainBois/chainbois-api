const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const ChainboiNft = require("../models/chainboiNftModel");
const WeaponNft = require("../models/weaponNftModel");
const TraitsPool = require("../models/traitsPoolModel");
const Tournament = require("../models/tournamentModel");
const PurchaseAttempt = require("../models/purchaseAttemptModel");
const FailedPayout = require("../models/failedPayoutModel");
const BurnRecord = require("../models/burnRecordModel");
const { getBattleBalance, getNftOwner, getWeaponNftOwner } = require("../utils/contractUtils");
const { sendDiscordAlert } = require("../utils/discordService");
const { getTokenomicsRates } = require("../services/tokenomicsService");
const {
  WALLET_ROLES,
  BATTLE_PRIZES_PER_LEVEL,
  TOURNAMENT_STATUS,
} = require("../config/constants");

/**
 * Platform audit job — runs daily at 3 AM UTC.
 * Comprehensive platform health and solvency check.
 */
const platformAuditJob = async function () {
  console.log("[PlatformAudit] Starting daily audit...");
  const report = { checks: [], issues: [] };

  try {
    await checkSolvency(report);
    await checkOwnershipSync(report);
    await checkStuckPurchases(report);
    await checkFailedPayouts(report);
    await reportTokenomicsHealth(report);
  } catch (e) {
    console.error("[PlatformAudit] Audit failed:", e.message);
    return;
  }

  // Summary
  console.log("\n[PlatformAudit] ========== DAILY AUDIT REPORT ==========");
  for (const check of report.checks) {
    console.log(`  [${check.status}] ${check.name}: ${check.detail}`);
  }

  if (report.issues.length > 0) {
    console.log(`\n  ${report.issues.length} issue(s) require attention:`);
    for (const issue of report.issues) {
      console.log(`    [${issue.severity.toUpperCase()}] ${issue.message}`);
    }

    // Send consolidated Discord alert
    try {
      const issueList = report.issues.map((i) => `[${i.severity.toUpperCase()}] ${i.message}`).join("\n");
      await sendDiscordAlert({
        subject: `Daily Audit: ${report.issues.length} issue(s)`,
        status: report.issues.some((i) => i.severity === "critical") ? "critical" : "warning",
        poolType: "Platform Audit",
        walletAddress: "N/A",
        currentBalance: 0,
        requiredAmount: 0,
        unitName: issueList.substring(0, 200),
      });
    } catch (e) {
      // Non-blocking
    }
  } else {
    console.log("\n  All checks passed.");
  }

  console.log("[PlatformAudit] ==========================================\n");
};

/**
 * Check platform solvency — can rewards wallet cover obligations?
 */
const checkSolvency = async function (report) {
  const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS }).lean();
  if (!rewardsWallet) {
    report.checks.push({ name: "Solvency", status: "SKIP", detail: "No rewards wallet" });
    return;
  }

  const rewardsBalance = parseFloat(await getBattleBalance(rewardsWallet.address));

  // Sum obligations
  let totalObligations = 0;
  const breakdown = {};

  // a. Active airdrop pools: weekly amount * 52 (annual projection)
  const activePools = await TraitsPool.find({ status: "active" }).lean();
  const airdropAnnual = activePools.reduce((sum, p) => sum + (p.weeklyDistributionAmount * 52), 0);
  totalObligations += airdropAnnual;
  breakdown.airdropAnnual = airdropAnnual;

  // b. Pending points conversions (all users' pointsBalance)
  const pointsAgg = await User.aggregate([
    { $group: { _id: null, totalPoints: { $sum: "$pointsBalance" } } },
  ]);
  const totalPendingPoints = pointsAgg[0] ? pointsAgg[0].totalPoints : 0;
  totalObligations += totalPendingPoints; // 1:1 at best (dynamic rate reduces this)
  breakdown.pendingPointsConversion = totalPendingPoints;

  // c. Upcoming tournament BATTLE prizes (3rd place)
  const upcomingTournaments = await Tournament.find({
    status: { $in: [TOURNAMENT_STATUS.ACTIVE, TOURNAMENT_STATUS.UPCOMING] },
  }).lean();
  const tournamentBattle = upcomingTournaments.reduce((sum, t) => sum + (BATTLE_PRIZES_PER_LEVEL[t.level] || 0), 0);
  totalObligations += tournamentBattle;
  breakdown.tournamentBattle = tournamentBattle;

  const isSolvent = rewardsBalance >= totalObligations;
  const coverage = totalObligations > 0 ? (rewardsBalance / totalObligations * 100).toFixed(1) : "∞";

  report.checks.push({
    name: "Solvency",
    status: isSolvent ? "PASS" : "WARN",
    detail: `Rewards: ${rewardsBalance.toLocaleString()} BATTLE | Obligations: ${totalObligations.toLocaleString()} | Coverage: ${coverage}%`,
  });

  if (!isSolvent) {
    report.issues.push({
      severity: rewardsBalance < totalObligations * 0.5 ? "critical" : "warning",
      message: `Solvency risk: ${rewardsBalance.toLocaleString()} BATTLE vs ${totalObligations.toLocaleString()} obligations (${coverage}% coverage)`,
    });
  }
};

/**
 * Spot-check on-chain vs DB ownership for a sample of NFTs/weapons.
 */
const checkOwnershipSync = async function (report) {
  let mismatches = 0;
  let checked = 0;

  // Sample 10 random ChainBoi NFTs
  try {
    const sampleNfts = await ChainboiNft.aggregate([{ $sample: { size: 10 } }]);

    for (const nft of sampleNfts) {
      try {
        const onChainOwner = (await getNftOwner(nft.tokenId)).toLowerCase();
        const dbOwner = (nft.ownerAddress || "").toLowerCase();
        checked++;

        if (onChainOwner !== dbOwner) {
          mismatches++;
          console.log(`[PlatformAudit] NFT #${nft.tokenId} mismatch: DB=${dbOwner} On-chain=${onChainOwner}`);
        }
      } catch (e) {
        // Token may not exist on-chain
      }
    }
  } catch (e) {
    console.error("[PlatformAudit] NFT ownership check failed:", e.message);
  }

  // Sample 5 random Weapon NFTs
  try {
    const sampleWeapons = await WeaponNft.aggregate([{ $sample: { size: 5 } }]);

    for (const weapon of sampleWeapons) {
      try {
        const onChainOwner = (await getWeaponNftOwner(weapon.tokenId)).toLowerCase();
        const dbOwner = (weapon.ownerAddress || "").toLowerCase();
        checked++;

        if (onChainOwner !== dbOwner) {
          mismatches++;
          console.log(`[PlatformAudit] Weapon #${weapon.tokenId} mismatch: DB=${dbOwner} On-chain=${onChainOwner}`);
        }
      } catch (e) {
        // Token may not exist on-chain
      }
    }
  } catch (e) {
    console.error("[PlatformAudit] Weapon ownership check failed:", e.message);
  }

  report.checks.push({
    name: "Ownership Sync",
    status: mismatches === 0 ? "PASS" : "WARN",
    detail: `Checked ${checked} assets, ${mismatches} mismatch(es)`,
  });

  if (mismatches > 0) {
    report.issues.push({
      severity: "warning",
      message: `${mismatches} ownership mismatch(es) found in ${checked} spot-checked assets`,
    });
  }
};

/**
 * Check for purchase attempts stuck in non-terminal states > 24h.
 */
const checkStuckPurchases = async function (report) {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stuckCount = await PurchaseAttempt.countDocuments({
    status: { $in: ["pending", "processing", "needs_refund"] },
    createdAt: { $lt: cutoff },
  });

  report.checks.push({
    name: "Stuck Purchases",
    status: stuckCount === 0 ? "PASS" : "WARN",
    detail: `${stuckCount} purchase(s) stuck > 24h`,
  });

  if (stuckCount > 0) {
    report.issues.push({
      severity: stuckCount > 5 ? "critical" : "warning",
      message: `${stuckCount} purchase attempt(s) stuck in non-terminal state for > 24 hours`,
    });
  }
};

/**
 * Check for unresolved failed payouts.
 */
const checkFailedPayouts = async function (report) {
  const unresolvedCount = await FailedPayout.countDocuments({ resolved: false });

  report.checks.push({
    name: "Failed Payouts",
    status: unresolvedCount === 0 ? "PASS" : "WARN",
    detail: `${unresolvedCount} unresolved failed payout(s)`,
  });

  if (unresolvedCount > 0) {
    report.issues.push({
      severity: unresolvedCount > 3 ? "critical" : "warning",
      message: `${unresolvedCount} unresolved failed payout(s) require manual attention`,
    });
  }
};

/**
 * Report current tokenomics health.
 */
const reportTokenomicsHealth = async function (report) {
  const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS }).lean();
  if (!rewardsWallet) return;

  try {
    const balance = parseFloat(await getBattleBalance(rewardsWallet.address));
    const rates = getTokenomicsRates(balance);

    // Get burn stats
    const totalBurned = await BurnRecord.aggregate([
      { $group: { _id: null, total: { $sum: "$burnAmount" } } },
    ]);
    const burnedAmount = totalBurned[0] ? totalBurned[0].total : 0;
    const burnCount = await BurnRecord.countDocuments();

    report.checks.push({
      name: "Tokenomics",
      status: rates.tier === "CRITICAL" ? "WARN" : "PASS",
      detail: `Tier: ${rates.tier} | Multiplier: ${rates.multiplier} | Burned: ${burnedAmount.toLocaleString()} BATTLE (${burnCount} events) | Rewards: ${balance.toLocaleString()}`,
    });
  } catch (e) {
    console.error("[PlatformAudit] Tokenomics check failed:", e.message);
  }
};

module.exports = { platformAuditJob };
