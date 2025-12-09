import React from "react";
import { useOutletContext } from "react-router-dom";
import { FiTrendingUp, FiBarChart2, FiAward, FiTarget } from "react-icons/fi";
import SubjectWiseMarksTable from "../components/MarksCards/SubjectWiseMarksTable";
import GradeBreakdownCard from "../components/MarksCards/GradeBreakdownCard";

export default function Marks() {
  const { darkMode } = useOutletContext();

  const marksData = {
    cgpa: 8.2,
    sgpa: 8.5,
    totalMarks: 825,
    maxMarks: 1000,
    averageMarks: 82.5,
    subjects: [
      { name: "Mathematics", internal: 42, external: 85, total: 127, grade: "A+", credits: 4 },
      { name: "Physics", internal: 40, external: 82, total: 122, grade: "A+", credits: 4 },
      { name: "Data Structures", internal: 45, external: 90, total: 135, grade: "A+", credits: 3 },
      { name: "DBMS", internal: 38, external: 78, total: 116, grade: "A", credits: 3 },
      { name: "Operating Systems", internal: 44, external: 88, total: 132, grade: "A+", credits: 3 },
      { name: "Computer Networks", internal: 41, external: 80, total: 121, grade: "A", credits: 3 },
    ],
    gradeDistribution: {
      "A+": 3,
      "A": 3,
      "B+": 0,
      "B": 0,
    },
    trend: [75, 78, 80, 82, 84, 82.5],
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Marks & Grades 📊
        </h1>
        <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          View your academic performance and grades
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CGPA */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40 hover:border-blue-600/60"
            : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60 hover:border-blue-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-blue-700/40" : "bg-blue-200"}`}>
              <FiAward className={`text-2xl ${darkMode ? "text-blue-300" : "text-blue-600"}`} />
            </div>
            <span className="text-xs font-semibold text-green-500">Excellent</span>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>CGPA</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{marksData.cgpa}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Out of 10</p>
        </div>

        {/* SGPA */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40 hover:border-purple-600/60"
            : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60 hover:border-purple-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-purple-700/40" : "bg-purple-200"}`}>
              <FiTrendingUp className={`text-2xl ${darkMode ? "text-purple-300" : "text-purple-600"}`} />
            </div>
            <span className="text-xs font-semibold text-green-500">+0.3</span>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>SGPA</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{marksData.sgpa}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Current Semester</p>
        </div>

        {/* Total Marks */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/40 hover:border-green-600/60"
            : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60 hover:border-green-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-green-700/40" : "bg-green-200"}`}>
              <FiBarChart2 className={`text-2xl ${darkMode ? "text-green-300" : "text-green-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total Marks</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{marksData.totalMarks}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Out of {marksData.maxMarks}</p>
        </div>

        {/* Average Marks */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700/40 hover:border-orange-600/60"
            : "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/60 hover:border-orange-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-orange-700/40" : "bg-orange-200"}`}>
              <FiTarget className={`text-2xl ${darkMode ? "text-orange-300" : "text-orange-600"}`} />
            </div>
            <span className="text-xs font-semibold text-green-500">Good</span>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Average Marks</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{marksData.averageMarks}%</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Across all subjects</p>
        </div>
      </div>

      {/* GRADE DISTRIBUTION */}
      <div>
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Grade Distribution
        </h2>
        <GradeBreakdownCard distribution={marksData.gradeDistribution} darkMode={darkMode} />
      </div>

      {/* SUBJECT WISE MARKS TABLE */}
      <div>
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Subject-wise Performance
        </h2>
        <SubjectWiseMarksTable subjects={marksData.subjects} darkMode={darkMode} />
      </div>

    </div>
  );
}
