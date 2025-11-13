const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/UnifyDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const Port = process.env.PORT || 3000;

app.use(express.json());

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
