const AppError = require("../utils/appError");

const handleCastErrorDB = function (err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  // Modern MongoDB driver uses err.message instead of err.errmsg
  const source = err.errmsg || err.message || "";
  const match = source.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : "unknown";
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Ensure CORS headers on error responses for cross-origin routes (faucet, metadata)
  if (req.originalUrl && (req.originalUrl.startsWith("/api/v1/claim") || req.originalUrl.startsWith("/api/v1/metadata"))) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }

  // Production
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") error = handleValidationErrorDB(err);

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error("ERROR:", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};
