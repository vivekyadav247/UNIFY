import React from "react";

// IMPORT STUDENT COMPONENTS
import StatCard from "../components/StudentCards/StatCard";
import SearchBar from "../components/StudentCards/SearchBar";
import StudentTable from "../components/StudentCards/StudentTable";

export default function Students() {
  return (
    <div className="p-6 space-y-6">

      {/* PAGE HEADING */}
      <div>
        <h1 className="text-2xl font-semibold">Students</h1>
        <p className="text-gray-500">Manage all students information here</p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="245" />
        <StatCard title="Active Students" value="230" />
        <StatCard title="On Leave" value="15" />
        <StatCard title="Avg Attendance" value="92%" />
      </div>

      {/* SEARCH BAR */}
      <SearchBar placeholder="Search students by name, email, ID..." />

      {/* STUDENTS TABLE */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <StudentTable />
      </div>

    </div>
  );
}
