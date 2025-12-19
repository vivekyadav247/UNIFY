const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/authentication");

const facultySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    facultyId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: false,
    },
    section: {
      type: String,
      required: false,
    },
    academicYear: {
      type: [String],
      required: false,
    },
    assignedSubjects: {
      type: [String],
      required: false,
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
    role: {
      type: String,
      default: "faculty",
      immutable: true,
    },
    teachSubjects: {
      type: [String],
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
    },
    resume: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

facultySchema.pre("save", function (next) {
  const faculty = this;
  if (!faculty.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(faculty.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

facultySchema.static(
  "matchPasswordAndGenerateToken",
  async function (facultyId, password) {
    const faculty = await this.findOne({ facultyId });
    if (!faculty) throw new Error("User not found");
    const hashPassword = createHmac("sha256", faculty.salt)
      .update(password)
      .digest("hex");
    if (hashPassword !== faculty.password) throw new Error("Invalid password");
    return createToken(faculty);
  }
);

module.exports = mongoose.model("Faculty", facultySchema);
