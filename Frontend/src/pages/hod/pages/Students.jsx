import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { hodAPI } from "../../../services/api";
import { FiX, FiMail, FiPhone, FiUser } from "react-icons/fi";

// IMPORT STUDENT COMPONENTS
import StatCard from "../components/StudentCards/StatCard";
import SearchBar from "../components/StudentCards/SearchBar";
import StudentTable from "../components/StudentCards/StudentTable";

export default function Students() {
  const { darkMode } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
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

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
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
        <StudentTableWithClick
          students={filteredStudents}
          darkMode={darkMode}
          onStudentClick={handleStudentClick}
        />
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-xl p-8 w-full max-w-2xl max-h-96 overflow-y-auto ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Student Details</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {selectedStudent.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-sm opacity-70">
                    {selectedStudent.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold opacity-70">
                    Enrollment Number
                  </label>
                  <p className="text-lg">{selectedStudent.enrollmentNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold opacity-70">
                    Semester
                  </label>
                  <p className="text-lg">
                    {selectedStudent.semesterNumber || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold opacity-70">
                    <FiMail className="inline mr-1" />
                    Email
                  </label>
                  <p className="text-lg break-all">{selectedStudent.email}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold opacity-70">
                    <FiPhone className="inline mr-1" />
                    Phone
                  </label>
                  <p className="text-lg">
                    {selectedStudent.mobileNumber || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold opacity-70">
                    <FiUser className="inline mr-1" />
                    Gender
                  </label>
                  <p className="text-lg">{selectedStudent.gender || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold opacity-70">
                    Status
                  </label>
                  <p className="text-lg">
                    {selectedStudent.onLeave ? "On Leave" : "Active"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold opacity-70">
                    Branch
                  </label>
                  <p className="text-lg">{selectedStudent.branch || "N/A"}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold opacity-70">
                    Section
                  </label>
                  <p className="text-lg">{selectedStudent.section || "N/A"}</p>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold opacity-70">
                    Academic Year
                  </label>
                  <p className="text-lg">
                    {selectedStudent.academicYear || "N/A"}
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold opacity-70">
                    Course
                  </label>
                  <p className="text-lg">{selectedStudent.course || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper component for StudentTable with click handler
function StudentTableWithClick({ students, darkMode, onStudentClick }) {
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
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const safeName = student.name || "";
            const initials = safeName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            const statusColor =
              student.onLeave === false
                ? darkMode
                  ? "bg-green-900/30 text-green-400"
                  : "bg-green-100 text-green-700"
                : darkMode
                ? "bg-red-900/30 text-red-400"
                : "bg-red-100 text-red-700";

            return (
              <tr
                key={student._id}
                onClick={() => onStudentClick(student)}
                className={`border-b cursor-pointer ${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-700/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {initials || "?"}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {student.name}
                      </p>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {student.department}
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  className={`px-3 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {student.enrollmentNumber}
                </td>
                <td
                  className={`px-3 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {student.branch || "N/A"}
                </td>
                <td className="px-3">
                  <p
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {student.email}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {student.mobileNumber || "N/A"}
                  </p>
                </td>
                <td
                  className={`px-3 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {student.gender || "N/A"}
                </td>
                <td
                  className={`px-3 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {student.attendancePercentage
                    ? `${student.attendancePercentage}%`
                    : "N/A"}
                </td>
                <td className="px-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                  >
                    {student.onLeave ? "On Leave" : "Active"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
