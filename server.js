const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const { initFirebase } = require("./config/firebase");
const Settings = require("./models/settingsModel");

const PORT = process.env.PORT || 5000;

let server;
let shutdownInProgress = false;

const startServer = async function () {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Firebase
    initFirebase();

    // Create default Settings if not exists
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      try {
        await Settings.create({});
        console.log("Default settings created");
      } catch (e) {
        if (e.code !== 11000) throw e;
        // Ignore duplicate key error from race condition in cluster mode
      }
    }

    // Start cron jobs only on primary PM2 instance
    const isPrimary =
      !process.env.NODE_APP_INSTANCE ||
      process.env.NODE_APP_INSTANCE === "0";

    if (isPrimary) {
      const cron = require("node-cron");
      const { syncNewUsersJob } = require("./jobs/syncNewUsersJob");
      const { syncScoresJob } = require("./jobs/syncScoresJob");
      const { traitAirdropJob } = require("./jobs/traitAirdropJob");
      const { tournamentJob } = require("./jobs/tournamentJob");
      const { failedPayoutJob } = require("./jobs/failedPayoutJob");
      const { purchaseFailsafeJob } = require("./jobs/purchaseFailsafeJob");
      const { tokenomicsJob } = require("./jobs/tokenomicsJob");
      const { walletHealthJob } = require("./jobs/walletHealthJob");
      const { platformAuditJob } = require("./jobs/platformAuditJob");
      const { inventoryReplenishJob } = require("./jobs/inventoryReplenishJob");
      const { SYNC_NEW_USERS_INTERVAL, SYNC_SCORES_INTERVAL } = require("./config/constants");

      cron.schedule(SYNC_NEW_USERS_INTERVAL, syncNewUsersJob);
      cron.schedule(SYNC_SCORES_INTERVAL, syncScoresJob);
      cron.schedule("0 20 * * 3", traitAirdropJob); // Wednesdays 8 PM UTC
      cron.schedule("0 * * * *", tournamentJob); // Every hour
      cron.schedule("0 */6 * * *", failedPayoutJob); // Every 6 hours
      cron.schedule("*/5 * * * *", purchaseFailsafeJob); // Every 5 minutes
      cron.schedule("0 */6 * * *", tokenomicsJob); // Every 6 hours
      cron.schedule("0 * * * *", walletHealthJob); // Every hour
      cron.schedule("0 3 * * *", platformAuditJob); // Daily 3 AM UTC
      cron.schedule("*/30 * * * *", inventoryReplenishJob); // Every 30 minutes
      console.log("Cron jobs started: syncNewUsers, syncScores, traitAirdrop, tournament (hourly), failedPayout (6h), purchaseFailsafe (5m), tokenomics (6h), walletHealth (hourly), platformAudit (daily 3AM), inventoryReplenish (30m)");
    }

    // Start server
    server = app.listen(PORT, () => {
      console.log(`ChainBois API running on port ${PORT} [${process.env.NODE_ENV}]`);
    });

    // Initialize Socket.IO
    const { initSocketIO } = require("./config/socketio");
    const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
      : ["http://localhost:3000"];
    initSocketIO(server, allowedOrigins);
    console.log("Socket.IO initialized");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = function (signal) {
  if (shutdownInProgress) return;
  shutdownInProgress = true;

  console.log(`${signal} received. Starting graceful shutdown...`);
  app.locals.isShuttingDown = true;

  if (server) {
    // Close Socket.IO connections first
    try {
      const { getIO } = require("./config/socketio");
      const io = getIO();
      if (io) {
        io.close();
        console.log("Socket.IO closed");
      }
    } catch (e) { /* Socket.IO may not have been initialized */ }

    server.close(() => {
      console.log("HTTP server closed");

      const mongoose = require("mongoose");
      const { disconnectRedis } = require("./config/redis");

      // Disconnect Redis if connected
      try {
        disconnectRedis();
        console.log("Redis disconnected");
      } catch (e) {
        // Redis may not have been initialized
      }

      mongoose.disconnect()
        .then(() => {
          console.log("MongoDB disconnected");
          process.exit(0);
        })
        .catch((e) => {
          console.error("MongoDB disconnect error:", e.message);
          process.exit(1);
        });
    });

    // Force shutdown after 10 seconds
    const forceTimer = setTimeout(() => {
      console.error(
        `Could not close connections in time (${app.locals.activeConnections} active). Forcing shutdown.`
      );
      process.exit(1);
    }, 10000);
    forceTimer.unref();
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// PM2 shutdown message
process.on("message", (msg) => {
  if (msg === "shutdown") {
    gracefulShutdown("PM2 shutdown");
  }
});

// Unhandled rejections
process.on("unhandledRejection", (err) => {
  const name = err && err.name ? err.name : "UnknownError";
  const message = err && err.message ? err.message : String(err);
  console.error("UNHANDLED REJECTION:", name, message);
  if (shutdownInProgress) return;
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

startServer();
