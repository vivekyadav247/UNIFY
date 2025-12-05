const ClassAttendance = require("../model/classAttendance");
const SubjectAttendance = require("../model/subjectAttendance");
const Student = require("../model/student");
const Leave = require("../model/leave");
const FacultyAssignment = require("../model/facultyAssign");
const mongoose = require("mongoose");

const VALID_STATUS = new Set(["present", "absent", "leave"]);

function normalizeDate(dateInput) {
  const d = new Date(dateInput);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ==================== TG CLASS ATTENDANCE ====================
async function takeClassAttendance(req, res) {
  if (!req.user || req.user.role !== "tg") {
    return res.status(401).json({ error: "Unauthorized: TG only" });
  }

  try {
    const tgId = req.user._id;
    const { date, records } = req.body;

    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ error: "Date and records required" });
    }

    const dt = normalizeDate(date);
    const studentIds = records.map((r) => r.studentId);
    const students = await Student.find({ _id: { $in: studentIds } }).lean();

    const stuMap = {};
    students.forEach((s) => (stuMap[s._id.toString()] = s));

    const ops = [];
    const errors = [];

    for (const r of records) {
      const sid = r.studentId;
      const stu = stuMap[sid];

      if (!stu) {
        errors.push({ studentId: sid, error: "Student not found" });
        continue;
      }

      const status = String(r.status).toLowerCase();
      if (!VALID_STATUS.has(status)) {
        errors.push({ studentId: sid, error: `Invalid status '${r.status}'` });
        continue;
      }

      ops.push({
        updateOne: {
          filter: { studentId: stu._id, date: dt },
          update: {
            $set: {
              tgId,
              studentId: stu._id,
              date: dt,
              status,
              academicYear: stu.academicYear,
              branch: stu.branch,
              section: stu.section,
              semesterNumber: stu.semesterNumber,
            },
          },
          upsert: true,
        },
      });
    }

    if (ops.length === 0) {
      return res.status(400).json({ error: "No valid attendance", errors });
    }

    await ClassAttendance.bulkWrite(ops);

    return res.status(200).json({
      message: "Class attendance saved",
      saved: ops.length,
      errors,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ==================== FACULTY SUBJECT ATTENDANCE ====================

// Get students list for taking attendance
async function getStudentsForAttendance(req, res) {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(401).json({ error: "Unauthorized: Faculty only" });
  }

  try {
    const facultyId = req.user._id;
    const { department, branch, academicYear, section, subjectId } = req.query;

    if (!department || !branch || !academicYear || !section || !subjectId) {
      return res.status(400).json({
        error: "department, branch, academicYear, section, subjectId required",
      });
    }

    // Verify faculty is assigned to this subject
    const assignment = await FacultyAssignment.findOne({
      facultyId,
      subjectId,
      department,
      branch,
      academicYear,
      section,
    });

    if (!assignment) {
      return res.status(403).json({
        error: "You are not assigned to teach this subject for this class",
      });
    }

    // Get all students of this class
    const students = await Student.find({
      department,
      branch,
      academicYear,
      section,
      isVerified: true,
    })
      .select("name enrollmentNumber email profilePic")
      .sort({ enrollmentNumber: 1 })
      .lean();

    // Check if attendance is already marked for today
    const today = normalizeDate(new Date());
    const todayAttendance = await SubjectAttendance.find({
      facultyId,
      subjectId,
      date: today,
    }).lean();

    const attendanceMap = {};
    todayAttendance.forEach((att) => {
      attendanceMap[att.studentId.toString()] = att.status;
    });

    // Check for approved leaves for today
    const leaves = await Leave.find({
      studentId: { $in: students.map((s) => s._id) },
      status: "approved",
      fromDate: { $lte: today },
      toDate: { $gte: today },
    }).lean();

    const leaveMap = {};
    leaves.forEach((l) => {
      leaveMap[l.studentId.toString()] = true;
    });

    // Combine student data with attendance and leave status
    const studentsWithStatus = students.map((student) => ({
      ...student,
      currentStatus: attendanceMap[student._id.toString()] || null,
      isOnLeave: leaveMap[student._id.toString()] || false,
    }));

    return res.status(200).json({
      success: true,
      students: studentsWithStatus,
      attendanceMarked: todayAttendance.length > 0,
      date: today,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Take or Edit Subject Attendance
async function takeSubjectAttendance(req, res) {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(401).json({ error: "Unauthorized: Faculty only" });
  }

  try {
    const facultyId = req.user._id;
    const {
      subjectId,
      department,
      branch,
      academicYear,
      section,
      date,
      records,
    } = req.body;

    if (
      !subjectId ||
      !department ||
      !branch ||
      !academicYear ||
      !section ||
      !date ||
      !Array.isArray(records)
    ) {
      return res.status(400).json({
        error:
          "subjectId, department, branch, academicYear, section, date and records required",
      });
    }

    // Verify faculty is assigned to this subject
    const assignment = await FacultyAssignment.findOne({
      facultyId,
      subjectId,
      department,
      branch,
      academicYear,
      section,
    });

    if (!assignment) {
      return res.status(403).json({
        error: "You are not assigned to teach this subject for this class",
      });
    }

    const dt = normalizeDate(date);
    const today = normalizeDate(new Date());

    // Allow editing only for today's attendance
    if (dt.getTime() !== today.getTime()) {
      return res.status(400).json({
        error: "You can only mark or edit attendance for today",
      });
    }

    const studentIds = records.map((r) => r.studentId);
    const students = await Student.find({ _id: { $in: studentIds } }).lean();

    const stuMap = {};
    students.forEach((s) => (stuMap[s._id.toString()] = s));

    // Check approved leaves for today
    const leaves = await Leave.find({
      studentId: { $in: studentIds },
      status: "approved",
      fromDate: { $lte: dt },
      toDate: { $gte: dt },
    }).lean();

    const leaveMap = {};
    leaves.forEach((l) => {
      leaveMap[l.studentId.toString()] = true;
    });

    const ops = [];
    const errors = [];

    for (const r of records) {
      const sid = r.studentId;
      const stu = stuMap[sid];

      if (!stu) {
        errors.push({ studentId: sid, error: "Student not found" });
        continue;
      }

      let status = String(r.status).toLowerCase();

      // Auto-mark as leave if student has approved leave
      if (leaveMap[sid]) {
        status = "leave";
      }

      if (!VALID_STATUS.has(status)) {
        errors.push({ studentId: sid, error: `Invalid status '${r.status}'` });
        continue;
      }

      ops.push({
        updateOne: {
          filter: {
            facultyId,
            subjectId,
            studentId: stu._id,
            date: dt,
          },
          update: {
            $set: {
              facultyId,
              subjectId,
              studentId: stu._id,
              date: dt,
              status,
              academicYear: stu.academicYear,
              branch: stu.branch,
              section: stu.section,
              semesterNumber: stu.semesterNumber,
            },
          },
          upsert: true,
        },
      });
    }

    if (ops.length === 0) {
      return res.status(400).json({ error: "No valid records", errors });
    }

    await SubjectAttendance.bulkWrite(ops);

    return res.status(200).json({
      success: true,
      message: "Subject attendance saved successfully",
      saved: ops.length,
      errors,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Show Subject Attendance (Overall Statistics)
async function showSubjectAttendance(req, res) {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(401).json({ error: "Unauthorized: Faculty only" });
  }

  try {
    const facultyId = req.user._id;
    const { department, branch, academicYear, section, subjectId } = req.query;

    if (!department || !branch || !academicYear || !section || !subjectId) {
      return res.status(400).json({
        error: "department, branch, academicYear, section, subjectId required",
      });
    }

    // Verify faculty is assigned to this subject
    const assignment = await FacultyAssignment.findOne({
      facultyId,
      subjectId,
      department,
      branch,
      academicYear,
      section,
    }).populate("subjectId", "name subjectCode");

    if (!assignment) {
      return res.status(403).json({
        error: "You are not assigned to teach this subject for this class",
      });
    }

    // Get all students of this class
    const students = await Student.find({
      department,
      branch,
      academicYear,
      section,
      isVerified: true,
    })
      .select("name enrollmentNumber email profilePic")
      .sort({ enrollmentNumber: 1 })
      .lean();

    // Get all attendance records for this subject
    const attendanceRecords = await SubjectAttendance.find({
      facultyId,
      subjectId,
      department,
      branch,
      academicYear,
      section,
    }).lean();

    // Calculate statistics for each student
    const studentStats = students.map((student) => {
      const studentAttendance = attendanceRecords.filter(
        (record) => record.studentId.toString() === student._id.toString()
      );

      const totalClasses = studentAttendance.length;
      const presentCount = studentAttendance.filter(
        (record) => record.status === "present"
      ).length;
      const absentCount = studentAttendance.filter(
        (record) => record.status === "absent"
      ).length;
      const leaveCount = studentAttendance.filter(
        (record) => record.status === "leave"
      ).length;

      const percentage =
        totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

      return {
        studentId: student._id,
        name: student.name,
        enrollmentNumber: student.enrollmentNumber,
        email: student.email,
        profilePic: student.profilePic,
        totalClasses,
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
        percentage: parseFloat(percentage),
      };
    });

    // Overall class statistics
    const totalClassesConducted = Math.max(
      ...studentStats.map((s) => s.totalClasses),
      0
    );
    const avgAttendance =
      studentStats.length > 0
        ? (
            studentStats.reduce((sum, s) => sum + parseFloat(s.percentage), 0) /
            studentStats.length
          ).toFixed(2)
        : 0;

    return res.status(200).json({
      success: true,
      subject: assignment.subjectId,
      classInfo: {
        department,
        branch,
        academicYear,
        section,
      },
      statistics: {
        totalStudents: students.length,
        totalClassesConducted,
        averageAttendance: parseFloat(avgAttendance),
      },
      students: studentStats,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get detailed attendance records (date-wise)
async function getDetailedAttendance(req, res) {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(401).json({ error: "Unauthorized: Faculty only" });
  }

  try {
    const facultyId = req.user._id;
    const { department, branch, academicYear, section, subjectId, from, to } =
      req.query;

    if (!department || !branch || !academicYear || !section || !subjectId) {
      return res.status(400).json({
        error: "department, branch, academicYear, section, subjectId required",
      });
    }

    const filter = {
      facultyId,
      subjectId,
      department,
      branch,
      academicYear,
      section,
    };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = normalizeDate(from);
      if (to) filter.date.$lte = normalizeDate(to);
    }

    const attendanceRecords = await SubjectAttendance.find(filter)
      .populate("studentId", "name enrollmentNumber email")
      .populate("subjectId", "name subjectCode")
      .sort({ date: -1, "studentId.enrollmentNumber": 1 })
      .lean();

    // Group by date
    const dateWiseAttendance = {};
    attendanceRecords.forEach((record) => {
      const dateKey = record.date.toISOString().split("T")[0];
      if (!dateWiseAttendance[dateKey]) {
        dateWiseAttendance[dateKey] = {
          date: record.date,
          records: [],
        };
      }
      dateWiseAttendance[dateKey].records.push({
        student: record.studentId,
        status: record.status,
      });
    });

    return res.status(200).json({
      success: true,
      attendance: Object.values(dateWiseAttendance),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ==================== STUDENT ATTENDANCE VIEW ====================
async function getStudentAttendance(req, res) {
  if (!req.user || req.user.role !== "student") {
    return res.status(401).json({ error: "Unauthorized: Student only" });
  }

  try {
    const studentId = req.user._id;
    const { semesterNumber, from, to } = req.query;

    const filter = {
      studentId,
      semesterNumber: semesterNumber
        ? parseInt(semesterNumber)
        : req.user.semesterNumber,
    };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = normalizeDate(from);
      if (to) filter.date.$lte = normalizeDate(to);
    }

    const classAtt = await ClassAttendance.find(filter)
      .sort({ date: -1 })
      .lean();
    const subjectAtt = await SubjectAttendance.find(filter)
      .populate("subjectId", "subjectCode name")
      .sort({ date: -1 })
      .lean();

    const classTotal = classAtt.length;
    const classPresent = classAtt.filter((x) => x.status === "present").length;

    const subjectStats = {};
    subjectAtt.forEach((att) => {
      const code = att.subjectId?.subjectCode || "Unknown";
      if (!subjectStats[code]) {
        subjectStats[code] = { total: 0, present: 0, absent: 0, leave: 0 };
      }
      subjectStats[code].total++;
      if (att.status === "present") subjectStats[code].present++;
      if (att.status === "absent") subjectStats[code].absent++;
      if (att.status === "leave") subjectStats[code].leave++;
    });

    Object.keys(subjectStats).forEach((code) => {
      const s = subjectStats[code];
      s.percentage = ((s.present / s.total) * 100).toFixed(2);
    });

    return res.status(200).json({
      classAttendance: classAtt,
      subjectAttendance: subjectAtt,
      classStats: {
        total: classTotal,
        present: classPresent,
        percentage:
          classTotal > 0 ? ((classPresent / classTotal) * 100).toFixed(2) : "0",
      },
      subjectStats,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ==================== TG ATTENDANCE DASHBOARD ====================

// Get comprehensive TG attendance dashboard
async function getTgAttendanceDashboard(req, res) {
  if (!req.user || req.user.role !== "tg") {
    return res.status(401).json({ error: "Unauthorized: TG only" });
  }

  try {
    const tgId = req.user._id;
    const { department, branch, section, academicYear, semesterNumber } =
      req.user;

    // ✅ FIX #1: Add semesterNumber filter
    if (!semesterNumber) {
      return res.status(400).json({
        error: "Semester number not found in user profile",
      });
    }

    // Get all verified students of this TG's class
    const students = await Student.find({
      department,
      branch,
      section,
      academicYear,
      isVerified: true,
    })
      .select(
        "name enrollmentNumber email mobileNumber profilePic parentContact"
      )
      .sort({ enrollmentNumber: 1 })
      .lean();

    const totalStudents = students.length;

    // ✅ FIX #1: Add semesterNumber filter to classAttendance
    const classAttendance = await ClassAttendance.find({
      tgId,
      department,
      branch,
      section,
      academicYear,
      semesterNumber, // ✅ FIXED: Only current semester
    }).lean();

    // ✅ FIX #2: Add semesterNumber filter to subjectAttendance
    const subjectAttendance = await SubjectAttendance.find({
      department,
      branch,
      section,
      academicYear,
      semesterNumber, // ✅ FIXED: Only current semester
    })
      .populate("subjectId", "name subjectCode")
      .lean();

    // ✅ FIX #3: Add semesterNumber filter to pending leaves
    const pendingLeaves = await Leave.find({
      status: "pending",
      department,
      branch,
      section,
      academicYear,
      semesterNumber, // ✅ FIXED: Only current semester leaves
    })
      .populate("studentId", "name enrollmentNumber email mobileNumber")
      .sort({ appliedDate: -1 })
      .lean();

    // Calculate student-wise statistics
    const studentStats = students.map((student) => {
      const studentId = student._id.toString();

      // Class attendance stats
      const classRecords = classAttendance.filter(
        (record) => record.studentId.toString() === studentId
      );
      const classTotalClasses = classRecords.length;
      const classPresent = classRecords.filter(
        (r) => r.status === "present"
      ).length;
      const classAbsent = classRecords.filter(
        (r) => r.status === "absent"
      ).length;
      const classLeave = classRecords.filter(
        (r) => r.status === "leave"
      ).length;
      const classPercentage =
        classTotalClasses > 0
          ? ((classPresent / classTotalClasses) * 100).toFixed(2)
          : 0;

      return {
        studentId: student._id,
        name: student.name,
        enrollmentNumber: student.enrollmentNumber,
        email: student.email,
        mobileNumber: student.mobileNumber,
        profilePic: student.profilePic,
        parentContact: student.parentContact,
        totalClasses: classTotalClasses,
        present: classPresent,
        absent: classAbsent,
        leave: classLeave,
        percentage: parseFloat(classPercentage),
        isAtRisk: parseFloat(classPercentage) < 60,
      };
    });

    // Students at risk (attendance < 60%)
    const studentsAtRisk = studentStats.filter((s) => s.isAtRisk);

    // Calculate average class attendance
    const avgClassAttendance =
      studentStats.length > 0
        ? (
            studentStats.reduce((sum, s) => sum + parseFloat(s.percentage), 0) /
            studentStats.length
          ).toFixed(2)
        : 0;

    // Calculate subject-wise average attendance
    const subjectWiseStats = {};
    subjectAttendance.forEach((record) => {
      const subjectCode = record.subjectId?.subjectCode || "Unknown";
      const subjectName = record.subjectId?.name || "Unknown";
      const studentId = record.studentId.toString();

      if (!subjectWiseStats[subjectCode]) {
        subjectWiseStats[subjectCode] = {
          subjectCode,
          subjectName,
          studentRecords: {},
        };
      }

      if (!subjectWiseStats[subjectCode].studentRecords[studentId]) {
        subjectWiseStats[subjectCode].studentRecords[studentId] = {
          total: 0,
          present: 0,
        };
      }

      subjectWiseStats[subjectCode].studentRecords[studentId].total++;
      if (record.status === "present") {
        subjectWiseStats[subjectCode].studentRecords[studentId].present++;
      }
    });

    // Calculate average percentage for each subject
    const subjectAverages = Object.values(subjectWiseStats).map((subject) => {
      const studentRecords = Object.values(subject.studentRecords);
      const avgPercentage =
        studentRecords.length > 0
          ? (
              studentRecords.reduce((sum, rec) => {
                const percentage =
                  rec.total > 0 ? (rec.present / rec.total) * 100 : 0;
                return sum + percentage;
              }, 0) / studentRecords.length
            ).toFixed(2)
          : 0;

      return {
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        averagePercentage: parseFloat(avgPercentage),
      };
    });

    // Attendance distribution (for pie chart)
    const above75 = studentStats.filter((s) => s.percentage >= 75).length;
    const between60And75 = studentStats.filter(
      (s) => s.percentage >= 60 && s.percentage < 75
    ).length;
    const below60 = studentStats.filter((s) => s.percentage < 60).length;

    const attendanceDistribution = {
      above75: {
        count: above75,
        percentage:
          totalStudents > 0 ? ((above75 / totalStudents) * 100).toFixed(2) : 0,
      },
      between60And75: {
        count: between60And75,
        percentage:
          totalStudents > 0
            ? ((between60And75 / totalStudents) * 100).toFixed(2)
            : 0,
      },
      below60: {
        count: below60,
        percentage:
          totalStudents > 0 ? ((below60 / totalStudents) * 100).toFixed(2) : 0,
      },
    };

    return res.status(200).json({
      success: true,
      classInfo: {
        department,
        branch,
        section,
        academicYear,
        semesterNumber, // ✅ Include semester info in response
      },
      summary: {
        totalStudents,
        averageClassAttendance: parseFloat(avgClassAttendance),
        studentsAtRiskCount: studentsAtRisk.length,
        pendingLeaveRequests: pendingLeaves.length,
      },
      attendanceDistribution,
      subjectAverages,
      studentsAtRisk: studentsAtRisk.map((s) => ({
        studentId: s.studentId,
        name: s.name,
        enrollmentNumber: s.enrollmentNumber,
        email: s.email,
        mobileNumber: s.mobileNumber,
        percentage: s.percentage,
      })),
      pendingLeaves,
      allStudents: studentStats,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

// Get students at risk with details
async function getStudentsAtRisk(req, res) {
  if (!req.user || req.user.role !== "tg") {
    return res.status(401).json({ error: "Unauthorized: TG only" });
  }

  try {
    const tgId = req.user._id;
    const { department, branch, section, academicYear, semesterNumber } =
      req.user;

    // ✅ FIX #1: Add semesterNumber validation
    if (!semesterNumber) {
      return res.status(400).json({
        error: "Semester number not found in user profile",
      });
    }

    // Get all verified students
    const students = await Student.find({
      department,
      branch,
      section,
      academicYear,
      isVerified: true,
    })
      .select(
        "name enrollmentNumber email mobileNumber profilePic parentContact"
      )
      .lean();

    // ✅ FIX #1: Add semesterNumber filter
    const classAttendance = await ClassAttendance.find({
      tgId,
      department,
      branch,
      section,
      academicYear,
      semesterNumber, // ✅ FIXED: Only current semester
    }).lean();

    // Calculate attendance for each student
    const studentsAtRisk = [];

    students.forEach((student) => {
      const studentId = student._id.toString();
      const records = classAttendance.filter(
        (r) => r.studentId.toString() === studentId
      );

      const total = records.length;
      const present = records.filter((r) => r.status === "present").length;
      const percentage = total > 0 ? (present / total) * 100 : 0;

      if (percentage < 60) {
        studentsAtRisk.push({
          studentId: student._id,
          name: student.name,
          enrollmentNumber: student.enrollmentNumber,
          email: student.email,
          mobileNumber: student.mobileNumber,
          parentContact: student.parentContact,
          profilePic: student.profilePic,
          totalClasses: total,
          present,
          absent: records.filter((r) => r.status === "absent").length,
          leave: records.filter((r) => r.status === "leave").length,
          percentage: percentage.toFixed(2),
        });
      }
    });

    return res.status(200).json({
      success: true,
      semesterNumber, // ✅ Include semester info
      count: studentsAtRisk.length,
      students: studentsAtRisk,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Send low attendance notification email
async function sendLowAttendanceEmail(req, res) {
  if (!req.user || req.user.role !== "tg") {
    return res.status(401).json({ error: "Unauthorized: TG only" });
  }

  try {
    const { studentIds, message } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: "Student IDs required" });
    }

    const students = await Student.find({ _id: { $in: studentIds } })
      .select("name email enrollmentNumber")
      .lean();

    // Import nodemailer
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
      },
    });

    const emailPromises = students.map((student) => {
      const mailOptions = {
        from: process.env.MAIL_ID,
        to: student.email,
        subject: "Low Attendance Warning - UNIFY",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
              <h2 style="color: #d32f2f;">⚠️ Low Attendance Alert</h2>
              <p>Dear <strong>${student.name}</strong>,</p>
              <p>Enrollment Number: <strong>${
                student.enrollmentNumber
              }</strong></p>
              <br/>
              <p>${
                message ||
                "Your attendance is below the required percentage. Please meet your TG tomorrow to discuss this matter."
              }</p>
              <br/>
              <p>This is an automated notification from UNIFY - College ERP System.</p>
              <hr style="margin: 20px 0;"/>
              <p style="color: #666; font-size: 12px;">
                If you have any queries, please contact your Teacher Guardian.
              </p>
            </div>
          </div>
        `,
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    return res.status(200).json({
      success: true,
      message: `Email sent to ${students.length} students successfully`,
      sentTo: students.map((s) => s.email),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

// Send WhatsApp notification (using Twilio)
async function sendLowAttendanceWhatsApp(req, res) {
  if (!req.user || req.user.role !== "tg") {
    return res.status(401).json({ error: "Unauthorized: TG only" });
  }

  try {
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: "Student IDs required" });
    }

    const students = await Student.find({ _id: { $in: studentIds } })
      .select("name mobileNumber enrollmentNumber")
      .lean();

    // WhatsApp integration using Twilio (requires Twilio setup)
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_WHATSAPP_NUMBER
    ) {
      return res.status(400).json({
        error:
          "WhatsApp service not configured. Please set up Twilio credentials.",
      });
    }

    const twilio = require("twilio");
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const whatsappPromises = students.map((student) => {
      return client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:+91${student.mobileNumber}`,
        body: `Dear ${student.name},

Your attendance is critically low. Please meet me tomorrow to discuss this matter.

- Your Teacher Guardian
UNIFY College ERP`,
      });
    });

    await Promise.all(whatsappPromises);

    return res.status(200).json({
      success: true,
      message: `WhatsApp messages sent to ${students.length} students successfully`,
      sentTo: students.map((s) => `+91${s.mobileNumber}`),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
      note: "Make sure Twilio is properly configured with: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER",
    });
  }
}

// Get all class attendance records (date-wise view)
async function getTgClassAttendanceRecords(req, res) {
  if (!req.user || req.user.role !== "tg") {
    return res.status(401).json({ error: "Unauthorized: TG only" });
  }

  try {
    const tgId = req.user._id;
    const { department, branch, section, academicYear, semesterNumber } =
      req.user;
    const { from, to } = req.query;

    // ✅ FIX #1: Add semesterNumber validation
    if (!semesterNumber) {
      return res.status(400).json({
        error: "Semester number not found in user profile",
      });
    }

    const filter = {
      tgId,
      department,
      branch,
      section,
      academicYear,
      semesterNumber, // ✅ FIXED: Only current semester
    };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = normalizeDate(from);
      if (to) filter.date.$lte = normalizeDate(to);
    }

    const attendanceRecords = await ClassAttendance.find(filter)
      .populate("studentId", "name enrollmentNumber email profilePic")
      .sort({ date: -1 })
      .lean();

    // Group by date
    const dateWiseAttendance = {};
    attendanceRecords.forEach((record) => {
      const dateKey = record.date.toISOString().split("T")[0];
      if (!dateWiseAttendance[dateKey]) {
        dateWiseAttendance[dateKey] = {
          date: record.date,
          records: [],
        };
      }
      dateWiseAttendance[dateKey].records.push({
        student: record.studentId,
        status: record.status,
      });
    });

    return res.status(200).json({
      success: true,
      semesterNumber, // ✅ Include semester info
      attendance: Object.values(dateWiseAttendance),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get students list for taking attendance (TG version)
async function getTgStudentsForAttendance(req, res) {
  if (!req.user || req.user.role !== "tg") {
    return res.status(401).json({ error: "Unauthorized: TG only" });
  }

  try {
    const tgId = req.user._id;
    const { department, branch, section, academicYear } = req.user;

    // Get all verified students
    const students = await Student.find({
      department,
      branch,
      section,
      academicYear,
      isVerified: true,
    })
      .select("name enrollmentNumber email profilePic")
      .sort({ enrollmentNumber: 1 })
      .lean();

    // Check if attendance is already marked for today
    const today = normalizeDate(new Date());
    const todayAttendance = await ClassAttendance.find({
      tgId,
      date: today,
    }).lean();

    const attendanceMap = {};
    todayAttendance.forEach((att) => {
      attendanceMap[att.studentId.toString()] = att.status;
    });

    // Check for approved leaves for today
    const leaves = await Leave.find({
      studentId: { $in: students.map((s) => s._id) },
      status: "approved",
      fromDate: { $lte: today },
      toDate: { $gte: today },
    }).lean();

    const leaveMap = {};
    leaves.forEach((l) => {
      leaveMap[l.studentId.toString()] = true;
    });

    // Combine student data
    const studentsWithStatus = students.map((student) => ({
      ...student,
      currentStatus: attendanceMap[student._id.toString()] || null,
      isOnLeave: leaveMap[student._id.toString()] || false,
    }));

    return res.status(200).json({
      success: true,
      students: studentsWithStatus,
      attendanceMarked: todayAttendance.length > 0,
      date: today,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Export all functions
module.exports = {
  takeClassAttendance,
  takeSubjectAttendance,
  getStudentAttendance,
  getStudentsForAttendance,
  showSubjectAttendance,
  getDetailedAttendance,
  getTgAttendanceDashboard,
  getStudentsAtRisk,
  sendLowAttendanceEmail,
  sendLowAttendanceWhatsApp,
  getTgClassAttendanceRecords,
  getTgStudentsForAttendance,
};
