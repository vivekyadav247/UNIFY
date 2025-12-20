const Assignment = require("../model/assignment");
const AssignmentSubmission = require("../model/assignmentSubmission");
const Subject = require("../model/subject");
const Student = require("../model/student");

// ============ STUDENT ENDPOINTS ============

// Get all assignments for a student's enrolled subjects
async function getStudentAssignments(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Get all subjects for this semester and branch
    const subjects = await Subject.find({
      semesterNumber: student.semesterNumber,
      branch: student.branch,
      section: student.section,
      course: student.course,
      department: student.department,
    }).populate("facultyId", "name email");

    const subjectIds = subjects.map((s) => s._id);

    // Get all assignments for these subjects
    const assignments = await Assignment.find({
      subjectId: { $in: subjectIds },
    })
      .populate("subjectId", "name code facultyId")
      .populate("facultyId", "name email")
      .lean();

    // Get submissions for this student
    const submissions = await AssignmentSubmission.find({
      studentId: studentId,
      assignmentId: { $in: assignments.map((a) => a._id) },
    }).lean();

    // Enrich assignments with submission data
    const enrichedAssignments = assignments.map((assignment) => {
      const submission = submissions.find(
        (s) => s.assignmentId.toString() === assignment._id.toString()
      );
      return {
        ...assignment,
        submission: submission || null,
        status: submission ? submission.status : "pending",
        submissionDate: submission ? submission.submissionDate : null,
        marks: submission ? submission.marks : null,
      };
    });

    // Group by subject
    const groupedBySubject = {};
    enrichedAssignments.forEach((assignment) => {
      const subjectName = assignment.subjectId.name;
      const subjectId = assignment.subjectId._id;
      if (!groupedBySubject[subjectId]) {
        groupedBySubject[subjectId] = {
          id: subjectId,
          name: subjectName,
          faculty: assignment.facultyId.name,
          assignments: [],
        };
      }
      groupedBySubject[subjectId].assignments.push(assignment);
    });

    return res.status(200).json({
      success: true,
      assignments: Object.values(groupedBySubject),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get specific assignment details
async function getAssignmentDetails(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const { assignmentId } = req.params;
    const studentId = req.user._id;

    const assignment = await Assignment.findById(assignmentId)
      .populate("subjectId")
      .populate("facultyId", "name email");

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const submission = await AssignmentSubmission.findOne({
      assignmentId: assignmentId,
      studentId: studentId,
    });

    return res.status(200).json({
      success: true,
      assignment,
      submission: submission || null,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Submit assignment
async function submitAssignment(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const { assignmentId, fileUrl } = req.body;
    const studentId = req.user._id;

    if (!assignmentId || !fileUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Check if already submitted
    let submission = await AssignmentSubmission.findOne({
      assignmentId,
      studentId,
    });

    if (submission) {
      // Update existing submission
      submission.fileUrl = fileUrl;
      submission.submissionDate = new Date();
      submission.status = "submitted";
      await submission.save();
    } else {
      // Create new submission
      submission = new AssignmentSubmission({
        assignmentId,
        studentId,
        fileUrl,
        status: "submitted",
      });
      await submission.save();
    }

    return res.status(200).json({
      success: true,
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ============ FACULTY ENDPOINTS ============

// Create assignment
async function createAssignment(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const {
      title,
      description,
      subject,
      dueDate,
      totalMarks,
      branch,
      section,
    } = req.body;
    const facultyId = req.user._id;

    if (!title || !description || !subject || !dueDate || !branch || !section) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get file path if uploaded
    const attachmentUrl = req.file
      ? `/uploads/assignments/${req.file.filename}`
      : null;

    const assignment = new Assignment({
      title,
      description,
      subject,
      createdBy: facultyId,
      dueDate,
      totalMarks: totalMarks || 100,
      branch,
      section,
      attachmentUrl,
    });

    await assignment.save();

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get faculty assignments
async function getFacultyAssignments(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const facultyId = req.user._id;

    const assignments = await Assignment.find({ createdBy: facultyId })
      .sort({ createdDate: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      assignments,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get submissions for assignment
async function getAssignmentSubmissions(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const { assignmentId } = req.params;
    const facultyId = req.user._id;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      facultyId,
    });

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const submissions = await AssignmentSubmission.find({
      assignmentId,
    })
      .populate("studentId", "name enrollmentNumber email")
      .lean();

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Grade submission
async function gradeSubmission(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    const submission = await AssignmentSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = "graded";
    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Submission graded successfully",
      submission,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getStudentAssignments,
  getAssignmentDetails,
  submitAssignment,
  createAssignment,
  getFacultyAssignments,
  getAssignmentSubmissions,
  gradeSubmission,
};
