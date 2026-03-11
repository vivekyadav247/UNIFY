import React, { useState } from "react";

export default function SendFeedbackForm({ darkMode, onClose }) {
  const [formData, setFormData] = useState({
    type: "general",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      className={`p-6 rounded-2xl transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800/50 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Request Feedback
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TYPE SELECT */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Feedback Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg transition-colors duration-300 ${
              darkMode
                ? "bg-gray-700 border border-gray-600 text-white"
                : "bg-white border border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="general">General Feedback</option>
            <option value="academic">Academic Performance</option>
            <option value="mentorship">Mentorship</option>
            <option value="behavioral">Behavioral</option>
          </select>
        </div>

        {/* MESSAGE TEXTAREA */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Your Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows="5"
            placeholder="Write your feedback request here..."
            className={`w-full px-4 py-2 rounded-lg transition-colors duration-300 ${
              darkMode
                ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-500"
                : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              darkMode
                ? "border border-gray-600 text-white hover:bg-gray-700"
                : "border border-gray-300 text-gray-900 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
