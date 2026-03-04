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
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
