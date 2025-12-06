import React from "react";

export default function HodAttendance() {
  const sample = [
    { name: "CS101 - Data Structures", present: 28, total: 30 },
    { name: "CS102 - Algorithms", present: 25, total: 30 },
    { name: "CS201 - DBMS", present: 27, total: 30 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold">Attendance</h2>
      <p className="text-gray-600 mb-6">Department attendance overview</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sample.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold">{s.name}</h3>
            <p className="text-sm text-gray-500">{s.present}/{s.total} present</p>
            <div className="w-full h-3 bg-gray-200 rounded-full mt-3 overflow-hidden">
              <div
                className="h-3 rounded-full"
                style={{ width: `${Math.round((s.present / s.total) * 100)}%`, backgroundColor: "#16A34A" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
