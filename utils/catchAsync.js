const { sanitizeForLog } = require("./sanitize");

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      console.error("Error occurred:");
      console.error("Message:", error.message);
      console.error("Route:", req.path);
      console.error("Method:", req.method);
      console.error("Query:", req.query ? sanitizeForLog(req.query) : null);
      console.error("Body:", req.body ? sanitizeForLog(req.body) : null);
      console.error("Params:", req.params ? sanitizeForLog(req.params) : null);

      next(error);
    });
  };
};
