import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { hodAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";
import "../../../styles/hod/ScheduleManagement.css";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiLoader,
} from "react-icons/fi";

const ScheduleManagement = () => {
  const { darkMode } = useOutletContext();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [viewingSchedule, setViewingSchedule] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filters, setFilters] = useState({
    academicYear: "",
    year: "",
    branch: "",
    section: "",
  });

  // Form states
  const [formData, setFormData] = useState({
    academicYear: "",
    year: "",
    branch: "",
    section: "",
    semester: "",
    timeSlots: [],
    remarks: "",
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await hodAPI.getAllSchedules();
      setSchedules(data.schedules || []);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingSchedule(null);
    setFormData({
      academicYear: "",
      year: "",
      branch: "",
      section: "",
      semester: "",
      timeSlots: [],
      remarks: "",
    });
    setShowModal(true);
  };

  const handleAddTimeSlot = () => {
    setFormData({
      ...formData,
      timeSlots: [
        ...formData.timeSlots,
        {
          day: "Monday",
          startTime: "09:00",
          endTime: "10:30",
          classType: "Theory",
          faculty: "",
          subject: "",
          subjectName: "",
          subjectCode: "",
          location: "Classroom",
        },
      ],
    });
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updatedSlots = [...formData.timeSlots];
    updatedSlots[index][field] = value;
    setFormData({ ...formData, timeSlots: updatedSlots });
  };

  const handleRemoveTimeSlot = (index) => {
    const updatedSlots = formData.timeSlots.filter((_, i) => i !== index);
    setFormData({ ...formData, timeSlots: updatedSlots });
  };

  const handleSaveSchedule = async () => {
    try {
      if (
        !formData.academicYear ||
        !formData.year ||
        !formData.branch ||
        !formData.section ||
        !formData.semester
      ) {
        showError("Please fill all required fields");
        return;
      }

      if (formData.timeSlots.length === 0) {
        showError("Please add at least one time slot");
        return;
      }

      if (editingSchedule) {
        await hodAPI.updateSchedule(editingSchedule._id, formData);
        showSuccess("Schedule updated successfully");
      } else {
        await hodAPI.createSchedule(formData);
        showSuccess("Schedule created successfully");
      }

      setShowModal(false);
      fetchSchedules();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to save schedule");
    }
  };

  const handlePublish = async (scheduleId) => {
    try {
      await hodAPI.publishSchedule(scheduleId);
      showSuccess("Schedule published successfully");
      fetchSchedules();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to publish schedule");
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await hodAPI.deleteSchedule(scheduleId);
        showSuccess("Schedule deleted successfully");
        fetchSchedules();
      } catch (error) {
        showError(error.response?.data?.message || "Failed to delete schedule");
      }
    }
  };

  const handleViewSchedule = (schedule) => {
    setViewingSchedule(schedule);
    setShowViewModal(true);
  };

  const filterSchedules = () => {
    return schedules.filter((schedule) => {
      return (
        (!filters.academicYear ||
          schedule.academicYear === filters.academicYear) &&
        (!filters.year || schedule.year.toString() === filters.year) &&
        (!filters.branch || schedule.branch === filters.branch) &&
        (!filters.section || schedule.section === filters.section)
      );
    });
  };

  if (loading) {
    return (
      <div className={`schedule-container ${darkMode ? "dark" : ""}`}>
        <div className="loading-state">Loading schedules...</div>
      </div>
    );
  }

  const filteredSchedules = filterSchedules();
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className={`schedule-container ${darkMode ? "dark" : ""}`}>
      <div className="schedule-header">
        <div>
          <h2>Schedule Management</h2>
          <p>Create and manage class schedules</p>
        </div>
        <button className="btn-primary" onClick={handleCreateNew}>
          <FiPlus /> Create New Schedule
        </button>
      </div>

      {/* Filters */}
      <div className={`filters-section ${darkMode ? "dark" : ""}`}>
        <input
          type="text"
          placeholder="Academic Year (e.g., 2024-2025)"
          value={filters.academicYear}
          onChange={(e) =>
            setFilters({ ...filters, academicYear: e.target.value })
          }
          className={darkMode ? "dark" : ""}
        />
        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className={darkMode ? "dark" : ""}
        >
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
        <input
          type="text"
          placeholder="Branch (e.g., CSE)"
          value={filters.branch}
          onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
          className={darkMode ? "dark" : ""}
        />
        <input
          type="text"
          placeholder="Section (e.g., A)"
          value={filters.section}
          onChange={(e) => setFilters({ ...filters, section: e.target.value })}
          className={darkMode ? "dark" : ""}
        />
      </div>

      {/* Schedules Grid */}
      <div className="schedules-grid">
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <div
              key={schedule._id}
              className={`schedule-card ${darkMode ? "dark" : ""}`}
            >
              <div className="card-header">
                <div className="card-title">
                  <h3>
                    {schedule.year}
                    {schedule.section} - {schedule.branch}
                  </h3>
                  <span className={`status-badge ${schedule.status}`}>
                    {schedule.status.charAt(0).toUpperCase() +
                      schedule.status.slice(1)}
                  </span>
                </div>
                <div className="card-actions">
                  <button
                    className="btn-icon"
                    title="View"
                    onClick={() => handleViewSchedule(schedule)}
                  >
                    <FiEye />
                  </button>
                  <button
                    className="btn-icon edit"
                    title="Edit"
                    onClick={() => {
                      setEditingSchedule(schedule);
                      setFormData({
                        academicYear: schedule.academicYear,
                        year: schedule.year,
                        branch: schedule.branch,
                        section: schedule.section,
                        semester: schedule.semester,
                        timeSlots: schedule.timeSlots,
                        remarks: schedule.remarks,
                      });
                      setShowModal(true);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="btn-icon delete"
                    title="Delete"
                    onClick={() => handleDelete(schedule._id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="card-body">
                <p className="meta">
                  <strong>Year:</strong> {schedule.academicYear}
                </p>
                <p className="meta">
                  <strong>Semester:</strong> {schedule.semester}
                </p>
                <p className="meta">
                  <strong>Faculty:</strong>{" "}
                  {schedule.assignedFaculty?.length || 0}
                </p>
                <p className="meta">
                  <strong>Classes:</strong> {schedule.timeSlots?.length || 0}
                </p>
              </div>

              <div className="card-footer">
                {schedule.status === "draft" && (
                  <button
                    className="btn-success"
                    onClick={() => handlePublish(schedule._id)}
                  >
                    <FiCheck /> Publish
                  </button>
                )}
                {schedule.status === "published" && (
                  <span className="status-published">Published & Active</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No schedules found. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className={`modal-content schedule-modal ${darkMode ? "dark" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                {editingSchedule ? "Edit Schedule" : "Create New Schedule"}
              </h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Academic Year *</label>
                <input
                  type="text"
                  placeholder="2024-2025"
                  value={formData.academicYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      academicYear: e.target.value,
                    })
                  }
                  className={darkMode ? "dark" : ""}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Year *</label>
                  <select
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className={darkMode ? "dark" : ""}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Branch *</label>
                  <input
                    type="text"
                    placeholder="CSE, ECE, ME, etc."
                    value={formData.branch}
                    onChange={(e) =>
                      setFormData({ ...formData, branch: e.target.value })
                    }
                    className={darkMode ? "dark" : ""}
                  />
                </div>

                <div className="form-group">
                  <label>Section *</label>
                  <input
                    type="text"
                    placeholder="A, B, C, etc."
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className={darkMode ? "dark" : ""}
                  />
                </div>

                <div className="form-group">
                  <label>Semester *</label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                    className={darkMode ? "dark" : ""}
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Remarks</label>
                <textarea
                  placeholder="Any special notes about this schedule"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className={darkMode ? "dark" : ""}
                  rows="3"
                />
              </div>

              <div className="time-slots-section">
                <div className="section-header">
                  <h3>Schedule (Monday to Saturday)</h3>
                  <button className="btn-secondary" onClick={handleAddTimeSlot}>
                    <FiPlus /> Add Time Slot
                  </button>
                </div>

                {formData.timeSlots.length > 0 ? (
                  <div className="slots-list">
                    {formData.timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`slot-item ${darkMode ? "dark" : ""}`}
                      >
                        <div className="slot-grid">
                          <div className="form-group">
                            <label>Day</label>
                            <select
                              value={slot.day}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  index,
                                  "day",
                                  e.target.value
                                )
                              }
                              className={darkMode ? "dark" : ""}
                            >
                              {daysOfWeek.map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Start Time</label>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className={darkMode ? "dark" : ""}
                            />
                          </div>

                          <div className="form-group">
                            <label>End Time</label>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  index,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className={darkMode ? "dark" : ""}
                            />
                          </div>

                          <div className="form-group">
                            <label>Class Type</label>
                            <select
                              value={slot.classType}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  index,
                                  "classType",
                                  e.target.value
                                )
                              }
                              className={darkMode ? "dark" : ""}
                            >
                              <option value="Theory">Theory</option>
                              <option value="Practical">Practical</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Faculty Name</label>
                            <input
                              type="text"
                              placeholder="Faculty name"
                              value={slot.faculty}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  index,
                                  "faculty",
                                  e.target.value
                                )
                              }
                              className={darkMode ? "dark" : ""}
                            />
                          </div>

                          <div className="form-group">
                            <label>Subject</label>
                            <input
                              type="text"
                              placeholder="Subject name"
                              value={slot.subjectName}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  index,
                                  "subjectName",
                                  e.target.value
                                )
                              }
                              className={darkMode ? "dark" : ""}
                            />
                          </div>

                          <div className="form-group">
                            <label>Subject Code</label>
                            <input
                              type="text"
                              placeholder="Subject code"
                              value={slot.subjectCode}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  index,
                                  "subjectCode",
                                  e.target.value
                                )
                              }
                              className={darkMode ? "dark" : ""}
                            />
                          </div>

                          <div className="form-group">
                            <label>Location</label>
                            <input
                              type="text"
                              placeholder="Room/Lab name"
                              value={slot.location}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                              className={darkMode ? "dark" : ""}
                            />
                          </div>
                        </div>

                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveTimeSlot(index)}
                        >
                          <FiTrash2 /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-slots">
                    No time slots added. Click "Add Time Slot" to start.
                  </p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveSchedule}>
                {editingSchedule ? "Update Schedule" : "Create Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Schedule Modal */}
      {showViewModal && viewingSchedule && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div
            className={`modal-content view-modal ${darkMode ? "dark" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                {viewingSchedule.year}
                {viewingSchedule.section} - {viewingSchedule.branch} Schedule
              </h2>
              <button
                className="btn-close"
                onClick={() => setShowViewModal(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="schedule-info">
                <p>
                  <strong>Academic Year:</strong> {viewingSchedule.academicYear}
                </p>
                <p>
                  <strong>Semester:</strong> {viewingSchedule.semester}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`badge ${viewingSchedule.status}`}>
                    {viewingSchedule.status}
                  </span>
                </p>
              </div>

              <div className="schedule-table">
                <table>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Faculty</th>
                      <th>Subject</th>
                      <th>Location</th>
                      <th>Backup Faculty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingSchedule.timeSlots &&
                      viewingSchedule.timeSlots.map((slot, index) => (
                        <tr key={index}>
                          <td>{slot.day}</td>
                          <td>
                            {slot.startTime} - {slot.endTime}
                          </td>
                          <td>{slot.classType}</td>
                          <td>{slot.faculty?.name || "Unassigned"}</td>
                          <td>{slot.subjectName}</td>
                          <td>{slot.location}</td>
                          <td>
                            {slot.backupFacultyName || "No backup assigned"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
