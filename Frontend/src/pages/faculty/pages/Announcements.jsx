import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { facultyAPI } from "../../../services/api";
import { FiPlus, FiBell } from "react-icons/fi";

export default function Announcements() {
  const { darkMode } = useOutletContext();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "medium",
    targetAudience: "all",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await facultyAPI.getAnnouncements();
      setAnnouncements(response.announcements || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await facultyAPI.createAnnouncement(formData);
      setShowCreateModal(false);
      setFormData({
        title: "",
        message: "",
        priority: "medium",
        targetAudience: "all",
      });
      fetchAnnouncements();
    } catch (error) {}
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: darkMode
        ? "bg-blue-900/30 border-blue-700"
        : "bg-blue-100 border-blue-300",
      medium: darkMode
        ? "bg-yellow-900/30 border-yellow-700"
        : "bg-yellow-100 border-yellow-300",
      high: darkMode
        ? "bg-red-900/30 border-red-700"
        : "bg-red-100 border-red-300",
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Announcements</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus /> Create Announcement
          </button>
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div
            className={`rounded-xl shadow-lg p-12 text-center ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <FiBell className="mx-auto text-6xl opacity-20 mb-4" />
            <p className="text-gray-500">No announcements yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className={`rounded-xl shadow-lg p-6 border-l-4 ${getPriorityColor(
                  announcement.priority
                )} ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">
                    {announcement.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      announcement.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : announcement.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {announcement.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm opacity-75 mb-4">
                  {announcement.message}
                </p>
                <div className="flex justify-between items-center text-xs opacity-60">
                  <span>Target: {announcement.targetAudience || "All"}</span>
                  <span>
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-xl p-6 w-full max-w-2xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Create Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-white border border-gray-300"
                  }`}
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows="4"
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-white border border-gray-300"
                  }`}
                  placeholder="Announcement message..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700"
                        : "bg-white border border-gray-300"
                    }`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Target Audience
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetAudience: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700"
                        : "bg-white border border-gray-300"
                    }`}
                  >
                    <option value="all">All Students</option>
                    <option value="department">My Department</option>
                    <option value="class">Specific Class</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
