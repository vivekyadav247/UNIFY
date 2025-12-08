const Student = require("../model/student");
const TG = require("../model/tg");
const { createHmac, randomBytes } = require("crypto");

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

    // Check if student belongs to this TG's class
    if (
      student.branch !== tg.branch ||
      student.section !== tg.section ||
      student.department !== tg.department ||
      student.course !== tg.course ||
      student.academicYear !== tg.academicYear ||
      student.assignTgId?.toString() !== tgId.toString()
    ) {
      return res.status(403).json({
        error: "You are not authorized to verify this student",
      });
    }

    // Check if already verified
    if (student.isVerified === true) {
      return res.status(400).json({ error: "Student already verified" });
    }

    // Verify student
    student.isVerified = true;
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

// ⭐ NEW: Get unverified students for TG dashboard
async function getUnverifiedStudents(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user._id;
    const { department, branch, section, academicYear } = req.user;

    // Get all unverified students of this TG's class
    const unverifiedStudents = await Student.find({
      department,
      branch,
      section,
      academicYear,
      isVerified: false,
      assignTgId: tgId,
    })
      .select(
        "name enrollmentNumber email mobileNumber dob gender profilePic course department branch section academicYear semesterNumber createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: unverifiedStudents.length,
      students: unverifiedStudents,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ⭐ NEW: Get all students (verified + unverified) for TG
async function getAllMyStudents(req, res) {
  try {
    if (!req.user || req.user.role !== "tg") {
      return res.status(401).json({ error: "Unauthorized: TG only" });
    }

    const tgId = req.user._id;
    const { department, branch, section, academicYear } = req.user;

    // Get all students of this TG's class
    const allStudents = await Student.find({
      department,
      branch,
      section,
      academicYear,
      assignTgId: tgId,
    })
      .select(
        "name enrollmentNumber email mobileNumber dob gender profilePic isVerified course department branch section academicYear semesterNumber createdAt"
      )
      .sort({ enrollmentNumber: 1 })
      .lean();

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

module.exports = {
  getTgProfile,
  updateTgProfile,
  changeTgPassword,
  verifyStudentByTG,
  getUnverifiedStudents,
  getAllMyStudents,
};
