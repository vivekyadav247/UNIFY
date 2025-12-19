const router = require("express").Router();
const upload = require("../middleware/upload");

const {
  takeSubjectAttendance,
  getStudentsForAttendance,
  getFacultyClasses,
  showSubjectAttendance,
  getDetailedAttendance,
} = require("../controller/attendance");
const {
  getDashboardStats,
  getFacultyProfile,
  updateFacultyProfile,
  changeFacultyPassword,
  getFacultySchedule,
} = require("../controller/faculty");
const {
  createAssignment,
  getFacultyAssignments,
  getAssignmentSubmissions,
  gradeSubmission,
} = require("../controller/assignment");
const {
  createAnnouncement,
  getFacultyAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controller/announcement");
const {
  updateStudentMarks,
  getStudentsForMarks,
} = require("../controller/marks");
const {
  submitFacultyLeaveRequest,
  getFacultyLeaves,
} = require("../controller/leave");

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);

// Profile routes
router.get("/profile", getFacultyProfile);
router.put("/profile/update", updateFacultyProfile);
router.put("/profile/change-password", changeFacultyPassword);

// Attendance routes
router.get("/attendance/classes", getFacultyClasses);
router.get("/attendance/students", getStudentsForAttendance);
router.post("/attendance/take", takeSubjectAttendance);
router.get("/attendance/show", showSubjectAttendance);
router.get("/attendance/detailed", getDetailedAttendance);

// Assignment routes
router.post("/assignments/create", upload.single("file"), createAssignment);
router.get("/assignments", getFacultyAssignments);
router.get("/assignments/:assignmentId/submissions", getAssignmentSubmissions);
router.put("/submissions/:submissionId/grade", gradeSubmission);

// Announcement routes
router.post("/announcements/create", createAnnouncement);
router.get("/announcements", getFacultyAnnouncements);
router.put("/announcements/:announcementId", updateAnnouncement);
router.delete("/announcements/:announcementId", deleteAnnouncement);

// Marks routes
router.get("/marks/students", getStudentsForMarks);
router.put("/marks/:studentId", updateStudentMarks);

// Leave routes
router.post("/leave/request", submitFacultyLeaveRequest);
router.get("/leave", getFacultyLeaves);

// Schedule route
router.get("/schedule", getFacultySchedule);

module.exports = router;
