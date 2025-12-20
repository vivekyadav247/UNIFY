const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Time slot schema
const timeSlotSchema = new Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  startTime: {
    type: String,
    required: true, // HH:MM format
  },
  endTime: {
    type: String,
    required: true, // HH:MM format
  },
  classType: {
    type: String,
    enum: ["Theory", "Practical"],
    default: "Theory",
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "Classroom", // Can be Room number or Lab name
  },
  backupFaculty: {
    type: Schema.Types.ObjectId,
    ref: "Faculty",
    default: null,
  },
  backupFacultyName: {
    type: String,
    default: null,
  },
  remarks: {
    type: String,
    default: null,
  },
});

// Main Schedule schema
const scheduleSchema = new Schema(
  {
    department: {
      type: String,
      required: true,
    },

    academicYear: {
      type: String,
      required: true, // e.g., "2024-2025"
    },

    year: {
      type: Number,
      required: true, // 1st year, 2nd year, etc.
      min: 1,
      max: 4,
    },

    branch: {
      type: String,
      required: true, // CSE, ECE, Mechanical, etc.
    },

    section: {
      type: String,
      required: true, // A, B, C, etc.
    },

    // All time slots for this class (full week schedule)
    timeSlots: [timeSlotSchema],

    // Faculty assigned to this schedule
    assignedFaculty: [
      {
        type: Schema.Types.ObjectId,
        ref: "Faculty",
      },
    ],

    semester: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "HOD",
      required: true,
    },

    remarks: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
