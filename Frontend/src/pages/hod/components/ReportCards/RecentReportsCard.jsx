import React from "react";
import { Download, FileText, Calendar } from "lucide-react";

const reports = [
  {
    title: "Monthly Attendance Report",
    date: "Jan 15, 2025",
    tag: "Attendance",
  },
  {
    title: "End Semester Performance",
    date: "Jan 10, 2025",
    tag: "Academic",
  },
  {
    title: "Faculty Activity Report",
    date: "Jan 8, 2025",
    tag: "Faculty",
  },
  {
    title: "Student Progress Analysis",
    date: "Jan 5, 2025",
    tag: "Academic",
  },
];

export default function RecentReportsCard() {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>

      <div className="space-y-4">
        {reports.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="text-blue-600" />
              </div>

              <div>
                <p className="font-medium">{r.title}</p>

                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {r.date}
                  </span>

                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    {r.tag}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
              <Download size={16} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
