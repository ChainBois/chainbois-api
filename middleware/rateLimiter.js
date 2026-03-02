const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});

const purchaseLimiter = rateLimit({
  max: 10,
  windowMs: 60 * 1000, // 1 minute
  message: "Too many purchase attempts. Please wait a moment.",
});

const authLimiter = rateLimit({
  max: 20,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many auth attempts. Please try again later.",
});

module.exports = {
  generalLimiter,
  purchaseLimiter,
  authLimiter,
};
