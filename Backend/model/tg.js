const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/authentication");

const tgSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tgId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    branch: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      default: "tg",
      immutable: true,
    },
  },
  { timestamps: true }
);

tgSchema.pre("save", function (next) {
  const tg = this;
  if (!tg.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");
  const hashPassword = createHmac("sha256", salt)
    .update(tg.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashPassword;
  next();
});

tgSchema.static(
  "matchPasswordAndGenerateToken",
  async function (tgId, password) {
    const tg = await this.findOne({ tgId });
    if (!tg) throw new Error("TG not found");
    const hashPassword = createHmac("sha256", tg.salt)
      .update(password)
      .digest("hex");

    if (hashPassword !== tg.password) throw new Error("Invalid password");
    return createToken(tg);
  }
);

module.exports = mongoose.model("TG", tgSchema);
