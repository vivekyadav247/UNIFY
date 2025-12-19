const router = require("express").Router();
const {
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
  completeStudentProfile,
  getMyClassTeacher,
} = require("../controller/student");
const { getStudentAttendance } = require("../controller/attendance");
const { attendanceBySemester } = require("../controller/semester");
const {
  applyLeave,
  getMyLeaves,
  submitLeaveRequest,
} = require("../controller/leave");
const {
  getStudentAssignments,
  getAssignmentDetails,
  submitAssignment,
} = require("../controller/assignment");
const {
  getStudentAnnouncements,
  getAnnouncementDetails,
} = require("../controller/announcement");
const {
  submitFeedback,
  getStudentFeedback,
  updateFeedback,
} = require("../controller/feedback");
const {
  getStudentMarks,
  getSubjectMarks,
  updateMidSemMarks,
} = require("../controller/marks");

// Profile routes
router.get("/profile", getStudentProfile);
router.put("/profile/update", updateStudentProfile);
router.put("/profile/complete", completeStudentProfile);
router.put("/profile/change-password", changeStudentPassword);

// Class Teacher (TG) info
router.get("/class-teacher", getMyClassTeacher);

// Attendance routes
router.get("/attendance", getStudentAttendance);
router.get("/semester/:semesterNumber/attendance", attendanceBySemester);

// Leave routes
router.post("/leave/apply", applyLeave);
router.post("/leave/request", submitLeaveRequest);
router.get("/leave", getMyLeaves);

// Assignment routes
router.get("/assignments", getStudentAssignments);
router.get("/assignments/:assignmentId", getAssignmentDetails);
router.post("/assignments/submit", submitAssignment);

// Announcement routes
router.get("/announcements", getStudentAnnouncements);
router.get("/announcements/:announcementId", getAnnouncementDetails);

// Feedback routes
router.post("/feedback/submit", submitFeedback);
router.get("/feedback", getStudentFeedback);
router.put("/feedback/:feedbackId", updateFeedback);

// Marks routes
router.get("/marks", getStudentMarks);
router.get("/marks/:subjectId", getSubjectMarks);
router.put("/marks/:studentId/midsem", updateMidSemMarks);

module.exports = router;
