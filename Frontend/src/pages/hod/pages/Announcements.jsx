import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { hodAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";
import { FiBell, FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

export default function Announcements() {
  const { darkMode } = useOutletContext();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
      setLoading(true);
      const response = await hodAPI.getAnnouncements({
        limit: 50,
        sort: "-createdAt",
      });
      setAnnouncements(response.announcements || []);
    } catch (err) {
      showError("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({
      title: "",
      message: "",
      priority: "medium",
      targetAudience: "all",
    });
    setShowCreateModal(true);
  };

  const handleEditClick = (announcement) => {
    setEditingId(announcement._id);
    setFormData({
      title: announcement.title,
      message: announcement.content,
      priority: announcement.priority || "medium",
      targetAudience: announcement.targetAudience || "all",
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await hodAPI.updateAnnouncement(editingId, formData);
        showSuccess("Announcement updated successfully");
      } else {
        await hodAPI.createAnnouncement(formData);
        showSuccess("Announcement created successfully");
      }
      setShowCreateModal(false);
      fetchAnnouncements();
    } catch (err) {
      showError(err.response?.data?.error || "Failed to save announcement");
    }
  };

  const handleDelete = async (announcementId) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await hodAPI.deleteAnnouncement(announcementId);
        showSuccess("Announcement deleted successfully");
        fetchAnnouncements();
      } catch (err) {
        showError("Failed to delete announcement");
      }
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Create Announcement
        </button>
      </div>

      {announcements.length === 0 ? (
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
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-sm opacity-75 mb-4">
                    {announcement.content}
                  </p>
                  <div className="flex flex-wrap gap-3 items-center">
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
                    <span className="text-xs opacity-60">
                      Target: {announcement.targetAudience || "All"}
                    </span>
                    <span className="text-xs opacity-60">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditClick(announcement)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-xl p-6 w-full max-w-2xl max-h-96 overflow-y-auto ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

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
                    <option value="all">All</option>
                    <option value="faculty">Faculty</option>
                    <option value="student">Students</option>
                    <option value="tg">Class Teachers</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
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
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
