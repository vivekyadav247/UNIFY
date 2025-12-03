const router = require("express").Router();

const {
  handleCreateTg,
  handleCreateFaculty,
  createSubject,
  setSemesterForBatch,
  assignFacultyToSubject,
  editTG,
  resetTGPassword,
  editFaculty,
  resetFacultyPassword,
  deleteTG,
  deleteFaculty,
} = require("../controller/hod");

router.get("/dashboard", (req, res) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  res.send("HOD Dashboard");
});

router.get("/create-tg", async (req, res) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  res.send("TG Creation Endpoint");
});

router.post("/create-tg", handleCreateTg);

router.get("/create-faculty", async (req, res) => {
  if (!req.user || req.user.role !== "hod") {
    return res.status(401).send("Unauthorized: Please log in as HOD.");
  }
  res.send("Faculty Creation Endpoint");
});

router.post("/create-faculty", handleCreateFaculty);

// TG
router.put("/edit-tg/:tgId", editTG);
router.put("/reset-tg-password/:tgId", resetTGPassword);

// Faculty
router.put("/edit-faculty/:facultyId", editFaculty);
router.put("/reset-faculty-password/:facultyId", resetFacultyPassword);

router.delete("/delete-tg/:tgId", deleteTG);
router.delete("/delete-faculty/:facultyId", deleteFaculty);

router.post("/subject", createSubject);
router.post("/semester", setSemesterForBatch);
router.post("/assign-faculty", assignFacultyToSubject);

module.exports = router;
