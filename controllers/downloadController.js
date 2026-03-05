const fs = require("fs");
const path = require("path");
const Settings = require("../models/settingsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const GAME_FILES = {
  win: "ChainBoisWin.zip",
  mac: "ChainBoisMac.zip",
  apk: "ChainBois.apk",
};

const GAME_DIR = process.env.GAME_FILES_DIR || path.resolve(__dirname, "..");

/**
 * GET /api/v1/game/download/:platform
 * Stream game download file (win or mac)
 * No auth required - public endpoint
 */
const downloadGame = catchAsync(async (req, res, next) => {
  const { platform } = req.params;

  const fileName = GAME_FILES[platform];
  if (!fileName) {
    return next(new AppError("Invalid platform. Use 'win', 'mac', or 'apk'.", 400));
  }

  const filePath = path.join(GAME_DIR, fileName);

  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch (e) {
    return next(new AppError("Game file not available yet", 404));
  }

  const stat = await fs.promises.stat(filePath);

  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Length", stat.size);

  const stream = fs.createReadStream(filePath);

  // Increment download counter only when response fully sent to client
  res.on("finish", async () => {
    try {
      await Settings.updateOne({}, { $inc: { downloads: 1 } }, { upsert: true });
    } catch (e) {
      console.error("Failed to increment download counter:", e.message);
    }
  });

  stream.on("error", (err) => {
    console.error("File stream error:", err.message);
    if (!res.headersSent) {
      return next(new AppError("Error streaming file", 500));
    }
  });

  stream.pipe(res);
});

/**
 * GET /api/v1/game/info
 * Get game info (trailer, download count) - public endpoint
 */
const getGameInfo = catchAsync(async (req, res, next) => {
  const settings = await Settings.findOne().select("downloads trailer").lean();

  res.status(200).json({
    success: true,
    data: {
      downloads: settings ? settings.downloads : 0,
      trailer: settings ? settings.trailer : "",
      platforms: {
        win: fs.existsSync(path.join(GAME_DIR, GAME_FILES.win)),
        mac: fs.existsSync(path.join(GAME_DIR, GAME_FILES.mac)),
        apk: fs.existsSync(path.join(GAME_DIR, GAME_FILES.apk)),
      },
    },
  });
});

module.exports = {
  downloadGame,
  getGameInfo,
};
