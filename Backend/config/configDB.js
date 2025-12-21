const mongoose = require("mongoose");
const logger = require("../utils/logger");

const configDB = () => {
  mongoose
    .connect(process.env.DBURL || "mongodb://127.0.0.1:27017/UnifyDB")
    .then(() => {
      logger.database("MongoDB connected successfully", "DB_CONNECTION", {
        url: process.env.DBURL || "mongodb://127.0.0.1:27017/UnifyDB",
      });
    })
    .catch((err) => {
      logger.error("MongoDB connection failed", "DB_CONNECTION", {
        error: err.message,
      });
    });
};

module.exports = configDB;
