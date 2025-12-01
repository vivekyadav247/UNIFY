const router = require("express").Router();

const {
  handleAdminLogin,
  handleCreateHOD,
  editHOD,
  resetHODPassword,
  deleteHOD,
} = require("../controller/admin");
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

// Edit HOD
router.put("/edit-hod/:hodId", editHOD);

// Reset HOD password
router.put("/reset-hod-password/:hodId", resetHODPassword);

router.delete("/delete-hod/:hodId", deleteHOD);

router.post("/logout", handleLogout);

module.exports = router;
