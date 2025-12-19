import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Public Pages
import Welcome from "../pages/Welcome";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/NotFound";

// Admin Pages
import AdminLogin from "../pages/admin/pages/AdminLogin";
import AdminLayout from "../pages/admin/layouts/AdminLayout";
import AdminDashboard from "../pages/admin/pages/AdminDashboard";
import HODManagement from "../pages/admin/pages/HODManagement";
import DepartmentManagement from "../pages/admin/pages/DepartmentManagement";
import CourseManagement from "../pages/admin/pages/CourseManagement";
import BranchManagement from "../pages/admin/pages/BranchManagement";
import SectionManagement from "../pages/admin/pages/SectionManagement";
import AcademicYearManagement from "../pages/admin/pages/AcademicYearManagement";
import SubjectManagement from "../pages/admin/pages/SubjectManagement";

// Student Pages
import StudentLayout from "../pages/student/layouts/StudentLayout";
import Dashboard from "../pages/student/pages/Dashboard";
import Assignments from "../pages/student/pages/Assignments";
import Attendance from "../pages/student/pages/Attendance";
import Marks from "../pages/student/pages/Marks";
import Feedback from "../pages/student/pages/Feedback";
import Announcements from "../pages/student/pages/Announcements";
import Profile from "../pages/student/pages/Profile";
import Settings from "../pages/student/pages/Settings";
import LeaveRequest from "../pages/student/pages/LeaveRequest";

// HOD Pages
import HodLayout from "../pages/hod/layouts/HodLayout";
import HodDashboard from "../pages/hod/pages/Dashboard";
import HodFaculty from "../pages/hod/pages/Faculty";
import HodStudents from "../pages/hod/pages/Students";
import HodSettings from "../pages/hod/pages/Settings";
import HodReports from "../pages/hod/pages/Reports";
import HodEvents from "../pages/hod/pages/Events";

// TG Pages
import TgLayout from "../pages/tg/layouts/TgLayout";
import TGDashboard from "../pages/tg/pages/Dashboard";
import TGMyStudents from "../pages/tg/pages/MyStudents";
import TGStudentDetail from "../pages/tg/pages/StudentDetail";
import TGLeaveRequest from "../pages/tg/pages/LeaveRequest";
import TGAttendance from "../pages/tg/pages/Attendance";
import TGMarks from "../pages/tg/pages/Marks";
import TGAssignments from "../pages/tg/pages/Assignments";
import TGFeedback from "../pages/tg/pages/Feedback";

import TGSchedule from "../pages/tg/pages/Schedule";
import TGAnnouncements from "../pages/tg/pages/Announcements";
import TGVerifyUsers from "../pages/tg/pages/VerifyUsers";
import TGSettings from "../pages/tg/pages/Settings";
import TGManagement from "../pages/hod/pages/TGManagement";

// FACULTY Pages
import FacultyLayout from "../pages/faculty/layouts/FacultyLayout";
import FacultyDashboard from "../pages/faculty/pages/Dashboard";
import FacultyAttendance from "../pages/faculty/pages/Attendance";
import FacultyAssignments from "../pages/faculty/pages/Assignments";
import FacultyLeaveManagement from "../pages/faculty/pages/LeaveManagement";
import FacultySchedule from "../pages/faculty/pages/Schedule";
import FacultyAnnouncements from "../pages/faculty/pages/Announcements";
import FacultyProfile from "../pages/faculty/pages/Profile";
import FacultySettings from "../pages/faculty/pages/Settings";

export default function AppRoutes({
  toggleTheme,
  currentTheme,
  notifications,
  setNotifications,
}) {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Welcome />} />

      {/* Authentication */}
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ------------------------ ADMIN ROUTES ------------------------ */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="hods" element={<HODManagement />} />
        <Route path="departments" element={<DepartmentManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="branches" element={<BranchManagement />} />
        <Route path="sections" element={<SectionManagement />} />
        <Route path="academic-years" element={<AcademicYearManagement />} />
        <Route path="subjects" element={<SubjectManagement />} />
      </Route>

      {/* ------------------------ STUDENT ROUTES ------------------------ */}
      <Route
        path="/:enrollmentNumber"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentLayout
              toggleTheme={toggleTheme}
              currentTheme={currentTheme}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="marks" element={<Marks />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="leave-request" element={<LeaveRequest />} />
      </Route>

      {/* ------------------------ HOD ROUTES ------------------------ */}
      <Route
        path="/hod"
        element={
          <ProtectedRoute requiredRole="hod">
            <HodLayout
              toggleTheme={toggleTheme}
              currentTheme={currentTheme}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<HodDashboard />} />
        <Route path="faculty" element={<HodFaculty />} />
        <Route path="tg-management" element={<TGManagement />} />
        <Route path="students" element={<HodStudents />} />
        <Route path="reports" element={<HodReports />} />
        <Route path="events" element={<HodEvents />} />
        <Route path="settings" element={<HodSettings />} />
      </Route>

      {/* ------------------------ TG ROUTES ------------------------ */}
      <Route
        path="/tg"
        element={
          <ProtectedRoute requiredRole="tg">
            <TgLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TGDashboard />} />
        <Route path="my-students" element={<TGMyStudents />} />
        <Route path="students/:studentId" element={<TGStudentDetail />} />
        <Route path="leave-request" element={<TGLeaveRequest />} />
        <Route path="attendance" element={<TGAttendance />} />
        <Route path="marks" element={<TGMarks />} />
        <Route path="assignments" element={<TGAssignments />} />
        <Route path="feedback" element={<TGFeedback />} />

        <Route path="schedule" element={<TGSchedule />} />
        <Route path="announcements" element={<TGAnnouncements />} />
        <Route path="verify-users" element={<TGVerifyUsers />} />
        <Route path="settings" element={<TGSettings />} />
      </Route>
      {/* ------------------------ FACULTY ROUTES ------------------------ */}

      {/* ------------------------ FACULTY ROUTES ------------------------ */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute requiredRole="faculty">
            <FacultyLayout
              toggleTheme={toggleTheme}
              currentTheme={currentTheme}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="attendance" element={<FacultyAttendance />} />
        <Route path="assignments" element={<FacultyAssignments />} />
        <Route path="leave-management" element={<FacultyLeaveManagement />} />
        <Route path="schedule" element={<FacultySchedule />} />
        <Route path="announcements" element={<FacultyAnnouncements />} />
        <Route path="profile" element={<FacultyProfile />} />
        <Route path="settings" element={<FacultySettings />} />
      </Route>

      {/* 404 Not Found - Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
