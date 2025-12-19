import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiMail,
  FiBook,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiRefreshCw,
  FiAward,
} from "react-icons/fi";
import { studentAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";

export default function Profile() {
  const { darkMode } = useOutletContext();
  const [student, setStudent] = useState(null);
  const [classTeacher, setClassTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchClassTeacher();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchProfile, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchClassTeacher = async () => {
    try {
      const data = await studentAPI.getClassTeacher();
      setClassTeacher(data.classTeacher);
    } catch (err) {
      setClassTeacher(null);
    }
  };

  const fetchProfile = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await studentAPI.getProfile();
      if (res.student) {
        // Format the data
        const formatted = {
          name: res.student.name,
          email: res.student.email,
          enrollmentNumber: res.student.enrollmentNumber,
          mobileNumber: res.student.mobileNumber,
          course: res.student.course,
          branch: res.student.branch,
          department: res.student.department,
          section: res.student.section,
          academicYear: res.student.academicYear,
          semesterNumber: res.student.semesterNumber,
          gender: res.student.gender,
          dob: res.student.dob
            ? new Date(res.student.dob).toLocaleDateString("en-IN")
            : "N/A",
          bloodGroup: res.student.bloodGroup || "Not Specified",
          profilePic:
            res.student.profilePic ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              res.student.name
            )}&background=3b82f6&color=fff&size=200`,
          parentContact: res.student.parentContact || "N/A",
        };
        setStudent(formatted);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.error || "Failed to load profile");
      showError("Failed to load profile");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div
        className={`p-6 rounded-lg text-center ${
          darkMode
            ? "bg-red-900/20 border border-red-700"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <p className={`${darkMode ? "text-red-400" : "text-red-600"}`}>
          {error || "Failed to load profile"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Profile
          </h1>
          <p
            className={`mt-2 text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            View your profile information
          </p>
        </div>
        <button
          onClick={fetchProfile}
          disabled={refreshing}
          className={`p-3 rounded-lg transition-all ${
            darkMode
              ? "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
              : "bg-blue-100 hover:bg-blue-200 text-blue-600"
          } ${refreshing ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Refresh profile"
        >
          <FiRefreshCw
            className={`text-xl ${refreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* PROFILE HEADER CARD */}
      <div
        className={`p-8 rounded-2xl transition-colors duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/40"
            : "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* AVATAR */}
          <div className="flex-shrink-0">
            <img
              src={student.profilePic}
              alt={student.name}
              className={`w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg`}
            />
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h2
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.name}
            </h2>
            <p
              className={`text-lg mb-4 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {student.course} - {student.branch}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`flex items-center gap-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FiUser className="text-blue-500" />
                <span>
                  Enroll: <strong>{student.enrollmentNumber}</strong>
                </span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FiBook className="text-purple-500" />
                <span>
                  Sem: <strong>{student.semesterNumber}</strong>
                </span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FiCalendar className="text-orange-500" />
                <span>
                  Year: <strong>{student.academicYear}</strong>
                </span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <FiUser className="text-red-500" />
                <span>
                  Blood: <strong>{student.bloodGroup}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLASS TEACHER (TG) INFO */}
      {classTeacher && (
        <div
          className={`p-6 rounded-2xl transition-colors duration-300 ${
            darkMode
              ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700/50"
              : "bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200"
          }`}
        >
          <h3
            className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <FiAward className="text-indigo-500" />
            Your Class Teacher (TG)
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {classTeacher.profilePic ? (
              <img
                src={classTeacher.profilePic}
                alt={classTeacher.name}
                className="w-20 h-20 rounded-full object-cover border-3 border-indigo-500"
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-indigo-700" : "bg-indigo-500"
                }`}
              >
                <FiUser className="text-white text-3xl" />
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <h4
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {classTeacher.name}
              </h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                TG ID: {classTeacher.tgId}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                {classTeacher.class} • {classTeacher.academicYear}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${classTeacher.email}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  darkMode
                    ? "bg-indigo-700/50 hover:bg-indigo-600 text-indigo-200"
                    : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                }`}
              >
                <FiMail /> {classTeacher.email}
              </a>
              <a
                href={`tel:${classTeacher.mobileNumber}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  darkMode
                    ? "bg-green-700/50 hover:bg-green-600 text-green-200"
                    : "bg-green-100 hover:bg-green-200 text-green-700"
                }`}
              >
                <FiPhone /> {classTeacher.mobileNumber}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT INFORMATION */}
      <div
        className={`p-6 rounded-2xl transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800/50 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <h3
          className={`text-2xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <FiMail
                className={`text-lg ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Email
              </p>
            </div>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.email}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <FiPhone
                className={`text-lg ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Phone
              </p>
            </div>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              +91 {student.mobileNumber}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg md:col-span-2 ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <FiMapPin
                className={`text-lg ${
                  darkMode ? "text-orange-400" : "text-orange-600"
                }`}
              />
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Parent Contact
              </p>
            </div>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.parentContact}
            </p>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div
        className={`p-6 rounded-2xl transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800/50 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <h3
          className={`text-2xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Date of Birth
            </p>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.dob}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Blood Group
            </p>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.bloodGroup}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Gender
            </p>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.gender}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Department
            </p>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.department}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Section
            </p>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.section}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-gray-700/30 border border-gray-600"
                : "bg-slate-50 border border-gray-200"
            }`}
          >
            <p
              className={`text-sm mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Course
            </p>
            <p
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {student.course}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
