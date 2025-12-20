import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheckCircle } from "react-icons/fi";

const SemesterManagement = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [searchYear, setSearchYear] = useState("");

  const [formData, setFormData] = useState({
    academicYear: "",
    semesterNumber: "",
    semesterName: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllSemesters();
      setSemesters(data.semesters || []);
    } catch (error) {
      showError(error.response?.data?.error || "Failed to fetch semesters");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingSemester(null);
    setFormData({
      academicYear: "",
      semesterNumber: "",
      semesterName: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Validation
      if (
        !formData.academicYear ||
        !formData.semesterNumber ||
        !formData.startDate ||
        !formData.endDate
      ) {
        showError("Please fill all required fields");
        return;
      }

      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate >= endDate) {
        showError("End date must be after start date");
        return;
      }

      if (editingSemester) {
        await adminAPI.updateSemester(editingSemester._id, formData);
        showSuccess("Semester updated successfully");
      } else {
        await adminAPI.createSemester(formData);
        showSuccess("Semester created successfully");
      }

      setShowModal(false);
      fetchSemesters();
    } catch (error) {
      showError(error.response?.data?.error || "Failed to save semester");
    }
  };

  const handleDelete = async (semesterId) => {
    if (window.confirm("Are you sure you want to delete this semester?")) {
      try {
        await adminAPI.deleteSemester(semesterId);
        showSuccess("Semester deleted successfully");
        fetchSemesters();
      } catch (error) {
        showError(error.response?.data?.error || "Failed to delete semester");
      }
    }
  };

  const getStatusBadge = (semester) => {
    const now = new Date();
    const start = new Date(semester.startDate);
    const end = new Date(semester.endDate);

    if (now >= start && now <= end) {
      return <span className="badge badge-active">Active</span>;
    } else if (now < start) {
      return <span className="badge badge-scheduled">Scheduled</span>;
    } else {
      return <span className="badge badge-completed">Completed</span>;
    }
  };

  const filteredSemesters = searchYear
    ? semesters.filter((sem) => sem.academicYear.includes(searchYear))
    : semesters;

  const groupedBySemester = filteredSemesters.reduce((acc, sem) => {
    const year = sem.academicYear;
    if (!acc[year]) acc[year] = [];
    acc[year].push(sem);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="semester-container">
        <div className="loading-state">Loading semesters...</div>
      </div>
    );
  }

  return (
    <div className="semester-container">
      <div className="page-header">
        <div>
          <h2>Semester Management</h2>
          <p>Create and manage academic semesters</p>
        </div>
        <button className="btn-primary" onClick={handleCreateNew}>
          <FiPlus /> Create Semester
        </button>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by academic year (e.g., 2024-2025)"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Semesters by Year */}
      <div className="semesters-list">
        {Object.keys(groupedBySemester).length > 0 ? (
          Object.keys(groupedBySemester)
            .sort()
            .reverse()
            .map((year) => (
              <div key={year} className="year-section">
                <h3 className="year-title">{year}</h3>
                <div className="semester-grid">
                  {groupedBySemester[year]
                    .sort((a, b) => a.semesterNumber - b.semesterNumber)
                    .map((semester) => (
                      <div key={semester._id} className="semester-card">
                        <div className="card-header-sem">
                          <div>
                            <h4>
                              Semester {semester.semesterNumber}{" "}
                              {semester.semesterName &&
                                `(${semester.semesterName})`}
                            </h4>
                            {getStatusBadge(semester)}
                          </div>
                          <div className="card-actions">
                            <button
                              className="btn-icon edit"
                              title="Edit"
                              onClick={() => {
                                setEditingSemester(semester);
                                setFormData({
                                  academicYear: semester.academicYear,
                                  semesterNumber:
                                    semester.semesterNumber.toString(),
                                  semesterName: semester.semesterName || "",
                                  startDate: semester.startDate.split("T")[0],
                                  endDate: semester.endDate.split("T")[0],
                                  description: semester.description || "",
                                });
                                setShowModal(true);
                              }}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              className="btn-icon delete"
                              title="Delete"
                              onClick={() => handleDelete(semester._id)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>

                        <div className="card-body-sem">
                          <p className="info-row">
                            <span className="label">Start Date:</span>
                            <span className="value">
                              {new Date(semester.startDate).toLocaleDateString(
                                "en-IN"
                              )}
                            </span>
                          </p>
                          <p className="info-row">
                            <span className="label">End Date:</span>
                            <span className="value">
                              {new Date(semester.endDate).toLocaleDateString(
                                "en-IN"
                              )}
                            </span>
                          </p>
                          <p className="info-row">
                            <span className="label">Duration:</span>
                            <span className="value">
                              {Math.ceil(
                                (new Date(semester.endDate) -
                                  new Date(semester.startDate)) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days
                            </span>
                          </p>
                          {semester.description && (
                            <p className="info-row">
                              <span className="label">Description:</span>
                              <span className="value">
                                {semester.description}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
        ) : (
          <div className="empty-state">
            <FiCheckCircle className="empty-icon" />
            <p>No semesters found. Create one to get started!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingSemester ? "Edit Semester" : "Create New Semester"}
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
                  placeholder="e.g., 2024-2025"
                  value={formData.academicYear}
                  onChange={(e) =>
                    setFormData({ ...formData, academicYear: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Semester Number *</label>
                  <select
                    value={formData.semesterNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        semesterNumber: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        Semester {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Semester Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Spring 2024, Fall 2024"
                    value={formData.semesterName}
                    onChange={(e) =>
                      setFormData({ ...formData, semesterName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Add any notes or description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                {editingSemester ? "Update Semester" : "Create Semester"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterManagement;
