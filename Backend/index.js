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
const tgRouter = require("./router/tg");
const facultyRouter = require("./router/faculty");
const studentRouter = require("./router/student");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/requestLogger");

const Port = process.env.PORT || 3000;

configDB();

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// ✅ LOGGING MIDDLEWARE
app.use(requestLogger);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Public routes
app.use("/api/auth", authRouter);

// Protected routes
app.use("/api/admin", cookieAuthenticate, adminRouter);
app.use("/api/hod", cookieAuthenticate, hodRouter);
app.use("/api/tg", cookieAuthenticate, tgRouter);
app.use("/api/faculty", cookieAuthenticate, facultyRouter);
app.use("/api/:enrollmentNumber", cookieAuthenticate, studentRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Unify Backend");
});

// 404 - Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    path: req.path,
    method: req.method,
  });
});

app.listen(Port, () => {
  logger.server(`Server running successfully`, "SERVER_START", {
    port: Port,
    environment: process.env.NODE_ENV || "development",
    corsOrigin: process.env.FRONTEND_URL || "http://localhost:5173",
  });
});
