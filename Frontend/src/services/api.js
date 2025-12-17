import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login if needed
      window.location.href = "/login";
    }
    throw error;
  }
);

// ============ STUDENT API ============
export const studentAPI = {
  // Profile
  getProfile: () => axiosInstance.get("/student/profile"),
  updateProfile: (data) => axiosInstance.put("/student/profile/update", data),
  completeProfile: (data) =>
    axiosInstance.put("/student/profile/complete", data),
  changePassword: (data) =>
    axiosInstance.put("/student/profile/change-password", data),

  // Attendance
  getAttendance: (filters = {}) =>
    axiosInstance.get("/student/attendance", { params: filters }),

  // Leave
  applyLeave: (data) => axiosInstance.post("/student/leave/apply", data),
  getLeaves: () => axiosInstance.get("/student/leave"),
  submitLeaveRequest: (data) =>
    axiosInstance.post("/student/leave/request", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Assignments
  getAssignments: (filters = {}) =>
    axiosInstance.get("/student/assignments", { params: filters }),
  getAssignmentDetails: (id) => axiosInstance.get(`/student/assignments/${id}`),
  submitAssignment: (data) =>
    axiosInstance.post("/student/assignments/submit", data),

  // Announcements
  getAnnouncements: (filters = {}) =>
    axiosInstance.get("/student/announcements", { params: filters }),
  getAnnouncementDetails: (id) =>
    axiosInstance.get(`/student/announcements/${id}`),

  // Feedback
  submitFeedback: (data) =>
    axiosInstance.post("/student/feedback/submit", data),
  getFeedback: (filters = {}) =>
    axiosInstance.get("/student/feedback", { params: filters }),
  updateFeedback: (feedbackId, data) =>
    axiosInstance.put(`/student/feedback/${feedbackId}`, data),

  // Marks
  getMarks: (filters = {}) =>
    axiosInstance.get("/student/marks", { params: filters }),
  getSubjectMarks: (subjectId) =>
    axiosInstance.get(`/student/marks/${subjectId}`),
};

// ============ FACULTY API ============
export const facultyAPI = {
  // Profile
  getProfile: () => axiosInstance.get("/faculty/profile"),
  updateProfile: (data) => axiosInstance.put("/faculty/profile/update", data),
  changePassword: (data) =>
    axiosInstance.put("/faculty/profile/change-password", data),

  // Attendance
  getStudentsForAttendance: () =>
    axiosInstance.get("/faculty/attendance/students"),
  takeAttendance: (data) =>
    axiosInstance.post("/faculty/attendance/take", data),
  showAttendance: () => axiosInstance.get("/faculty/attendance/show"),
  getDetailedAttendance: () =>
    axiosInstance.get("/faculty/attendance/detailed"),

  // Assignments
  createAssignment: (data) =>
    axiosInstance.post("/faculty/assignments/create", data),
  getAssignments: () => axiosInstance.get("/faculty/assignments"),
  getAssignmentSubmissions: (assignmentId) =>
    axiosInstance.get(`/faculty/assignments/${assignmentId}/submissions`),
  gradeSubmission: (submissionId, data) =>
    axiosInstance.put(`/faculty/submissions/${submissionId}/grade`, data),

  // Announcements
  createAnnouncement: (data) =>
    axiosInstance.post("/faculty/announcements/create", data),
  getAnnouncements: () => axiosInstance.get("/faculty/announcements"),
  updateAnnouncement: (announcementId, data) =>
    axiosInstance.put(`/faculty/announcements/${announcementId}`, data),
  deleteAnnouncement: (announcementId) =>
    axiosInstance.delete(`/faculty/announcements/${announcementId}`),

  // Marks
  getStudentsForMarks: (branch, section, semester) =>
    axiosInstance.get("/faculty/marks/students", {
      params: { branch, section, semester },
    }),
  updateStudentMarks: (studentId, data) =>
    axiosInstance.put(`/faculty/marks/${studentId}`, data),
};

// ============ HOD API ============
export const hodAPI = {
  // Profile
  getProfile: () => axiosInstance.get("/hod/profile"),
  updateProfile: (data) => axiosInstance.put("/hod/profile", data),
  changePassword: (data) => axiosInstance.put("/hod/change-password", data),

  // TG Management
  createTG: (data) => axiosInstance.post("/hod/create-tg", data),
  editTG: (tgId, data) => axiosInstance.put(`/hod/edit-tg/${tgId}`, data),
  resetTGPassword: (tgId, data) =>
    axiosInstance.put(`/hod/reset-tg-password/${tgId}`, data),
  deleteTG: (tgId) => axiosInstance.delete(`/hod/delete-tg/${tgId}`),

  // Faculty Management
  createFaculty: (data) => axiosInstance.post("/hod/create-faculty", data),
  editFaculty: (facultyId, data) =>
    axiosInstance.put(`/hod/edit-faculty/${facultyId}`, data),
  resetFacultyPassword: (facultyId, data) =>
    axiosInstance.put(`/hod/reset-faculty-password/${facultyId}`, data),
  deleteFaculty: (facultyId) =>
    axiosInstance.delete(`/hod/delete-faculty/${facultyId}`),

  // Subject Management
  createSubject: (data) => axiosInstance.post("/hod/subject", data),
  assignFaculty: (data) => axiosInstance.post("/hod/assign-faculty", data),

  // Semester Management
  startSemester: (data) => axiosInstance.post("/hod/semester/start", data),
  endSemester: (data) => axiosInstance.post("/hod/semester/end", data),
  listSemesters: () => axiosInstance.get("/hod/semester/list"),
};

// ============ AUTH API ============
export const authAPI = {
  sendOtp: (data) => axiosInstance.post("/auth/send-otp", data),
  verifyOtp: (data) => axiosInstance.post("/auth/verify-otp", data),
  register: (data) => axiosInstance.post("/auth/signup", data),
  login: (data) => axiosInstance.post("/auth/signin", data),
  logout: () => axiosInstance.get("/auth/logout"),
  sendForgotPasswordOtp: (email, enrollmentNumber) =>
    axiosInstance.post("/auth/forgot-password", { email, enrollmentNumber }),
  resetPassword: (email, otp, newPassword) =>
    axiosInstance.post("/auth/reset-password", { email, otp, newPassword }),
  resendOtp: (email) => axiosInstance.post("/auth/resend-otp", { email }),
};

// ============ TG API ============
export const tgAPI = {
  // Profile
  getProfile: () => axiosInstance.get("/tg/profile"),
  updateProfile: (data) => axiosInstance.put("/tg/profile/update", data),
  changePassword: (data) =>
    axiosInstance.put("/tg/profile/change-password", data),

  // Attendance
  getAttendanceDashboard: () => axiosInstance.get("/tg/attendance/dashboard"),
  getStudentsForAttendance: () => axiosInstance.get("/tg/attendance/students"),
  takeAttendance: (data) => axiosInstance.post("/tg/attendance/take", data),
  getAttendanceRecords: () => axiosInstance.get("/tg/attendance/records"),
  getStudentsAtRisk: () => axiosInstance.get("/tg/attendance/at-risk"),
  sendLowAttendanceEmail: (data) =>
    axiosInstance.post("/tg/attendance/send-email", data),
  sendLowAttendanceWhatsApp: (data) =>
    axiosInstance.post("/tg/attendance/send-whatsapp", data),

  // Student Management
  getUnverifiedStudents: () => axiosInstance.get("/tg/students/unverified"),
  verifyStudent: (studentId, data) =>
    axiosInstance.put(`/tg/verify-student/${studentId}`, data),
  getAllStudents: () => axiosInstance.get("/tg/students/all"),
  getStudentMarks: (id) => axiosInstance.get(`/tg/students/${id}/marks`),
  getStudentAttendance: (id) =>
    axiosInstance.get(`/tg/students/${id}/attendance`),

  // Leave Management
  approveLeave: (data) => axiosInstance.post("/tg/leave/approve", data),
  rejectLeave: (data) => axiosInstance.post("/tg/leave/reject", data),
};

// ============ ADMIN API ============
export const adminAPI = {
  getProfile: () => axiosInstance.get("/admin/profile"),
  getAllUsers: (role = "", page = 1, limit = 10) =>
    axiosInstance.get("/admin/users", { params: { role, page, limit } }),
  createUser: (data) => axiosInstance.post("/admin/users", data),
  updateUser: (id, data) => axiosInstance.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  getAllFeedback: (targetType = "", status = "", page = 1, limit = 10) =>
    axiosInstance.get("/feedback/all", {
      params: { targetType, status, page, limit },
    }),
  updateFeedbackStatus: (id, data) =>
    axiosInstance.put(`/feedback/${id}/status`, data),
};

// ============ FILE UPLOAD API ============
export const fileAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
  },
};

export default {
  studentAPI,
  facultyAPI,
  hodAPI,
  authAPI,
  tgAPI,
  adminAPI,
  fileAPI,
};
