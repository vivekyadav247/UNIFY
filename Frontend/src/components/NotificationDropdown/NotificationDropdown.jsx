import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiX, FiCheck, FiCheckCircle } from "react-icons/fi";
import { useNotifications } from "../../contexts/NotificationContext";

const NotificationDropdown = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "announcement":
        return "📢";
      case "assignment":
        return "📝";
      case "leave":
        return "🏖️";
      case "marks":
        return "📊";
      case "attendance":
        return "✅";
      default:
        return "🔔";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-lg transition-all duration-200
          ${
            darkMode
              ? "hover:bg-gray-800 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
          }
        `}
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`
            absolute right-0 mt-2 w-96 rounded-lg shadow-xl z-50 border overflow-hidden
            ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }
          `}
        >
          {/* Header */}
          <div
            className={`
              px-4 py-3 border-b flex items-center justify-between
              ${darkMode ? "border-gray-700" : "border-gray-200"}
            `}
          >
            <h3
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
              >
                <FiCheckCircle className="text-sm" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FiBell
                  className={`mx-auto text-4xl mb-2 ${
                    darkMode ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    px-4 py-3 border-b cursor-pointer transition-colors
                    ${
                      !notification.read
                        ? darkMode
                          ? "bg-blue-900/20 hover:bg-blue-900/30"
                          : "bg-blue-50 hover:bg-blue-100"
                        : darkMode
                        ? "hover:bg-gray-700/50"
                        : "hover:bg-gray-50"
                    }
                    ${darkMode ? "border-gray-700" : "border-gray-100"}
                  `}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm mb-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p
                        className={`text-sm mb-2 line-clamp-2 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                        className={`
                          p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600
                          ${darkMode ? "text-gray-400" : "text-gray-500"}
                        `}
                      >
                        <FiX className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
