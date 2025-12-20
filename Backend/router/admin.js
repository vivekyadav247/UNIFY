const router = require("express").Router();

const {
  handleAdminLogin,
  getAdminProfile,
  handleCreateHOD,
  editHOD,
  resetHODPassword,
  deleteHOD,
  getAllHODs,
  getAdminDashboard,
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  createBranch,
  getAllBranches,
  updateBranch,
  deleteBranch,
  createSection,
  getAllSections,
  updateSection,
  deleteSection,
  createAcademicYear,
  getAllAcademicYears,
  updateAcademicYear,
  deleteAcademicYear,
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} = require("../controller/admin");
const {
  createSemester,
  getAllSemesters,
  getSemestersByYear,
  getCurrentSemester,
  updateSemester,
  deleteSemester,
} = require("../controller/semester");
const { handleLogout } = require("../controller/auth");

router.post("/login", handleAdminLogin);

router.get("/profile", getAdminProfile);

router.get("/dashboard", getAdminDashboard);

// HOD Management
router.post("/hod", handleCreateHOD);
router.get("/hods", getAllHODs);
router.put("/hod/:hodId", editHOD);
router.put("/hod/:hodId/reset-password", resetHODPassword);
router.delete("/hod/:hodId", deleteHOD);

// Department Management
router.post("/department", createDepartment);
router.get("/departments", getAllDepartments);
router.put("/department/:id", updateDepartment);
router.delete("/department/:id", deleteDepartment);

// Course Management
router.post("/course", createCourse);
router.get("/courses", getAllCourses);
router.put("/course/:id", updateCourse);
router.delete("/course/:id", deleteCourse);

// Branch Management
router.post("/branch", createBranch);
router.get("/branches", getAllBranches);
router.put("/branch/:id", updateBranch);
router.delete("/branch/:id", deleteBranch);

// Section Management
router.post("/section", createSection);
router.get("/sections", getAllSections);
router.put("/section/:id", updateSection);
router.delete("/section/:id", deleteSection);

// Academic Year Management
router.post("/academic-year", createAcademicYear);
router.get("/academic-years", getAllAcademicYears);
router.put("/academic-year/:id", updateAcademicYear);
router.delete("/academic-year/:id", deleteAcademicYear);

// Subject Management
router.post("/subject", createSubject);
router.get("/subjects", getAllSubjects);
router.put("/subject/:id", updateSubject);
router.delete("/subject/:id", deleteSubject);

// Semester Management
router.post("/semester", createSemester);
router.get("/semesters", getAllSemesters);
router.get("/semester/year/:academicYear", getSemestersByYear);
router.get("/semester/current", getCurrentSemester);
router.put("/semester/:semesterId", updateSemester);
router.delete("/semester/:semesterId", deleteSemester);

router.post("/logout", handleLogout);

module.exports = router;
