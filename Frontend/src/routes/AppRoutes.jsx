import { Routes, Route } from "react-router-dom";

// Public Pages
import Welcome from "../pages/Welcome";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Student Pages
import StudentLayout from "../pages/student/layouts/StudentLayout";
import Dashboard from "../pages/student/pages/Dashboard";
import Attendance from "../pages/student/pages/Attendance";
import Assignments from "../pages/student/pages/Assignments";
import Marks from "../pages/student/pages/Marks";
import Feedback from "../pages/student/pages/Feedback";
import Profile from "../pages/student/pages/Profile";

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

      {/* ------------------------ STUDENT ROUTES ------------------------ */}
      <Route
        path="/student"
        element={
          <StudentLayout
            toggleTheme={toggleTheme}
            currentTheme={currentTheme}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="marks" element={<Marks />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ------------------------ TG ROUTES ------------------------ */}
      <Route path="/tg" element={<TgLayout />}>
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
      </Route>
    </Routes>
  );
}
