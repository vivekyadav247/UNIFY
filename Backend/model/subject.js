const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
    },
    name: { type: String, required: true },
    course: { type: String, required: true },
    department: { type: String, required: true },
    branch: { type: String, required: true },
    semesterNumber: { type: Number, required: true },
    subjectType: {
      type: String,
      enum: ["Theory", "Practical"],
      required: true,
    },
  },
  { timestamps: true }
);

// Create a composite unique index on subjectCode, course, and branch
subjectSchema.index({ subjectCode: 1, course: 1, branch: 1 }, { unique: true });

module.exports = mongoose.model("Subject", subjectSchema);
