import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import AttendanceOverviewCard from "../components/AttendanceCards/AttendanceOverviewCard";
import MonthlyAttendanceChart from "../components/AttendanceCards/MonthlyAttendanceChart";
import AttendanceDistributionChart from "../components/AttendanceCards/AttendanceDistributionChart";
import SubjectWiseAttendanceList from "../components/AttendanceCards/SubjectWiseAttendanceList";
import RecentAttendanceLog from "../components/AttendanceCards/RecentAttendanceLog";
import { studentAPI } from "../../../services/api";
import { showError } from "../../../utils/notifications";

export default function Attendance() {
  const { darkMode, student } = useOutletContext();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(
    student?.semesterNumber || 1
  );
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    // Generate semester options (1 to current semester)
    const maxSemester = student?.semesterNumber || 1;
    const semesterOptions = Array.from(
      { length: maxSemester },
      (_, i) => i + 1
    );
    setSemesters(semesterOptions);

    // Fetch attendance for current or selected semester
    fetchAttendance(selectedSemester);
  }, [selectedSemester]);

  const fetchAttendance = async (semester) => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await studentAPI.getAttendance({
        semesterNumber: semester,
      });

      // Transform backend response to match component expectations
      const classStats = response.classStats || {};
      const classAtt = response.classAttendance || [];
      const subjectStats = response.subjectStats || {};

      // Group attendance by date for logs
      const attendanceByDate = {};
      classAtt.forEach((att) => {
        const date = new Date(att.date).toISOString().split("T")[0];
        if (!attendanceByDate[date]) {
          attendanceByDate[date] = [];
        }
        attendanceByDate[date].push({
          date: att.date,
          status: att.status,
        });
      });

      const logs = Object.entries(attendanceByDate).map(([date, records]) => ({
        date,
        records,
      }));

      // Transform data for component
      const transformedData = {
        overall: classStats.percentage || 0,
        totalClasses: classStats.total || 0,
        attended: classStats.present || 0,
        missed: classStats.total - (classStats.present || 0) || 0,
        trend: generateTrendData(classAtt),
        distribution: {
          present: classStats.present || 0,
          absent: classStats.total - (classStats.present || 0) || 0,
        },
        subjects: Object.entries(subjectStats).map(([code, stats]) => ({
          code,
          ...stats,
        })),
        logs,
        semester,
      };

      setAttendanceData(transformedData);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch attendance";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Generate trend data from attendance records
  const generateTrendData = (classAtt) => {
    const monthlyData = {};
    classAtt.forEach((att) => {
      const date = new Date(att.date);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, present: 0 };
      }
      monthlyData[monthKey].total++;
      if (att.status === "present") {
        monthlyData[monthKey].present++;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
        }),
        percentage: ((data.present / data.total) * 100).toFixed(0),
      }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-xl ${darkMode ? "text-white" : "text-gray-900"}`}>
          Loading attendance data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={() => fetchAttendance(selectedSemester)}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        No attendance data available
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Attendance
          </h1>
          <p
            className={`mt-2 text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Track your class attendance and participation
          </p>
        </div>

        {/* Semester Selector */}
        <div className="flex flex-col items-end gap-2">
          <label
            className={`text-sm font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Select Semester
          </label>
          <div className="flex gap-2">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg border font-semibold transition-all ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
              } disabled:opacity-50 cursor-pointer`}
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchAttendance(selectedSemester)}
              disabled={refreshing}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              }`}
            >
              <FiRefreshCw
                className={`text-xl ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Attendance */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-linear-to-br from-green-900/30 to-green-800/20 border-green-700/40 hover:border-green-600/60"
              : "bg-linear-to-br from-green-50 to-green-100/50 border-green-200/60 hover:border-green-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-green-700/40" : "bg-green-200"
              }`}
            >
              <FiCheckCircle
                className={`text-2xl ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-green-500">+5%</span>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Overall Attendance
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {attendanceData.overall}%
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            This semester
          </p>
        </div>

        {/* Total Classes */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40 hover:border-blue-600/60"
              : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60 hover:border-blue-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-blue-700/40" : "bg-blue-200"
              }`}
            >
              <FiCalendar
                className={`text-2xl ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              />
            </div>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total Classes
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {attendanceData.totalClasses}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Conducted
          </p>
        </div>

        {/* Classes Attended */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40 hover:border-purple-600/60"
              : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60 hover:border-purple-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-purple-700/40" : "bg-purple-200"
              }`}
            >
              <FiCheckCircle
                className={`text-2xl ${
                  darkMode ? "text-purple-300" : "text-purple-600"
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-green-500">Good</span>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Classes Attended
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {attendanceData.attended}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Present
          </p>
        </div>

        {/* Classes Missed */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/40 hover:border-red-600/60"
              : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/60 hover:border-red-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-red-700/40" : "bg-red-200"
              }`}
            >
              <FiXCircle
                className={`text-2xl ${
                  darkMode ? "text-red-300" : "text-red-600"
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-red-500">Alert</span>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Classes Missed
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {attendanceData.missed}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Absent
          </p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2
            className={`text-xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Monthly Trend
          </h2>
          <MonthlyAttendanceChart
            trend={attendanceData.trend}
            darkMode={darkMode}
          />
        </div>

        <div>
          <h2
            className={`text-xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Attendance Distribution
          </h2>
          <AttendanceDistributionChart
            distribution={attendanceData.distribution}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* SUBJECT WISE DETAILS */}
      <div>
        <h2
          className={`text-xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Subject-wise Attendance
        </h2>
        <SubjectWiseAttendanceList
          subjects={attendanceData.subjects}
          darkMode={darkMode}
        />
      </div>

      {/* RECENT LOGS SECTION */}
      <div>
        <h2
          className={`text-xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Recent Attendance Log
        </h2>
        <RecentAttendanceLog logs={attendanceData.logs} darkMode={darkMode} />
      </div>
    </div>
  );
}
