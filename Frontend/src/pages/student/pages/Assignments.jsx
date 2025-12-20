import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import SubjectAssignmentCard from "../components/AssignmentCards/SubjectAssignmentCard";
import AssignmentListView from "../components/AssignmentCards/AssignmentListView";
import { studentAPI } from "../../../services/api";
import {
  showSuccess,
  notifyNewAssignment,
  showError,
} from "../../../utils/notifications";

export default function Assignments() {
  const { darkMode, student } = useOutletContext();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectsData, setSubjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(
    student?.semesterNumber || 1
  );
  const [semesters, setSemesters] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Generate semester options (1 to current semester)
    const maxSemester = student?.semesterNumber || 1;
    const semesterOptions = Array.from(
      { length: maxSemester },
      (_, i) => i + 1
    );
    setSemesters(semesterOptions);
    fetchAssignments(selectedSemester);
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(
      () => fetchAssignments(selectedSemester),
      30000
    );
    return () => clearInterval(interval);
  }, [selectedSemester]);

  const fetchAssignments = async (semester) => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await studentAPI.getAssignments({
        semesterNumber: semester,
      });
      setSubjectsData(response.assignments || []);

      // Notify about pending assignments
      const pendingCount = response.assignments.reduce(
        (sum, s) =>
          sum + s.assignments.filter((a) => a.status === "pending").length,
        0
      );
      if (pendingCount > 0 && response.assignments.length > 0) {
        const firstAssignment = response.assignments[0]?.assignments?.[0];
        if (firstAssignment) {
          notifyNewAssignment(
            firstAssignment.title,
            new Date(firstAssignment.dueDate).toLocaleDateString()
          );
        }
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch assignments";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calculate stats
  const stats = {
    total: subjectsData.reduce((sum, s) => sum + s.assignments.length, 0),
    pending: subjectsData.reduce(
      (sum, s) =>
        sum + s.assignments.filter((a) => a.status === "pending").length,
      0
    ),
    submitted: subjectsData.reduce(
      (sum, s) =>
        sum + s.assignments.filter((a) => a.status === "submitted").length,
      0
    ),
    overdue: subjectsData.reduce(
      (sum, s) =>
        sum +
        s.assignments.filter(
          (a) => a.status === "pending" && new Date(a.dueDate) < new Date()
        ).length,
      0
    ),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-xl ${darkMode ? "text-white" : "text-gray-900"}`}>
          Loading assignments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={() => fetchAssignments(selectedSemester)}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (selectedSubject) {
    return (
      <AssignmentListView
        subject={selectedSubject}
        onBack={() => setSelectedSubject(null)}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER with Semester Selector */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Assignments
          </h1>
          <p
            className={`mt-2 text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Track and submit your coursework
          </p>
        </div>
        {/* Semester Selector */}
        <div className="flex flex-col items-end gap-2">
          <label
            className={`text-sm font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Select Semester
          </label>
          <div className="flex gap-2">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg border transition ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 hover:border-blue-500"
                  : "bg-white text-gray-900 border-gray-300 hover:border-blue-500"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchAssignments(selectedSemester)}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg transition ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Refresh assignments"
            >
              <FiRefreshCw
                className={`inline ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40 hover:border-blue-600/60"
              : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60 hover:border-blue-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-blue-700/40" : "bg-blue-200"
              }`}
            >
              <FiFileText
                className={`text-2xl ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              />
            </div>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total Assignments
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.total}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            This semester
          </p>
        </div>

        {/* Pending */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-700/40 hover:border-yellow-600/60"
              : "bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200/60 hover:border-yellow-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-yellow-700/40" : "bg-yellow-200"
              }`}
            >
              <FiClock
                className={`text-2xl ${
                  darkMode ? "text-yellow-300" : "text-yellow-600"
                }`}
              />
            </div>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Pending
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.pending}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            To submit
          </p>
        </div>

        {/* Submitted */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/40 hover:border-green-600/60"
              : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60 hover:border-green-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-green-700/40" : "bg-green-200"
              }`}
            >
              <FiCheckCircle
                className={`text-2xl ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
              />
            </div>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Submitted
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.submitted}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Completed
          </p>
        </div>

        {/* Overdue */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/40 hover:border-red-600/60"
              : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/60 hover:border-red-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-red-700/40" : "bg-red-200"
              }`}
            >
              <FiAlertCircle
                className={`text-2xl ${
                  darkMode ? "text-red-300" : "text-red-600"
                }`}
              />
            </div>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Overdue
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.overdue}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Urgent
          </p>
        </div>
      </div>

      {/* SUBJECT CARDS GRID */}
      <div>
        <h2
          className={`text-2xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Assignments by Subject
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectsData.map((subject) => (
            <SubjectAssignmentCard
              key={subject.id}
              subject={subject}
              onClick={() => setSelectedSubject(subject)}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
