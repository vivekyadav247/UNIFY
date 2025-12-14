import React from "react";
import StudentRow from "./StudentRow";

export default function StudentTable() {
  const students = [
    {
      name: "Aditi Sharma",
      id: "STU001",
      branch: "CSE",
      email: "aditi@college.com",
      phone: "9876543210",
      gender: "Female",
      attendance: "92%",
      status: "Active"
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1200px] w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-600">
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
            <StudentRow key={i} {...s} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
