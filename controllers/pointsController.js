const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getBattleBalance, transferBattleTokens } = require("../utils/contractUtils");
const { decrypt } = require("../utils/cryptUtils");
const { ethers } = require("ethers");
const {
  TRANSACTION_TYPES,
  WALLET_ROLES,
} = require("../config/constants");
const { getConversionAmount, getConversionRate } = require("../services/tokenomicsService");

/**
 * GET /api/v1/points/:address
 * Get points balance + conversion info (public)
 */
const getPointsBalance = catchAsync(async (req, res, next) => {
  const address = req.params.address.toLowerCase();
  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  const user = await User.findOne({ address });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check how much $BATTLE is available in rewards wallet
  let availableBattle = "0";
  try {
    const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS });
    if (rewardsWallet) {
      availableBattle = await getBattleBalance(rewardsWallet.address);
    }
  } catch (e) {
    console.error(`Failed to check rewards balance: ${e.message}`);
  }

  const rewardsBalanceNum = parseFloat(availableBattle);
  const conversionRate = getConversionRate(rewardsBalanceNum);
  const maxBattle = Math.floor(rewardsBalanceNum);
  const maxConvertible = Math.min(
    user.pointsBalance,
    conversionRate > 0 ? Math.floor(maxBattle / conversionRate) : 0
  );

  res.status(200).json({
    success: true,
    data: {
      address,
      pointsBalance: user.pointsBalance,
      conversionRate, // Dynamic: 1 point = conversionRate $BATTLE
      maxConvertible,
    },
  });
});

/**
 * POST /api/v1/points/convert
 * Convert points to $BATTLE (1:1, transferred from rewards wallet)
 *
 * Body: { address: string, amount: number }
 */
const convertPoints = catchAsync(async (req, res, next) => {
  const { address, amount } = req.body;

  // 1. Validate inputs
  if (!address || !ethers.isAddress(address)) {
    return next(new AppError("Valid wallet address is required", 400));
  }
  if (!amount || !Number.isInteger(amount) || amount <= 0) {
    return next(new AppError("amount must be a positive integer", 400));
  }

  // 2. Get user by wallet address
  const normalizedAddress = address.toLowerCase();
  const user = await User.findOne({ address: normalizedAddress });
  if (!user) {
    return next(new AppError("No account found for this wallet", 404));
  }

  // 3. Atomically deduct points (prevents race conditions)
  // Only deduct points here; battleTokenBalance updated after we know the effective amount
  const previousBalance = user.pointsBalance;
  const updated = await User.findOneAndUpdate(
    { _id: user._id, pointsBalance: { $gte: amount } },
    { $inc: { pointsBalance: -amount } },
    { new: true }
  );
  if (!updated) {
    return next(new AppError(`Insufficient points. You have ${user.pointsBalance}, requested ${amount}`, 400));
  }

  // 4. Get rewards wallet
  const rewardsWallet = await Wallet.findOne({ role: WALLET_ROLES.REWARDS }).select("+key +iv");
  if (!rewardsWallet) {
    // Rollback points deduction
    await User.findByIdAndUpdate(user._id, { $inc: { pointsBalance: amount } });
    return next(new AppError("Conversion service temporarily unavailable", 503));
  }

  // 5. Calculate dynamic conversion amount
  const rewardsBalance = await getBattleBalance(rewardsWallet.address);
  const rewardsBalanceNum = parseFloat(rewardsBalance);
  const effectiveBattle = getConversionAmount(amount, rewardsBalanceNum);

  if (rewardsBalanceNum < effectiveBattle) {
    // Rollback points deduction
    await User.findByIdAndUpdate(user._id, { $inc: { pointsBalance: amount } });
    return next(new AppError("Insufficient $BATTLE in rewards pool. Try a smaller amount.", 503));
  }

  // 6. Transfer $BATTLE from rewards wallet to user (dynamic amount)
  let rewardsKey;
  try {
    rewardsKey = await decrypt(rewardsWallet.key, rewardsWallet.iv);
  } catch (e) {
    // Rollback points deduction
    await User.findByIdAndUpdate(user._id, { $inc: { pointsBalance: amount } });
    return next(new AppError("Wallet decryption failed. Contact support.", 500));
  }

  let receipt;
  try {
    receipt = await transferBattleTokens(normalizedAddress, effectiveBattle, rewardsKey);
  } catch (e) {
    // Rollback points deduction
    await User.findByIdAndUpdate(user._id, { $inc: { pointsBalance: amount } });
    return next(new AppError(`Transfer failed: ${e.message}`, 500));
  }

  if (!receipt || !receipt.hash) {
    // Rollback points deduction
    await User.findByIdAndUpdate(user._id, { $inc: { pointsBalance: amount } });
    return next(new AppError("Transfer did not return a valid receipt", 500));
  }

  // 6b. Update battleTokenBalance now that we know the effective amount
  await User.findByIdAndUpdate(user._id, { $inc: { battleTokenBalance: effectiveBattle } });

  // 7. Record transaction (non-fatal — tokens already transferred on-chain)
  try {
    await Transaction.create({
      type: TRANSACTION_TYPES.POINTS_CONVERSION,
      fromAddress: rewardsWallet.address,
      toAddress: normalizedAddress,
      amount: effectiveBattle,
      currency: "BATTLE",
      txHash: receipt.hash,
      status: "confirmed",
      metadata: {
        description: `Converted ${amount} points to ${effectiveBattle} BATTLE tokens (rate: ${getConversionRate(rewardsBalanceNum)}).`,
        pointsDeducted: amount,
        battleReceived: effectiveBattle,
        conversionRate: getConversionRate(rewardsBalanceNum),
        previousBalance,
        newBalance: updated.pointsBalance,
      },
    });
  } catch (e) {
    console.error(`Failed to record points conversion transaction: ${e.message}`, {
      address: normalizedAddress,
      amount,
      transferTxHash: receipt.hash,
    });
  }

  res.status(200).json({
    success: true,
    data: {
      message: `Converted ${amount} points to ${effectiveBattle} $BATTLE`,
      pointsDeducted: amount,
      battleTokensReceived: effectiveBattle,
      conversionRate: getConversionRate(rewardsBalanceNum),
      newPointsBalance: updated.pointsBalance,
      txHash: receipt.hash,
    },
  });
});

/**
 * GET /api/v1/points/history/:address
 * Points conversion + weapon purchase history (public)
 */
const getPointsHistory = catchAsync(async (req, res, next) => {
  const address = req.params.address.toLowerCase();
  if (!ethers.isAddress(address)) {
    return next(new AppError("Invalid wallet address", 400));
  }

  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const skip = (page - 1) * limit;

  const filter = {
    toAddress: address,
    type: { $in: [TRANSACTION_TYPES.POINTS_CONVERSION, TRANSACTION_TYPES.WEAPON_PURCHASE] },
  };

  const total = await Transaction.countDocuments(filter);
  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("type amount currency txHash status metadata createdAt")
    .lean();

  res.status(200).json({
    success: true,
    data: {
      history: transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

module.exports = {
  getPointsBalance,
  convertPoints,
  getPointsHistory,
};
