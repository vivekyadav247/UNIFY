const logger = require("./logger");

// Database operation logging utilities
const dbLogger = {
  // Log successful database queries
  success: (operation, collection, details = null) => {
    logger.database(
      `${operation} on ${collection}`,
      `DB_${operation.toUpperCase()}`,
      details
    );
  },

  // Log database errors
  error: (operation, collection, error, details = null) => {
    logger.error(
      `Database ${operation} failed on ${collection}: ${error.message}`,
      `DB_ERROR_${operation.toUpperCase()}`,
      {
        error: error.message,
        collection,
        operation,
        ...details,
      }
    );
  },

  // Log database connection
  connection: (status, message, details = null) => {
    if (status === "connected") {
      logger.database(message, "DB_CONNECTED", details);
    } else if (status === "error") {
      logger.error(message, "DB_CONNECTION_ERROR", details);
    } else {
      logger.database(message, "DB_EVENT", details);
    }
  },
};

module.exports = dbLogger;
