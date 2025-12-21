import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  FiArrowLeft,
  FiLoader,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiBook,
  FiAward,
  FiAlertCircle,
  FiBarChart2,
} from "react-icons/fi";
import { tgAPI } from "../../../services/api";
import { showError } from "../../../utils/notifications";

export default function StudentDetail() {
  const { darkMode } = useOutletContext();
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId]);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      const data = await tgAPI.getStudentDetail(studentId);
      setStudent(data.student || null);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch student details");
      showError("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl mx-auto mb-3 text-blue-600" />
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/tg/my-students")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <FiArrowLeft />
          Back to Students
        </button>

        <div
          className={`p-6 rounded-2xl border flex items-start gap-4 ${
            darkMode
              ? "bg-red-900/20 border-red-600/50"
              : "bg-red-50 border-red-200"
          }`}
        >
          <FiAlertCircle
            className={`flex-shrink-0 text-xl mt-1 ${
              darkMode ? "text-red-400" : "text-red-600"
            }`}
          />
          <div>
            <h3
              className={`font-bold mb-1 ${
                darkMode ? "text-red-400" : "text-red-900"
              }`}
            >
              Error Loading Student
            </h3>
            <p className={darkMode ? "text-red-300" : "text-red-700"}>
              {error || "Student not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/tg/my-students")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium mb-6 transition-all ${
          darkMode
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
        }`}
      >
        <FiArrowLeft />
        Back to Students
      </button>

      {/* Student Header Card */}
      <div
        className={`p-8 rounded-2xl border mb-6 ${
          darkMode
            ? "bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-700/50"
            : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
        }`}
      >
        <div className="flex items-center gap-6">
          {student.profilePic ? (
            <img
              src={student.profilePic}
              alt={student.name}
              className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
            />
          ) : (
            <div
              className={`w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center text-2xl font-bold ${
                darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {student.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
          )}

          <div className="flex-1">
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.name}
            </h1>
            <p
              className={`text-lg mt-2 flex items-center gap-2 ${
                darkMode ? "text-blue-400" : "text-blue-700"
              }`}
            >
              <FiAward />
              {student.enrollmentNumber}
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode
                    ? "bg-green-900/40 text-green-300"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {student.course}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode
                    ? "bg-purple-900/40 text-purple-300"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {student.branch} - Section {student.section}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {["profile", "marks", "attendance", "announcements"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition-all capitalize ${
              activeTab === tab
                ? darkMode
                  ? "border-blue-500 text-blue-400"
                  : "border-blue-500 text-blue-600"
                : darkMode
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-600 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-6 rounded-2xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <label
              className={`text-xs font-semibold flex items-center gap-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FiMail size={14} /> EMAIL
            </label>
            <p
              className={`text-lg font-medium mt-2 break-all ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.email}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <label
              className={`text-xs font-semibold flex items-center gap-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FiPhone size={14} /> MOBILE NUMBER
            </label>
            <p
              className={`text-lg font-medium mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.mobileNumber || "N/A"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <label
              className={`text-xs font-semibold flex items-center gap-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FiCalendar size={14} /> DATE OF BIRTH
            </label>
            <p
              className={`text-lg font-medium mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <label
              className={`text-xs font-semibold flex items-center gap-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FiMapPin size={14} /> GENDER
            </label>
            <p
              className={`text-lg font-medium mt-2 capitalize ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.gender || "N/A"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <label
              className={`text-xs font-semibold flex items-center gap-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FiBook size={14} /> DEPARTMENT
            </label>
            <p
              className={`text-lg font-medium mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.department || "N/A"}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <label
              className={`text-xs font-semibold flex items-center gap-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <FiAward size={14} /> SEMESTER
            </label>
            <p
              className={`text-lg font-medium mt-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.semesterNumber
                ? `Semester ${student.semesterNumber}`
                : "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* MARKS TAB */}
      {activeTab === "marks" && (
        <div>
          {student.marks && student.marks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.marks.map((mark, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {mark.subjectName || "Subject"}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-2 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {mark.totalMarks || "0"} / 100
                      </p>
                    </div>
                    <FiBarChart2
                      className={`text-3xl ${
                        mark.totalMarks >= 80
                          ? "text-green-500"
                          : mark.totalMarks >= 60
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`p-8 rounded-2xl border text-center ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p
                className={`text-lg font-semibold ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                No marks data available
              </p>
            </div>
          )}
        </div>
      )}

      {/* ATTENDANCE TAB */}
      {activeTab === "attendance" && (
        <div
          className={`p-8 rounded-2xl border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <p
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Attendance data coming soon
          </p>
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === "announcements" && (
        <div>
          <p
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Class Announcements
          </p>
          <p
            className={`text-sm mt-4 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Announcements from faculty will appear here
          </p>
        </div>
      )}
    </div>
  );
}
