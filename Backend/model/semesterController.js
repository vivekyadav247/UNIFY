const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const semesterControlSchema = new Schema(
  {
    academicYear: { type: String, required: true, unique: true }, // "2023-2027"
    currentSemester: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SemesterControl", semesterControlSchema);
