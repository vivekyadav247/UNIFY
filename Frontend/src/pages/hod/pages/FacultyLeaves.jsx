import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { hodAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";
import "../../../styles/hod/FacultyLeaves.css";

const FacultyLeaves = () => {
  const { darkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState("pending");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    fetchFacultyLeaveRequests();
  }, []);

  const fetchFacultyLeaveRequests = async () => {
    try {
      setLoading(true);
      const data = await hodAPI.getFacultyLeaveRequests();
      setLeaveRequests(data.data || []);
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to fetch leave requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const openRemarksModal = (leave, action) => {
    setSelectedLeave(leave);
    setActionType(action);
    setRemarks("");
    setShowRemarksModal(true);
  };

  const handleApproveLeave = async () => {
    try {
      await hodAPI.approveFacultyLeave(selectedLeave._id, { remarks });
      showSuccess(`Faculty leave approved successfully`);
      setShowRemarksModal(false);
      fetchFacultyLeaveRequests();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to approve leave");
    }
  };

  const handleRejectLeave = async () => {
    try {
      await hodAPI.rejectFacultyLeave(selectedLeave._id, { remarks });
      showSuccess(`Faculty leave rejected successfully`);
      setShowRemarksModal(false);
      fetchFacultyLeaveRequests();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to reject leave");
    }
  };

  const getPendingRequests = () =>
    leaveRequests.filter(
      (leave) => leave.status === "pending" || leave.status === "submitted"
    );

  const getApprovedRequests = () =>
    leaveRequests.filter(
      (leave) => leave.status === "approved" || leave.status === "rejected"
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "pending":
      case "submitted":
        return "status-pending";
      default:
        return "";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderContent = () => {
    const requests =
      activeTab === "pending" ? getPendingRequests() : getApprovedRequests();

    if (loading) {
      return <div className="loading-state">Loading...</div>;
    }

    if (requests.length === 0) {
      return (
        <div className="empty-state">
          <p>
            {activeTab === "pending"
              ? "No pending faculty leave requests"
              : "No leave history found"}
          </p>
        </div>
      );
    }

    return (
      <div className="leaves-list">
        {requests.map((leave) => (
          <div key={leave._id} className="leave-card">
            <div className="leave-header">
              <div className="faculty-info">
                <h4>{leave.faculty?.name || "Unknown Faculty"}</h4>
                <p className="faculty-id">{leave.faculty?.facultyId}</p>
              </div>
              <span className={`status-badge ${getStatusColor(leave.status)}`}>
                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
              </span>
            </div>

            <div className="leave-details">
              <div className="detail-row">
                <label>From:</label>
                <span>{formatDate(leave.startDate)}</span>
              </div>
              <div className="detail-row">
                <label>To:</label>
                <span>{formatDate(leave.endDate)}</span>
              </div>
              <div className="detail-row">
                <label>Days:</label>
                <span>{leave.numberOfDays} day(s)</span>
              </div>
              <div className="detail-row">
                <label>Reason:</label>
                <span>{leave.reason}</span>
              </div>
              {leave.remarks && (
                <div className="detail-row">
                  <label>Remarks:</label>
                  <span className="remarks-text">{leave.remarks}</span>
                </div>
              )}
              {leave.approvedBy && (
                <div className="detail-row">
                  <label>Approved By:</label>
                  <span>{leave.approvedBy}</span>
                </div>
              )}
            </div>

            {activeTab === "pending" && (
              <div className="action-buttons">
                <button
                  className="btn-approve"
                  onClick={() => openRemarksModal(leave, "approve")}
                >
                  Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => openRemarksModal(leave, "reject")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`faculty-leaves-container ${darkMode ? "dark" : ""}`}>
      <div className="leaves-header">
        <h2>Faculty Leave Management</h2>
        <p>Review and manage faculty leave requests</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests ({getPendingRequests().length})
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History ({getApprovedRequests().length})
        </button>
      </div>

      {renderContent()}

      {showRemarksModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {actionType === "approve" ? "Approve" : "Reject"} Faculty Leave
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowRemarksModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="faculty-name">
                <strong>{selectedLeave?.faculty?.name}</strong>
              </div>
              <div className="leave-dates">
                <p>
                  {formatDate(selectedLeave?.startDate)} to{" "}
                  {formatDate(selectedLeave?.endDate)}
                </p>
              </div>

              <label htmlFor="remarks">Remarks (Optional)</label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={`Enter ${
                  actionType === "approve" ? "approval" : "rejection"
                } remarks...`}
                className="remarks-textarea"
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowRemarksModal(false)}
              >
                Cancel
              </button>
              {actionType === "approve" ? (
                <button className="btn-approve" onClick={handleApproveLeave}>
                  Approve Leave
                </button>
              ) : (
                <button className="btn-reject" onClick={handleRejectLeave}>
                  Reject Leave
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyLeaves;
