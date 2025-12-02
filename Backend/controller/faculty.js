const Faculty = require("../model/faculty");
const { createHmac, randomBytes } = require("crypto");

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

module.exports = {
  getFacultyProfile,
  updateFacultyProfile,
  changeFacultyPassword,
};
