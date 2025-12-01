const router = require("express").Router();

const { takeClassAttendance } = require("../controller/attendance");
const { verifyStudentByTG } = require("../controller/tg");

router.post("/class", takeClassAttendance);
router.put("/verify-student/:studentId", verifyStudentByTG);

module.exports = router;
