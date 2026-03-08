const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const FailedPayout = require("../models/failedPayoutModel");
const WeeklyLeaderboard = require("../models/weeklyLeaderboardModel");
const LeaderboardHistory = require("../models/leaderboardHistoryModel");
const { sendAvax, getAvaxBalance } = require("../utils/avaxUtils");
const { transferBattleTokens, getBattleBalance } = require("../utils/contractUtils");
const { decrypt } = require("../utils/cryptUtils");
const { sendLeaderboardNotification, sendDiscordAlert } = require("../utils/discordService");
const {
  PRIZE_DISTRIBUTION,
  BATTLE_PRIZES_PER_LEVEL,
  TRANSACTION_TYPES,
  WALLET_ROLES,
} = require("../config/constants");

/**
 * Distribute prizes for a completed tournament.
 * Sends AVAX to 1st/2nd from prize_pool wallet, $BATTLE to 3rd from rewards wallet.
 *
 * @param {Object} tournament - Tournament document (must have level, prizePool, weekNumber, year)
 * @returns {Object} Summary of distribution results
 */
const distributePrizes = async function (tournament) {
  const results = { winners: [], errors: [] };

  // Idempotency check: skip if prizes already distributed
  if (tournament.winners && tournament.winners.length > 0 && tournament.winners.some((w) => w.paid)) {
    console.log(`Tournament L${tournament.level} W${tournament.weekNumber}: Prizes already distributed, skipping`);
    return results;
  }

  // 1. Get top 3 from WeeklyLeaderboard for this tournament
  const topPlayers = await WeeklyLeaderboard.find({
    year: tournament.year,
    weekNumber: tournament.weekNumber,
    tournamentLevel: tournament.level,
  })
    .sort({ highScore: -1 })
    .limit(3)
    .lean();

  if (topPlayers.length === 0) {
    console.log(`Tournament L${tournament.level} W${tournament.weekNumber}: No players, skipping prizes`);
    tournament.winners = [];
    return results;
  }

  // 2. Load wallets
  const prizePoolWallet = await Wallet.findOne({ role: WALLET_ROLES.PRIZE_POOL }).select("+key +iv");
  const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS }).select("+key +iv");

  let prizePoolKey = null;
  let rewardsKey = null;

  if (prizePoolWallet) {
    try {
      prizePoolKey = await decrypt(prizePoolWallet.key, prizePoolWallet.iv);
    } catch (e) {
      console.error("Failed to decrypt prize_pool wallet:", e.message);
    }
  }

  if (rewardsWallet) {
    try {
      rewardsKey = await decrypt(rewardsWallet.key, rewardsWallet.iv);
    } catch (e) {
      console.error("Failed to decrypt rewards wallet:", e.message);
    }
  }

  // 3. Define prizes for each position
  const prizeConfig = [
    {
      rank: 1,
      amount: tournament.prizePool * PRIZE_DISTRIBUTION.FIRST,
      currency: "AVAX",
    },
    {
      rank: 2,
      amount: tournament.prizePool * PRIZE_DISTRIBUTION.SECOND,
      currency: "AVAX",
    },
    {
      rank: 3,
      amount: BATTLE_PRIZES_PER_LEVEL[tournament.level] || 0,
      currency: "BATTLE",
    },
  ];

  // 4. Distribute to each winner
  for (let i = 0; i < Math.min(topPlayers.length, 3); i++) {
    const player = topPlayers[i];
    const prize = prizeConfig[i];

    if (!player.address) {
      console.log(`Tournament L${tournament.level}: Rank ${prize.rank} player ${player.uid} has no wallet address`);
      results.errors.push({ rank: prize.rank, uid: player.uid, reason: "No wallet address" });
      continue;
    }

    if (prize.amount <= 0) {
      continue;
    }

    const winnerEntry = {
      rank: prize.rank,
      address: player.address,
      username: player.username,
      points: player.highScore,
      paid: false,
      txHash: "",
      paidAt: null,
    };

    try {
      let receipt;

      if (prize.currency === "AVAX") {
        if (!prizePoolWallet || !prizePoolKey) {
          throw new Error("Prize pool wallet not configured or decryption failed");
        }

        // Check balance
        const balance = parseFloat(await getAvaxBalance(prizePoolWallet.address));
        if (balance < prize.amount) {
          throw new Error(`Insufficient AVAX balance: ${balance} < ${prize.amount}`);
        }

        receipt = await sendAvax(prizePoolKey, player.address, String(prize.amount));
      } else {
        // $BATTLE
        if (!rewardsWallet || !rewardsKey) {
          throw new Error("Rewards wallet not configured or decryption failed");
        }

        const balance = parseFloat(await getBattleBalance(rewardsWallet.address));
        if (balance < prize.amount) {
          throw new Error(`Insufficient $BATTLE balance: ${balance} < ${prize.amount}`);
        }

        receipt = await transferBattleTokens(player.address, prize.amount, rewardsKey);
      }

      winnerEntry.paid = true;
      winnerEntry.txHash = receipt.hash;
      winnerEntry.paidAt = new Date();

      // Record transaction
      await Transaction.create({
        type: TRANSACTION_TYPES.PRIZE_PAYOUT,
        fromAddress: prize.currency === "AVAX" ? prizePoolWallet.address : rewardsWallet.address,
        toAddress: player.address,
        amount: prize.amount,
        currency: prize.currency,
        txHash: receipt.hash,
        status: "confirmed",
        metadata: {
          tournamentId: tournament._id,
          tournamentLevel: tournament.level,
          rank: prize.rank,
          weekNumber: tournament.weekNumber,
          year: tournament.year,
        },
      });

      console.log(`  Rank ${prize.rank}: ${prize.amount} ${prize.currency} -> ${player.address} (${receipt.hash})`);
    } catch (e) {
      console.error(`  Rank ${prize.rank} payout failed: ${e.message}`);
      results.errors.push({ rank: prize.rank, address: player.address, reason: e.message });

      // Create failed payout for retry
      try {
        await FailedPayout.create({
          tournamentId: tournament._id,
          address: player.address,
          amount: prize.amount,
          currency: prize.currency,
          reason: e.message,
        });
      } catch (fpErr) {
        console.error(`  Failed to create FailedPayout record: ${fpErr.message}`);
      }

      // Discord alert for insufficient balance or wallet issues
      sendDiscordAlert({
        subject: `Prize Payout Failed - L${tournament.level} Rank ${prize.rank}`,
        status: "critical",
        poolType: prize.currency === "AVAX" ? "Prize Pool" : "Rewards",
        walletAddress: prize.currency === "AVAX" ? (prizePoolWallet?.address || "N/A") : (rewardsWallet?.address || "N/A"),
        currentBalance: 0,
        requiredAmount: prize.amount,
        unitName: prize.currency,
      }).catch(() => {});
    }

    results.winners.push(winnerEntry);
  }

  // 5. Update tournament with winners
  tournament.winners = results.winners;
  await tournament.save();

  // 6. Create leaderboard history
  try {
    await LeaderboardHistory.create({
      year: tournament.year,
      weekNumber: tournament.weekNumber,
      tournamentLevel: tournament.level,
      winners: results.winners.map((w) => ({
        rank: w.rank,
        address: w.address,
        username: w.username,
        highScore: w.points,
        prizeAmount: prizeConfig[w.rank - 1]?.amount || 0,
        prizeCurrency: prizeConfig[w.rank - 1]?.currency || "AVAX",
        txHash: w.txHash,
      })),
      totalPayout: results.winners
        .filter((w) => w.paid && prizeConfig[w.rank - 1]?.currency === "AVAX")
        .reduce((sum, w) => sum + (prizeConfig[w.rank - 1]?.amount || 0), 0),
    });
  } catch (e) {
    console.error("Failed to create leaderboard history:", e.message);
  }

  // 7. Send Discord notification
  try {
    await sendLeaderboardNotification({
      weekNumber: tournament.weekNumber,
      level: tournament.level,
      winners: results.winners.map((w) => ({
        rank: w.rank,
        username: w.username,
        points: w.points,
        amount: prizeConfig[w.rank - 1]?.amount || 0,
        currency: prizeConfig[w.rank - 1]?.currency || "AVAX",
        txHash: w.txHash,
      })),
    });
  } catch (e) {
    console.error("Failed to send Discord notification:", e.message);
  }

  return results;
};

/**
 * Retry failed prize payouts.
 * Attempts to resend prizes that failed during tournament distribution.
 */
const retryFailedPayouts = async function () {
  const failedPayouts = await FailedPayout.find({
    resolved: false,
    retryCount: { $lt: 5 },
  });

  if (failedPayouts.length === 0) return;

  console.log(`Retrying ${failedPayouts.length} failed payouts...`);

  const prizePoolWallet = await Wallet.findOne({ role: WALLET_ROLES.PRIZE_POOL }).select("+key +iv");
  const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS }).select("+key +iv");

  let prizePoolKey = null;
  let rewardsKey = null;

  if (prizePoolWallet) {
    try { prizePoolKey = await decrypt(prizePoolWallet.key, prizePoolWallet.iv); } catch (e) { /* */ }
  }
  if (rewardsWallet) {
    try { rewardsKey = await decrypt(rewardsWallet.key, rewardsWallet.iv); } catch (e) { /* */ }
  }

  for (const payout of failedPayouts) {
    try {
      let receipt;

      if (payout.currency === "AVAX") {
        if (!prizePoolWallet || !prizePoolKey) throw new Error("Prize pool wallet/key unavailable");
        receipt = await sendAvax(prizePoolKey, payout.address, String(payout.amount));
      } else {
        if (!rewardsWallet || !rewardsKey) throw new Error("Rewards wallet/key unavailable");
        receipt = await transferBattleTokens(payout.address, payout.amount, rewardsKey);
      }

      payout.resolved = true;
      payout.resolvedTxHash = receipt.hash;
      await payout.save();

      await Transaction.create({
        type: TRANSACTION_TYPES.PRIZE_PAYOUT,
        fromAddress: payout.currency === "AVAX" ? prizePoolWallet.address : rewardsWallet.address,
        toAddress: payout.address,
        amount: payout.amount,
        currency: payout.currency,
        txHash: receipt.hash,
        status: "confirmed",
        metadata: {
          tournamentId: payout.tournamentId,
          retryOf: payout._id,
        },
      });

      console.log(`  Resolved payout ${payout._id}: ${payout.amount} ${payout.currency} -> ${payout.address}`);
    } catch (e) {
      payout.retryCount += 1;
      payout.lastRetry = new Date();
      payout.reason = e.message;
      await payout.save();

      console.error(`  Retry failed for ${payout._id}: ${e.message} (attempt ${payout.retryCount}/5)`);

      // Critical alert if max retries reached
      if (payout.retryCount >= 5) {
        sendDiscordAlert({
          subject: `Prize Payout Permanently Failed`,
          status: "critical",
          poolType: payout.currency === "AVAX" ? "Prize Pool" : "Rewards",
          walletAddress: payout.address,
          currentBalance: 0,
          requiredAmount: payout.amount,
          unitName: payout.currency,
        }).catch(() => {});
      }
    }
  }
};

module.exports = { distributePrizes, retryFailedPayouts };
