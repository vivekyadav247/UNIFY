import React from "react";
import { FiBookOpen, FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";

export default function SubjectAssignmentCard({ subject, onClick, darkMode }) {
  const pendingCount = subject.assignments.filter(a => a.status === "pending").length;
  const submittedCount = subject.assignments.filter(a => a.status === "submitted").length;
  const totalCount = subject.assignments.length;

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700 hover:border-blue-600 hover:shadow-lg"
          : "bg-white border border-gray-200 hover:border-blue-600 hover:shadow-lg"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
            <FiBookOpen className={`text-2xl ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {subject.name}
            </h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {subject.faculty}
            </p>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-3 gap-3">

        {/* Total Assignments */}
        <div className={`p-3 rounded-lg text-center ${
          darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"
        }`}>
          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total</p>
          <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {totalCount}
          </p>
        </div>

        {/* Pending Assignments */}
        <div className={`p-3 rounded-lg text-center ${
          pendingCount > 0
            ? darkMode ? "bg-yellow-900/30 border border-yellow-600" : "bg-yellow-50 border border-yellow-200"
            : darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"
        }`}>
          <p className={`text-xs ${
            pendingCount > 0
              ? darkMode ? "text-yellow-400" : "text-yellow-600"
              : darkMode ? "text-gray-400" : "text-gray-600"
          }`}>Pending</p>
          <p className={`text-2xl font-bold ${
            pendingCount > 0
              ? darkMode ? "text-yellow-300" : "text-yellow-600"
              : darkMode ? "text-white" : "text-gray-900"
          }`}>
            {pendingCount}
          </p>
        </div>

        {/* Submitted Assignments */}
        <div className={`p-3 rounded-lg text-center ${
          submittedCount > 0
            ? darkMode ? "bg-green-900/30 border border-green-600" : "bg-green-50 border border-green-200"
            : darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"
        }`}>
          <p className={`text-xs ${
            submittedCount > 0
              ? darkMode ? "text-green-400" : "text-green-600"
              : darkMode ? "text-gray-400" : "text-gray-600"
          }`}>Submitted</p>
          <p className={`text-2xl font-bold ${
            submittedCount > 0
              ? darkMode ? "text-green-300" : "text-green-600"
              : darkMode ? "text-white" : "text-gray-900"
          }`}>
            {submittedCount}
          </p>
        </div>
      </div>

      {/* ALERT BANNER */}
      {pendingCount > 0 && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
          darkMode ? "bg-yellow-900/20 border border-yellow-700/30" : "bg-yellow-50 border border-yellow-200"
        }`}>
          <FiAlertCircle className={`${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
          <p className={`text-sm font-medium ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}>
            {pendingCount} assignment{pendingCount !== 1 ? "s" : ""} pending
          </p>
        </div>
      )}
    </div>
  );
}