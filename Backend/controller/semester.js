const Semester = require("../model/semester");
const Student = require("../model/student");
const logger = require("../utils/logger");

// Create a new semester
async function createSemester(req, res) {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "hod")) {
      return res.status(401).json({ error: "Unauthorized: Admin/HOD only" });
    }

    const {
      academicYear,
      semesterNumber,
      semesterName,
      startDate,
      endDate,
      description,
    } = req.body;

    // Validate required fields
    if (!academicYear || !semesterNumber || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    // Check if semester already exists for this academic year
    const existingSemester = await Semester.findOne({
      academicYear,
      semesterNumber,
    });

    if (existingSemester) {
      return res.status(400).json({
        error: `Semester ${semesterNumber} already exists for ${academicYear}`,
      });
    }

    // Determine status based on current date
    const now = new Date();
    let status = "scheduled";
    if (now >= start && now <= end) {
      status = "active";
    } else if (now > end) {
      status = "completed";
    }

    // Create semester
    const semester = new Semester({
      academicYear,
      semesterNumber,
      semesterName: semesterName || `Semester ${semesterNumber}`,
      startDate: start,
      endDate: end,
      status,
      description,
      department: req.user.role === "hod" ? req.user.department : null,
    });

    await semester.save();

    return res.status(201).json({
      success: true,
      message: "Semester created successfully",
      semester,
    });
  } catch (err) {
    logger.error("Semester creation failed", "SEMESTER_CREATE", {
      error: err.message,
    });
    return res.status(500).json({
      error: err.message,
      details: err.toString(),
    });
  }
}

// Get all semesters
async function getAllSemesters(req, res) {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "hod")) {
      return res.status(401).json({ error: "Unauthorized: Admin/HOD only" });
    }

    let filter = {};

    // If HOD, only show their department's semesters
    if (req.user.role === "hod") {
      filter = {
        $or: [
          { department: req.user.department },
          { department: null }, // Show global semesters too
        ],
      };
    }

    const semesters = await Semester.find(filter)
      .populate("createdBy", "name email role")
      .sort({ academicYear: -1, semesterNumber: 1 });

    return res.status(200).json({
      success: true,
      count: semesters.length,
      semesters,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get semesters by academic year
async function getSemestersByYear(req, res) {
  try {
    const { academicYear } = req.params;

    const semesters = await Semester.find({ academicYear })
      .populate("createdBy", "name email")
      .sort({ semesterNumber: 1 });

    if (semesters.length === 0) {
      return res.status(404).json({
        error: `No semesters found for ${academicYear}`,
      });
    }

    return res.status(200).json({
      success: true,
      count: semesters.length,
      academicYear,
      semesters,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get current/active semester
async function getCurrentSemester(req, res) {
  try {
    const now = new Date();

    const currentSemester = await Semester.findOne({
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ semesterNumber: -1 });

    if (!currentSemester) {
      return res.status(404).json({
        error: "No active semester found",
      });
    }

    return res.status(200).json({
      success: true,
      currentSemester,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get semester for a specific student
async function getStudentCurrentSemester(req, res) {
  try {
    const { enrollmentNumber } = req.params;

    const student = await Student.findOne({ enrollmentNumber }).select(
      "academicYear enrollmentNumber"
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const now = new Date();

    // Find active semester for the student's academic year
    const currentSemester = await Semester.findOne({
      academicYear: student.academicYear,
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    // If no active semester, get the next scheduled semester
    let semester = currentSemester;
    if (!semester) {
      semester = await Semester.findOne({
        academicYear: student.academicYear,
        status: "scheduled",
      }).sort({ semesterNumber: 1 });
    }

    // If no scheduled semester, get the latest semester
    if (!semester) {
      semester = await Semester.findOne({
        academicYear: student.academicYear,
      }).sort({ semesterNumber: -1 });
    }

    if (!semester) {
      return res.status(404).json({
        error: `No semester found for ${student.academicYear}`,
      });
    }

    return res.status(200).json({
      success: true,
      student: {
        enrollmentNumber: student.enrollmentNumber,
        academicYear: student.academicYear,
      },
      currentSemester: semester,
      isActive: semester.status === "active",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update semester
async function updateSemester(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized: Admin only" });
    }

    const { semesterId } = req.params;
    const { semesterName, startDate, endDate, status, description } = req.body;

    const semester = await Semester.findById(semesterId);

    if (!semester) {
      return res.status(404).json({ error: "Semester not found" });
    }

    if (startDate || endDate) {
      const start = new Date(startDate || semester.startDate);
      const end = new Date(endDate || semester.endDate);

      if (start >= end) {
        return res
          .status(400)
          .json({ error: "End date must be after start date" });
      }

      if (startDate) semester.startDate = start;
      if (endDate) semester.endDate = end;
    }

    if (semesterName) semester.semesterName = semesterName;
    if (status) semester.status = status;
    if (description) semester.description = description;

    await semester.save();

    return res.status(200).json({
      success: true,
      message: "Semester updated successfully",
      semester,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete semester
async function deleteSemester(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized: Admin only" });
    }

    const { semesterId } = req.params;

    const semester = await Semester.findByIdAndDelete(semesterId);

    if (!semester) {
      return res.status(404).json({ error: "Semester not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Semester deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createSemester,
  getAllSemesters,
  getSemestersByYear,
  getCurrentSemester,
  getStudentCurrentSemester,
  updateSemester,
  deleteSemester,
};
