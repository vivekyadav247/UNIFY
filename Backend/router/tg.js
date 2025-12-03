const router = require("express").Router();

const { takeClassAttendance } = require("../controller/attendance");
const {
  getTgProfile,
  updateTgProfile,
  changeTgPassword,
  verifyStudentByTG,
} = require("../controller/tg");

const { approveLeave, rejectLeave } = require("../controller/leave");

router.get("/profile", getTgProfile);
router.put("/profile/update", updateTgProfile);
router.put("/profile/change-password", changeTgPassword);

router.post("/class", takeClassAttendance);
router.put("/verify-student/:studentId", verifyStudentByTG);

router.post("/leave/approve", approveLeave);
router.post("/leave/reject", rejectLeave);

module.exports = router;
