const mongoose = require("mongoose");

const purchaseAttemptSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["nft_purchase", "weapon_purchase"],
      required: true,
    },
    buyerAddress: {
      type: String,
      required: true,
    },

    // Payment info — store ACTUAL on-chain amount as string (avoids float precision issues)
    paymentTxHash: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: String,
      required: true,
    },
    paymentCurrency: {
      type: String,
      enum: ["AVAX", "BATTLE"],
      required: true,
    },
    storeWalletAddress: {
      type: String,
      required: true,
    },

    // Asset info (set after claim succeeds)
    tokenId: {
      type: Number,
      default: null,
    },
    weaponTokenId: {
      type: Number,
      default: null,
    },
    weaponName: {
      type: String,
      default: "",
    },

    // Lifecycle
    status: {
      type: String,
      enum: [
        "pending",        // Transfer not yet attempted or deferred to failsafe
        "processing",     // Transfer in progress (prevents failsafe from also processing)
        "completed",      // NFT transferred, Transaction recorded, all done
        "needs_refund",   // Transfer impossible (sold out, max retries), refund required
        "refunded",       // Refund sent successfully
      ],
      default: "pending",
    },

    // Transfer tracking
    transferTxHash: {
      type: String,
      default: "",
    },
    refundTxHash: {
      type: String,
      default: "",
    },

    // Transfer retry tracking
    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Refund retry tracking (separate from transfer retries)
    refundRetryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastRetry: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: "",
    },

    // Failsafe tracking
    failsafeProcessing: {
      type: Boolean,
      default: false,
    },
    failsafeStartedAt: {
      type: Date,
      default: null,
    },
    failsafeAttempts: {
      type: Number,
      default: 0,
    },

    // Processing timestamp (for stuck "processing" detection)
    processingStartedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Normalize addresses to lowercase before save
purchaseAttemptSchema.pre("save", function (next) {
  if (this.buyerAddress) this.buyerAddress = this.buyerAddress.toLowerCase();
  if (this.storeWalletAddress) this.storeWalletAddress = this.storeWalletAddress.toLowerCase();
  next();
});

// Unique on paymentTxHash (non-sparse — field is required)
purchaseAttemptSchema.index({ paymentTxHash: 1 }, { unique: true });
// Failsafe queries
purchaseAttemptSchema.index({ status: 1, createdAt: 1 });
// User lookup
purchaseAttemptSchema.index({ buyerAddress: 1, status: 1 });

const PurchaseAttempt = mongoose.model("PurchaseAttempt", purchaseAttemptSchema);
module.exports = PurchaseAttempt;
