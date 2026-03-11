const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectAttendanceSchema = new Schema(
  {
    facultyId: { type: Schema.Types.ObjectId, ref: "Faculty", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      required: true,
    },
    academicYear: { type: String, required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true },
    semesterNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

subjectAttendanceSchema.index(
  { facultyId: 1, subjectId: 1, studentId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("SubjectAttendance", subjectAttendanceSchema);
