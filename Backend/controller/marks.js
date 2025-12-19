const Student = require("../model/student");

// ============ STUDENT ENDPOINTS ============

// Get student marks with CGPA/SGPA
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
        const sem = mark.semester || 1;
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

    // Get SGPA for each semester
    const semesterWiseSGPA = [];
    for (let i = 1; i <= currentSemester; i++) {
      semesterWiseSGPA.push({
        semester: i,
        sgpa: student.sgpa[i - 1] || 0,
      });
    }

    return res.status(200).json({
      success: true,
      marks: student.marks || [],
      marksBySemester,
      midSemMarks,
      cgpa: student.cgpa || 0,
      sgpa: student.sgpa || [],
      semesterWiseSGPA,
      currentSemester,
      statistics: {
        totalMarks,
        maxTotalMarks,
        averagePercentage,
        totalSubjects: student.marks?.length || 0,
        cgpa: student.cgpa || 0,
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

// ============ CGPA / SGPA UPDATE FUNCTIONS ============

// Update student's SGPA for a specific semester (TG/Faculty only)
async function updateStudentSGPA(req, res) {
  try {
    if (
      !req.user ||
      (req.user.role !== "tg" &&
        req.user.role !== "faculty" &&
        req.user.role !== "hod")
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { studentId } = req.params;
    const { semester, sgpa } = req.body;

    if (!semester || sgpa === undefined) {
      return res.status(400).json({ error: "Semester and SGPA are required" });
    }

    if (sgpa < 0 || sgpa > 10) {
      return res.status(400).json({ error: "SGPA must be between 0 and 10" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Initialize sgpa array if it doesn't exist
    if (!student.sgpa || !Array.isArray(student.sgpa)) {
      student.sgpa = [];
    }

    // Ensure array is large enough (semester is 1-indexed, array is 0-indexed)
    while (student.sgpa.length < semester) {
      student.sgpa.push(0);
    }

    // Update SGPA for the specific semester
    student.sgpa[semester - 1] = parseFloat(sgpa.toFixed(2));

    // Recalculate CGPA as average of all SGPAs
    const validSgpas = student.sgpa.filter((s) => s > 0);
    if (validSgpas.length > 0) {
      student.cgpa = parseFloat(
        (validSgpas.reduce((sum, s) => sum + s, 0) / validSgpas.length).toFixed(
          2
        )
      );
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: `SGPA for semester ${semester} updated successfully`,
      sgpa: student.sgpa,
      cgpa: student.cgpa,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update student's CGPA directly (TG/Faculty only)
async function updateStudentCGPA(req, res) {
  try {
    if (
      !req.user ||
      (req.user.role !== "tg" &&
        req.user.role !== "faculty" &&
        req.user.role !== "hod")
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { studentId } = req.params;
    const { cgpa } = req.body;

    if (cgpa === undefined) {
      return res.status(400).json({ error: "CGPA is required" });
    }

    if (cgpa < 0 || cgpa > 10) {
      return res.status(400).json({ error: "CGPA must be between 0 and 10" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    student.cgpa = parseFloat(cgpa.toFixed(2));
    await student.save();

    return res.status(200).json({
      success: true,
      message: "CGPA updated successfully",
      cgpa: student.cgpa,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Bulk update SGPA for multiple students (TG/Faculty only)
async function bulkUpdateSGPA(req, res) {
  try {
    if (
      !req.user ||
      (req.user.role !== "tg" &&
        req.user.role !== "faculty" &&
        req.user.role !== "hod")
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { students, semester } = req.body;
    // students: [{ studentId, sgpa }]

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: "Students array is required" });
    }

    if (!semester) {
      return res.status(400).json({ error: "Semester is required" });
    }

    const results = [];
    const errors = [];

    for (const entry of students) {
      try {
        const { studentId, sgpa } = entry;

        if (!studentId || sgpa === undefined) {
          errors.push({ studentId, error: "Missing studentId or sgpa" });
          continue;
        }

        if (sgpa < 0 || sgpa > 10) {
          errors.push({ studentId, error: "SGPA must be between 0 and 10" });
          continue;
        }

        const student = await Student.findById(studentId);
        if (!student) {
          errors.push({ studentId, error: "Student not found" });
          continue;
        }

        // Initialize sgpa array if needed
        if (!student.sgpa || !Array.isArray(student.sgpa)) {
          student.sgpa = [];
        }

        // Ensure array is large enough
        while (student.sgpa.length < semester) {
          student.sgpa.push(0);
        }

        // Update SGPA for the specific semester
        student.sgpa[semester - 1] = parseFloat(sgpa.toFixed(2));

        // Recalculate CGPA
        const validSgpas = student.sgpa.filter((s) => s > 0);
        if (validSgpas.length > 0) {
          student.cgpa = parseFloat(
            (
              validSgpas.reduce((sum, s) => sum + s, 0) / validSgpas.length
            ).toFixed(2)
          );
        }

        await student.save();
        results.push({ studentId, sgpa: student.sgpa, cgpa: student.cgpa });
      } catch (e) {
        errors.push({ studentId: entry.studentId, error: e.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Updated SGPA for ${results.length} students`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get CGPA/SGPA for a specific student
async function getStudentGrades(req, res) {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).select(
      "name rollNumber cgpa sgpa semesterNumber branch section"
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const currentSemester = student.semesterNumber || 1;
    const semesterWiseSGPA = [];

    for (let i = 1; i <= currentSemester; i++) {
      semesterWiseSGPA.push({
        semester: i,
        sgpa: student.sgpa?.[i - 1] || 0,
      });
    }

    return res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        branch: student.branch,
        section: student.section,
        currentSemester,
      },
      cgpa: student.cgpa || 0,
      sgpa: student.sgpa || [],
      semesterWiseSGPA,
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
  updateStudentSGPA,
  updateStudentCGPA,
  bulkUpdateSGPA,
  getStudentGrades,
};
