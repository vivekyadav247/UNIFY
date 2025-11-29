
import React from "react";

export default function SubjectWiseAttendanceList({ subjects }) {
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
