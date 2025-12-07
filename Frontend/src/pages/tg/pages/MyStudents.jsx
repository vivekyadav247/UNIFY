import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FiSearch, FiMoreVertical } from "react-icons/fi";

export default function MyStudents() {
  const { darkMode } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedClasses, setAssignedClasses] = useState([]);

  // Mock data for testing
  useEffect(() => {
    setAssignedClasses([
      { _id: "1", branch: "CSE", course: "Data Structures" },
      { _id: "2", branch: "CSE", course: "Web Development" },
    ]);

    setStudents([
      {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        rollNo: "21001",
        branch: "CSE",
        course: "Data Structures",
        status: "active",
      },
      {
        _id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        rollNo: "21002",
        branch: "CSE",
        course: "Data Structures",
        status: "active",
      },
      {
        _id: "3",
        name: "Alex Johnson",
        email: "alex@example.com",
        rollNo: "21003",
        branch: "CSE",
        course: "Web Development",
        status: "active",
      },
    ]);
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Students
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {assignedClasses.length} Classes • {filteredStudents.length} Students
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            darkMode
              ? "bg-green-900/30 text-green-300"
              : "bg-green-100 text-green-700"
          }`}
        >
          {filteredStudents.length} Verified
        </div>
      </div>

      {/* ASSIGNED CLASSES */}
      {assignedClasses.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {assignedClasses.map((cls) => (
            <div
              key={cls._id}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                darkMode
                  ? "bg-purple-900/30 text-purple-300 border border-purple-700/50"
                  : "bg-purple-100 text-purple-700 border border-purple-200"
              }`}
            >
              {cls.branch} - {cls.course}
            </div>
          ))}
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or roll no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
          }`}
        />
      </div>

      {/* TABLE */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <table className="w-full">
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Roll No
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Class
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student._id}
                className={`border-t ${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-700/50"
                    : "border-gray-200 hover:bg-gray-50"
                } transition-colors`}
              >
                <td className="px-6 py-4 font-medium">{student.name}</td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4">{student.rollNo}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {student.branch} - {student.course}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Verified
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FiMoreVertical />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}