import React from "react";

export default function RecentAttendanceLog({ logs }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h3 className="text-xl font-bold">Recent Logs</h3>

      {logs.map((log, i) => (
        <div key={i}>
          <p className="font-semibold mb-2">{log.date}</p>

          <div className="grid gap-3">
            {log.entries.map((entry, index) => (
              <div
                key={index}
                className="flex justify-between bg-gray-100 p-3 rounded-lg"
              >
                <span>{entry.subject}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    entry.status === "Present"
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
