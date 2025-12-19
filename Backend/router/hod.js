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
  getDashboardStats,
  getStudentsByDepartment,
  getFacultyByDepartment,
  getTGsByDepartment,
  getStudentDetails,
  getFacultyDetails,
  getTGDetails,
  getHODAnnouncements,
  createHODAnnouncement,
  getSubjectsByFilters,
  getDepartments,
  getCourses,
  getBranches,
  getSections,
  getAcademicYears,
} = require("../controller/hod");

const {
  startSemester,
  endSemester,
  listSemesters,
} = require("../controller/semester");

router.get("/dashboard", getDashboardStats);

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

// Students
router.get("/students", getStudentsByDepartment);
router.get("/student/:studentId", getStudentDetails);

// Faculty
router.get("/faculties", getFacultyByDepartment);
router.get("/faculty/:facultyId", getFacultyDetails);

// TGs
router.get("/tgs", getTGsByDepartment);
router.get("/tg/:tgId", getTGDetails);

// Announcements
router.get("/announcements", getHODAnnouncements);
router.post("/announcements", createHODAnnouncement);

// Subjects
router.get("/subjects", getSubjectsByFilters);

// Institution Config
router.get("/departments", getDepartments);
router.get("/courses", getCourses);
router.get("/branches", getBranches);
router.get("/sections", getSections);
router.get("/academic-years", getAcademicYears);

module.exports = router;
