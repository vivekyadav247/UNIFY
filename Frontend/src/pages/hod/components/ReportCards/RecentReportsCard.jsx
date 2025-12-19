import React from "react";
import { Download, FileText, Calendar } from "lucide-react";

export default function RecentReportsCard({ darkMode, reports = [] }) {
  if (reports.length === 0) {
    return (
      <div
        className={`rounded-2xl border shadow-sm p-6 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h2
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Recent Reports
        </h2>
        <p
          className={`text-center py-8 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No reports generated yet
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border shadow-sm p-6 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-lg font-semibold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Recent Reports
      </h2>

      <div className="space-y-4">
        {reports.map((r, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl p-4 ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  darkMode ? "bg-blue-900/30" : "bg-blue-100"
                }`}
              >
                <FileText className="text-blue-600" />
              </div>

              <div>
                <p
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {r.title}
                </p>

                <div
                  className={`flex items-center gap-3 text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {r.date}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      darkMode
                        ? "bg-blue-900/40 text-blue-300"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {r.tag}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <button
              className={`flex items-center gap-2 border px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? "border-gray-600 hover:bg-gray-600 text-gray-200"
                  : "border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Download size={16} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
