import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiBell,
  FiCalendar,
  FiUser,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { studentAPI } from "../../../services/api";
import {
  showSuccess,
  showError,
  notifyNewAnnouncement,
} from "../../../utils/notifications";

export default function Announcements() {
  const { darkMode, student } = useOutletContext();
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
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
    fetchAnnouncements(selectedSemester);
    // Auto-refresh every minute for new announcements
    const interval = setInterval(
      () => fetchAnnouncements(selectedSemester),
      60000
    );
    return () => clearInterval(interval);
  }, [selectedSemester]);

  const fetchAnnouncements = async (semester) => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await studentAPI.getAnnouncements({
        semesterNumber: semester,
      });

      // Transform backend response
      const announcements = response.announcements || [];
      const transformedData = announcements
        .map((ann) => ({
          _id: ann._id,
          title: ann.title || "Untitled Announcement",
          description: ann.description || "No description provided",
          postedBy: ann.postedBy || "Administration",
          category: ann.category || "General",
          priority: ann.priority || "normal",
          attachments: ann.attachments || [],
          createdAt: new Date(ann.createdAt),
          date: new Date(ann.createdAt).toLocaleDateString(),
          time: new Date(ann.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isNew:
            new Date(ann.createdAt) >
            new Date(Date.now() - 24 * 60 * 60 * 1000),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setAnnouncementsData(transformedData);

      // Notify if new announcement
      if (transformedData.length > 0 && refreshing) {
        const latest = transformedData[0];
        if (latest.isNew) {
          notifyNewAnnouncement(latest.title);
          showSuccess("New announcements!");
        }
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch announcements";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredAnnouncements =
    filter === "all"
      ? announcementsData
      : announcementsData.filter(
          (a) => a.priority === filter || a.category === filter
        );

  const getBackgroundColor = (priority) => {
    const colors = {
      high: darkMode
        ? "bg-red-900/20 border-red-700/40"
        : "bg-red-50 border-red-200",
      medium: darkMode
        ? "bg-yellow-900/20 border-yellow-700/40"
        : "bg-yellow-50 border-yellow-200",
      normal: darkMode
        ? "bg-blue-900/20 border-blue-700/40"
        : "bg-blue-50 border-blue-200",
    };
    return colors[priority] || colors.normal;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: "[URGENT]",
      medium: "[IMPORTANT]",
      normal: "[GENERAL]",
    };
    return badges[priority] || badges.normal;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-xl ${darkMode ? "text-white" : "text-gray-900"}`}>
          Loading announcements...
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
            Announcements
          </h1>
          <p
            className={`mt-2 text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Stay updated with latest announcements and notices
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
              onClick={() => fetchAnnouncements(selectedSemester)}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg transition ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Refresh announcements"
            >
              <FiRefreshCw
                className={`inline ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {error && announcementsData.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === "all"
              ? darkMode
                ? "bg-blue-600 text-white"
                : "bg-blue-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("high")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === "high"
              ? "bg-red-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          [URGENT]
        </button>
        <button
          onClick={() => setFilter("medium")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === "medium"
              ? "bg-yellow-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          [IMPORTANT]
        </button>
        <button
          onClick={() => setFilter("normal")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === "normal"
              ? "bg-blue-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          [GENERAL]
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-linear-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40"
              : "bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FiBell className="text-2xl text-blue-500" />
          </div>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total Announcements
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {announcementsData.length}
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-linear-to-br from-red-900/30 to-red-800/20 border-red-700/40"
              : "bg-linear-to-br from-red-50 to-red-100/50 border-red-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">[U]</span>
          </div>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Urgent
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {announcementsData.filter((a) => a.priority === "high").length}
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-linear-to-br from-green-900/30 to-green-800/20 border-green-700/40"
              : "bg-linear-to-br from-green-50 to-green-100/50 border-green-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">[N]</span>
          </div>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            New Today
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {announcementsData.filter((a) => a.isNew).length}
          </p>
        </div>
      </div>

      {/* ANNOUNCEMENTS LIST */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement._id}
              className={`border-l-4 rounded-lg overflow-hidden transition-all ${
                announcement.priority === "high"
                  ? "border-l-red-500"
                  : announcement.priority === "medium"
                  ? "border-l-yellow-500"
                  : "border-l-blue-500"
              } ${
                darkMode
                  ? `bg-gray-800 hover:bg-gray-750`
                  : `bg-white hover:bg-gray-50`
              }`}
            >
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === announcement._id ? null : announcement._id
                  )
                }
                className="w-full text-left p-6 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className={`text-lg font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {announcement.title}
                      {announcement.isNew && (
                        <span className="ml-2 inline-block px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          NEW
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap text-sm">
                    <div className="flex items-center gap-1">
                      <FiUser
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      />
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        {announcement.postedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      />
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        {announcement.date} {announcement.time}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-opacity-20 bg-blue-500">
                      {getPriorityBadge(announcement.priority)}
                    </span>
                  </div>
                </div>
                <div
                  className={`ml-4 transition-transform ${
                    expandedId === announcement._id ? "rotate-180" : ""
                  }`}
                >
                  {expandedId === announcement._id ? (
                    <FiChevronUp className="text-xl" />
                  ) : (
                    <FiChevronDown className="text-xl" />
                  )}
                </div>
              </button>

              {/* EXPANDED CONTENT */}
              {expandedId === announcement._id && (
                <div
                  className={`px-6 pb-6 ${
                    darkMode
                      ? "border-t border-gray-700"
                      : "border-t border-gray-200"
                  }`}
                >
                  <p
                    className={`my-4 leading-relaxed ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {announcement.description}
                  </p>

                  {announcement.attachments &&
                    announcement.attachments.length > 0 && (
                      <div className="mt-4">
                        <p
                          className={`text-sm font-semibold mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Attachments:
                        </p>
                        <div className="space-y-2">
                          {announcement.attachments.map((att, idx) => (
                            <a
                              key={idx}
                              href={att}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                              Download Attachment {idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            className={`text-center py-12 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <FiBell className="text-6xl opacity-20 mx-auto mb-4" />
            <p className="text-lg">No announcements in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
