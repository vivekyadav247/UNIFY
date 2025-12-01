const router = require("express").Router();

const { handleAdminLogin, handleCreateHOD } = require("../controller/admin");
const { handleLogout } = require("../controller/auth");

router.get("/login", async (req, res) => {
  return res.send("Admin Login Page");
});

router.post("/login", handleAdminLogin);

router.get("/dashboard", (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Please log in as admin.");
  }
  return res.send("Admin Dashboard");
});

router.get("/create-hod", (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).send("Unauthorized: Please log in as admin.");
  }
  return res.send("Create HOD Page");
});

router.post("/create-hod", handleCreateHOD);

router.post("/logout", handleLogout);

module.exports = router;
