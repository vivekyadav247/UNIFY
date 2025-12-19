import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { facultyAPI } from "../../../../services/api";

export default function NotificationsCard() {
  const { darkMode } = useOutletContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Placeholder: Replace with actual API when backend endpoint is ready
        setNotifications([]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getIconColor = (type) => {
    const colors = {
      info: "text-blue-500",
      success: "text-green-500",
      warning: "text-orange-500",
      error: "text-red-500",
    };
    return colors[type] || "text-gray-500";
  };

  if (loading) {
    return (
      <div
        className={`rounded-2xl p-6 shadow space-y-4 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold">Recent Notifications</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-16 rounded-lg animate-pulse ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-6 shadow space-y-4 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <h2 className="text-lg font-semibold">Recent Notifications</h2>

      {notifications.length === 0 ? (
        <div
          className={`text-center py-8 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <FiBell size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <FiBell className={`mt-1 ${getIconColor(notif.type)}`} size={18} />
            <div className="flex-1">
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {notif.text}
              </p>
              <p
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {notif.time}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
