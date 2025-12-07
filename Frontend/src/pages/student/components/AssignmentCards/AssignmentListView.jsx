import React from "react";
import { FiArrowLeft, FiUpload, FiDownload, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function AssignmentListView({ subject, onBack, darkMode }) {
  const getStatusColor = (status, isOverdue) => {
    if (status === "submitted") {
      return darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700";
    }
    if (status === "pending" && isOverdue) {
      return darkMode ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700";
    }
    if (status === "pending") {
      return darkMode ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-700";
    }
    return darkMode ? "bg-gray-700/50 text-gray-300" : "bg-gray-100 text-gray-700";
  };

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { text: `${Math.abs(daysLeft)} days overdue`, isOverdue: true };
    }
    return { text: `${daysLeft} days left`, isOverdue: false };
  };

  return (
    <div className="space-y-6">

      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg transition-all duration-300 ${
            darkMode 
              ? "hover:bg-gray-700 text-gray-300 hover:text-white" 
              : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
          }`}
        >
          <FiArrowLeft className="text-2xl" />
        </button>
        <div>
          <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {subject.name}
          </h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {subject.faculty}
          </p>
        </div>
      </div>

      {/* ASSIGNMENTS LIST */}
      <div className="space-y-4">
        {subject.assignments.map((assignment) => {
          const { text, isOverdue } = getTimeRemaining(assignment.dueDate);
          const statusColor = getStatusColor(assignment.status, isOverdue);

          return (
            <div
              key={assignment.id}
              className={`p-6 rounded-2xl transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-800/50 border border-gray-700 hover:border-gray-600"
                  : "bg-white border border-gray-200 hover:border-gray-300"
              }`}
            >

              {/* TOP SECTION */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                
                {/* LEFT - TITLE & DESCRIPTION */}
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {assignment.title}
                  </h3>
                  <p className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {assignment.description}
                  </p>

                  {/* DUE DATE & TIME */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <FiCalendar className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Due: <strong>{new Date(assignment.dueDate).toLocaleDateString()}</strong>
                      </p>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      isOverdue
                        ? darkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
                        : darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
                    }`}>
                      <FiClock className="text-xs" />
                      {text}
                    </div>
                  </div>
                </div>

                {/* RIGHT - STATUS BADGE */}
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor}`}>
                    {assignment.status === "submitted" ? "SUBMITTED" : isOverdue ? "OVERDUE" : "PENDING"}
                  </span>

                  {/* MARKS IF SUBMITTED */}
                  {assignment.status === "submitted" && assignment.marks !== null && (
                    <div className={`text-center px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700/30" : "bg-slate-100"}`}>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Marks</p>
                      <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {assignment.marks}/{assignment.maxMarks}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* DIVIDER */}
              <div className={`my-4 border-t ${darkMode ? "border-gray-600" : "border-gray-200"}`} />

              {/* BOTTOM SECTION - ACTIONS & INFO */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                {/* SUBMISSION INFO */}
                <div>
                  {assignment.status === "submitted" ? (
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-green-500 text-lg" />
                      <div>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Submitted on
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {new Date(assignment.submissionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : isOverdue ? (
                    <div className="flex items-center gap-2">
                      <FiXCircle className="text-red-500 text-lg" />
                      <div>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Missed deadline
                        </p>
                        <p className={`text-sm font-semibold text-red-500`}>
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FiClock className="text-yellow-500 text-lg" />
                      <div>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Submit by
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
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
          );
        })}
      </div>
    </div>
  );
}