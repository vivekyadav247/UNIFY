const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/authentication");

const hodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    hodId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
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
    course: {
      type: String,
      required: true,
      enum: ["B.Tech", "M.Tech", "MBA", "MCA"],
    },
    department: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "ME", "CE", "EE", "BBA", "MBA", "MCA"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dob: {
      type: Date,
      required: false,
    },
    profileImg: {
      type: String,
      required: false,
      url: true,
    },
    role: {
      type: String,
      default: "hod",
      immutable: true,
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

hodSchema.pre("save", function (next) {
  const hod = this;
  if (!hod.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");
  const hashPassword = createHmac("sha256", salt)
    .update(hod.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashPassword;
  next();
});

hodSchema.static(
  "matchPasswordAndGenerateToken",
  async function (hodId, password) {
    const hod = await this.findOne({ hodId });
    if (!hod) throw new Error("User not found");
    const hashPassword = createHmac("sha256", hod.salt)
      .update(password)
      .digest("hex");
    if (hashPassword !== hod.password) throw new Error("Invalid password");
    return createToken(hod);
  }
);

module.exports = mongoose.model("Hod", hodSchema);
