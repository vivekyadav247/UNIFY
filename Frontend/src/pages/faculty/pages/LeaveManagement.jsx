import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { facultyAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";

export default function LeaveManagement() {
  const { darkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState("requests"); // requests or myLeaves
  const [studentLeaveRequests, setStudentLeaveRequests] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "requests") {
        const response = await facultyAPI.getStudentLeaveRequests();
        setStudentLeaveRequests(response.leaveRequests || []);
      } else {
        const response = await facultyAPI.getLeaves();
        setMyLeaves(response.leaves || []);
      }
    } catch (err) {
      showError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await facultyAPI.approveStudentLeave(modalData._id, { remarks });
      showSuccess("Leave approved successfully");
      setShowModal(false);
      setRemarks("");
      fetchData();
    } catch (err) {
      showError(err.response?.data?.error || "Failed to approve leave");
    }
  };

  const handleReject = async () => {
    try {
      await facultyAPI.rejectStudentLeave(modalData._id, { remarks });
      showSuccess("Leave rejected successfully");
      setShowModal(false);
      setRemarks("");
      fetchData();
    } catch (err) {
      showError(err.response?.data?.error || "Failed to reject leave");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pending":
      case "submitted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      <h1 className="text-3xl font-bold">Leave Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "requests"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Student Requests ({studentLeaveRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("myLeaves")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "myLeaves"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          My Leaves ({myLeaves.length})
        </button>
      </div>

      {/* Student Leave Requests */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {studentLeaveRequests.length === 0 ? (
            <div
              className={`rounded-xl p-8 text-center ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <FiClock className="mx-auto text-4xl opacity-30 mb-3" />
              <p className="text-gray-600">No pending leave requests</p>
            </div>
          ) : (
            studentLeaveRequests.map((leave) => (
              <div
                key={leave._id}
                className={`rounded-xl p-6 shadow-lg border-l-4 ${
                  leave.status === "pending" || leave.status === "submitted"
                    ? "border-yellow-500"
                    : leave.status === "approved"
                    ? "border-green-500"
                    : "border-red-500"
                } ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {leave.studentId?.name || "Student"}
                    </h3>
                    <p className="text-sm opacity-70">
                      {leave.studentId?.enrollmentNumber}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      leave.status
                    )}`}
                  >
                    {leave.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-semibold">From:</span>{" "}
                    {formatDate(leave.fromDate)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">To:</span>{" "}
                    {formatDate(leave.toDate)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Reason:</span>{" "}
                    {leave.reason}
                  </p>
                </div>

                {(leave.status === "pending" ||
                  leave.status === "submitted") && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setModalData(leave);
                        setRemarks("");
                        setShowModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <FiCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => {
                        setModalData({ ...leave, action: "reject" });
                        setRemarks("");
                        setShowModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <FiXCircle /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* My Leaves */}
      {activeTab === "myLeaves" && (
        <div className="space-y-4">
          {myLeaves.length === 0 ? (
            <div
              className={`rounded-xl p-8 text-center ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <FiClock className="mx-auto text-4xl opacity-30 mb-3" />
              <p className="text-gray-600">No leave requests submitted</p>
            </div>
          ) : (
            myLeaves.map((leave) => (
              <div
                key={leave._id}
                className={`rounded-xl p-6 shadow-lg border-l-4 ${
                  leave.status === "pending"
                    ? "border-yellow-500"
                    : leave.status === "approved"
                    ? "border-green-500"
                    : "border-red-500"
                } ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {leave.leaveType || "Leave Request"}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      leave.status
                    )}`}
                  >
                    {leave.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-semibold">From:</span>{" "}
                    {formatDate(leave.fromDate || leave.startDate)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">To:</span>{" "}
                    {formatDate(leave.toDate || leave.endDate)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Reason:</span>{" "}
                    {leave.reason}
                  </p>
                  {leave.remarks && (
                    <p className="text-sm">
                      <span className="font-semibold">Remarks:</span>{" "}
                      {leave.remarks}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-xl p-6 w-full max-w-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">
              {modalData.action === "reject" ? "Reject Leave" : "Approve Leave"}
            </h2>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-sm">
                <span className="font-semibold">Student:</span>{" "}
                {modalData.studentId?.name}
              </p>
              <p className="text-sm mt-1">
                <span className="font-semibold">Period:</span>{" "}
                {formatDate(modalData.fromDate)} to{" "}
                {formatDate(modalData.toDate)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                <FiMessageSquare className="inline mr-2" />
                Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg text-sm ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-white border border-gray-300"
                }`}
                placeholder="Add any remarks..."
                rows="3"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              {modalData.action === "reject" ? (
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              ) : (
                <button
                  onClick={handleApprove}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
