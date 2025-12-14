
import React from "react";
import StatCard from "../components/FacultyCards/StatCard";
import SearchBar from "../components/FacultyCards/SearchBar";
import FacultyTable from "../components/FacultyCards/FacultyTable";

export default function Faculty() {
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-semibold">Faculty</h1>
      <p className="text-gray-500">Welcome back, Dr. Sarah Johnson</p>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Faculty" value="32" />
        <StatCard title="Active" value="28" />
        <StatCard title="On Leave" value="4" />
        <StatCard title="Avg Students/TG" value="26" />
      </div>

      {/* SEARCH BAR */}
      <SearchBar placeholder="Search faculty by name, email, or ID..." />

      {/* TABLE */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <FacultyTable />
      </div>
    </div>
  );
}
