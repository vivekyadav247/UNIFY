
import React from "react";

export default function SubjectWiseAttendanceList({ subjects, onSubjectAction }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Subject-wise Attendance
      </h2>

      <div className="space-y-6">
        {subjects.map((item, index) => {
          const percentage = ((item.present / item.total) * 100).toFixed(1);

          return (
            <div
              key={index}
              className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                {/* Subject Name */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>

                {/* Percentage Badge */}
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "rgba(34,197,94,0.15)",
                    color: "#16A34A",
                  }}
                >
                  {percentage}%
                </span>
              </div>

              {/* Present - Absent - Total */}
              <div className="grid grid-cols-3 text-sm mt-3 text-gray-700">
                <p>
                  <span className="font-medium">Present</span>
                  <br />
                  {item.present}
                </p>

                <p>
                  <span className="font-medium">Absent</span>
                  <br />
                  {item.absent}
                </p>

                <p className="text-right">
                  <span className="font-medium">Total</span>
                  <br />
                  {item.total}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-300 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: "#000", // Black bar like UI
                  }}
                />
              </div>

              {/* Action Buttons: Present / Absent / Leave (moved below progress bar) */}
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSubjectAction?.(item, "present")}
                  aria-label={`Show present details for ${item.name}`}
                  className="px-3 py-1 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-100 hover:bg-green-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-200"
                >
                  Present: {item.present}
                </button>

                <button
                  type="button"
                  onClick={() => onSubjectAction?.(item, "absent")}
                  aria-label={`Show absent details for ${item.name}`}
                  className="px-3 py-1 rounded-md bg-red-50 text-red-700 text-sm font-medium border border-red-100 hover:bg-red-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  Absent: {item.absent}
                </button>

                <button
                  type="button"
                  onClick={() => onSubjectAction?.(item, "leave")}
                  aria-label={`Show leave details for ${item.name}`}
                  className="px-3 py-1 rounded-md bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-100 hover:bg-yellow-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-200"
                >
                  Leave: {item.leave ?? 0}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
