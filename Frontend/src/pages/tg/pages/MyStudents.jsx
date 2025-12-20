import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { FiSearch, FiEye, FiLoader } from "react-icons/fi";
import { tgAPI } from "../../../services/api";
import { showError } from "../../../utils/notifications";

export default function MyStudents() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyStudents();
  }, []);

  const fetchMyStudents = async () => {
    try {
      setLoading(true);
      const data = await tgAPI.getAllStudents();

      // Get all verified students
      const verifiedStudents = data.verified || data.students || [];
      setStudents(verifiedStudents);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch students");
      showError("Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (studentId) => {
    navigate(`/tg/students/${studentId}`);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.enrollmentNumber
        ? student.enrollmentNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false)
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
            {filteredStudents.length} Verified Students
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            darkMode
              ? "bg-green-900/30 text-green-300"
              : "bg-green-100 text-green-700"
          }`}
        >
          {filteredStudents.length} Total
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or enrollment number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
          }`}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-200">
          <p className="font-semibold">Error loading students</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div
          className={`p-12 rounded-2xl border flex items-center justify-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <FiLoader className="animate-spin text-2xl mr-3" />
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Loading verified students...
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div
          className={`p-12 rounded-2xl border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No verified students
          </p>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Verify students in the "Verify Users" section
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
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
                  Enrollment No
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Section
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
                  <td className="px-6 py-4">
                    {student.enrollmentNumber
                      ? student.enrollmentNumber
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {student.course ? student.course : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        darkMode
                          ? "bg-blue-900/30 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {student.section ? student.section : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewStudent(student._id)}
                      className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all hover:scale-105 ${
                        darkMode
                          ? "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300"
                          : "bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-900"
                      }`}
                    >
                      <FiEye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
