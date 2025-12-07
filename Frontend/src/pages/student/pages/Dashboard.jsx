import React from "react";
import { useOutletContext } from "react-router-dom";
import { FiTrendingUp, FiBook, FiCheckCircle, FiCalendar, FiBarChart2, FiMessageCircle } from "react-icons/fi";
import AttendanceProgress from "../components/DashboardCards/AttendanceProgress";
import MarksDistribution from "../components/DashboardCards/MarksDistribution";
import AssignmentCardList from "../components/DashboardCards/AssignmentCardList";
import EventCard from "../components/DashboardCards/EventCard";
import FeedbackCard from "../components/DashboardCards/FeedbackCard";

export default function Dashboard() {
  const { darkMode } = useOutletContext();

  const stats = {
    attendance: 88,
    avgMarks: 82.2,
    pending: 2,
    events: 3,
  };

  const marksData = {
    internal: [40, 35, 45, 42, 44],
    external: [85, 80, 90, 72, 80],
  };

  const assignments = [
    { title: "Binary Tree Implementation", subject: "Data Structures", due: "Jan 20", status: "pending" },
    { title: "SQL Query Assignment", subject: "DBMS", due: "Jan 22", status: "pending" },
    { title: "Process Scheduling", subject: "OS", due: "Jan 18", status: "submitted" },
  ];

  const events = [
    { title: "Mid-Semester Exam", date: "Jan 25, 2025" },
    { title: "Tech Fest 2025", date: "Feb 5-7, 2025" },
    { title: "Faculty Meeting", date: "Jan 22, 2025" },
  ];

  const feedback = [
    { by: "Prof. Michael Chen", tag: "Academic", text: "Excellent performance in Data Structures. Keep up the good work!", date: "Jan 15, 2025" },
    { by: "Prof. Michael Chen", tag: "Mentorship", text: "Please focus more on time management for productivity.", date: "Jan 10, 2025" },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Welcome back, Sakshi! 👋
        </h1>
        <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Here's your academic performance overview
        </p>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`
            p-6 rounded-2xl border transition-all duration-300
            ${
              darkMode
                ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40 hover:border-blue-600/60"
                : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60 hover:border-blue-300"
            }
            hover:shadow-lg
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-blue-700/40" : "bg-blue-200"}`}>
              <FiCheckCircle className={`text-2xl ${darkMode ? "text-blue-300" : "text-blue-600"}`} />
            </div>
            <span className="text-xs font-semibold text-green-500">+2%</span>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Attendance</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.attendance}%</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>This month</p>
        </div>

        <div
          className={`
            p-6 rounded-2xl border transition-all duration-300
            ${
              darkMode
                ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40 hover:border-purple-600/60"
                : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60 hover:border-purple-300"
            }
            hover:shadow-lg
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-purple-700/40" : "bg-purple-200"}`}>
              <FiTrendingUp className={`text-2xl ${darkMode ? "text-purple-300" : "text-purple-600"}`} />
            </div>
            <span className="text-xs font-semibold text-green-500">+3.5%</span>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Average Marks</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.avgMarks}%</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Improvement</p>
        </div>

        <div
          className={`
            p-6 rounded-2xl border transition-all duration-300
            ${
              darkMode
                ? "bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700/40 hover:border-orange-600/60"
                : "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/60 hover:border-orange-300"
            }
            hover:shadow-lg
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-orange-700/40" : "bg-orange-200"}`}>
              <FiBook className={`text-2xl ${darkMode ? "text-orange-300" : "text-orange-600"}`} />
            </div>
            <span className="text-xs font-semibold text-red-500">Urgent</span>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Pending</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.pending}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Assignments</p>
        </div>

        <div
          className={`
            p-6 rounded-2xl border transition-all duration-300
            ${
              darkMode
                ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/40 hover:border-green-600/60"
                : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60 hover:border-green-300"
            }
            hover:shadow-lg
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-green-700/40" : "bg-green-200"}`}>
              <FiCalendar className={`text-2xl ${darkMode ? "text-green-300" : "text-green-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Upcoming Events</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.events}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Coming soon</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Attendance Trend
          </h2>
          <AttendanceProgress percent={stats.attendance} trend={[90, 92, 88, 94, 90, 88]} darkMode={darkMode} />
        </div>

        <div>
          <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Marks Distribution
          </h2>
          <MarksDistribution internal={marksData.internal} external={marksData.external} darkMode={darkMode} />
        </div>
      </div>

      {/* ASSIGNMENTS + EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <AssignmentCardList items={assignments} darkMode={darkMode} />
        </div>

        <div>
          <EventCard events={events} darkMode={darkMode} />
        </div>
      </div>

      {/* FEEDBACK - AT THE BOTTOM */}
      <div>
        <FeedbackCard items={feedback} darkMode={darkMode} />
      </div>

    </div>
  );
}
