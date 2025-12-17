import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiMessageCircle,
  FiUser,
  FiCalendar,
  FiTag,
  FiStar,
  FiRefreshCw,
} from "react-icons/fi";
import FeedbackCategoryFilter from "../components/FeedbackCards/FeedbackCategoryFilter";
import FeedbackDetailCard from "../components/FeedbackCards/FeedbackDetailCard";
import SendFeedbackForm from "../components/FeedbackCards/SendFeedbackForm";
import { studentAPI } from "../../../services/api";
import { showSuccess, showError, showInfo } from "../../../utils/notifications";

export default function Feedback() {
  const { darkMode, student } = useOutletContext();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(
    student?.semesterNumber || 1
  );
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const maxSemester = student?.semesterNumber || 1;
    const semesterOptions = Array.from(
      { length: maxSemester },
      (_, i) => i + 1
    );
    setSemesters(semesterOptions);
    fetchFeedback(selectedSemester);
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => fetchFeedback(selectedSemester), 120000);
    return () => clearInterval(interval);
  }, [selectedSemester]);

  const fetchFeedback = async (semester) => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await studentAPI.getFeedback({
        semesterNumber: semester,
      });

      // Transform backend response
      const feedbacks = response.feedbacks || response.feedback || [];
      const transformedData = feedbacks.map((fb) => ({
        _id: fb._id,
        by: fb.postedBy || "Faculty",
        category: fb.category || "Academic",
        text: fb.comments || "No feedback provided",
        rating: fb.rating || 4,
        targetType: (fb.category || "faculty").toLowerCase(),
        date: new Date(fb.createdAt).toLocaleDateString(),
        timestamp: new Date(fb.createdAt),
      }));

      setFeedbackData(transformedData);

      // Notify if new feedback received
      if (transformedData.length > 0 && refreshing) {
        const latestFeedback = transformedData[0];
        showInfo(`📬 New feedback from ${latestFeedback.by}`);
        showSuccess("Feedback data updated!");
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to fetch feedback";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const categories = [
    { id: "all", label: "All Feedback" },
    { id: "faculty", label: "Faculty" },
    { id: "course", label: "Course" },
    { id: "facility", label: "Facility" },
  ];

  const filteredFeedback =
    activeCategory === "all"
      ? feedbackData
      : feedbackData.filter((f) => f.targetType === activeCategory);

  const averageRating =
    feedbackData.length > 0
      ? (
          feedbackData.reduce((sum, f) => sum + f.rating, 0) /
          feedbackData.length
        ).toFixed(1)
      : 0;
  const totalFeedback = feedbackData.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-xl ${darkMode ? "text-white" : "text-gray-900"}`}>
          Loading feedback...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER with Semester Selector */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Feedback 💬
          </h1>
          <p
            className={`mt-2 text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Receive constructive feedback from your mentors
          </p>
        </div>
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
              onClick={() => fetchFeedback(selectedSemester)}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg transition ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Refresh feedback"
            >
              <FiRefreshCw
                className={`inline ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
        {/* Form Toggle Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Request Feedback
        </button>
      </div>

      {error && feedbackData.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* FEEDBACK FORM */}
      {showForm && (
        <SendFeedbackForm
          darkMode={darkMode}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Feedback */}
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
              <FiMessageCircle
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
            Total Feedback
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {totalFeedback}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Received
          </p>
        </div>

        {/* Average Rating */}
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
              <FiStar
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
            Average Rating
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {averageRating}/5
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Overall score
          </p>
        </div>

        {/* Latest Feedback */}
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
              <FiCalendar
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
            Latest Feedback
          </p>
          <p
            className={`text-lg font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {new Date(feedbackData[0].date).toLocaleDateString()}
          </p>
          <p
            className={`text-xs mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Most recent
          </p>
        </div>
      </div>

      {/* PROVIDE FEEDBACK SECTION */}
      {!showForm && (
        <div
          className={`p-8 rounded-2xl border transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40"
              : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Share Your Feedback 📝
              </h3>
              <p
                className={`mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Request feedback from your mentors on your academic progress
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all"
            >
              Send Request
            </button>
          </div>
        </div>
      )}

      {/* FILTER TABS */}
      <FeedbackCategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        darkMode={darkMode}
      />

      {/* FEEDBACK LIST */}
      <div className="space-y-6">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((feedback) => (
            <FeedbackDetailCard
              key={feedback.id}
              feedback={feedback}
              darkMode={darkMode}
            />
          ))
        ) : (
          <div
            className={`p-12 rounded-2xl text-center ${
              darkMode
                ? "bg-gray-800/50 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-lg font-medium ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No feedback found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
