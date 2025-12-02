const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: { type: String, required: true },
    course: { type: String, required: true },
    department: { type: String, required: true },
    branch: { type: String, required: false },
    section: { type: String, required: false },
    semesterNumber: { type: Number, required: true },
    academicYear: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
