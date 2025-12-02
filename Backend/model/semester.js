const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const semesterSchema = new Schema(
  {
    academicYear: { type: String, required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true },

    semesterNumber: { type: Number, required: true }, // 1,2,3...

    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null }, // null = running semester

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

semesterSchema.index(
  { academicYear: 1, branch: 1, section: 1, semesterNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Semester", semesterSchema);
