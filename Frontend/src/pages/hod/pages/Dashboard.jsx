import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiTrendingUp,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import { hodAPI } from "../../../services/api";

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
      const response = await hodAPI.getDashboard();
      setStats(response.summary || {});
      setError(null);
    } catch (err) {
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
                  {stats?.totalStudents || 0}
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
                  {stats?.facultyCount || 0}
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
                  {stats?.avgAttendance || 0}%
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
                  {stats?.pendingTasks || 0}
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
              {stats?.tgActivity && stats.tgActivity.length > 0 ? (
                stats.tgActivity.map((tg, index) => (
                  <TGActivityCard
                    key={index}
                    name={tg.name}
                    students={tg.students}
                    active={tg.active}
                    reports={tg.reports}
                    attendance={tg.attendance}
                    darkMode={darkMode}
                  />
                ))
              ) : (
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  No TG activity available
                </p>
              )}
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
              {stats?.pendingApprovals && stats.pendingApprovals.length > 0 ? (
                stats.pendingApprovals.map((approval, index) => (
                  <ApprovalCard
                    key={index}
                    title={approval.title}
                    name={approval.name}
                    date={approval.date}
                    darkMode={darkMode}
                  />
                ))
              ) : (
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  No pending approvals
                </p>
              )}
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
              {stats?.announcements && stats.announcements.length > 0 ? (
                stats.announcements
                  .slice(0, 2)
                  .map((announcement, index) => (
                    <AnnouncementCard
                      key={index}
                      color={darkMode ? "bg-blue-900/20" : "bg-blue-50"}
                      textColor={darkMode ? "text-blue-300" : "text-blue-900"}
                      heading={announcement.title}
                      text={announcement.content}
                      darkMode={darkMode}
                    />
                  ))
              ) : (
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  No announcements
                </p>
              )}
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
