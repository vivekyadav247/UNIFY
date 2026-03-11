import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { hodAPI } from "../../../services/api";
import { showError } from "../../../utils/notifications";
import "../../../styles/hod/FacultyAttendance.css";

const FacultyAttendance = () => {
  const { darkMode } = useOutletContext();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchFacultyAttendance();
  }, []);

  const fetchFacultyAttendance = async () => {
    try {
      setLoading(true);
      const data = await hodAPI.getTodayFacultyAttendance();
      setAttendanceData(data.data || {});
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to fetch attendance data"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTodayDate = () => {
    return formatDate(new Date());
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?"
    );
  };

  if (loading) {
    return <div className="loading-state">Loading attendance data...</div>;
  }

  return (
    <div className={`faculty-attendance-container ${darkMode ? "dark" : ""}`}>
      <div className="attendance-header">
        <div>
          <h2>Faculty Attendance</h2>
          <p>Today's Faculty Presence & Absence</p>
        </div>
        <div className="header-date">{getTodayDate()}</div>
      </div>

      <div className="attendance-summary">
        <div className="summary-card total">
          <div className="summary-number">
            {attendanceData?.totalFaculty || 0}
          </div>
          <div className="summary-label">Total Faculty</div>
        </div>

        <div className="summary-card present">
          <div className="summary-number">
            {attendanceData?.presentFaculty?.length || 0}
          </div>
          <div className="summary-label">Present</div>
        </div>

        <div className="summary-card absent">
          <div className="summary-number">
            {attendanceData?.onLeaveFaculty?.length || 0}
          </div>
          <div className="summary-label">On Leave</div>
        </div>

        <div className="summary-card percentage">
          <div className="summary-number">
            {attendanceData?.presentPercentage
              ? `${attendanceData.presentPercentage}%`
              : "0%"}
          </div>
          <div className="summary-label">Attendance %</div>
        </div>
      </div>

      <div className="attendance-lists">
        <div className="attendance-section">
          <div className="section-header">
            <h3>Present Today</h3>
            <span className="count">
              {attendanceData?.presentFaculty?.length || 0}
            </span>
          </div>

          {attendanceData?.presentFaculty?.length > 0 ? (
            <div className="faculty-list">
              {attendanceData.presentFaculty.map((faculty) => (
                <div key={faculty._id} className="faculty-item present-item">
                  <div className="faculty-avatar present-avatar">
                    {getInitials(faculty.name)}
                  </div>
                  <div className="faculty-info">
                    <h4>{faculty.name}</h4>
                    <p>{faculty.facultyId}</p>
                  </div>
                  <div className="status-badge present-badge">Present</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-list">No faculty marked present</div>
          )}
        </div>

        <div className="attendance-section">
          <div className="section-header">
            <h3>On Leave</h3>
            <span className="count">
              {attendanceData?.onLeaveFaculty?.length || 0}
            </span>
          </div>

          {attendanceData?.onLeaveFaculty?.length > 0 ? (
            <div className="faculty-list">
              {attendanceData.onLeaveFaculty.map((faculty) => (
                <div key={faculty._id} className="faculty-item leave-item">
                  <div className="faculty-avatar leave-avatar">
                    {getInitials(faculty.name)}
                  </div>
                  <div className="faculty-info">
                    <h4>{faculty.name}</h4>
                    <p>{faculty.facultyId}</p>
                  </div>
                  <div className="status-badge leave-badge">On Leave</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-list">No faculty on leave</div>
          )}
        </div>
      </div>

      <div className="attendance-note">
        <p>
          This view updates daily at 9:00 AM. It shows which faculty members
          have approved leaves scheduled for today.
        </p>
      </div>
    </div>
  );
};

export default FacultyAttendance;
