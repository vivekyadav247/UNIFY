const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/authentication");
const { type } = require("os");

const studentRegSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      validate: {
        validator: function (v) {
          // Must start with 0805 and 0403
          // and rest must be uppercase letters or digits
          return /^(0805|0403)[A-Z0-9]+$/.test(v);
        },
        message:
          "Enrollment number must start with 0805 or 0403 and contain only uppercase letters/numbers.",
      },
    },
    course: {
      type: String,
      required: true,
      enum: ["B.Tech", "M.Tech", "MBA", "MCA"],
    },
    department: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "ME", "CE", "EE", "BT", "MBA", "MCA"],
    },
    branch: {
      type: String,
      required: true,
      enum: [
        "CSE",
        "IT",
        "CSE(AI&ML)",
        "CSE(DS)",
        "ECE",
        "ME",
        "CE",
        "EE",
        "BT",
        "MBA",
        "MCA",
      ],
    },
    section: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F"],
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      enum: ["2022-2026", "2023-2027", "2024-2028", "2025-2029", "2026-2030"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/, // Indian mobile number validation
    },
    role: {
      type: String,
      default: "student",
      immutable: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

studentRegSchema.pre("save", function (next) {
  const student = this;
  if (!student.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");
  const hashPassword = createHmac("sha256", salt)
    .update(student.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashPassword;
  next();
});

studentRegSchema.static(
  "matchPasswordAndGenerateToken",
  async function (enrollmentNumber, password) {
    const student = await this.findOne({ enrollmentNumber });
    if (!student) throw new Error("User not found");
    const hashPassword = createHmac("sha256", student.salt)
      .update(password)
      .digest("hex");
    if (hashPassword !== student.password) throw new Error("Invalid password");
    return createToken(student);
  }
);

module.exports = mongoose.model("Student", studentRegSchema);
