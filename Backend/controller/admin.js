const dotenv = require("dotenv");
dotenv.config();
const { createToken } = require("../services/authentication");
const HOD = require("../model/hod");

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
    return res
      .status(200)
      .cookie("token", token)
      .redirect("/api/admin/dashboard");
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
    return res.status(201).redirect("/api/admin/dashboard");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleAdminLogin,
  handleCreateHOD,
};
