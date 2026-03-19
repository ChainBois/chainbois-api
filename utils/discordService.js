const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const DISCORD_USERNAME = "ChainBois Alerts";
const AVATAR_URL = ""; // Set to ChainBois avatar URL when available
const COOLDOWN_PERIOD_HOURS = 24;

// Use a Map with max size to prevent memory leaks
const MAX_TRACKER_SIZE = 1000;
const notificationTracker = new Map();

const createNotificationKey = function (subject) {
  return subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_+|_+$)/g, "");
};

/**
 * Send a structured alert to Discord
 * @param {Object} options
 * @param {string} options.subject - Alert title
 * @param {string} options.status - 'critical', 'warning', 'success', or 'info'
 * @param {string} options.poolType - Type of pool
 * @param {string} options.walletAddress - Wallet address
 * @param {number} options.currentBalance - Current balance
 * @param {number} options.requiredAmount - Required amount
 * @param {string} options.unitName - Token unit name (AVAX, BATTLE)
 */
const sendDiscordAlert = async function (options) {
  const {
    subject,
    status,
    poolType,
    walletAddress,
    currentBalance,
    requiredAmount,
    unitName = "",
  } = options;

  const webhookUrl = process.env.DISCORD_ALERTS_WEBHOOK;
  if (!webhookUrl) {
    console.error("DISCORD_ALERTS_WEBHOOK not configured. Skipping notification.");
    return "skipped_misconfigured";
  }

  const notificationKey = createNotificationKey(subject);
  const now = Date.now();
  const cooldownMs = COOLDOWN_PERIOD_HOURS * 60 * 60 * 1000;

  if (notificationTracker.has(notificationKey)) {
    const lastSentTime = notificationTracker.get(notificationKey);
    if (now - lastSentTime < cooldownMs) {
      return "skipped_duplicate";
    }
  }

  let color, title, description;
  switch (status) {
    case "critical":
      color = 0xd32f2f;
      title = `🚨 CRITICAL ALERT: ${subject}`;
      description = `**${subject}** has been flagged due to insufficient funds.`;
      break;
    case "success":
      color = 0x4caf50;
      title = `✅ Success: ${subject}`;
      description = `**${subject}** completed successfully.`;
      break;
    case "info":
      color = 0x2196f3;
      title = `ℹ️ Info: ${subject}`;
      description = `**${subject}** — informational notice.`;
      break;
    default: // "warning" and any other value
      color = 0xffa500;
      title = `⚠️ Low Balance Warning: ${subject}`;
      description = `**${subject}** is running low on funds. Please top up soon.`;
      break;
  }

  const payload = {
    username: DISCORD_USERNAME,
    avatar_url: AVATAR_URL || undefined,
    embeds: [
      {
        title,
        description,
        color,
        fields: [
          { name: "Pool Type", value: poolType, inline: true },
          { name: "Status", value: status.toUpperCase(), inline: true },
          { name: "Wallet Address", value: `\`${walletAddress}\``, inline: false },
          { name: "Current Balance", value: `**${currentBalance.toLocaleString()} ${unitName}**`, inline: true },
          { name: "Required for Payout", value: `**${requiredAmount.toLocaleString()} ${unitName}**`, inline: true },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "ChainBois Automated Alert" },
      },
    ],
  };

  try {
    await axios.post(webhookUrl, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    // Evict oldest entries if tracker exceeds max size
    if (notificationTracker.size >= MAX_TRACKER_SIZE) {
      const oldestKey = notificationTracker.keys().next().value;
      notificationTracker.delete(oldestKey);
    }
    notificationTracker.set(notificationKey, now);
    return "sent";
  } catch (error) {
    console.error(`Failed to send Discord alert: "${subject}". Error: ${error.message}`);
    throw error;
  }
};

/**
 * Send leaderboard winner notification to Discord
 * @param {Object} options
 * @param {number} options.weekNumber
 * @param {number} options.level - Tournament level
 * @param {Array} options.winners - Array of { rank, username, points, amount, currency, txHash }
 */
const sendLeaderboardNotification = async function (options) {
  const { weekNumber, level, winners } = options;

  const webhookUrl = process.env.DISCORD_LEADERBOARD_WEBHOOK;
  if (!webhookUrl) {
    console.error("DISCORD_LEADERBOARD_WEBHOOK not configured. Skipping notification.");
    return "skipped_misconfigured";
  }

  const medals = ["🥇", "🥈", "🥉"];
  const winnerLines = winners.map((w, i) => {
    const medal = medals[i] || `#${w.rank}`;
    const statusIcon = w.txHash ? "✓" : "✗";
    return `${medal} **${w.username}** - ${w.points.toLocaleString()} pts → ${w.amount} ${w.currency} ${statusIcon}`;
  });

  const totalAvax = winners
    .filter((w) => w.currency === "AVAX")
    .reduce((sum, w) => sum + w.amount, 0);
  const totalBattle = winners
    .filter((w) => w.currency === "BATTLE")
    .reduce((sum, w) => sum + w.amount, 0);

  const payload = {
    username: DISCORD_USERNAME,
    avatar_url: AVATAR_URL || undefined,
    embeds: [
      {
        title: `🏆 Week ${weekNumber} - Level ${level} Tournament Winners!`,
        description: winnerLines.join("\n"),
        color: 0xffd700,
        fields: [
          {
            name: "Total Payout",
            value: `${totalAvax} AVAX + ${totalBattle} $BATTLE`,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "ChainBois Tournament System" },
      },
    ],
  };

  try {
    await axios.post(webhookUrl, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return "sent";
  } catch (error) {
    console.error(`Failed to send leaderboard notification. Error: ${error.message}`);
    throw error;
  }
};

const sendAlertNonBlocking = function (options) {
  sendDiscordAlert(options)
    .then((status) => {
      if (status !== "skipped_duplicate") {
        // Background alert processed
      }
    })
    .catch(() => {
      console.error("Background Discord alert failed.");
    });
};

module.exports = {
  sendDiscordAlert,
  sendLeaderboardNotification,
  sendAlertNonBlocking,
};
