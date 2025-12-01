const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./router/auth");
const cookieParser = require("cookie-parser");
const { cookieAuthenticate } = require("./middleware/cookieAuthenticate");
const adminRouter = require("./router/admin");
const configDB = require("./config/configDB");
const hodRouter = require("./router/hod");

const Port = process.env.PORT || 3000;

configDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cookieAuthenticate("token"));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/api/auth", authRouter);

app.use("/api/admin", adminRouter);

app.use("/api/hod", hodRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Unify Backend");
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
