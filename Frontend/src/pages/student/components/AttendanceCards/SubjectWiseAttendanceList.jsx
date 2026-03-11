import React from "react";

export default function SubjectWiseAttendanceList({ subjects = [], onSubjectAction, darkMode = false }) {
  return (
    <div
      className={`p-6 rounded-2xl transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="space-y-4">
        {subjects.map((subject, index) => {
          const percentage = subject.total ? Math.round((subject.present / subject.total) * 100) : 0;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700/30 border border-gray-600"
                  : "bg-slate-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {subject.name}
                </h4>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    percentage >= 75
                      ? darkMode
                        ? "bg-green-900/50 text-green-300"
                        : "bg-green-100 text-green-700"
                      : percentage >= 65
                      ? darkMode
                        ? "bg-yellow-900/50 text-yellow-300"
                        : "bg-yellow-100 text-yellow-700"
                      : darkMode
                      ? "bg-red-900/50 text-red-300"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {percentage}%
                </span>
              </div>

              <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}>
                <div
                  className={`h-full transition-all duration-300 ${
                    percentage >= 75 ? "bg-green-500" : percentage >= 65 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex justify-between mt-3 text-sm">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Present:{" "}
                  <span className={`font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                    {subject.present}
                  </span>
                </p>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Absent:{" "}
                  <span className={`font-semibold ${darkMode ? "text-red-400" : "text-red-600"}`}>
                    {subject.absent}
                  </span>
                </p>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Total:{" "}
                  <span className="font-semibold">{subject.total}</span>
                </p>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSubjectAction?.(subject, "present")}
                  aria-label={`Show present details for ${subject.name}`}
                  className="px-3 py-1 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-100 hover:bg-green-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  Present: {subject.present}
                </button>

                <button
                  type="button"
                  onClick={() => onSubjectAction?.(subject, "absent")}
                  aria-label={`Show absent details for ${subject.name}`}
                  className="px-3 py-1 rounded-md bg-red-50 text-red-700 text-sm font-medium border border-red-100 hover:bg-red-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  Absent: {subject.absent}
                </button>

                <button
                  type="button"
                  onClick={() => onSubjectAction?.(subject, "leave")}
                  aria-label={`Show leave details for ${subject.name}`}
                  className="px-3 py-1 rounded-md bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-100 hover:bg-yellow-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-200"
                >
                  Leave: {subject.leave ?? 0}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
