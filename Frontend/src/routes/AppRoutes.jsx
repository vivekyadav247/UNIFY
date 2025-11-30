import React from "react";
import { Routes, Route } from "react-router-dom";

import Welcome from "../pages/Welcome";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RoleSelection from "../pages/auth/RoleSelection";

// Future dashboards (we'll implement later)
// import StudentDashboard from "../pages/dashboards/StudentDashboard";
// import HodDashboard from "../pages/dashboards/HodDashboard";
// import TgDashboard from "../pages/dashboards/TgDashboard";
// import FacultyDashboard from "../pages/dashboards/FacultyDashboard";

const AppRoutes = () => {
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
    </Routes>
  );
};

export default AppRoutes;
