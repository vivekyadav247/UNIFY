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
  getUnverifiedStudents,
  getAllMyStudents,
  getTgLeaveRequests,
  approveTgLeaveRequest,
  rejectTgLeaveRequest,
  getStudentDetail,
  getTgAnnouncements,
  getTgMarks,
  getTgAssignments,
  getTgFeedback,
  getTgReports,
  getTgSchedule,
  getTgDashboardStats,
  debugTgStudents,
} = require("../controller/tg");

const {
  updateStudentSGPA,
  updateStudentCGPA,
  bulkUpdateSGPA,
  getStudentGrades,
} = require("../controller/marks");

const { approveLeave, rejectLeave } = require("../controller/leave");

// Profile routes
router.get("/profile", getTgProfile);
router.put("/profile/update", updateTgProfile);
router.put("/profile/change-password", changeTgPassword);

// Dashboard
router.get("/dashboard/stats", getTgDashboardStats);

// DEBUG route - remove in production
router.get("/debug/students", debugTgStudents);

// Attendance routes
router.get("/attendance/dashboard", getTgAttendanceDashboard);
router.get("/attendance/students", getTgStudentsForAttendance);
router.post("/attendance/take", takeClassAttendance);
router.get("/attendance/records", getTgClassAttendanceRecords);
router.get("/attendance/at-risk", getStudentsAtRisk);
router.post("/attendance/send-email", sendLowAttendanceEmail);
router.post("/attendance/send-whatsapp", sendLowAttendanceWhatsApp);

// Student verification
router.get("/students/unverified", getUnverifiedStudents);
router.put("/verify-student/:studentId", verifyStudentByTG);
router.get("/students/all", getAllMyStudents);
router.get("/students/:studentId/detail", getStudentDetail);

// Leave management
router.get("/leave/requests", getTgLeaveRequests);
router.post("/leave/approve/:leaveId", approveTgLeaveRequest);
router.post("/leave/reject/:leaveId", rejectTgLeaveRequest);

// Announcements
router.get("/announcements", getTgAnnouncements);

// Marks
router.get("/marks", getTgMarks);

// CGPA/SGPA Management
router.get("/students/:studentId/grades", getStudentGrades);
router.put("/students/:studentId/sgpa", updateStudentSGPA);
router.put("/students/:studentId/cgpa", updateStudentCGPA);
router.post("/students/bulk-sgpa", bulkUpdateSGPA);

// Assignments
router.get("/assignments", getTgAssignments);

// Feedback
router.get("/feedback", getTgFeedback);

// Reports
router.get("/reports", getTgReports);

// Schedule
router.get("/schedule", getTgSchedule);

module.exports = router;
