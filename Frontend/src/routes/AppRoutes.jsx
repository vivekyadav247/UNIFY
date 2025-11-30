
import { Routes, Route } from "react-router-dom";

// Public Pages
import Welcome from "../pages/Welcome";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RoleSelection from "../pages/auth/RoleSelection";

// Future dashboards (we'll implement later)
// import StudentDashboard from "../pages/dashboards/StudentDashboard";
// import HodDashboard from "../pages/dashboards/HodDashboard";
// import TgDashboard from "../pages/dashboards/TgDashboard";
// import FacultyDashboard from "../pages/dashboards/FacultyDashboard";

// Student
import StudentLayout from "../pages/student/layouts/StudentLayout";
import Dashboard from "../pages/student/pages/Dashboard";
import Attendance from "../pages/student/pages/Attendance";
import Assignments from "../pages/student/pages/Assignments";
import Marks from "../pages/student/pages/Marks";
import Feedback from "../pages/student/pages/Feedback";

export default function AppRoutes({ toggleTheme, currentTheme, notifications, setNotifications }) {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Welcome />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/select-role" element={<RoleSelection />} />
      <Route path="/register" element={<Register />} /> {/* role determined via query param */}

      {/* Dashboards
      <Route path="/dashboard/student" element={<StudentDashboard />} />
      <Route path="/dashboard/hod" element={<HodDashboard />} />
      <Route path="/dashboard/tg" element={<TgDashboard />} />
      <Route path="/dashboard/faculty" element={<FacultyDashboard />} /> */}
      <Route path="/register" element={<Register />} />

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
      </Route>
    </Routes>
  );
}
