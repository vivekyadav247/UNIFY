import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiMoon, FiSun, FiBell, FiX } from "react-icons/fi";
import Sidebar from "../components/Sidebar/Sidebar";
import { tgAPI } from "../../../services/api";

export default function TgLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [tg, setTg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    const fetchTgProfile = async () => {
      try {
        const response = await tgAPI.getProfile();
        if (response.tg) {
          setTg(response.tg);
        } else {
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error fetching TG profile:", error);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchTgProfile();
  }, [navigate]);

  // Fetch leave requests to show as notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await tgAPI.getLeaveRequests();
        const pendingLeaves = (data.leaveRequests || []).filter(
          (leave) => leave.status === "pending"
        );
        setNotifications(pendingLeaves);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (tg) {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [tg]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teacher guardian dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* SIDEBAR */}
      <Sidebar darkMode={darkMode} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <header
          className={`
            p-6 flex items-center justify-between border-b
            transition-colors duration-300
            ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }
          `}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome Back, {tg?.name || "TG"}
            </h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Teacher Guardian Dashboard
            </p>
          </div>

          <div
            className={`flex items-center gap-6 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div
              onClick={toggleTheme}
              className="cursor-pointer hover:text-blue-500 transition-colors"
            >
              {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </div>

            <div className="relative">
              <div
                onClick={() => setShowNotifications(!showNotifications)}
                className="cursor-pointer hover:text-blue-500 transition-colors relative"
              >
                <FiBell size={22} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {notifications.length > 9 ? "9+" : notifications.length}
                  </span>
                )}
              </div>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div
                  className={`absolute right-0 mt-2 w-80 rounded-lg border shadow-lg z-50 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`p-4 border-b flex items-center justify-between ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <h3
                      className={`font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Notifications
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="hover:bg-gray-400 rounded p-1"
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div
                        className={`p-4 text-center ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        No pending notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-4 border-b ${
                            darkMode
                              ? "border-gray-700 hover:bg-gray-700"
                              : "border-gray-200 hover:bg-gray-50"
                          } cursor-pointer transition-colors`}
                        >
                          <p
                            className={`font-semibold text-sm ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            New Leave Request
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {notif.studentId?.name || "Student"} -{" "}
                            {notif.leaveType}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              darkMode ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div
                    className={`p-3 border-t text-center ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => {
                        navigate("/tg/leave-request");
                        setShowNotifications(false);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      View All Leave Requests
                    </button>
                  </div>
                </div>
              )}
            </div>

            <img
              src={`https://ui-avatars.com/api/?name=${
                tg?.name || "TG"
              }&background=2563eb&color=fff`}
              className="w-10 h-10 rounded-full shadow border"
              alt="avatar"
            />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet context={{ darkMode, tg }} />
        </main>
      </div>
    </div>
  );
}
