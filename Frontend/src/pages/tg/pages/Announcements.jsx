import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { tgAPI } from "../../../services/api";
import { showError } from "../../../utils/notifications";
import { FiLoader, FiAlertCircle, FiBell } from "react-icons/fi";

export default function Announcements() {
  const { darkMode } = useOutletContext();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tgAPI.getAnnouncements();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to fetch announcements";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center py-12 ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <FiLoader className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <h1
        className={`text-3xl font-bold mb-6 flex items-center gap-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <FiBell /> Announcements
      </h1>

      {error && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            darkMode
              ? "bg-red-900/30 border border-red-700"
              : "bg-red-100 border border-red-400"
          }`}
        >
          <FiAlertCircle className="text-red-500" />
          <span className={darkMode ? "text-red-300" : "text-red-700"}>
            {error}
          </span>
        </div>
      )}

      {announcements.length === 0 ? (
        <div
          className={`p-8 rounded-2xl border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <FiBell className="text-4xl mx-auto mb-3 text-gray-400" />
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No announcements at the moment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className={`p-6 rounded-2xl border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  : "bg-white border-gray-200 hover:border-blue-400"
              } transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {announcement.title}
                  </h3>
                  <p
                    className={`mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {announcement.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {new Date(announcement.createdAt).toLocaleDateString()} at{" "}
                      {new Date(announcement.createdAt).toLocaleTimeString()}
                    </span>
                    {announcement.facultyId?.name && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          darkMode
                            ? "bg-blue-900 text-blue-300"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {announcement.facultyId.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
