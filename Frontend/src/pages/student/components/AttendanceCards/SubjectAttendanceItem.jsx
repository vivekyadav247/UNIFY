import React from "react";

export default function SubjectAttendanceItem({ subject }) {
  const percentage = Math.round((subject.present / subject.total) * 100);

  return (
    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
      <div>
        <h4 className="font-semibold text-lg">{subject.name}</h4>
        <p className="text-gray-500 text-sm">
          {subject.present}/{subject.total} classes
        </p>
      </div>

      <div
        className={`text-lg font-bold ${
          percentage >= 75 ? "text-green-600" : "text-red-600"
        }`}
      >
        {percentage}%
      </div>
    </div>
  );
}
