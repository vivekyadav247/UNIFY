const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const semesterSchema = new Schema(
  {
    // Academic Year (e.g., "2024-2025")
    academicYear: {
      type: String,
      required: true,
      unique: false,
    },

    // Semester Number (1-8)
    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    // Semester Name (e.g., "Spring 2024", "Fall 2024")
    semesterName: {
      type: String,
      default: null,
    },

    // Start Date of Semester
    startDate: {
      type: Date,
      required: true,
    },

    // End Date of Semester
    endDate: {
      type: Date,
      required: true,
    },

    // Status
    status: {
      type: String,
      enum: ["scheduled", "active", "completed"],
      default: "scheduled",
    },

    // Description/Remarks
    description: {
      type: String,
      default: null,
    },

    // Created by (Admin/HOD)
    createdBy: {
      type: String,
      required: false,
    },

    // Department if HOD creates it
    department: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Unique index on academic year + semester number
semesterSchema.index({ academicYear: 1, semesterNumber: 1 }, { unique: true });

module.exports = mongoose.model("Semester", semesterSchema);
