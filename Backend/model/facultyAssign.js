const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facultyAssignSchema = new Schema(
  {
    facultyId: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true },
    course: { type: String, required: true },
    department: { type: String, required: true },
    academicYear: { type: String, required: true },
    semesterNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

facultyAssignSchema.index(
  {
    facultyId: 1,
    subjectId: 1,
    branch: 1,
    section: 1,
    academicYear: 1,
    semesterNumber: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("FacultyAssignment", facultyAssignSchema);
