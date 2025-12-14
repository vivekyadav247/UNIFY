
import React from "react";
import FacultyRow from "./FacultyRow";

export default function FacultyTable() {
  const facultyList = [
    {
      name: "Prof. Michael Chen",
      dept: "Computer Science",
      id: "FAC001",
      email: "mchen@college.edu",
      phone: "+1 234-567-8901",
      designation: "Professor",
      exp: "15 years",
      students: 25,
      status: "Active",
    },
    {
      name: "Dr. Sarah Miller",
      dept: "Computer Science",
      id: "FAC002",
      email: "smiller@college.edu",
      phone: "+1 234-567-8902",
      designation: "Associate Professor",
      exp: "12 years",
      students: 28,
      status: "Active",
    },
    {
      name: "Prof. James Wilson",
      dept: "Computer Science",
      id: "FAC003",
      email: "jwilson@college.edu",
      phone: "+1 234-567-8903",
      designation: "Assistant Professor",
      exp: "8 years",
      students: 23,
      status: "Active",
    },
    {
      name: "Dr. Emily Brown",
      dept: "Computer Science",
      id: "FAC004",
      email: "ebrown@college.edu",
      phone: "+1 234-567-8904",
      designation: "Professor",
      exp: "18 years",
      students: 30,
      status: "On Leave",
    },
  ];

  return (
    <table className="w-full text-left mt-4 border-collapse">
      <thead>
        <tr className="text-gray-600 border-b">
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
        {facultyList.map((f, index) => (
          <FacultyRow key={index} {...f} />
        ))}
      </tbody>
    </table>
  );
}
