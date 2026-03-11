import React from "react";
import { FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";

export default function RecentAttendanceLog({ logs = [], darkMode }) {
  if (!logs || logs.length === 0) {
    return (
      <div
        className={`p-6 rounded-2xl transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800/50 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <p
          className={`text-center ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No recent attendance logs available
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-2xl transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="space-y-6">
        {logs.map((log, logIndex) => {
          // Support both 'entries' and 'records' property names
          const entries = log.entries || log.records || [];

          return (
            <div key={logIndex}>
              {/* DATE HEADER */}
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar
                  className={darkMode ? "text-blue-400" : "text-blue-600"}
                />
                <h4
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {log.date}
                </h4>
              </div>

              {/* ATTENDANCE ENTRIES */}
              <div className="space-y-2 ml-6">
                {entries.map((entry, entryIndex) => {
                  const status =
                    entry.status?.toLowerCase() === "present"
                      ? "Present"
                      : "Absent";
                  const subject = entry.subject || entry.subjectCode || "Class";

                  return (
                    <div
                      key={entryIndex}
                      className={`p-3 rounded-lg flex items-center gap-3 transition-colors duration-300 ${
                        darkMode
                          ? "bg-gray-700/30 border border-gray-600"
                          : "bg-slate-50 border border-gray-200"
                      }`}
                    >
                      {/* STATUS ICON */}
                      {status === "Present" ? (
                        <FiCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                      ) : (
                        <FiXCircle className="text-red-500 text-lg flex-shrink-0" />
                      )}

                      {/* CONTENT */}
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {subject}
                        </p>
                      </div>

                      {/* STATUS BADGE */}
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded transition-colors duration-300 ${
                          status === "Present"
                            ? darkMode
                              ? "bg-green-900/50 text-green-300"
                              : "bg-green-100 text-green-700"
                            : darkMode
                            ? "bg-red-900/50 text-red-300"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* DIVIDER */}
              {logIndex < logs.length - 1 && (
                <div
                  className={`my-6 border-t ${
                    darkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
