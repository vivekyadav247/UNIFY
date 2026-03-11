const Student = require("../model/student");
const TG = require("../model/tg");
const Semester = require("../model/semester");
const Marks = require("../model/marks");
const ClassAttendance = require("../model/classAttendance");
const Assignment = require("../model/assignment");
const Feedback = require("../model/feedback");
const { createHmac, randomBytes } = require("crypto");

async function getStudentProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;

    const student = await Student.findById(studentId)
      .select("-password -salt")
      .populate("assignTgId", "name tgId email mobileNumber profilePic");

    if (!student) return res.status(404).json({ error: "Student not found" });

    return res.status(200).json({ student });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get student's class teacher (TG) info
async function getMyClassTeacher(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;
    const student = await Student.findById(studentId);

    if (!student) return res.status(404).json({ error: "Student not found" });

    let tg = null;

    // If TG is assigned, get their info
    if (student.assignTgId) {
      tg = await TG.findById(student.assignTgId).select(
        "name tgId email mobileNumber profilePic branch section academicYear"
      );
    }

    // If no TG assigned, try to find one for this class
    if (!tg) {
      tg = await TG.findOne({
        branch: student.branch,
        section: student.section,
        academicYear: student.academicYear,
        course: student.course,
        department: student.department,
      }).select(
        "name tgId email mobileNumber profilePic branch section academicYear"
      );

      // Auto-assign if found
      if (tg) {
        student.assignTgId = tg._id;
        await student.save();
      }
    }

    if (!tg) {
      return res.status(404).json({
        error: "No class teacher assigned yet",
        message: "Your class teacher will be assigned soon by HOD",
      });
    }

    return res.status(200).json({
      success: true,
      classTeacher: {
        name: tg.name,
        tgId: tg.tgId,
        email: tg.email,
        mobileNumber: tg.mobileNumber,
        profilePic: tg.profilePic,
        class: `${tg.branch} - ${tg.section}`,
        academicYear: tg.academicYear,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateStudentProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;

    const allowed = [
      "name",
      "email",
      "mobileNumber",
      "dob",
      "gender",
      "bloodGroup",
      "profilePic",
      "resume",
      "parentContact",
    ];

    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const updated = await Student.findByIdAndUpdate(studentId, updates, {
      new: true,
    }).select("-password -salt");

    return res
      .status(200)
      .json({ message: "Student updated", student: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function changeStudentPassword(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const oldHash = createHmac("sha256", student.salt)
      .update(oldPassword)
      .digest("hex");

    if (oldHash !== student.password)
      return res.status(400).json({ error: "Old password incorrect" });

    const newSalt = randomBytes(16).toString("hex");
    const newHash = createHmac("sha256", newSalt)
      .update(newPassword)
      .digest("hex");

    student.salt = newSalt;
    student.password = newHash;

    await student.save();

    return res.status(200).json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function completeStudentProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (student.profileComplete) {
      return res.status(400).json({
        error: "Profile is already complete. You can only change password now.",
      });
    }

    // Allowed fields for profile completion
    const allowed = [
      "name",
      "email",
      "mobileNumber",
      "dob",
      "gender",
      "bloodGroup",
      "parentContact",
      "profilePic",
    ];

    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    // Mark profile as complete
    updates.profileComplete = true;

    const updated = await Student.findByIdAndUpdate(studentId, updates, {
      new: true,
    }).select("-password -salt");

    return res.status(200).json({
      message: "Profile completed successfully!",
      student: updated,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
  completeStudentProfile,
  getMyClassTeacher,
  getStudentCurrentSemesterData,
};

// Get all student data for current semester
async function getStudentCurrentSemesterData(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
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
        data: {
          student,
          currentSemester: null,
          marks: null,
          attendance: null,
          assignments: null,
          feedback: null,
        },
      });
    }

    // Get student's HOD
    const hod = await TG.findOne({
      role: "hod",
      department: student.department,
    }).select("name hodId email mobileNumber profilePic");

    // Fetch data for current semester
    const [marks, attendance, assignments, feedback] = await Promise.all([
      Marks.find({
        studentId,
        semesterNumber: currentSemester.semesterNumber,
        academicYear: currentSemester.academicYear,
      }),
      ClassAttendance.find({
        studentId,
        semesterNumber: currentSemester.semesterNumber,
        academicYear: currentSemester.academicYear,
      }),
      Assignment.find({
        branch: student.branch,
        section: student.section,
        semesterNumber: currentSemester.semesterNumber,
        academicYear: currentSemester.academicYear,
      }),
      Feedback.find({
        studentId,
        semesterNumber: currentSemester.semesterNumber,
        academicYear: currentSemester.academicYear,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: student.name,
          enrollmentNumber: student.enrollmentNumber,
          branch: student.branch,
          section: student.section,
          academicYear: student.academicYear,
        },
        hod: hod
          ? {
              name: hod.name,
              hodId: hod.hodId,
              email: hod.email,
              mobileNumber: hod.mobileNumber,
              profilePic: hod.profilePic,
            }
          : null,
        currentSemester: {
          semesterNumber: currentSemester.semesterNumber,
          semesterName: currentSemester.semesterName,
          academicYear: currentSemester.academicYear,
          startDate: currentSemester.startDate,
          endDate: currentSemester.endDate,
          status: currentSemester.status,
        },
        marks: marks || null,
        attendance: {
          total: attendance.length,
          present: attendance.filter((a) => a.status === "present").length,
          absent: attendance.filter((a) => a.status === "absent").length,
          leave: attendance.filter((a) => a.status === "leave").length,
          percentage:
            attendance.length > 0
              ? (
                  (attendance.filter((a) => a.status === "present").length /
                    attendance.length) *
                  100
                ).toFixed(2)
              : 0,
        },
        assignments: assignments.map((a) => ({
          id: a._id,
          title: a.title,
          subject: a.subject,
          dueDate: a.dueDate,
          totalMarks: a.totalMarks,
        })),
        feedbackCount: feedback.length,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
