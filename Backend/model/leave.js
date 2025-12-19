const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema(
  {
    // For students
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: false },

    // For faculty - generic user reference
    userId: { type: Schema.Types.ObjectId, required: false },
    userType: {
      type: String,
      enum: ["student", "faculty"],
      default: "student",
    },

    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },

    reason: { type: String, required: true },

    leaveType: {
      type: String,
      enum: [
        "sick",
        "personal",
        "medical",
        "emergency",
        "other",
        "Casual",
        "Sick",
        "Earned",
      ],
      default: "personal",
    },

    attachment: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    appliedDate: { type: Date, default: Date.now },

    approvedBy: { type: Schema.Types.ObjectId, default: null },

    // Student specific fields
    academicYear: { type: String, required: false },
    branch: { type: String, required: false },
    section: { type: String, required: false },
    semesterNumber: { type: Number, required: false },

    // Faculty specific fields
    department: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
