import React from "react";
import { FiDownload, FiUpload, FiCalendar, FiFileText } from "react-icons/fi";

export default function AssignmentDetailCard({ assignment, darkMode }) {
  const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === "pending";
  const daysLeft = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`p-6 rounded-2xl transition-colors duration-300 ${
      darkMode 
        ? "bg-gray-800/50 border border-gray-700 hover:border-gray-600" 
        : "bg-white border border-gray-200 hover:border-gray-300"
    }`}>
      
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

        {/* LEFT SECTION */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
              <FiFileText className={`text-2xl ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {assignment.title}
              </h3>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {assignment.subject}
              </p>
            </div>
          </div>

          <p className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {assignment.description}
          </p>

          {/* DUE DATE */}
          <div className="flex items-center gap-2 mb-4">
            <FiCalendar className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`} />
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Due: <strong>{new Date(assignment.dueDate).toLocaleDateString()}</strong>
              {assignment.status === "pending" && (
                <span className={`ml-2 ${isOverdue ? "text-red-500" : "text-green-500"}`}>
                  {isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `${daysLeft} days left`}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col items-end gap-4">

          {/* STATUS BADGE */}
          <span className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
            assignment.status === "pending"
              ? isOverdue
                ? darkMode ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700"
                : darkMode ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-700"
              : assignment.status === "submitted"
              ? darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
              : darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
          }`}>
            {assignment.status === "pending" ? (isOverdue ? "OVERDUE" : "PENDING") : assignment.status.toUpperCase()}
          </span>

          {/* MARKS */}
          {assignment.marks !== null && (
            <div className={`text-center px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700/30" : "bg-slate-100"}`}>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Marks</p>
              <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {assignment.marks}/{assignment.maxMarks}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-2">
            {assignment.status === "pending" && (
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                darkMode 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}>
                <FiUpload className="text-lg" />
                Upload
              </button>
            )}
            {assignment.file && (
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                darkMode 
                  ? "border border-gray-600 text-white hover:bg-gray-700" 
                  : "border border-gray-300 text-gray-900 hover:bg-gray-100"
              }`}>
                <FiDownload className="text-lg" />
                Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}