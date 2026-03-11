import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiTrendingUp,
  FiBarChart2,
  FiAward,
  FiPercent,
  FiRefreshCw,
  FiBook,
} from "react-icons/fi";

import { studentAPI } from "../../../services/api";
import {
  showSuccess,
  showError,
  notifyMarksReleased,
} from "../../../utils/notifications";

export default function Marks() {
  const { darkMode, student } = useOutletContext();
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(
    Math.max(1, (student?.semesterNumber || 1) - 1)
  );
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const maxSemester = student?.semesterNumber || 1;
    const semesterOptions = Array.from(
      { length: maxSemester },
      (_, i) => i + 1
    );
    setSemesters(semesterOptions);
    fetchMarks(selectedSemester);
    // Auto-refresh every 3 minutes
    const interval = setInterval(() => fetchMarks(selectedSemester), 180000);
    return () => clearInterval(interval);
  }, [selectedSemester]);

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    return "D";
  };

  const calculateCGPA = (marks) => {
    if (marks.length === 0) return 0;
    const gradePoints = {
      "A+": 10.0,
      A: 9.0,
      "B+": 8.0,
      B: 7.0,
      C: 6.0,
      D: 5.0,
    };
    let total = 0;
    marks.forEach((m) => {
      const percentage = ((m.marks || 0) / (m.maxMarks || 100)) * 100;
      const grade = calculateGrade(percentage);
      total += gradePoints[grade] || 0;
    });
    return (total / marks.length).toFixed(2);
  };

  const calculateSGPA = (marks) => {
    if (marks.length === 0) return 0;
    // SGPA is just the GPA for the current semester
    return calculateCGPA(marks);
  };

  const calculateGradeDistribution = (marks) => {
    const dist = { "A+": 0, A: 0, "B+": 0, B: 0, C: 0, D: 0 };
    marks.forEach((m) => {
      const percentage = ((m.marks || 0) / (m.maxMarks || 100)) * 100;
      const grade = calculateGrade(percentage);
      dist[grade] = (dist[grade] || 0) + 1;
    });
    return dist;
  };

  const fetchMarks = async (semester) => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await studentAPI.getMarks({ semesterNumber: semester });

      const marks = response.marks || [];
      const stats = response.statistics || {};
      const midSemMarks = response.midSemMarks || [];

      // Use real CGPA/SGPA from backend if available
      const realCGPA = response.cgpa || stats.cgpa || 0;
      const realSGPAArray = response.sgpa || [];
      const semesterWiseSGPA = response.semesterWiseSGPA || [];

      // Get SGPA for selected semester
      const currentSemSGPA =
        semesterWiseSGPA.find((s) => s.semester === semester)?.sgpa ||
        realSGPAArray[semester - 1] ||
        calculateSGPA(marks);

      const transformedData = {
        statistics: {
          totalMarks: stats.totalMarks || 0,
          maxMarks: stats.maxTotalMarks || 0,
          averagePercentage: parseFloat(stats.averagePercentage || 0).toFixed(
            2
          ),
          totalSubjects: marks.length,
          cgpa: parseFloat(realCGPA).toFixed(2),
          sgpa: parseFloat(currentSemSGPA).toFixed(2),
        },
        semesterWiseSGPA: semesterWiseSGPA,
        allSGPA: realSGPAArray,
        subjects: marks.map((m) => {
          const percentage = ((m.marks || 0) / (m.maxMarks || 100)) * 100;
          return {
            _id: m._id,
            subject: m.subject || "Unknown",
            marks: m.marks || 0,
            maxMarks: m.maxMarks || 100,
            percentage: parseFloat(percentage).toFixed(2),
            grade: calculateGrade(percentage),
            semester: m.semester || "Unknown",
            date: m.date ? new Date(m.date).toLocaleDateString() : "N/A",
            feedback: m.feedback || "",
          };
        }),
        midSemMarks: midSemMarks.map((m) => ({
          subject: m.subject || "Unknown",
          internalMarks: m.internalMarks || 0,
          maxInternalMarks: m.maxInternalMarks || 20,
          percentage:
            ((m.internalMarks || 0) / (m.maxInternalMarks || 20)) * 100,
        })),
        gradeDistribution: calculateGradeDistribution(marks),
      };

      setMarksData(transformedData);

      if (marks.length > 0 && refreshing) {
        const latest = marks[0];
        if (latest.marks) {
          notifyMarksReleased(latest.subject || "Subject", latest.marks);
        }
        showSuccess("Marks data updated!");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to fetch marks";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-xl ${darkMode ? "text-white" : "text-gray-900"}`}>
          Loading marks data...
        </div>
      </div>
    );
  }

  if (error && !marksData) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={() => fetchMarks(selectedSemester)}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!marksData) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        No marks data available
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER with Semester Selector and Refresh Button */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Marks & Grades
          </h1>
          <p
            className={`mt-2 text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            View your academic performance and grades
          </p>
        </div>
      </div>

      {error && marksData && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CGPA */}
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
              <FiAward
                className={`text-2xl ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-green-500">
              Excellent
            </span>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            CGPA
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {marksData.statistics.cgpa}/10.0
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Cumulative
          </p>
        </div>

        {/* SGPA */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40 hover:border-purple-600/60"
              : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60 hover:border-purple-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-purple-700/40" : "bg-purple-200"
              }`}
            >
              <FiTrendingUp
                className={`text-2xl ${
                  darkMode ? "text-purple-300" : "text-purple-600"
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-green-500">+0.3</span>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            SGPA
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {marksData.statistics.sgpa}/10.0
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Current Semester
          </p>
        </div>

        {/* Average % */}
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
              <FiPercent
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
            Average %
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {marksData.statistics.averagePercentage}%
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Overall
          </p>
        </div>

        {/* Subjects */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40 hover:border-purple-600/60"
              : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60 hover:border-purple-300"
          } hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                darkMode ? "bg-purple-700/40" : "bg-purple-200"
              }`}
            >
              <FiBook
                className={`text-2xl ${
                  darkMode ? "text-purple-300" : "text-purple-600"
                }`}
              />
            </div>
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total Subjects
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {marksData.statistics.totalSubjects}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Courses taken
          </p>
        </div>
      </div>

      {/* GRADE DISTRIBUTION */}
      <div>
        <h2
          className={`text-xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Grade Distribution
        </h2>
        <div
          className={`p-6 rounded-2xl border ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {Object.entries(marksData.gradeDistribution).map(
              ([grade, count]) => {
                const gradeColors = {
                  "A+": "from-green-500 to-green-600",
                  A: "from-green-400 to-green-500",
                  "B+": "from-blue-400 to-blue-500",
                  B: "from-blue-300 to-blue-400",
                  C: "from-yellow-400 to-yellow-500",
                  D: "from-red-400 to-red-500",
                };

                return (
                  <div key={grade} className="text-center">
                    <div
                      className={`bg-gradient-to-br ${
                        gradeColors[grade] || "from-gray-400 to-gray-500"
                      } rounded-lg p-4 text-white font-bold text-2xl mb-2`}
                    >
                      {grade}
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {count}
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Subjects
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* MID-SEMESTER MARKS TABLE (Current Semester) */}
      {marksData.midSemMarks && marksData.midSemMarks.length > 0 && (
        <div>
          <h2
            className={`text-xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Mid-Semester & Internal Marks (Current Semester)
          </h2>
          <div
            className={`overflow-x-auto rounded-2xl border ${
              darkMode
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white border-gray-200"
            }`}
          >
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${
                    darkMode
                      ? "bg-gray-700/50 border-gray-600/50"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Subject
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Internal Marks
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {marksData.midSemMarks.map((mark, index) => (
                  <tr
                    key={index}
                    className={`border-b transition-colors ${
                      darkMode
                        ? "border-gray-700/50 hover:bg-gray-700/30"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {mark.subject}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {mark.internalMarks}/{mark.maxInternalMarks}
                    </td>
                    <td
                      className={`px-6 py-4 text-center ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className="w-24 bg-gray-300 rounded-full h-2 dark:bg-gray-600 mr-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${Math.min(mark.percentage, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="font-semibold">
                          {mark.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBJECT WISE MARKS TABLE */}
      <div>
        <h2
          className={`text-xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Subject-wise Performance
        </h2>
        <div
          className={`overflow-x-auto rounded-2xl border ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white border-gray-200"
          }`}
        >
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${
                  darkMode
                    ? "bg-gray-700/50 border-gray-600/50"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <th
                  className={`px-6 py-3 text-left text-sm font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Subject
                </th>
                <th
                  className={`px-6 py-3 text-center text-sm font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Marks
                </th>
                <th
                  className={`px-6 py-3 text-center text-sm font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Percentage
                </th>
                <th
                  className={`px-6 py-3 text-center text-sm font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Grade
                </th>
                <th
                  className={`px-6 py-3 text-center text-sm font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Semester
                </th>
              </tr>
            </thead>
            <tbody>
              {marksData.subjects.map((subject, index) => {
                const gradeColorMap = {
                  "A+": "text-green-600 dark:text-green-400 font-bold",
                  A: "text-green-500 dark:text-green-300 font-bold",
                  "B+": "text-blue-600 dark:text-blue-400 font-bold",
                  B: "text-blue-500 dark:text-blue-300 font-bold",
                  C: "text-yellow-600 dark:text-yellow-400 font-bold",
                  D: "text-red-600 dark:text-red-400 font-bold",
                  F: "text-red-700 dark:text-red-500 font-bold",
                };

                return (
                  <tr
                    key={index}
                    className={`border-b transition-colors ${
                      darkMode
                        ? "border-gray-700/50 hover:bg-gray-700/30"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-6 py-4 font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {subject.subject}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {subject.marks}/{subject.maxMarks}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {subject.percentage}%
                    </td>
                    <td
                      className={`px-6 py-4 text-center ${
                        gradeColorMap[subject.grade] || "text-gray-600"
                      }`}
                    >
                      {subject.grade}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Sem {subject.semester}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
