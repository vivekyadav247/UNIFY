import React from "react";
import { useOutletContext } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiBarChart2, FiCalendar } from "react-icons/fi";
import AttendanceOverviewCard from "../components/AttendanceCards/AttendanceOverviewCard";
import MonthlyAttendanceChart from "../components/AttendanceCards/MonthlyAttendanceChart";
import AttendanceDistributionChart from "../components/AttendanceCards/AttendanceDistributionChart";
import SubjectWiseAttendanceList from "../components/AttendanceCards/SubjectWiseAttendanceList";
import RecentAttendanceLog from "../components/AttendanceCards/RecentAttendanceLog";

export default function Attendance() {
  const { darkMode } = useOutletContext();

  const attendanceData = {
    overall: 88,
    totalClasses: 276,
    attended: 243,
    missed: 33,
    trend: [80, 85, 78, 90, 88, 87],
    distribution: {
      present: 88,
      absent: 12,
    },
    subjects: [
      { name: "Mathematics", present: 42, absent: 6, total: 48 },
      { name: "Physics", present: 38, absent: 7, total: 45 },
      { name: "DBMS", present: 36, absent: 8, total: 44 },
      { name: "Operating Systems", present: 40, absent: 5, total: 45 },
      { name: "Computer Networks", present: 42, absent: 4, total: 46 },
    ],
    logs: [
      {
        date: "Saturday, January 18, 2025",
        entries: [
          { subject: "Mathematics", status: "Present" },
          { subject: "Data Structures", status: "Present" },
          { subject: "DBMS", status: "Absent" },
        ]
      },
      {
        date: "Friday, January 17, 2025",
        entries: [
          { subject: "Physics", status: "Present" },
          { subject: "Operating Systems", status: "Present" },
          { subject: "Computer Networks", status: "Present" },
        ]
      }
    ]
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Attendance 📋
        </h1>
        <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Track your class attendance and participation
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Overall Attendance */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/40 hover:border-green-600/60"
            : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60 hover:border-green-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-green-700/40" : "bg-green-200"}`}>
              <FiCheckCircle className={`text-2xl ${darkMode ? "text-green-300" : "text-green-600"}`} />
            </div>
            <span className="text-xs font-semibold text-green-500">+5%</span>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Overall Attendance</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{attendanceData.overall}%</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>This semester</p>
        </div>

        {/* Total Classes */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40 hover:border-blue-600/60"
            : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60 hover:border-blue-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-blue-700/40" : "bg-blue-200"}`}>
              <FiCalendar className={`text-2xl ${darkMode ? "text-blue-300" : "text-blue-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total Classes</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{attendanceData.totalClasses}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Conducted</p>
        </div>

        {/* Classes Attended */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40 hover:border-purple-600/60"
            : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60 hover:border-purple-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-purple-700/40" : "bg-purple-200"}`}>
              <FiCheckCircle className={`text-2xl ${darkMode ? "text-purple-300" : "text-purple-600"}`} />
            </div>
            <span className="text-xs font-semibold text-green-500">Good</span>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Classes Attended</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{attendanceData.attended}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Present</p>
        </div>

        {/* Classes Missed */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/40 hover:border-red-600/60"
            : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/60 hover:border-red-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-red-700/40" : "bg-red-200"}`}>
              <FiXCircle className={`text-2xl ${darkMode ? "text-red-300" : "text-red-600"}`} />
            </div>
            <span className="text-xs font-semibold text-red-500">Alert</span>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Classes Missed</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{attendanceData.missed}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Absent</p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Monthly Trend
          </h2>
          <MonthlyAttendanceChart trend={attendanceData.trend} darkMode={darkMode} />
        </div>

        <div>
          <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Attendance Distribution
          </h2>
          <AttendanceDistributionChart distribution={attendanceData.distribution} darkMode={darkMode} />
        </div>
      </div>

      {/* SUBJECT WISE DETAILS */}
      <div>
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Subject-wise Attendance
        </h2>
        <SubjectWiseAttendanceList subjects={attendanceData.subjects} darkMode={darkMode} />
      </div>

      {/* RECENT LOGS SECTION */}
      <div>
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Recent Attendance Log
        </h2>
        <RecentAttendanceLog logs={attendanceData.logs} darkMode={darkMode} />
      </div>

    </div>
  );
}
