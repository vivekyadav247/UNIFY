
import { Routes, Route } from "react-router-dom";

// Public Pages
import Welcome from "../pages/Welcome";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

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
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
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
