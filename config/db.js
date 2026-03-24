const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async function () {
  const uri =
    process.env.NETWORK === "prod"
      ? process.env.MONGODB_URI_PROD
      : process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MongoDB URI not configured. Set MONGODB_URI in .env");
  }

  const conn = await mongoose.connect(uri, {
    // Server selection: how long to wait to find a suitable server for an operation.
    // 10s (up from 5s) gives Atlas more time during node elections / failovers.
    serverSelectionTimeoutMS: 10000,

    // Socket timeout: how long to wait for a response after sending a command.
    socketTimeoutMS: 45000,

    // Heartbeat: driver pings each node this often to detect outages faster.
    // 10s (default 30s) means a dead node is detected in ~10s instead of ~30s.
    heartbeatFrequencyMS: 10000,

    // Connection pool: max connections per node. Higher = more resilience to
    // burst traffic while some connections are waiting on a slow node.
    maxPoolSize: 10,

    // Min pool: keep at least this many connections warm so the first request
    // after idle doesn't pay the TCP+TLS handshake cost (~200ms to Atlas).
    minPoolSize: 2,

    // Max idle time: close connections idle longer than this (5 min).
    // Prevents stale sockets that have been silently killed by firewalls/NATs.
    maxIdleTimeMS: 300000,

    // Retry: automatically retry reads/writes once on transient network errors.
    // These are on by default in Mongoose 7+ but explicit is clearer.
    retryWrites: true,
    retryReads: true,
  });

  // --- Connection event listeners for observability ---
  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Disconnected — driver will attempt to reconnect automatically");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("[MongoDB] Reconnected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[MongoDB] Connection error:", err.message);
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
