const router = require("express").Router();

const {
  takeClassAttendance,
  getTgAttendanceDashboard,
  getStudentsAtRisk,
  sendLowAttendanceEmail,
  sendLowAttendanceWhatsApp,
  getTgClassAttendanceRecords,
  getTgStudentsForAttendance,
} = require("../controller/attendance");

const {
  getTgProfile,
  updateTgProfile,
  changeTgPassword,
  verifyStudentByTG,
} = require("../controller/tg");

const { approveLeave, rejectLeave } = require("../controller/leave");

// Profile routes
router.get("/profile", getTgProfile);
router.put("/profile/update", updateTgProfile);
router.put("/profile/change-password", changeTgPassword);

// Attendance routes
router.get("/attendance/dashboard", getTgAttendanceDashboard);
router.get("/attendance/students", getTgStudentsForAttendance);
router.post("/attendance/take", takeClassAttendance);
router.get("/attendance/records", getTgClassAttendanceRecords);
router.get("/attendance/at-risk", getStudentsAtRisk);
router.post("/attendance/send-email", sendLowAttendanceEmail);
router.post("/attendance/send-whatsapp", sendLowAttendanceWhatsApp);

// Student verification
router.put("/verify-student/:studentId", verifyStudentByTG);

// Leave management
router.post("/leave/approve", approveLeave);
router.post("/leave/reject", rejectLeave);

module.exports = router;
