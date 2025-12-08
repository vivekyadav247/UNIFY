import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiMessageCircle, FiUser, FiCalendar, FiTag, FiStar } from "react-icons/fi";
import FeedbackCategoryFilter from "../components/FeedbackCards/FeedbackCategoryFilter";
import FeedbackDetailCard from "../components/FeedbackCards/FeedbackDetailCard";
import SendFeedbackForm from "../components/FeedbackCards/SendFeedbackForm";

export default function Feedback() {
  const { darkMode } = useOutletContext();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const feedbackData = [
    {
      id: 1,
      from: "Prof. Michael Chen",
      category: "Academic",
      date: "2025-01-15",
      title: "Excellent Performance in Data Structures",
      message: "You have shown exceptional understanding of data structures concepts. Your implementation of AVL trees was particularly impressive. Keep up this excellent work!",
      rating: 5,
    },
    {
      id: 2,
      from: "Prof. Sarah Johnson",
      category: "Mentorship",
      date: "2025-01-10",
      title: "Time Management Focus",
      message: "While your technical knowledge is solid, I suggest you work on time management for your projects. Setting milestones and deadlines for yourself will help you deliver better quality work.",
      rating: 4,
    },
    {
      id: 3,
      from: "Prof. Rajesh Kumar",
      category: "Behavioral",
      date: "2025-01-05",
      title: "Great Classroom Participation",
      message: "Excellent participation in class discussions. Your questions demonstrate deep thinking about the subject matter. Continue asking insightful questions!",
      rating: 5,
    },
    {
      id: 4,
      from: "Prof. Emily Davis",
      category: "Academic",
      date: "2024-12-28",
      title: "Project Submission Quality",
      message: "Your project submission was well-documented and showed good understanding. However, try to add more comments to your code for better readability.",
      rating: 4,
    },
    {
      id: 5,
      from: "Prof. Michael Chen",
      category: "Mentorship",
      date: "2024-12-20",
      title: "Collaborative Learning",
      message: "Great job collaborating with your peers on group assignments. Your communication skills are strong. This will be valuable in your future career.",
      rating: 5,
    },
  ];

  const categories = [
    { id: "all", label: "All Feedback" },
    { id: "Academic", label: "Academic" },
    { id: "Mentorship", label: "Mentorship" },
    { id: "Behavioral", label: "Behavioral" },
  ];

  const filteredFeedback = activeCategory === "all" 
    ? feedbackData 
    : feedbackData.filter(f => f.category === activeCategory);

  const averageRating = (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1);
  const totalFeedback = feedbackData.length;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Feedback 💬
          </h1>
          <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Receive constructive feedback from your mentors
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            darkMode 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Request Feedback
        </button>
      </div>

      {/* FEEDBACK FORM */}
      {showForm && (
        <SendFeedbackForm darkMode={darkMode} onClose={() => setShowForm(false)} />
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Feedback */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40 hover:border-blue-600/60"
            : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60 hover:border-blue-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-blue-700/40" : "bg-blue-200"}`}>
              <FiMessageCircle className={`text-2xl ${darkMode ? "text-blue-300" : "text-blue-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total Feedback</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{totalFeedback}</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Received</p>
        </div>

        {/* Average Rating */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-700/40 hover:border-yellow-600/60"
            : "bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200/60 hover:border-yellow-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-yellow-700/40" : "bg-yellow-200"}`}>
              <FiStar className={`text-2xl ${darkMode ? "text-yellow-300" : "text-yellow-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Average Rating</p>
          <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{averageRating}/5</p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Overall score</p>
        </div>

        {/* Latest Feedback */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/40 hover:border-green-600/60"
            : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60 hover:border-green-300"
        } hover:shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-green-700/40" : "bg-green-200"}`}>
              <FiCalendar className={`text-2xl ${darkMode ? "text-green-300" : "text-green-600"}`} />
            </div>
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Latest Feedback</p>
          <p className={`text-lg font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            {new Date(feedbackData[0].date).toLocaleDateString()}
          </p>
          <p className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Most recent</p>
        </div>
      </div>

      {/* PROVIDE FEEDBACK SECTION */}
      {!showForm && (
        <div className={`p-8 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40"
            : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Share Your Feedback 📝
              </h3>
              <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
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
            <FeedbackDetailCard key={feedback.id} feedback={feedback} darkMode={darkMode} />
          ))
        ) : (
          <div className={`p-12 rounded-2xl text-center ${
            darkMode 
              ? "bg-gray-800/50 border border-gray-700" 
              : "bg-white border border-gray-200"
          }`}>
            <p className={`text-lg font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              No feedback found in this category
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
