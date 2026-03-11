const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classAttendanceSchema = new Schema(
  {
    tgId: { type: Schema.Types.ObjectId, ref: "TG", required: true },
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

classAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("ClassAttendance", classAttendanceSchema);
