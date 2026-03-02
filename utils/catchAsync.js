const sanitizeForLogging = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const sensitiveFields = [
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

  const sanitized = {};
  for (const [field, value] of Object.entries(obj)) {
    const fieldLower = field.toLowerCase();
    const isSensitive = sensitiveFields.some(
      (sensitive) =>
        fieldLower.includes(sensitive) || fieldLower === sensitive
    );

    if (isSensitive) {
      sanitized[field] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[field] = sanitizeForLogging(value);
    } else {
      sanitized[field] = value;
    }
  }
  return sanitized;
};

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      console.error("Error occurred:");
      console.error("Message:", error.message);
      console.error("Route:", req.path);
      console.error("Method:", req.method);
      console.error("Query:", req.query ? sanitizeForLogging(req.query) : null);
      console.error("Body:", req.body ? sanitizeForLogging(req.body) : null);
      console.error("Params:", req.params ? sanitizeForLogging(req.params) : null);

      next(error);
    });
  };
};
