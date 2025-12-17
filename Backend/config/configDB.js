const mongoose = require("mongoose");
const dbLogger = require("../utils/dbLogger");

const configDB = () => {
  mongoose
    .connect(process.env.DBURL || "mongodb://127.0.0.1:27017/UnifyDB")
    .then(() => {
      dbLogger.connection("connected", "MongoDB connected successfully", {
        url: process.env.DBURL || "mongodb://127.0.0.1:27017/UnifyDB",
      });
    })
    .catch((err) => {
      dbLogger.connection("error", "MongoDB connection failed", {
        error: err.message,
      });
    });
};

module.exports = configDB;
