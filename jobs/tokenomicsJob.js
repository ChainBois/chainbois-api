const Wallet = require("../models/walletModel");
const BurnRecord = require("../models/burnRecordModel");
const Transaction = require("../models/transactionModel");
const { getBattleBalance, getBattleTotalSupply, burnBattleTokens, transferBattleTokens } = require("../utils/contractUtils");
const { decrypt } = require("../utils/cryptUtils");
const { getSweepSplit } = require("../services/tokenomicsService");
const { sendDiscordAlert } = require("../utils/discordService");
const { WALLET_ROLES, TOKENOMICS, TRANSACTION_TYPES } = require("../config/constants");

/**
 * Tokenomics sweep job — runs every 6 hours.
 * Checks weapon_store $BATTLE balance, burns a portion, recycles the rest to rewards.
 */
const tokenomicsJob = async function () {
  console.log("[Tokenomics] Starting sweep job...");

  try {
    // 1. Get weapon_store wallet
    const weaponStore = await Wallet.findOne({ role: WALLET_ROLES.WEAPON_STORE }).select("+key +iv");
    if (!weaponStore) {
      console.log("[Tokenomics] weapon_store wallet not found, skipping");
      return;
    }

    // 2. Check weapon_store BATTLE balance
    const weaponStoreBalance = parseFloat(await getBattleBalance(weaponStore.address));
    console.log(`[Tokenomics] weapon_store BATTLE balance: ${weaponStoreBalance}`);

    if (weaponStoreBalance < TOKENOMICS.SWEEP_MIN_THRESHOLD) {
      console.log(`[Tokenomics] Balance below threshold (${TOKENOMICS.SWEEP_MIN_THRESHOLD}), skipping sweep`);
      return;
    }

    // 3. Get rewards wallet for recirculation
    const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS });
    if (!rewardsWallet) {
      console.error("[Tokenomics] rewards wallet not found, skipping");
      return;
    }

    const rewardsBalanceBefore = parseFloat(await getBattleBalance(rewardsWallet.address));

    // 4. Calculate burn/recycle split based on current health
    const { burnAmount, recycleAmount, tier, burnRate } = getSweepSplit(weaponStoreBalance, rewardsBalanceBefore);

    console.log(`[Tokenomics] Health tier: ${tier} | Burn: ${burnAmount} (${burnRate * 100}%) | Recycle: ${recycleAmount}`);

    // 5. Decrypt weapon_store key
    let weaponStoreKey;
    try {
      weaponStoreKey = await decrypt(weaponStore.key, weaponStore.iv);
    } catch (e) {
      console.error("[Tokenomics] Failed to decrypt weapon_store key:", e.message);
      return;
    }

    // 6. Burn tokens
    let burnTxHash = "";
    if (burnAmount > 0) {
      try {
        const burnReceipt = await burnBattleTokens(burnAmount, weaponStoreKey);
        burnTxHash = burnReceipt.hash;
        console.log(`[Tokenomics] Burned ${burnAmount} BATTLE (tx: ${burnTxHash})`);
      } catch (e) {
        console.error(`[Tokenomics] Burn failed: ${e.message}`);
        return; // Don't proceed if burn fails
      }
    }

    // 7. Recycle remaining to rewards wallet
    let recycleTxHash = "";
    if (recycleAmount > 0) {
      try {
        const recycleReceipt = await transferBattleTokens(rewardsWallet.address, recycleAmount, weaponStoreKey);
        recycleTxHash = recycleReceipt.hash;
        console.log(`[Tokenomics] Recycled ${recycleAmount} BATTLE to rewards (tx: ${recycleTxHash})`);
      } catch (e) {
        console.error(`[Tokenomics] Recycle transfer failed: ${e.message}`);
        // Burn already happened, log the partial success
      }
    }

    // 8. Get post-sweep balances
    const rewardsBalanceAfter = parseFloat(await getBattleBalance(rewardsWallet.address));
    let totalSupplyAfter = 0;
    try {
      totalSupplyAfter = parseFloat(await getBattleTotalSupply());
    } catch (e) {
      console.error("[Tokenomics] Failed to get total supply:", e.message);
    }

    // 9. Record burn in database
    const now = new Date();
    const weekNumber = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));

    await BurnRecord.create({
      weekNumber,
      year: now.getFullYear(),
      sweepAmount: weaponStoreBalance,
      burnAmount,
      recycleAmount,
      burnTxHash,
      recycleTxHash,
      healthTier: tier,
      rewardsBalanceBefore,
      rewardsBalanceAfter,
      totalSupplyAfter,
    });

    // 10. Record transactions
    if (burnTxHash) {
      await Transaction.create({
        type: TRANSACTION_TYPES.TOKEN_BURN,
        fromAddress: weaponStore.address,
        toAddress: "0x0000000000000000000000000000000000000000",
        amount: burnAmount,
        currency: "BATTLE",
        txHash: burnTxHash,
        status: "confirmed",
        metadata: {
          description: `Auto-burn: ${burnAmount} BATTLE permanently destroyed (${burnRate * 100}% of ${weaponStoreBalance} sweep). Health tier: ${tier}.`,
          healthTier: tier,
          sweepAmount: weaponStoreBalance,
        },
      });
    }

    if (recycleTxHash) {
      await Transaction.create({
        type: TRANSACTION_TYPES.TOKEN_RECYCLE,
        fromAddress: weaponStore.address,
        toAddress: rewardsWallet.address,
        amount: recycleAmount,
        currency: "BATTLE",
        txHash: recycleTxHash,
        status: "confirmed",
        metadata: {
          description: `Auto-recycle: ${recycleAmount} BATTLE returned to rewards wallet. Health tier: ${tier}.`,
          healthTier: tier,
          sweepAmount: weaponStoreBalance,
        },
      });
    }

    // 11. Discord notification
    try {
      await sendDiscordAlert({
        subject: `Token Burn & Recycle - ${tier}`,
        status: tier === "CRITICAL" || tier === "SCARCE" ? "critical" : "warning",
        poolType: "Tokenomics Sweep",
        walletAddress: weaponStore.address,
        currentBalance: rewardsBalanceAfter,
        requiredAmount: burnAmount,
        unitName: `BATTLE burned | ${recycleAmount} recycled | Supply: ${Math.round(totalSupplyAfter).toLocaleString()}`,
      });
    } catch (e) {
      // Non-blocking
    }

    console.log(`[Tokenomics] Sweep complete. Supply: ${Math.round(totalSupplyAfter).toLocaleString()} BATTLE remaining`);
  } catch (e) {
    console.error("[Tokenomics] Job failed:", e.message);
  }
};

module.exports = { tokenomicsJob };
