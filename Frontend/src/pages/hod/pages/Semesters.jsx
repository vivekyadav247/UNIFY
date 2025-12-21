import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FiCalendar, FiClock, FiLoader, FiAlertCircle } from "react-icons/fi";
import { hodAPI } from "../../../services/api";

export default function Semesters() {
  const { darkMode } = useOutletContext();
  const [semesters, setSemesters] = useState([]);
  const [academicYear, setAcademicYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const response = await hodAPI.getSemestersByActiveAcademicYear();
      setSemesters(response.semesters || []);
      setAcademicYear(response.academicYear || "");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch semesters");
      setSemesters([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return darkMode
          ? "bg-green-900/30 text-green-300 border-green-700/50"
          : "bg-green-100 text-green-800 border-green-300";
      case "scheduled":
        return darkMode
          ? "bg-yellow-900/30 text-yellow-300 border-yellow-700/50"
          : "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "completed":
        return darkMode
          ? "bg-blue-900/30 text-blue-300 border-blue-700/50"
          : "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return darkMode
          ? "bg-gray-700 text-gray-300 border-gray-600"
          : "bg-gray-200 text-gray-800 border-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return "✓ Active";
      case "scheduled":
        return "⏰ Scheduled";
      case "completed":
        return "✓ Completed";
      default:
        return status;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div
        className={`p-6 min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="text-4xl animate-spin text-blue-500" />
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Loading semesters...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FiCalendar className="text-blue-500" />
            Semesters
          </h1>
          {academicYear && (
            <p className={`text-lg mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Academic Year: <span className="font-semibold">{academicYear}</span>
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div
            className={`p-4 rounded-lg border flex items-start gap-3 ${
              darkMode
                ? "bg-red-900/30 border-red-700/50 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <FiAlertCircle className="text-xl flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Semesters Grid */}
        {semesters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {semesters.map((semester) => (
              <div
                key={semester._id}
                className={`rounded-xl p-5 border transition-all ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:border-blue-600"
                    : "bg-white border-gray-200 hover:border-blue-400 shadow-sm"
                }`}
              >
                {/* Semester Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      Semester {semester.semesterNumber}
                    </h3>
                    {semester.semesterName && (
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                        {semester.semesterName}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                      semester.status
                    )}`}
                  >
                    {getStatusIcon(semester.status)}
                  </span>
                </div>

                {/* Dates Section */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-blue-500" />
                    <div className="text-sm">
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                        Start Date
                      </p>
                      <p className="font-semibold">
                        {formatDate(semester.startDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiClock className="text-green-500" />
                    <div className="text-sm">
                      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                        End Date
                      </p>
                      <p className="font-semibold">
                        {formatDate(semester.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div
                  className={`p-3 rounded-lg mb-4 ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Duration
                  </p>
                  <p className="font-semibold">
                    {getDaysRemaining(
                      semester.startDate,
                      semester.endDate
                    )} days
                  </p>
                </div>

                {/* Description */}
                {semester.description && (
                  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <p className="font-medium mb-1">Description</p>
                    <p>{semester.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`p-12 rounded-lg text-center border-2 border-dashed ${
              darkMode
                ? "bg-gray-800/50 border-gray-700 text-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-600"
            }`}
          >
            <FiCalendar className="text-4xl mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No semesters found</p>
            <p className="text-sm mt-1">
              {academicYear
                ? "No semesters created for this academic year"
                : "No active academic year found"}
            </p>
          </div>
        )}

        {/* Summary Stats */}
        {semesters.length > 0 && (
          <div
            className={`mt-8 p-5 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="font-bold mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Semesters
                </p>
                <p className="text-2xl font-bold">{semesters.length}</p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Active
                </p>
                <p className="text-2xl font-bold text-green-500">
                  {semesters.filter((s) => s.status === "active").length}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Scheduled
                </p>
                <p className="text-2xl font-bold text-yellow-500">
                  {semesters.filter((s) => s.status === "scheduled").length}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Completed
                </p>
                <p className="text-2xl font-bold text-blue-500">
                  {semesters.filter((s) => s.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
