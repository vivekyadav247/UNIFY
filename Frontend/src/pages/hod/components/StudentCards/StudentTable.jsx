import React from "react";
import StudentRow from "./StudentRow";

export default function StudentTable({ students = [], darkMode }) {
  if (students.length === 0) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        No students found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1200px] w-full text-left border-collapse">
        <thead>
          <tr
            className={`border-b ${
              darkMode
                ? "text-gray-400 border-gray-700"
                : "text-gray-600 border-gray-200"
            }`}
          >
            <th className="px-3 py-3">Student</th>
            <th className="px-3">ID</th>
            <th className="px-3">Branch</th>
            <th className="px-3">Contact</th>
            <th className="px-3">Gender</th>
            <th className="px-3">Attendance</th>
            <th className="px-3">Status</th>
            <th className="px-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <StudentRow
              key={s._id || i}
              name={s.name}
              id={s.enrollmentNumber}
              branch={s.department}
              email={s.email}
              phone={s.phone || "N/A"}
              gender={s.gender || "N/A"}
              attendance={
                s.attendancePercentage ? `${s.attendancePercentage}%` : "N/A"
              }
              status={s.onLeave ? "On Leave" : "Active"}
              darkMode={darkMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
