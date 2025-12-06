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
import Settings from "../pages/student/pages/Settings";

// HOD Pages
import HodLayout from "../pages/hod/layouts/HodLayout";
import HodDashboard from "../pages/hod/pages/Dashboard";
import HodFaculty from "../pages/hod/pages/Faculty";
import HodStudents from "../pages/hod/pages/Students";
import HodAttendance from "../pages/hod/pages/Attendance";
import HodReports from "../pages/hod/pages/Reports";
import HodEvents from "../pages/hod/pages/Events";
import HodSettings from "../pages/hod/pages/Settings";

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

      {/* STUDENT ROUTES */}
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
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* HOD ROUTES */}
      <Route
        path="/hod"
        element={
          <HodLayout
            toggleTheme={toggleTheme}
            currentTheme={currentTheme}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        }
      >
        <Route path="dashboard" element={<HodDashboard />} />
        <Route path="faculty" element={<HodFaculty />} />
        <Route path="students" element={<HodStudents />} />
        <Route path="attendance" element={<HodAttendance />} />
        <Route path="reports" element={<HodReports />} />
        <Route path="events" element={<HodEvents />} />
        <Route path="settings" element={<HodSettings />} />
      </Route>
    </Routes>
  );
}
