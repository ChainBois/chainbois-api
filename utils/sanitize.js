/**
 * Shared sanitization utility for logging.
 * Recursively redacts sensitive fields from objects before logging.
 */
const SENSITIVE_FIELDS = [
  "password",
  "mnemonic",
  "key",
  "secret",
  "token",
  "authorization",
  "apikey",
  "api_key",
  "privatekey",
  "private_key",
  "accesstoken",
  "access_token",
  "refreshtoken",
  "refresh_token",
  "iv",
  "seed",
  "credential",
];

const sanitizeForLog = function (obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => sanitizeForLog(item));

  const sanitized = {};
  for (const [field, value] of Object.entries(obj)) {
    const fieldLower = field.toLowerCase();
    const isSensitive = SENSITIVE_FIELDS.some(
      (sensitive) => fieldLower.includes(sensitive) || fieldLower === sensitive
    );

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

module.exports = { sanitizeForLog };
