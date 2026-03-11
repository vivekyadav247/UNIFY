const logger = require("../utils/logger");

// Middleware to log all API requests and responses
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, url, ip, body } = req;

  // Capture the original send function
  const originalSend = res.send;

  // Override the send function to log response
  res.send = function (data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log based on status code
    if (statusCode >= 400) {
      logger.error(`${method} ${url}`, `${method} ${url}`, {
        statusCode,
        duration: `${duration}ms`,
        ip,
        requestBody: body,
      });
    } else {
      logger.api(method, url, statusCode, duration, {
        ip,
        userAgent: req.get("user-agent"),
      });
    }

    // Call the original send function
    return originalSend.call(this, data);
  };

  next();
};

module.exports = requestLogger;
