const Student = require("../model/student");
const TG = require("../model/tg");
const Leave = require("../model/leave");
const Semester = require("../model/semester");
const ClassAttendance = require("../model/classAttendance");
const Marks = require("../model/marks");
const Assignment = require("../model/assignment");
const { createHmac, randomBytes } = require("crypto");

// DEBUG: Check TG and Students data match
async function debugTgStudents(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    // TG ka data
    const tgData = {
      department: tg.department,
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
      course: tg.course,
    };

    // All students in database
    const allStudents = await Student.find({})
      .select(
        "name enrollmentNumber department branch section academicYear course isVerified"
      )
      .lean();

    // Students that should match
    const matchingStudents = allStudents.filter(
      (s) =>
        s.department === tg.department &&
        s.branch === tg.branch &&
        s.section === tg.section &&
        s.academicYear === tg.academicYear &&
        s.course === tg.course
    );

    // Students with partial match (for debugging)
    const partialMatch = allStudents.filter(
      (s) => s.branch === tg.branch || s.section === tg.section
    );

    // Unique values in students
    const uniqueValues = {
      departments: [...new Set(allStudents.map((s) => s.department))],
      branches: [...new Set(allStudents.map((s) => s.branch))],
      sections: [...new Set(allStudents.map((s) => s.section))],
      academicYears: [...new Set(allStudents.map((s) => s.academicYear))],
      courses: [...new Set(allStudents.map((s) => s.course))],
    };

    return res.status(200).json({
      success: true,
      tgData,
      totalStudentsInDB: allStudents.length,
      matchingStudentsCount: matchingStudents.length,
      matchingStudents: matchingStudents.slice(0, 5), // first 5
      partialMatchCount: partialMatch.length,
      uniqueValuesInStudents: uniqueValues,
      sampleStudents: allStudents.slice(0, 3), // first 3 students for comparison
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function verifyStudentByTG(req, res) {
  try {
    // TG Authentication Check
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user.id || req.user._id;
    const { studentId } = req.params;

    // Fetch TG details
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    // Fetch student
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Check if student belongs to this TG's class (by class match)
    if (
      student.branch !== tg.branch ||
      student.section !== tg.section ||
      student.department !== tg.department ||
      student.course !== tg.course ||
      student.academicYear !== tg.academicYear
    ) {
      return res.status(403).json({
        error: "You are not authorized to verify this student",
      });
    }

    // Check if already verified
    if (student.isVerified === true) {
      return res.status(400).json({ error: "Student already verified" });
    }

    // Verify student and assign TG if not already assigned
    student.isVerified = true;
    if (!student.assignTgId) {
      student.assignTgId = tgId;
    }
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student verified successfully",
      student: {
        name: student.name,
        enrollment: student.enrollmentNumber,
        isVerified: student.isVerified,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getUnverifiedStudents(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const { department, branch, section, academicYear, course } = tg;

    // Get all unverified students of this TG's class (by class match)
    const unverifiedStudents = await Student.find({
      department,
      branch,
      section,
      academicYear,
      course,
      isVerified: false,
    })
      .select(
        "name enrollmentNumber email mobileNumber dob gender profilePic course department branch section academicYear semesterNumber createdAt assignTgId"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Auto-assign TG to students without assignTgId
    const unassignedIds = unverifiedStudents
      .filter((s) => !s.assignTgId)
      .map((s) => s._id);

    if (unassignedIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: unassignedIds } },
        { assignTgId: tgId }
      );
    }

    return res.status(200).json({
      success: true,
      count: unverifiedStudents.length,
      students: unverifiedStudents,
      autoAssigned: unassignedIds.length,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getAllMyStudents(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const { department, branch, section, academicYear, course } = tg;

    // Get all students of this TG's class (by class match OR assignTgId)
    const allStudents = await Student.find({
      department,
      branch,
      section,
      academicYear,
      course,
    })
      .select(
        "name enrollmentNumber email mobileNumber dob gender profilePic isVerified course department branch section academicYear semesterNumber createdAt cgpa sgpa assignTgId parentContact"
      )
      .sort({ enrollmentNumber: 1 })
      .lean();

    // Auto-assign TG to students without assignTgId
    const unassignedIds = allStudents
      .filter((s) => !s.assignTgId)
      .map((s) => s._id);

    if (unassignedIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: unassignedIds } },
        { assignTgId: tgId }
      );
    }

    // Separate verified and unverified
    const verified = allStudents.filter((s) => s.isVerified === true);
    const unverified = allStudents.filter((s) => s.isVerified === false);

    return res.status(200).json({
      success: true,
      total: allStudents.length,
      verifiedCount: verified.length,
      unverifiedCount: unverified.length,
      verified,
      unverified,
      students: allStudents,
      autoAssigned: unassignedIds.length,
      tgInfo: {
        name: tg.name,
        tgId: tg.tgId,
        email: tg.email,
        mobileNumber: tg.mobileNumber,
        branch: tg.branch,
        section: tg.section,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getTgProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user._id;

    const tg = await TG.findById(tgId).select("-password -salt");
    if (!tg) return res.status(404).json({ error: "TG not found" });

    return res.status(200).json({ tg });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateTgProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user._id;

    const allowed = [
      "name",
      "email",
      "mobileNumber",
      "gender",
      "dob",
      "profilePic",
    ];

    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const updated = await TG.findByIdAndUpdate(tgId, updates, {
      new: true,
    }).select("-password -salt");

    return res.status(200).json({ message: "TG updated", tg: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function changeTgPassword(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const oldHash = createHmac("sha256", tg.salt)
      .update(oldPassword)
      .digest("hex");

    if (oldHash !== tg.password)
      return res.status(400).json({ error: "Old password incorrect" });

    const newSalt = randomBytes(16).toString("hex");
    const newHash = createHmac("sha256", newSalt)
      .update(newPassword)
      .digest("hex");

    tg.salt = newSalt;
    tg.password = newHash;

    await tg.save();

    return res.status(200).json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Leave Requests for TG - with status filter
async function getTgLeaveRequests(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const { branch, section, academicYear } = req.user;
    const { status } = req.query; // pending, approved, rejected, all

    // Only filter by fields that exist in Leave model
    let query = {
      branch,
      section,
      academicYear,
    };

    if (status && status !== "all") {
      query.status = status;
    }

    // Get all leave requests from students of this TG's class
    const leaveRequests = await Leave.find(query)
      .populate(
        "studentId",
        "name enrollmentNumber email branch section semesterNumber"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leaveRequests,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Approve Leave Request
async function approveTgLeaveRequest(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const { leaveId } = req.params;
    const tgId = req.user._id;

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({ error: "Leave already processed" });
    }

    leave.status = "approved";
    leave.approvedBy = tgId;
    await leave.save();

    return res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      leave,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Reject Leave Request
async function rejectTgLeaveRequest(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const { leaveId } = req.params;

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({ error: "Leave already processed" });
    }

    leave.status = "rejected";
    await leave.save();

    return res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      leave,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get specific student details
async function getStudentDetail(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const { studentId } = req.params;
    const tgId = req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const student = await Student.findById(studentId)
      .select("-password -salt")
      .lean();

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Get student's attendance data
    const ClassAttendance = require("../model/classAttendance");
    const attendanceRecords = await ClassAttendance.find({
      students: studentId,
    })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    // Calculate attendance percentage
    let totalClasses = attendanceRecords.length;
    let presentCount = 0;
    attendanceRecords.forEach((record) => {
      const studentRecord = record.attendance?.find(
        (a) => a.student?.toString() === studentId
      );
      if (studentRecord?.status === "present") presentCount++;
    });
    const attendancePercentage =
      totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

    // Get leave history
    const leaves = await Leave.find({ studentId: studentId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      student,
      attendance: {
        total: totalClasses,
        present: presentCount,
        absent: totalClasses - presentCount,
        percentage: parseFloat(attendancePercentage),
        recentRecords: attendanceRecords.slice(0, 10),
      },
      leaves,
      marks: student.marks || [],
      midSemMarks: student.midSemMarks || [],
      cgpa: student.cgpa || 0,
      sgpa: student.sgpa || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Announcements visible to TG's class
async function getTgAnnouncements(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tgId = req.user.id || req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const Announcement = require("../model/announcement");
    const announcements = await Announcement.find({
      $or: [
        { targetType: "all" },
        {
          targetType: "class",
          branch: tg.branch,
          section: tg.section,
          academicYear: tg.academicYear,
        },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("facultyId", "name email");

    return res.status(200).json({
      success: true,
      announcements: announcements || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Marks for TG's class - with CGPA/SGPA
async function getTgMarks(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tgId = req.user.id || req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const Marks = require("../model/marks");

    // Get all students' marks from the Marks model
    const marksData = await Marks.find({
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
    })
      .populate("studentId", "name enrollmentNumber email profilePic")
      .sort({ cgpa: -1 });

    // Also get students with embedded marks (for compatibility)
    const students = await Student.find({
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
      assignTgId: tgId,
    })
      .select(
        "name enrollmentNumber email cgpa sgpa marks semesterNumber profilePic"
      )
      .sort({ cgpa: -1 })
      .lean();

    // Calculate class statistics
    const cgpaList = students.filter((s) => s.cgpa > 0).map((s) => s.cgpa);
    const avgCGPA =
      cgpaList.length > 0
        ? (cgpaList.reduce((a, b) => a + b, 0) / cgpaList.length).toFixed(2)
        : 0;
    const highestCGPA = cgpaList.length > 0 ? Math.max(...cgpaList) : 0;
    const lowestCGPA = cgpaList.length > 0 ? Math.min(...cgpaList) : 0;

    return res.status(200).json({
      success: true,
      marksData: marksData || [],
      students: students || [], // Students with embedded marks
      statistics: {
        totalStudents: students.length,
        avgCGPA,
        highestCGPA,
        lowestCGPA,
        studentsWithCGPA: cgpaList.length,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Assignments for TG's class
async function getTgAssignments(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tgId = req.user.id || req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const Assignment = require("../model/assignment");
    const assignments = await Assignment.find({
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
    })
      .sort({ createdAt: -1 })
      .populate("facultyId", "name email");

    return res.status(200).json({
      success: true,
      assignments: assignments || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Feedback for TG's class
async function getTgFeedback(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tgId = req.user.id || req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const Feedback = require("../model/feedback");
    const feedback = await Feedback.find({
      targetType: "class",
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
    })
      .sort({ createdAt: -1 })
      .populate("studentId", "name enrollmentNumber")
      .populate("facultyId", "name email");

    return res.status(200).json({
      success: true,
      feedback: feedback || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Reports (attendance summary) for TG's class
async function getTgReports(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tgId = req.user.id || req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const ClassAttendance = require("../model/classAttendance");
    const students = await Student.find({
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
    });

    const reports = [];
    for (let student of students) {
      const attendance = await ClassAttendance.countDocuments({
        studentId: student._id,
        status: "present",
      });
      const total = await ClassAttendance.countDocuments({
        studentId: student._id,
      });
      reports.push({
        studentId: student._id,
        name: student.name,
        enrollmentNumber: student.enrollmentNumber,
        attendance: total > 0 ? ((attendance / total) * 100).toFixed(2) : 0,
        presentDays: attendance,
        totalDays: total,
      });
    }

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Schedule/Timetable for TG's class
async function getTgSchedule(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tgId = req.user.id || req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    const Subject = require("../model/subject");
    const schedule = await Subject.find({
      branch: tg.branch,
      section: tg.section,
      semester: tg.semester,
    }).populate("facultyId", "name email");

    return res.status(200).json({
      success: true,
      schedule: schedule || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Dashboard Stats for TG
async function getTgDashboardStats(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tgId = req.user.id || req.user._id;
    const tg = await TG.findById(tgId);
    if (!tg) return res.status(404).json({ error: "TG not found" });

    // Get total students by class match (not assignTgId)
    const totalStudents = await Student.countDocuments({
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
      department: tg.department,
      course: tg.course,
      isVerified: true,
    });

    // Get pending leaves
    const pendingLeaves = await Leave.countDocuments({
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
      status: "pending",
    });

    // Get all students of this class
    const classStudents = await Student.find({
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
      department: tg.department,
      course: tg.course,
    })
      .select("_id cgpa")
      .lean();

    // Calculate average CGPA
    const studentsWithCgpa = classStudents.filter((s) => s.cgpa > 0);
    const avgMarks =
      studentsWithCgpa.length > 0
        ? (
            studentsWithCgpa.reduce((sum, s) => sum + s.cgpa, 0) /
            studentsWithCgpa.length
          ).toFixed(2)
        : 0;

    // Get attendance data - last 6 months
    const ClassAttendance = require("../model/classAttendance");

    const monthlyAttendance = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      // Get attendance for all students in this class
      const studentIds = classStudents.map((s) => s._id);

      const presentCount = await ClassAttendance.countDocuments({
        studentId: { $in: studentIds },
        status: "present",
        date: { $gte: monthStart, $lte: monthEnd },
      });

      const totalCount = await ClassAttendance.countDocuments({
        studentId: { $in: studentIds },
        date: { $gte: monthStart, $lte: monthEnd },
      });

      const percentage =
        totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

      monthlyAttendance.push({
        month: monthStart.toLocaleString("default", { month: "short" }),
        percentage,
        present: presentCount,
        total: totalCount,
      });
    }

    // Calculate average attendance
    const monthsWithData = monthlyAttendance.filter((m) => m.total > 0);
    const avgAttendance =
      monthsWithData.length > 0
        ? Math.round(
            monthsWithData.reduce((sum, m) => sum + m.percentage, 0) /
              monthsWithData.length
          )
        : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        avgAttendance,
        avgMarks: parseFloat(avgMarks) || 0,
        pendingLeaves,
      },
      monthlyAttendance,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get current semester data for all TG's students
async function getTgCurrentSemesterStudentData(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user._id;
    const tg = await TG.findById(tgId);

    if (!tg) {
      return res.status(404).json({ error: "TG not found" });
    }

    // Get current active semester
    const now = new Date();
    const currentSemester = await Semester.findOne({
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!currentSemester) {
      return res.status(404).json({
        error: "No active semester found",
      });
    }

    // Get all students under this TG
    const students = await Student.find({
      department: tg.department,
      branch: tg.branch,
      section: tg.section,
      academicYear: tg.academicYear,
      course: tg.course,
    }).select("_id enrollmentNumber name");

    const studentIds = students.map((s) => s._id);

    // Get semester data for all students
    const [attendanceData, marksData, assignmentData] = await Promise.all([
      ClassAttendance.find({
        studentId: { $in: studentIds },
        semesterNumber: currentSemester.semesterNumber,
        academicYear: currentSemester.academicYear,
      }),
      Marks.find({
        studentId: { $in: studentIds },
        semesterNumber: currentSemester.semesterNumber,
        academicYear: currentSemester.academicYear,
      }),
      Assignment.find({
        branch: tg.branch,
        section: tg.section,
        semesterNumber: currentSemester.semesterNumber,
        academicYear: currentSemester.academicYear,
      }),
    ]);

    // Aggregate attendance by student
    const studentAttendanceMap = {};
    students.forEach((s) => {
      studentAttendanceMap[s._id] = {
        studentId: s._id,
        enrollmentNumber: s.enrollmentNumber,
        name: s.name,
        total: 0,
        present: 0,
        absent: 0,
        leave: 0,
        percentage: 0,
      };
    });

    attendanceData.forEach((record) => {
      if (studentAttendanceMap[record.studentId]) {
        studentAttendanceMap[record.studentId].total++;
        if (record.status === "present") {
          studentAttendanceMap[record.studentId].present++;
        } else if (record.status === "absent") {
          studentAttendanceMap[record.studentId].absent++;
        } else if (record.status === "leave") {
          studentAttendanceMap[record.studentId].leave++;
        }
      }
    });

    // Calculate percentage
    Object.values(studentAttendanceMap).forEach((record) => {
      if (record.total > 0) {
        record.percentage = ((record.present / record.total) * 100).toFixed(2);
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        tg: {
          name: tg.name,
          tgId: tg.tgId,
          department: tg.department,
          branch: tg.branch,
          section: tg.section,
          academicYear: tg.academicYear,
        },
        currentSemester: {
          semesterNumber: currentSemester.semesterNumber,
          semesterName: currentSemester.semesterName,
          academicYear: currentSemester.academicYear,
          startDate: currentSemester.startDate,
          endDate: currentSemester.endDate,
          status: currentSemester.status,
        },
        students: Object.values(studentAttendanceMap),
        studentCount: students.length,
        assignments: assignmentData.map((a) => ({
          id: a._id,
          title: a.title,
          subject: a.subject,
          dueDate: a.dueDate,
        })),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getTgProfile,
  updateTgProfile,
  changeTgPassword,
  verifyStudentByTG,
  getUnverifiedStudents,
  getAllMyStudents,
  getTgLeaveRequests,
  approveTgLeaveRequest,
  rejectTgLeaveRequest,
  getStudentDetail,
  getTgAnnouncements,
  getTgMarks,
  getTgAssignments,
  getTgFeedback,
  getTgReports,
  getTgSchedule,
  getTgDashboardStats,
  getTgCurrentSemesterStudentData,
  debugTgStudents,
};
