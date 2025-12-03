const router = require("express").Router();

const { takeSubjectAttendance } = require("../controller/attendance");
const {
  getFacultyProfile,
  updateFacultyProfile,
  changeFacultyPassword,
} = require("../controller/faculty");

router.post("/subject", takeSubjectAttendance);

router.get("/profile", getFacultyProfile);
router.put("/profile/update", updateFacultyProfile);
router.put("/profile/change-password", changeFacultyPassword);

module.exports = router;
