const dotenv = require("dotenv");
dotenv.config();
const { createToken } = require("../services/authentication");
const HOD = require("../model/hod");
const { randomBytes, createHmac } = require("crypto");

async function handleAdminLogin(req, res) {
  try {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (adminId !== process.env.adminID || password !== process.env.adminPASS) {
      return res.status(401).json({ error: "Invalid Admin Credentials" });
    }
    const token = await createToken({
      id: adminId,
      name: "Admin",
      role: "admin",
    });
    return res.cookie("token", token).redirect("/api/admin/dashboard");
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

async function handleCreateHOD(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Please log in as admin.");
  }
  try {
    const {
      name,
      hodId,
      course,
      department,
      password,
      email,
      mobileNumber,
      gender,
    } = req.body;
    if (
      !name ||
      !hodId ||
      !course ||
      !department ||
      !password ||
      !email ||
      !mobileNumber ||
      !gender
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await HOD.findOne({
      $or: [{ hodId }, { email }, { mobileNumber }],
    });

    if (existing) {
      return res.status(409).json({
        error: "HOD with this ID, email, or mobile number already exists",
      });
    }

    const newHOD = new HOD({
      name,
      hodId,
      course,
      department,
      password,
      email,
      mobileNumber,
      gender,
    });
    await newHOD.save();
    return res.redirect("/api/admin/dashboard");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// ADMIN — Edit HOD Details
async function editHOD(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { hodId } = req.params;
    const updates = req.body;

    const hod = await HOD.findOneAndUpdate({ hodId }, updates, { new: true });

    if (!hod) {
      return res.status(404).json({ error: "HOD not found" });
    }

    return res.status(200).json({ message: "HOD updated successfully", hod });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ADMIN — Reset HOD Password
async function resetHODPassword(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { hodId } = req.params;
    const { newPassword } = req.body;

    const hod = await HOD.findOne({ hodId });
    if (!hod) return res.status(404).json({ error: "HOD not found" });

    const salt = randomBytes(16).toString("hex");
    const hashed = createHmac("sha256", salt).update(newPassword).digest("hex");

    hod.password = hashed;
    hod.salt = salt;

    await hod.save();

    return res.status(200).json({ message: "HOD password reset successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// DELETE HOD
async function deleteHOD(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Admin only.");
  }

  try {
    const { hodId } = req.params;

    const deleted = await HOD.findOneAndDelete({ hodId });
    if (!deleted) return res.status(404).json({ error: "HOD not found" });

    return res.status(200).json({ message: "HOD deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  handleAdminLogin,
  handleCreateHOD,
  editHOD,
  resetHODPassword,
  deleteHOD,
};
