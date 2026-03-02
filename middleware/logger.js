const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const logStream = fs.createWriteStream(
  path.join(__dirname, "..", "error.log"),
  { flags: "a" }
);

const sanitizeForLog = function (obj) {
  if (!obj || typeof obj !== "object") return obj;
  const sensitiveFields = ["password", "mnemonic", "key", "secret", "token", "authorization", "iv", "seed"];
  const sanitized = {};
  for (const [field, value] of Object.entries(obj)) {
    const fieldLower = field.toLowerCase();
    const isSensitive = sensitiveFields.some((s) => fieldLower.includes(s));
    if (isSensitive) {
      sanitized[field] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[field] = sanitizeForLog(value);
    } else {
      sanitized[field] = value;
    }
  }
  return sanitized;
};

const errorLogger = morgan(
  (tokens, req, res) => {
    const status = parseInt(tokens.status(req, res), 10);
    if (status < 400) return null;

    const logEntry = {
      timestamp: new Date().toISOString(),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status,
      responseTime: tokens["response-time"](req, res) + "ms",
      body: req.body ? sanitizeForLog(req.body) : null,
      params: req.params ? sanitizeForLog(req.params) : null,
    };
    return JSON.stringify(logEntry);
  },
  {
    stream: logStream,
    skip: (req, res) => res.statusCode < 400,
  }
);

module.exports = errorLogger;
