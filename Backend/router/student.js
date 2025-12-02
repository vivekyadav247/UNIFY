const router = require("express").Router();
const {
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
} = require("../controller/student");
const { getStudentAttendance } = require("../controller/attendance");
const { attendanceBySemester } = require("../controller/semester");
const { applyLeave, getMyLeaves } = require("../controller/leave");

router.get("/profile", getStudentProfile);
router.put("/profile/update", updateStudentProfile);
router.put("/profile/change-password", changeStudentPassword);

router.get("/attendance", getStudentAttendance);
router.get("/semester/:semesterNumber/attendance", attendanceBySemester);

router.post("/leave/apply", applyLeave);
router.get("/leave", getMyLeaves);

module.exports = router;
