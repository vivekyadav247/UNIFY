const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const studetRouter = require("./router/student");
const cookieParser = require("cookie-parser");
const { cookieAuthenticate } = require("./middleware/cookieAuthenticate");

mongoose
  .connect("mongodb://127.0.0.1:27017/UnifyDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const Port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cookieAuthenticate("token"));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/api/student", studetRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Unify Backend");
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
