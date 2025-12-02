const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },

    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },

    reason: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    appliedDate: { type: Date, default: Date.now },

    approvedBy: { type: Schema.Types.ObjectId, ref: "TG", default: null },

    academicYear: { type: String, required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true },
    semesterNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
