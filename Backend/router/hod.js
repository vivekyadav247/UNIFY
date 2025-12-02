const router = require("express").Router();

const {
  handleCreateTg,
  handleCreateFaculty,
  createSubject,
  assignFacultyToSubject,
  editTG,
  resetTGPassword,
  editFaculty,
  resetFacultyPassword,
  deleteTG,
  deleteFaculty,
  getHodProfile,
  updateHodProfile,
  changeHodPassword,
} = require("../controller/hod");

const {
  startSemester,
  endSemester,
  listSemesters,
} = require("../controller/semester");

router.get("/dashboard", (req, res) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  res.send("HOD Dashboard");
});

// TG
router.get("/create-tg", async (req, res) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  res.send("TG Creation Endpoint");
});
router.post("/create-tg", handleCreateTg);
router.put("/edit-tg/:tgId", editTG);
router.put("/reset-tg-password/:tgId", resetTGPassword);
router.delete("/delete-tg/:tgId", deleteTG);

// Faculty
router.get("/create-faculty", async (req, res) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  res.send("Faculty Creation Endpoint");
});
router.post("/create-faculty", handleCreateFaculty);
router.put("/edit-faculty/:facultyId", editFaculty);
router.put("/reset-faculty-password/:facultyId", resetFacultyPassword);
router.delete("/delete-faculty/:facultyId", deleteFaculty);

router.post("/subject", createSubject);

router.post("/semester/start", startSemester);
router.post("/semester/end", endSemester);
router.get("/semester/list", listSemesters);

router.post("/assign-faculty", assignFacultyToSubject);

router.get("/profile", getHodProfile);
router.put("/profile", updateHodProfile);
router.put("/change-password", changeHodPassword);

module.exports = router;
