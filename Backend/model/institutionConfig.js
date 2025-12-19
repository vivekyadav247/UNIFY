const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Department Schema
const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Course Schema
const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    duration: {
      type: Number, // in years
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Branch Schema
const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Section Schema
const sectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
    capacity: {
      type: Number,
      default: 60,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Academic Year Schema
const academicYearSchema = new Schema(
  {
    year: {
      type: String, // e.g., "2023-2027"
      required: true,
      unique: true,
    },
    startYear: {
      type: Number,
      required: true,
    },
    endYear: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
const Course = mongoose.model("Course", courseSchema);
const Branch = mongoose.model("Branch", branchSchema);
const Section = mongoose.model("Section", sectionSchema);
const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);

module.exports = {
  Department,
  Course,
  Branch,
  Section,
  AcademicYear,
};
