const express = require("express");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.get("/health", catchAsync(async (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  const health = {
    success: true,
    data: {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        mongodb: mongoStatus,
      },
    },
  };

  const statusCode = mongoStatus === "connected" ? 200 : 503;
  res.status(statusCode).json(health);
}));

router.get("/settings", catchAsync(async (req, res) => {
  const Settings = require("../models/settingsModel");
  const settings = await Settings.findOne().select(
    "-_id -__v -contracts -createdAt -updatedAt"
  );
  res.status(200).json({
    success: true,
    data: settings,
  });
}));

module.exports = router;
