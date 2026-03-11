const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: false,
    },
    feedback: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "submitted", "graded"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignmentSubmission", submissionSchema);
