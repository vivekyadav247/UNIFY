import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiTrendingUp,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

import StatCard from "../components/DashboardCards/StatsCard";
import GraphCard from "../components/DashboardCards/GraphCard";
import TGActivityCard from "../components/DashboardCards/TGActivityCard";
import ApprovalCard from "../components/DashboardCards/ApprovalCard";
import AnnouncementCard from "../components/DashboardCards/AnnouncementCard";
import QuickActionsCard from "../components/DashboardCards/QuickActionCard";
import AttendanceChart from "../components/DashboardCards/AttendanceChart";
import PerformanceChart from "../components/DashboardCards/PerformanceChart";

export default function HodDashboard() {
  const { darkMode } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/hod/dashboard",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setStats(data.summary || {});
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="animate-spin text-4xl text-blue-600" />
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Dashboard
          </h1>
          <p
            className={`text-sm mt-2 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Welcome back, HOD. Here's an overview of your department.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`p-4 rounded-lg border ${
              darkMode
                ? "bg-red-900/20 border-red-700 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <p className="font-semibold">Error loading dashboard data</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className={`p-6 rounded-2xl border transition-all ${
              darkMode
                ? "bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 hover:border-blue-600/50"
                : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    darkMode ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  Total Students
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats?.totalStudents || "485"}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  ↑ +12 this month
                </p>
              </div>
              <div className="text-4xl text-blue-600">
                <FiUsers />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl border transition-all ${
              darkMode
                ? "bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/30 hover:border-green-600/50"
                : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 hover:border-green-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    darkMode ? "text-green-300" : "text-green-600"
                  }`}
                >
                  Faculty Members
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats?.facultyCount || "32"}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  ↑ +2 this month
                </p>
              </div>
              <div className="text-4xl text-green-600">
                <FiUserCheck />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl border transition-all ${
              darkMode
                ? "bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 hover:border-purple-600/50"
                : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 hover:border-purple-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    darkMode ? "text-purple-300" : "text-purple-600"
                  }`}
                >
                  Avg Attendance
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats?.avgAttendance || "84"}%
                </p>
                <p
                  className={`text-xs mt-2 ${
                    darkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  ↑ +3% from last month
                </p>
              </div>
              <div className="text-4xl text-purple-600">
                <FiTrendingUp />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl border transition-all ${
              darkMode
                ? "bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-700/30 hover:border-orange-600/50"
                : "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 hover:border-orange-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    darkMode ? "text-orange-300" : "text-orange-600"
                  }`}
                >
                  Pending Tasks
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats?.pendingTasks || "8"}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  ⚠️ 3 urgent
                </p>
              </div>
              <div className="text-4xl text-orange-600">
                <FiAlertCircle />
              </div>
            </div>
          </div>
        </div>

        {/* GRAPH SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <div
            className={`rounded-2xl border p-6 transition-all ${
              darkMode
                ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Department Attendance Trend
            </h3>
            <AttendanceChart darkMode={darkMode} />
          </div>

          {/* Performance Chart */}
          <div
            className={`rounded-2xl border p-6 transition-all ${
              darkMode
                ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Average Performance by Year
            </h3>
            <PerformanceChart darkMode={darkMode} />
          </div>
        </div>

        {/* TG ACTIVITY + APPROVALS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TG ACTIVITY */}
          <div
            className={`rounded-2xl border p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Teacher Guardian Activity
            </h3>

            <div className="space-y-4">
              <TGActivityCard
                name="Prof. Michael Chen"
                students="25"
                reports="18"
                attendance="92%"
                darkMode={darkMode}
              />
              <TGActivityCard
                name="Dr. Sarah Miller"
                students="28"
                reports="22"
                attendance="88%"
                darkMode={darkMode}
              />
              <TGActivityCard
                name="Prof. James Wilson"
                students="23"
                reports="20"
                attendance="95%"
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* APPROVALS */}
          <div
            className={`rounded-2xl border p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Pending Approvals
            </h3>

            <div className="space-y-4">
              <ApprovalCard
                title="Leave Request"
                name="Prof. Michael Chen"
                date="Jan 15-17"
                darkMode={darkMode}
              />
              <ApprovalCard
                title="Report Submission"
                name="Dr. Sarah Miller"
                date="Jan 10"
                darkMode={darkMode}
              />
              <ApprovalCard
                title="Budget Request"
                name="Prof. James Wilson"
                date="Jan 12"
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>

        {/* ANNOUNCEMENTS + QUICK ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements */}
          <div
            className={`rounded-2xl border p-6 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Department Announcements
            </h3>

            <div className="space-y-4">
              <AnnouncementCard
                color={darkMode ? "bg-blue-900/20" : "bg-blue-50"}
                textColor={darkMode ? "text-blue-300" : "text-blue-900"}
                heading="Faculty Meeting - Jan 20, 2025"
                text="All faculty members are requested to attend the monthly review meeting at 3 PM."
                darkMode={darkMode}
              />

              <AnnouncementCard
                color={darkMode ? "bg-green-900/20" : "bg-green-50"}
                textColor={darkMode ? "text-green-300" : "text-green-900"}
                heading="Exam Schedule Released"
                text="End semester examination schedule has been published on the portal."
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <QuickActionsCard darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
