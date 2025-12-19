import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiUsers,
  FiCheckSquare,
  FiBarChart2,
  FiFileText,
  FiLoader,
  FiCheck,
  FiX,
  FiTrendingUp,
} from "react-icons/fi";
import { tgAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";

export default function Dashboard() {
  const { darkMode, tg } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgAttendance: 0,
    avgMarks: 0,
    pendingLeaves: 0,
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [approving, setApproving] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get dashboard stats (includes monthly attendance)
      const dashboardRes = await tgAPI.getDashboardStats();
      setStats(
        dashboardRes.stats || {
          totalStudents: 0,
          avgAttendance: 0,
          avgMarks: 0,
          pendingLeaves: 0,
        }
      );
      setMonthlyAttendance(dashboardRes.monthlyAttendance || []);

      // Get leave requests
      const leaveRes = await tgAPI.getLeaveRequests();
      setLeaveRequests(leaveRes.leaveRequests || []);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      showError("Failed to fetch dashboard data");
      setLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      setApproving(leaveId);
      await tgAPI.approveLeave(leaveId, { status: "approved" });
      showSuccess("Leave approved!");
      setLeaveRequests(leaveRequests.filter((l) => l._id !== leaveId));
    } catch (err) {
      showError("Failed to approve leave");
      console.error(err);
    } finally {
      setApproving(null);
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      setApproving(leaveId);
      await tgAPI.rejectLeave(leaveId, { status: "rejected" });
      showSuccess("Leave rejected!");
      setLeaveRequests(leaveRequests.filter((l) => l._id !== leaveId));
    } catch (err) {
      showError("Failed to reject leave");
      console.error(err);
    } finally {
      setApproving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-2xl text-blue-600" />
      </div>
    );
  }

  const pendingLeaves = leaveRequests.filter((l) => l.status === "pending");

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1
          className={`text-4xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome, {tg?.name}
        </h1>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {tg?.department} • {tg?.section} Section
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40"
              : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Students
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.totalStudents}
              </p>
            </div>
            <div
              className={`p-4 rounded-xl ${
                darkMode ? "bg-blue-700/40" : "bg-blue-200"
              }`}
            >
              <FiUsers
                className={`text-2xl ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Avg Attendance */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/40"
              : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Avg Attendance
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.avgAttendance}%
              </p>
            </div>
            <div
              className={`p-4 rounded-xl ${
                darkMode ? "bg-green-700/40" : "bg-green-200"
              }`}
            >
              <FiCheckSquare
                className={`text-2xl ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Avg Marks */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40"
              : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Class Avg Marks
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.avgMarks}
              </p>
            </div>
            <div
              className={`p-4 rounded-xl ${
                darkMode ? "bg-purple-700/40" : "bg-purple-200"
              }`}
            >
              <FiBarChart2
                className={`text-2xl ${
                  darkMode ? "text-purple-300" : "text-purple-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Pending Leaves */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700/40"
              : "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Pending Leaves
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.pendingLeaves}
              </p>
            </div>
            <div
              className={`p-4 rounded-xl ${
                darkMode ? "bg-orange-700/40" : "bg-orange-200"
              }`}
            >
              <FiFileText
                className={`text-2xl ${
                  darkMode ? "text-orange-300" : "text-orange-600"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ATTENDANCE CHART */}
      <div>
        <h2
          className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <FiTrendingUp />
          Monthly Attendance Trend
        </h2>

        <div
          className={`p-8 rounded-2xl border ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-end justify-between h-64 gap-3">
            {monthlyAttendance.map((data, idx) => {
              const maxHeight = Math.max(
                ...monthlyAttendance.map((d) => d.percentage)
              );
              const heightPercent = (data.percentage / maxHeight) * 100;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                      darkMode
                        ? "bg-gradient-to-t from-blue-600 to-blue-500"
                        : "bg-gradient-to-t from-blue-500 to-blue-400"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div
                      className={`text-xs font-bold text-white text-center mt-2 ${
                        heightPercent > 20 ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {data.percentage}%
                    </div>
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {data.month}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700/30 flex justify-between">
            <div>
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                HIGHEST
              </p>
              <p
                className={`text-lg font-bold mt-1 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {monthlyAttendance.length > 0
                  ? Math.max(...monthlyAttendance.map((m) => m.percentage))
                  : 0}
                %
              </p>
            </div>
            <div>
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                AVERAGE
              </p>
              <p
                className={`text-lg font-bold mt-1 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {stats.avgAttendance}%
              </p>
            </div>
            <div>
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                LOWEST
              </p>
              <p
                className={`text-lg font-bold mt-1 ${
                  darkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                {monthlyAttendance.length > 0
                  ? Math.min(...monthlyAttendance.map((m) => m.percentage))
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LEAVE REQUESTS */}
      <div>
        <h2
          className={`text-xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Leave Requests to Review
        </h2>

        {pendingLeaves.length === 0 ? (
          <div
            className={`p-8 rounded-2xl text-center border-2 border-dashed ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              ✓ No pending leave requests
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingLeaves.map((leave) => (
              <div
                key={leave._id}
                className={`p-6 rounded-2xl border ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-lg ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {leave.studentId?.name}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {leave.studentId?.enrollmentNumber} • {leave.leaveType}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          FROM
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          TO
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {new Date(leave.toDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`text-sm mt-3 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <strong>Reason:</strong> {leave.reason}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApproveLeave(leave._id)}
                      disabled={approving === leave._id}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {approving === leave._id ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <FiCheck />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectLeave(leave._id)}
                      disabled={approving === leave._id}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {approving === leave._id ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <FiX />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
