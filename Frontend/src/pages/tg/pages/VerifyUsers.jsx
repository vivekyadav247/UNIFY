import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { tgAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";

export default function VerifyUsers() {
  const { darkMode } = useOutletContext();
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    fetchUnverifiedStudents();
  }, []);

  const fetchUnverifiedStudents = async () => {
    try {
      setLoading(true);
      const data = await tgAPI.getUnverifiedStudents();
      setUnverifiedStudents(data.students || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch unverified students");
      setUnverifiedStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStudent = async (studentId) => {
    try {
      setVerifying(studentId);
      await tgAPI.verifyStudent(studentId, {});
      setUnverifiedStudents(
        unverifiedStudents.filter((s) => s._id !== studentId)
      );
      showSuccess("Student verified successfully!");
    } catch (err) {
      showError("Failed to verify student");
    } finally {
      setVerifying(null);
    }
  };

  const handleRejectStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to reject this student?")) {
      return;
    }

    try {
      setVerifying(studentId);
      setUnverifiedStudents(
        unverifiedStudents.filter((s) => s._id !== studentId)
      );
      showSuccess("Student rejected!");
    } catch (err) {
      showError("Failed to reject student");
    } finally {
      setVerifying(null);
    }
  };

  const filteredStudents = unverifiedStudents.filter(
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

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-200 flex items-start gap-3">
          <FiAlertCircle className="mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
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
            Loading unverified students...
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
          <FiCheck className="text-4xl mx-auto mb-3 text-green-500" />
          <p
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            All students verified
          </p>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            No pending verifications
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className={`p-6 rounded-2xl border transition-all ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                  : "bg-white border-gray-200 hover:border-gray-300"
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
                        ENROLLMENT NO
                      </p>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {student.enrollmentNumber
                          ? student.enrollmentNumber
                          : "N/A"}
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

                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        REGISTERED
                      </p>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {student.createdAt
                          ? new Date(student.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleVerifyStudent(student._id)}
                    disabled={verifying === student._id}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                      verifying === student._id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    } bg-green-600 hover:bg-green-700 text-white`}
                  >
                    {verifying === student._id ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiCheck />
                    )}
                    Verify
                  </button>

                  <button
                    onClick={() => handleRejectStudent(student._id)}
                    disabled={verifying === student._id}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                      verifying === student._id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    } bg-red-600 hover:bg-red-700 text-white`}
                  >
                    {verifying === student._id ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiX />
                    )}
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
