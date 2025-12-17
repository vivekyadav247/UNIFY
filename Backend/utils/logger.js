const fs = require("fs");
const path = require("path");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create subdirectories for different log types
const logDirs = {
  error: path.join(logsDir, "errors"),
  auth: path.join(logsDir, "auth"),
  api: path.join(logsDir, "api"),
  database: path.join(logsDir, "database"),
  server: path.join(logsDir, "server"),
};

Object.values(logDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Utility functions for logging
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

const getLogFileName = (type) => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  return `${type}_${date}.log`;
};

const formatLogMessage = (level, category, message, data = null) => {
  const timestamp = getTimestamp();
  let logMessage = `[${timestamp}] [${level.toUpperCase()}] [${category}] ${message}`;

  if (data) {
    logMessage += `\n${JSON.stringify(data, null, 2)}`;
  }

  logMessage += "\n" + "=".repeat(80) + "\n";
  return logMessage;
};

const logger = {
  // Error Logs
  error: (message, category = "GENERAL", data = null) => {
    const logMessage = formatLogMessage("error", category, message, data);
    const filePath = path.join(logDirs.error, getLogFileName("error"));

    fs.appendFileSync(filePath, logMessage);
    console.error(`❌ [${category}] ${message}`, data || "");
  },

  // Authentication Logs
  auth: (message, action = "AUTH", data = null) => {
    const logMessage = formatLogMessage("info", action, message, data);
    const filePath = path.join(logDirs.auth, getLogFileName("auth"));

    fs.appendFileSync(filePath, logMessage);
    console.log(`🔐 [${action}] ${message}`, data || "");
  },

  // API Request/Response Logs
  api: (method, endpoint, statusCode, duration, data = null) => {
    const category = `${method} ${endpoint}`;
    const message = `Response Status: ${statusCode} | Duration: ${duration}ms`;
    const logMessage = formatLogMessage("info", category, message, data);
    const filePath = path.join(logDirs.api, getLogFileName("api"));

    fs.appendFileSync(filePath, logMessage);
    console.log(
      `📡 [${statusCode}] ${method} ${endpoint} (${duration}ms)`,
      data || ""
    );
  },

  // Database Logs
  database: (message, operation = "DB", data = null) => {
    const logMessage = formatLogMessage("info", operation, message, data);
    const filePath = path.join(logDirs.database, getLogFileName("database"));

    fs.appendFileSync(filePath, logMessage);
    console.log(`💾 [${operation}] ${message}`, data || "");
  },

  // Server Logs
  server: (message, event = "SERVER", data = null) => {
    const logMessage = formatLogMessage("info", event, message, data);
    const filePath = path.join(logDirs.server, getLogFileName("server"));

    fs.appendFileSync(filePath, logMessage);
    console.log(`🚀 [${event}] ${message}`, data || "");
  },

  // Warning Logs (stored in errors folder)
  warn: (message, category = "WARNING", data = null) => {
    const logMessage = formatLogMessage("warn", category, message, data);
    const filePath = path.join(logDirs.error, getLogFileName("warning"));

    fs.appendFileSync(filePath, logMessage);
    console.warn(`⚠️  [${category}] ${message}`, data || "");
  },
};

module.exports = logger;
