const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const { initFirebase } = require("./config/firebase");
const Settings = require("./models/settingsModel");

const PORT = process.env.PORT || 5000;

let server;
let isShuttingDown = false;
let activeConnections = 0;

// Track active connections
app.use((req, res, next) => {
  if (isShuttingDown) {
    res.set("Connection", "close");
    return res.status(503).json({
      success: false,
      message: "Server is shutting down",
    });
  }
  activeConnections++;
  res.on("finish", () => {
    activeConnections--;
  });
  next();
});

const startServer = async function () {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Firebase
    initFirebase();

    // Create default Settings if not exists
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({});
      console.log("Default settings created");
    }

    // Start cron jobs only on primary PM2 instance
    const isPrimary =
      !process.env.NODE_APP_INSTANCE ||
      process.env.NODE_APP_INSTANCE === "0";

    if (isPrimary) {
      console.log("Primary instance - starting cron jobs");
      // Cron jobs will be loaded in Phase 1
    }

    // Start server
    server = app.listen(PORT, () => {
      console.log(`ChainBois API running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = function (signal) {
  console.log(`${signal} received. Starting graceful shutdown...`);
  isShuttingDown = true;

  if (server) {
    server.close(() => {
      console.log("HTTP server closed");

      const mongoose = require("mongoose");
      mongoose.disconnect().then(() => {
        console.log("MongoDB disconnected");
        process.exit(0);
      });
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error(
        `Could not close connections in time (${activeConnections} active). Forcing shutdown.`
      );
      process.exit(1);
    }, 10000);
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
  console.error("UNHANDLED REJECTION:", err.name, err.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

startServer();
