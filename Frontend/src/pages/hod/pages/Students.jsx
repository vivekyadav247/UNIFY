import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { hodAPI } from "../../../services/api";

// IMPORT STUDENT COMPONENTS
import StatCard from "../components/StudentCards/StatCard";
import SearchBar from "../components/StudentCards/SearchBar";
import StudentTable from "../components/StudentCards/StudentTable";

export default function Students() {
  const { darkMode } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    avgAttendance: 0,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await hodAPI.getStudents();
      if (response.students) {
        setStudents(response.students);
        setFilteredStudents(response.students);
        calculateStats(response.students);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentList) => {
    const total = studentList.length;
    const active = studentList.filter((s) => s.status !== "inactive").length;
    const onLeave = studentList.filter((s) => s.onLeave).length;

    setStats({
      total,
      active,
      onLeave,
      avgAttendance: 92,
    });
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(
      (student) =>
        student.name?.toLowerCase().includes(query.toLowerCase()) ||
        student.enrollmentNumber?.toLowerCase().includes(query.toLowerCase()) ||
        student.email?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  if (loading) {
    return (
      <div
        className={`p-6 flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Loading students...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 space-y-6 min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* PAGE HEADING */}
      <div>
        <h1
          className={`text-2xl font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Students
        </h1>
        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
          Manage all students information here
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.total}
          darkMode={darkMode}
        />
        <StatCard
          title="Active Students"
          value={stats.active}
          darkMode={darkMode}
        />
        <StatCard title="On Leave" value={stats.onLeave} darkMode={darkMode} />
        <StatCard
          title="Avg Attendance"
          value={`${stats.avgAttendance}%`}
          darkMode={darkMode}
        />
      </div>

      {/* SEARCH BAR */}
      <SearchBar
        placeholder="Search students by name, email, ID..."
        onSearch={handleSearch}
        darkMode={darkMode}
      />

      {/* STUDENTS TABLE */}
      <div
        className={`rounded-xl p-4 shadow-sm border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <StudentTable students={filteredStudents} darkMode={darkMode} />
      </div>
    </div>
  );
}
