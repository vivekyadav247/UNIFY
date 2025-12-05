const router = require("express").Router();

const {
  takeSubjectAttendance,
  getStudentsForAttendance,
  showSubjectAttendance,
  getDetailedAttendance,
} = require("../controller/attendance");
const {
  getFacultyProfile,
  updateFacultyProfile,
  changeFacultyPassword,
} = require("../controller/faculty");

// Profile routes
router.get("/profile", getFacultyProfile);
router.put("/profile/update", updateFacultyProfile);
router.put("/profile/change-password", changeFacultyPassword);

// Attendance routes
router.get("/attendance/students", getStudentsForAttendance);
router.post("/attendance/take", takeSubjectAttendance);
router.get("/attendance/show", showSubjectAttendance);
router.get("/attendance/detailed", getDetailedAttendance);

module.exports = router;
