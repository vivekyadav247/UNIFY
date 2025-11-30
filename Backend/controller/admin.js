const dotenv = require("dotenv");
dotenv.config();
const { createToken } = require("../services/authentication");

async function handleAdminLogin(req, res) {
  try {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (adminId !== process.env.adminID || password !== process.env.adminPASS) {
      return res.status(401).json({ error: "Invalid Admin Credentials" });
    }
    const token = await createToken(adminId, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

module.exports = {
  handleAdminLogin,
};
