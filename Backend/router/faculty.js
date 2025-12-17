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

// Profile routes
router.get("/profile", getFacultyProfile);
router.put("/profile/update", updateFacultyProfile);
router.put("/profile/change-password", changeFacultyPassword);

// Attendance routes
router.get("/attendance/students", getStudentsForAttendance);
router.post("/attendance/take", takeSubjectAttendance);
router.get("/attendance/show", showSubjectAttendance);
router.get("/attendance/detailed", getDetailedAttendance);

// Assignment routes
router.post("/assignments/create", createAssignment);
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

module.exports = router;
