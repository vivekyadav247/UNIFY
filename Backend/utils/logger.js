const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

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

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

const getLogFileName = (type) => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
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
  error: (message, category = "GENERAL", data = null) => {
    const logMessage = formatLogMessage("error", category, message, data);
    const filePath = path.join(logDirs.error, getLogFileName("error"));
    fs.appendFileSync(filePath, logMessage);
  },

  auth: (message, action = "AUTH", data = null) => {
    const logMessage = formatLogMessage("info", action, message, data);
    const filePath = path.join(logDirs.auth, getLogFileName("auth"));
    fs.appendFileSync(filePath, logMessage);
  },

  api: (method, endpoint, statusCode, duration, data = null) => {
    const category = `${method} ${endpoint}`;
    const message = `Response Status: ${statusCode} | Duration: ${duration}ms`;
    const logMessage = formatLogMessage("info", category, message, data);
    const filePath = path.join(logDirs.api, getLogFileName("api"));
    fs.appendFileSync(filePath, logMessage);
  },

  database: (message, operation = "DB", data = null) => {
    const logMessage = formatLogMessage("info", operation, message, data);
    const filePath = path.join(logDirs.database, getLogFileName("database"));
    fs.appendFileSync(filePath, logMessage);
  },

  server: (message, event = "SERVER", data = null) => {
    const logMessage = formatLogMessage("info", event, message, data);
    const filePath = path.join(logDirs.server, getLogFileName("server"));
    fs.appendFileSync(filePath, logMessage);
  },

  warn: (message, category = "WARNING", data = null) => {
    const logMessage = formatLogMessage("warn", category, message, data);
    const filePath = path.join(logDirs.error, getLogFileName("warning"));
    fs.appendFileSync(filePath, logMessage);
  },
};

module.exports = logger;
