const mongoose = require("mongoose");

const configDB = () => {
  mongoose
    .connect(process.env.DBURL || "mongodb://127.0.0.1:27017/UnifyDB")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};

module.exports = configDB;
