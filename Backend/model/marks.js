const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Semester-wise marks schema
const semesterMarksSchema = new Schema({
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  sgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    default: 0,
  },
  subjects: [
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      subjectCode: {
        type: String,
        required: true,
      },
      subjectName: {
        type: String,
        required: true,
      },
      credits: {
        type: Number,
        required: true,
        default: 3,
      },
      internalMarks: {
        type: Number,
        default: 0,
        min: 0,
        max: 40,
      },
      externalMarks: {
        type: Number,
        default: 0,
        min: 0,
        max: 60,
      },
      totalMarks: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      gradePoint: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      grade: {
        type: String,
        enum: ["O", "A+", "A", "B+", "B", "C", "P", "F", "-"],
        default: "-",
      },
      status: {
        type: String,
        enum: ["pass", "fail", "absent", "pending"],
        default: "pending",
      },
    },
  ],
  totalCredits: {
    type: Number,
    default: 0,
  },
  earnedCredits: {
    type: Number,
    default: 0,
  },
  result: {
    type: String,
    enum: ["pass", "fail", "promoted", "detained", "pending"],
    default: "pending",
  },
  examDate: {
    type: Date,
  },
  declaredDate: {
    type: Date,
  },
});

// Main Marks schema for student academic record
const marksSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      uppercase: true,
    },
    branch: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
      enum: ["B.Tech", "M.Tech", "MBA", "MCA"],
    },
    department: {
      type: String,
      required: true,
    },

    // CGPA - Cumulative Grade Point Average
    cgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    // Current semester SGPA
    currentSgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    // Current semester number
    currentSemester: {
      type: Number,
      default: 1,
      min: 1,
      max: 8,
    },

    // Total credits earned across all semesters
    totalCreditsEarned: {
      type: Number,
      default: 0,
    },

    // Total credits required
    totalCreditsRequired: {
      type: Number,
      default: 160, // Typical for B.Tech
    },

    // Semester-wise detailed marks
    semesters: [semesterMarksSchema],

    // Backlogs
    backlogs: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
        subjectCode: String,
        subjectName: String,
        semester: Number,
        attempts: {
          type: Number,
          default: 1,
        },
        cleared: {
          type: Boolean,
          default: false,
        },
        clearedDate: Date,
      },
    ],

    // Active backlogs count
    activeBacklogs: {
      type: Number,
      default: 0,
    },

    // Academic standing
    academicStanding: {
      type: String,
      enum: ["good", "warning", "probation", "detained"],
      default: "good",
    },

    // Rank in class (if available)
    classRank: {
      type: Number,
      default: null,
    },

    // Percentile
    percentile: {
      type: Number,
      default: null,
    },

    // Last updated
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
marksSchema.index({ studentId: 1 });
marksSchema.index({ enrollmentNumber: 1 });
marksSchema.index({ branch: 1, section: 1, academicYear: 1 });
marksSchema.index({ cgpa: -1 });

// Method to calculate CGPA from all semesters
marksSchema.methods.calculateCGPA = function () {
  if (!this.semesters || this.semesters.length === 0) {
    return 0;
  }

  let totalCreditPoints = 0;
  let totalCredits = 0;

  this.semesters.forEach((sem) => {
    if (sem.sgpa > 0 && sem.earnedCredits > 0) {
      totalCreditPoints += sem.sgpa * sem.earnedCredits;
      totalCredits += sem.earnedCredits;
    }
  });

  this.cgpa =
    totalCredits > 0 ? (totalCreditPoints / totalCredits).toFixed(2) : 0;
  return this.cgpa;
};

// Method to add semester marks
marksSchema.methods.addSemesterMarks = async function (semesterData) {
  const existingSem = this.semesters.find(
    (s) => s.semester === semesterData.semester
  );

  if (existingSem) {
    // Update existing semester
    Object.assign(existingSem, semesterData);
  } else {
    // Add new semester
    this.semesters.push(semesterData);
  }

  // Recalculate CGPA
  this.calculateCGPA();

  // Update current semester info
  this.currentSemester = Math.max(...this.semesters.map((s) => s.semester));
  this.currentSgpa = semesterData.sgpa;

  // Update total credits earned
  this.totalCreditsEarned = this.semesters.reduce(
    (sum, sem) => sum + (sem.earnedCredits || 0),
    0
  );

  // Count active backlogs
  this.activeBacklogs = this.backlogs.filter((b) => !b.cleared).length;

  // Determine academic standing
  if (this.cgpa >= 7.0 && this.activeBacklogs === 0) {
    this.academicStanding = "good";
  } else if (this.cgpa >= 5.0 && this.activeBacklogs <= 3) {
    this.academicStanding = "warning";
  } else if (this.activeBacklogs > 3) {
    this.academicStanding = "probation";
  } else {
    this.academicStanding = "detained";
  }

  this.lastUpdated = new Date();
  return this.save();
};

// Static method to get class toppers
marksSchema.statics.getClassToppers = async function (
  branch,
  section,
  academicYear,
  limit = 10
) {
  return this.find({
    branch,
    section,
    academicYear,
  })
    .sort({ cgpa: -1 })
    .limit(limit)
    .populate("studentId", "name enrollmentNumber profilePic")
    .lean();
};

// Static method to get students at academic risk
marksSchema.statics.getAtRiskStudents = async function (
  branch,
  section,
  academicYear
) {
  return this.find({
    branch,
    section,
    academicYear,
    $or: [{ cgpa: { $lt: 5.0 } }, { activeBacklogs: { $gt: 3 } }],
  })
    .populate("studentId", "name enrollmentNumber profilePic email")
    .lean();
};

// Grade to point conversion
const gradeToPoint = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  P: 4,
  F: 0,
};

// Helper to convert marks to grade
marksSchema.statics.marksToGrade = function (marks) {
  if (marks >= 90) return "O";
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "B+";
  if (marks >= 50) return "B";
  if (marks >= 45) return "C";
  if (marks >= 40) return "P";
  return "F";
};

// Helper to convert grade to point
marksSchema.statics.gradeToPoint = function (grade) {
  return gradeToPoint[grade] || 0;
};

module.exports = mongoose.model("Marks", marksSchema);
