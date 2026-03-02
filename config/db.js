const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async function () {
  const uri =
    process.env.NETWORK === "prod"
      ? process.env.MONGODB_URI_PROD
      : process.env.MONGODB_URI;

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
