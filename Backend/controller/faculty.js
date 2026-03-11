const Faculty = require("../model/faculty");
const FacultyAssign = require("../model/facultyAssign");
const Assignment = require("../model/assignment");
const Leave = require("../model/leave");
const Subject = require("../model/subject");
const { createHmac, randomBytes } = require("crypto");

async function getDashboardStats(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const facultyId = req.user._id;
    const department = req.user.department;

    // Get faculty assignments (classes assigned to this faculty)
    const facultyAssignments = await FacultyAssign.find({
      faculty: facultyId,
    }).populate("subject");

    // Count total unique students from all assigned classes
    let totalStudents = 0;
    const uniqueStudentIds = new Set();

    for (const assignment of facultyAssignments) {
      const students = await require("../model/student").find({
        department: assignment.department,
        branch: assignment.branch,
        section: assignment.section,
        academicYear: assignment.academicYear,
      });
      students.forEach((s) => uniqueStudentIds.add(s._id.toString()));
    }
    totalStudents = uniqueStudentIds.size;

    // Count pending assignments (created by this faculty)
    const pendingAssignments = await Assignment.countDocuments({
      createdBy: facultyId,
      dueDate: { $gte: new Date() },
    });

    // Count pending leave requests from students in faculty's classes
    const pendingLeaves = await Leave.countDocuments({
      department: department,
      status: "pending",
    });

    return res.status(200).json({
      stats: {
        totalStudents,
        pendingAssignments,
        pendingLeaves,
        totalClasses: facultyAssignments.length,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getFacultyProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const facultyId = req.user._id;

    const faculty = await Faculty.findById(facultyId).select("-password -salt");
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });

    return res.status(200).json({ message: "Profile fetched", faculty });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateFacultyProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const facultyId = req.user._id;

    const allowedFields = [
      "name",
      "email",
      "mobileNumber",
      "department",
      "course",
      "gender",
      "dob",
      "bio",
      "profilePic",
      "resume",
    ];

    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const updated = await Faculty.findByIdAndUpdate(facultyId, updates, {
      new: true,
    }).select("-password -salt");

    return res
      .status(200)
      .json({ message: "Profile updated", faculty: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function changeFacultyPassword(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const facultyId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });

    const oldHash = createHmac("sha256", faculty.salt)
      .update(oldPassword)
      .digest("hex");

    if (oldHash !== faculty.password)
      return res.status(400).json({ error: "Old password incorrect" });

    const newSalt = randomBytes(16).toString("hex");
    const newHash = createHmac("sha256", newSalt)
      .update(newPassword)
      .digest("hex");

    faculty.salt = newSalt;
    faculty.password = newHash;

    await faculty.save();

    return res.status(200).json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getFacultySchedule(req, res) {
  try {
    if (!req.user || req.user.role !== "faculty") {
      return res.status(401).json({ error: "Unauthorized: Faculty only" });
    }

    const facultyId = req.user._id;

    // Get all class assignments for this faculty
    const assignments = await FacultyAssign.find({ faculty: facultyId })
      .populate("subject")
      .lean();

    const schedule = assignments.map((assign) => ({
      subjectName: assign.subject?.name || "Unknown Subject",
      subjectCode: assign.subject?.code || "",
      department: assign.department,
      branch: assign.branch,
      section: assign.section,
      academicYear: assign.academicYear,
      dayOfWeek: assign.dayOfWeek || 1,
      startTime: assign.startTime || "09:00",
      endTime: assign.endTime || "10:00",
      room: assign.room || "TBA",
    }));

    return res.status(200).json({
      message: "Schedule fetched successfully",
      schedule,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getDashboardStats,
  getFacultyProfile,
  updateFacultyProfile,
  changeFacultyPassword,
  getFacultySchedule,
};
