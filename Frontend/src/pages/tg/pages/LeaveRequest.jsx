import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiCalendar,
  FiClipboard,
  FiAlertCircle,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import { tgAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";

export default function LeaveRequest() {
  const { darkMode } = useOutletContext();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");

  useEffect(() => {
    fetchLeaveRequests();
  }, [filterStatus]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const data = await tgAPI.getLeaveRequests();

      // Filter by status
      let filtered = data.leaveRequests || [];
      if (filterStatus !== "all") {
        filtered = filtered.filter((l) => l.status === filterStatus);
      }

      setLeaveRequests(filtered);
    } catch (err) {
      showError("Failed to fetch leave requests");
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      setApproving(leaveId);
      await tgAPI.approveLeave(leaveId, {});
      showSuccess("Leave approved!");
      setLeaveRequests(leaveRequests.filter((l) => l._id !== leaveId));
    } catch (err) {
      showError("Failed to approve leave");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (leaveId) => {
    if (
      !window.confirm("Are you sure you want to reject this leave request?")
    ) {
      return;
    }
    try {
      setApproving(leaveId);
      await tgAPI.rejectLeave(leaveId, {});
      showSuccess("Leave rejected!");
      setLeaveRequests(leaveRequests.filter((l) => l._id !== leaveId));
    } catch (err) {
      showError("Failed to reject leave");
    } finally {
      setApproving(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return darkMode
          ? "bg-yellow-900/30 border-yellow-700/50 text-yellow-300"
          : "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "approved":
        return darkMode
          ? "bg-green-900/30 border-green-700/50 text-green-300"
          : "bg-green-50 border-green-200 text-green-700";
      case "rejected":
        return darkMode
          ? "bg-red-900/30 border-red-700/50 text-red-300"
          : "bg-red-50 border-red-200 text-red-700";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-xl" />;
      case "approved":
        return <FiCheckCircle className="text-xl" />;
      case "rejected":
        return <FiXCircle className="text-xl" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Leave Requests
        </h1>
        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Manage and approve student leave requests
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-3 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              filterStatus === status
                ? darkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : darkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div
          className={`p-12 rounded-2xl border flex items-center justify-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <FiLoader className="animate-spin text-2xl mr-3" />
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Loading leave requests...
          </p>
        </div>
      ) : leaveRequests.length === 0 ? (
        <div
          className={`p-12 rounded-2xl border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <FiClipboard className="text-4xl mx-auto mb-3 text-gray-400" />
          <p
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No {filterStatus === "all" ? "" : filterStatus} leave requests
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((leave) => (
            <div
              key={leave._id}
              className={`p-6 rounded-2xl border ${getStatusColor(
                leave.status
              )}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`p-3 rounded-lg ${
                      darkMode ? "bg-gray-800/50" : "bg-gray-100/50"
                    }`}
                  >
                    {getStatusIcon(leave.status)}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`text-lg font-bold ${
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
                      {leave.studentId?.enrollmentNumber} • Semester{" "}
                      {leave.studentId?.semesterNumber}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          LEAVE TYPE
                        </p>
                        <p
                          className={`text-sm font-medium mt-1 capitalize ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {leave.leaveType}
                        </p>
                      </div>

                      <div>
                        <p
                          className={`text-xs font-semibold flex items-center gap-1 ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          <FiCalendar size={12} /> FROM
                        </p>
                        <p
                          className={`text-sm font-medium mt-1 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p
                          className={`text-xs font-semibold flex items-center gap-1 ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          <FiCalendar size={12} /> TO
                        </p>
                        <p
                          className={`text-sm font-medium mt-1 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {new Date(leave.toDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          DAYS
                        </p>
                        <p
                          className={`text-sm font-medium mt-1 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {Math.ceil(
                            (new Date(leave.toDate) -
                              new Date(leave.fromDate)) /
                              (1000 * 60 * 60 * 24)
                          ) + 1}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p
                        className={`text-xs font-semibold ${
                          darkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        REASON
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {leave.reason}
                      </p>
                    </div>

                    <p
                      className={`text-xs mt-3 ${
                        darkMode ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Applied on{" "}
                      {new Date(leave.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Only for pending */}
                {leave.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(leave._id)}
                      disabled={approving === leave._id}
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-all"
                    >
                      {approving === leave._id ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <FiCheckCircle />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(leave._id)}
                      disabled={approving === leave._id}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-all"
                    >
                      {approving === leave._id ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <FiXCircle />
                      )}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
