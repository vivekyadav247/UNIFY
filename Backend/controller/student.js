const Student = require("../model/student");
const { createHmac, randomBytes } = require("crypto");

async function getStudentProfile(req, res) {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(401).json({ error: "Unauthorized: Student only" });
    }

    const studentId = req.user._id;

    const student = await Student.findById(studentId).select("-password -salt");
    if (!student) return res.status(404).json({ error: "Student not found" });

    return res.status(200).json({ student });
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
};
