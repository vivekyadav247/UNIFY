import React from "react";
import FacultyRow from "./FacultyRow";

export default function FacultyTable({ faculty = [], darkMode }) {
  if (faculty.length === 0) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        No faculty members found
      </div>
    );
  }

  return (
    <table className="w-full text-left mt-4 border-collapse">
      <thead>
        <tr
          className={`border-b ${
            darkMode
              ? "text-gray-400 border-gray-700"
              : "text-gray-600 border-gray-200"
          }`}
        >
          <th className="py-3 px-2">Faculty</th>
          <th className="px-2">ID</th>
          <th className="px-2">Contact</th>
          <th className="px-2">Designation</th>
          <th className="px-2">Experience</th>
          <th className="px-2">Students</th>
          <th className="px-2">Status</th>
          <th className="px-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {faculty.map((f, index) => (
          <FacultyRow
            key={f._id || index}
            name={f.name}
            dept={f.department}
            id={f.facultyId}
            email={f.email}
            phone={f.phone || "N/A"}
            designation={f.designation || "Faculty"}
            exp={f.experience || "N/A"}
            students={f.studentsCount || 0}
            status={f.onLeave ? "On Leave" : "Active"}
            darkMode={darkMode}
          />
        ))}
      </tbody>
    </table>
  );
}
