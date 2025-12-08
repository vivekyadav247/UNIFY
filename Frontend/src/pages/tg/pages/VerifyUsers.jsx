import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FiSearch, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

export default function VerifyUsers() {
  const { darkMode } = useOutletContext();
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for testing
  useEffect(() => {
    setUnverifiedStudents([
      {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        rollNo: "21001",
        branch: "CSE",
        course: "Data Structures",
        createdAt: new Date(),
      },
      {
        _id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        rollNo: "21002",
        branch: "CSE",
        course: "Data Structures",
        createdAt: new Date(),
      },
    ]);
  }, []);

  const handleVerifyStudent = (studentId) => {
    setUnverifiedStudents(
      unverifiedStudents.filter((s) => s._id !== studentId)
    );
    alert("Student verified successfully!");
  };

  const handleRejectStudent = (studentId) => {
    if (window.confirm("Are you sure you want to reject this student?")) {
      setUnverifiedStudents(
        unverifiedStudents.filter((s) => s._id !== studentId)
      );
      alert("Student rejected!");
    }
  };

  const filteredStudents = unverifiedStudents.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            Verify Users
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Review and verify newly registered students
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            darkMode
              ? "bg-orange-900/30 text-orange-300"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {filteredStudents.length} Pending
        </div>
      </div>

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

      {filteredStudents.length === 0 ? (
        <div
          className={`p-12 rounded-2xl border text-center ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            All students verified
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className={`p-6 rounded-2xl border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {student.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {student.email}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ROLL NO
                      </p>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {student.rollNo}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        BRANCH
                      </p>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {student.branch}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        COURSE
                      </p>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {student.course}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleVerifyStudent(student._id)}
                    className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FiCheck />
                    Verify
                  </button>

                  <button
                    onClick={() => handleRejectStudent(student._id)}
                    className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <FiX />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}