import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiFileText, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import SubjectAssignmentCard from "../components/AssignmentCards/SubjectAssignmentCard";
import AssignmentListView from "../components/AssignmentCards/AssignmentListView";

export default function Assignments() {
  const { darkMode } = useOutletContext();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjectsData = [
    {
      id: 1,
      name: "Data Structures",
      faculty: "Prof. Michael Chen",
      assignments: [
        {
          id: 1,
          title: "Binary Tree Implementation",
          description: "Implement a complete binary tree with insertion, deletion, and traversal methods.",
          dueDate: "2025-01-20",
          submissionDate: null,
          status: "pending",
          marks: null,
          maxMarks: 100,
          file: null,
        },
        {
          id: 2,
          title: "Graph Algorithms",
          description: "Implement DFS, BFS, and shortest path algorithms.",
          dueDate: "2025-01-25",
          submissionDate: null,
          status: "pending",
          marks: null,
          maxMarks: 100,
          file: null,
        },
        {
          id: 3,
          title: "Sorting Algorithms Comparison",
          description: "Compare different sorting algorithms and analyze their complexities.",
          dueDate: "2025-01-12",
          submissionDate: "2025-01-11",
          status: "submitted",
          marks: 95,
          maxMarks: 100,
          file: "sorting_analysis.pdf",
        },
      ],
    },
    {
      id: 2,
      name: "DBMS",
      faculty: "Prof. Sarah Johnson",
      assignments: [
        {
          id: 4,
          title: "Database Query Optimization",
          description: "Write optimized SQL queries for given scenarios and explain execution plans.",
          dueDate: "2025-01-22",
          submissionDate: null,
          status: "pending",
          marks: null,
          maxMarks: 80,
          file: null,
        },
        {
          id: 5,
          title: "Normalization Assignment",
          description: "Normalize database schemas up to BCNF.",
          dueDate: "2025-01-10",
          submissionDate: "2025-01-09",
          status: "submitted",
          marks: 88,
          maxMarks: 100,
          file: "normalization.pdf",
        },
      ],
    },
    {
      id: 3,
      name: "Operating Systems",
      faculty: "Prof. Rajesh Kumar",
      assignments: [
        {
          id: 6,
          title: "Process Scheduling Algorithms",
          description: "Implement various CPU scheduling algorithms and compare performance.",
          dueDate: "2025-01-18",
          submissionDate: null,
          status: "pending",
          marks: null,
          maxMarks: 100,
          file: null,
        },
        {
          id: 7,
          title: "Memory Management",
          description: "Implement and analyze memory management techniques.",
          dueDate: "2025-01-08",
          submissionDate: null,
          status: "pending",
          marks: null,
          maxMarks: 100,
          file: null,
        },
      ],
    },
    {
      id: 4,
      name: "Computer Networks",
      faculty: "Prof. Emily Davis",
      assignments: [
        {
          id: 8,
          title: "Network Protocol Analysis",
          description: "Analyze network packets using Wireshark and document findings.",
          dueDate: "2025-01-15",
          submissionDate: "2025-01-14",
          status: "submitted",
          marks: 92,
          maxMarks: 100,
          file: "network_analysis.pdf",
        },
      ],
    },
  ];

  // Calculate stats
  const stats = {
    total: subjectsData.reduce((sum, s) => sum + s.assignments.length, 0),
    pending: subjectsData.reduce((sum, s) => sum + s.assignments.filter(a => a.status === "pending").length, 0),
    submitted: subjectsData.reduce((sum, s) => sum + s.assignments.filter(a => a.status === "submitted").length, 0),
    overdue: subjectsData.reduce((sum, s) => sum + s.assignments.filter(
      a => a.status === "pending" && new Date(a.dueDate) < new Date()
    ).length, 0),
  };

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

      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Assignments 📝
        </h1>
        <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Track and submit your coursework
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40 hover:border-blue-600/60"
            : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60 hover:border-blue-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-blue-700/40" : "bg-blue-200"}`}>
              <FiFileText className={`text-2xl ${darkMode ? "text-blue-300" : "text-blue-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total Assignments</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.total}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>This semester</p>
        </div>

        {/* Pending */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-700/40 hover:border-yellow-600/60"
            : "bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200/60 hover:border-yellow-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-yellow-700/40" : "bg-yellow-200"}`}>
              <FiClock className={`text-2xl ${darkMode ? "text-yellow-300" : "text-yellow-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Pending</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.pending}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>To submit</p>
        </div>

        {/* Submitted */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/40 hover:border-green-600/60"
            : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60 hover:border-green-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-green-700/40" : "bg-green-200"}`}>
              <FiCheckCircle className={`text-2xl ${darkMode ? "text-green-300" : "text-green-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Submitted</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.submitted}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Completed</p>
        </div>

        {/* Overdue */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/40 hover:border-red-600/60"
            : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/60 hover:border-red-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-red-700/40" : "bg-red-200"}`}>
              <FiAlertCircle className={`text-2xl ${darkMode ? "text-red-300" : "text-red-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Overdue</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.overdue}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Urgent</p>
        </div>
      </div>

      {/* SUBJECT CARDS GRID */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
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