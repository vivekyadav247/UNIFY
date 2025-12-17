import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Public Pages
import Welcome from "../pages/Welcome";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/NotFound";

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
import TGAttendance from "../pages/tg/pages/Attendance";
import TGMarks from "../pages/tg/pages/Marks";
import TGAssignments from "../pages/tg/pages/Assignments";
import TGFeedback from "../pages/tg/pages/Feedback";
import TGReports from "../pages/tg/pages/Reports";
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
import FacultyReport from "../pages/faculty/pages/Report";
import FacultySchedule from "../pages/faculty/pages/Schedule";
import FacultyAnnouncements from "../pages/faculty/pages/Announcements";

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
        <Route path="attendance" element={<TGAttendance />} />
        <Route path="marks" element={<TGMarks />} />
        <Route path="assignments" element={<TGAssignments />} />
        <Route path="feedback" element={<TGFeedback />} />
        <Route path="reports" element={<TGReports />} />
        <Route path="schedule" element={<TGSchedule />} />
        <Route path="announcements" element={<TGAnnouncements />} />
        <Route path="verify-users" element={<TGVerifyUsers />} />
        <Route path="settings" element={<TGSettings />} />
        <Route path="tg-management" element={<TGManagement />} />
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
        <Route path="report" element={<FacultyReport />} />
        <Route path="schedule" element={<FacultySchedule />} />
        <Route path="announcements" element={<FacultyAnnouncements />} />
      </Route>

      {/* 404 Not Found - Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
