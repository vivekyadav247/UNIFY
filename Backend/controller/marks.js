const Student = require("../model/student");

// ============ STUDENT ENDPOINTS ============

// Get student marks
async function getStudentMarks(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;

    const student = await Student.findById(studentId).populate({
      path: "marks",
      select: "subjectId subject marks maxMarks semester date",
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Group marks by semester
    const marksBySemester = {};
    if (student.marks) {
      student.marks.forEach((mark) => {
        const sem = mark.semester || "General";
        if (!marksBySemester[sem]) {
          marksBySemester[sem] = [];
        }
        marksBySemester[sem].push(mark);
      });
    }

    // Get mid-sem marks for current semester
    const currentSemester = student.semesterNumber || 1;
    const midSemMarks =
      student.midSemMarks?.filter((m) => m.semester === currentSemester) || [];

    // Calculate statistics
    const totalMarks =
      student.marks?.reduce((sum, m) => sum + (m.marks || 0), 0) || 0;
    const maxTotalMarks =
      student.marks?.reduce((sum, m) => sum + (m.maxMarks || 0), 0) || 0;
    const averagePercentage =
      maxTotalMarks > 0 ? ((totalMarks / maxTotalMarks) * 100).toFixed(2) : 0;

    return res.status(200).json({
      success: true,
      marks: student.marks || [],
      marksBySemester,
      midSemMarks,
      statistics: {
        totalMarks,
        maxTotalMarks,
        averagePercentage,
        totalSubjects: student.marks?.length || 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get specific subject marks history
async function getSubjectMarks(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const { subjectId } = req.params;
    const studentId = req.user._id;

    const student = await Student.findById(studentId).populate({
      path: "marks",
      match: { subjectId: subjectId },
      select: "subject marks maxMarks date feedback",
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      marks: student.marks || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ============ TG/FACULTY ENDPOINTS ============

// Update student marks
async function updateStudentMarks(req, res) {
  try {
    if (!req.user || (req.user.role !== "tg" && req.user.role !== "faculty")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { studentId } = req.params;
    const { subject, marks, maxMarks, feedback } = req.body;

    if (!subject || marks === undefined || !maxMarks) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Initialize marks array if it doesn't exist
    if (!student.marks) {
      student.marks = [];
    }

    // Add or update mark
    const markEntry = {
      subject,
      marks,
      maxMarks,
      feedback: feedback || "",
      date: new Date(),
    };

    student.marks.push(markEntry);
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Marks updated successfully",
      marks: student.marks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get all students for TG/Faculty (for marks entry)
async function getStudentsForMarks(req, res) {
  try {
    if (!req.user || (req.user.role !== "tg" && req.user.role !== "faculty")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { branch, section, semester } = req.query;
    const query = {};

    if (branch) query.branch = branch;
    if (section) query.section = section;
    if (semester) query.semesterNumber = semester;

    const students = await Student.find(query).select(
      "name enrollmentNumber email branch section semesterNumber"
    );

    return res.status(200).json({
      success: true,
      students,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update mid-sem marks for a student
async function updateMidSemMarks(req, res) {
  try {
    if (!req.user || (req.user.role !== "tg" && req.user.role !== "faculty")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { studentId } = req.params;
    const { subject, internalMarks, maxInternalMarks, semester } = req.body;

    if (
      !subject ||
      internalMarks === undefined ||
      !maxInternalMarks ||
      !semester
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Initialize midSemMarks array if it doesn't exist
    if (!student.midSemMarks) {
      student.midSemMarks = [];
    }

    // Check if this subject's mid-sem marks already exist for this semester
    const existingIndex = student.midSemMarks.findIndex(
      (m) => m.subject === subject && m.semester === semester
    );

    const midSemEntry = {
      subject,
      internalMarks,
      maxInternalMarks,
      semester,
      date: new Date(),
    };

    if (existingIndex > -1) {
      // Update existing entry
      student.midSemMarks[existingIndex] = midSemEntry;
    } else {
      // Add new entry
      student.midSemMarks.push(midSemEntry);
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Mid-sem marks updated successfully",
      midSemMarks: student.midSemMarks,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getStudentMarks,
  getSubjectMarks,
  updateStudentMarks,
  getStudentsForMarks,
  updateMidSemMarks,
};
