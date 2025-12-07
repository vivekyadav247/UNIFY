import React from "react";

export default function AssignmentCardList({ items, darkMode }) {
  return (
    <div
      className={`p-6 rounded-xl transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700"
          : "bg-white border border-gray-200"
      } shadow`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className={`text-lg font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Assignments
        </h3>
        <span
          className={`text-sm px-3 py-1 rounded transition-colors duration-300 ${
            darkMode
              ? "bg-blue-900/50 text-blue-300"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {items.filter((i) => i.status === "pending").length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {items.map((a, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl transition-colors duration-300 flex flex-col gap-3 ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <div className="flex justify-between">
              <div>
                <h4
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {a.title}
                </h4>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-slate-500"
                  }`}
                >
                  {a.subject}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-500" : "text-slate-400"
                  }`}
                >
                  Due: {a.due}
                </p>
              </div>

              <span
                className={`px-2 py-1 h-fit text-xs rounded transition-colors duration-300 ${
                  a.status === "pending"
                    ? darkMode
                      ? "bg-yellow-900/50 text-yellow-300"
                      : "bg-yellow-100 text-yellow-700"
                    : darkMode
                    ? "bg-green-900/50 text-green-300"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {a.status}
              </span>
            </div>

            {a.status === "pending" ? (
              <button
                className={`py-2 rounded transition-all duration-300 font-medium ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Upload Assignment
              </button>
            ) : (
              <button
                className={`py-2 rounded transition-all duration-300 font-medium ${
                  darkMode
                    ? "border border-gray-600 text-white hover:bg-gray-700"
                    : "border border-gray-300 text-gray-900 hover:bg-gray-100"
                }`}
              >
                Download Submission
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
