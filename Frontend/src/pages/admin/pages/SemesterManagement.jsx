import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCalendar,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

const SemesterManagement = () => {
  const [semesters, setSemesters] = useState([]);
  const [activeAcademicYear, setActiveAcademicYear] = useState("");
  const [allAcademicYears, setAllAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [searchYear, setSearchYear] = useState("");

  const [formData, setFormData] = useState({
    academicYear: "",
    semesterNumber: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [semData, yearData] = await Promise.all([
        adminAPI.getAllSemesters(),
        adminAPI.getActiveAcademicYear(),
      ]);
      setSemesters(semData.semesters || []);
      setActiveAcademicYear(yearData.academicYear?.year || "");
      setAllAcademicYears(yearData.allYears || []);
    } catch (error) {
      showError(error.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingSemester(null);
    setFormData({
      academicYear: activeAcademicYear,
      semesterNumber: "",
      startDate: "",
      endDate: "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
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

      const dataToSend = {
        academicYear: formData.academicYear,
        semesterNumber: parseInt(formData.semesterNumber),
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      if (editingSemester) {
        await adminAPI.updateSemester(editingSemester._id, dataToSend);
        showSuccess("Semester updated successfully");
      } else {
        await adminAPI.createSemester(dataToSend);
        showSuccess("Semester created successfully");
      }

      setShowModal(false);
      fetchAllData();
    } catch (error) {
      showError(error.response?.data?.error || "Failed to save semester");
    }
  };

  const handleDelete = async (semesterId) => {
    if (window.confirm("Are you sure you want to delete this semester?")) {
      try {
        await adminAPI.deleteSemester(semesterId);
        showSuccess("Semester deleted successfully");
        fetchAllData();
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
      return (
        <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
          Active
        </div>
      );
    } else if (now < start) {
      return (
        <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
          Scheduled
        </div>
      );
    } else {
      return (
        <div className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
          Completed
        </div>
      );
    }
  };

  const getDaysCount = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">[L]</div>
          <p className="text-gray-600">Loading semesters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiCalendar className="text-blue-600" />
              Semester Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage academic semesters for {activeAcademicYear}
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
          >
            <FiPlus size={20} />
            Create Semester
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by academic year..."
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Semesters List */}
        {Object.keys(groupedBySemester).length > 0 ? (
          <div className="space-y-6">
            {Object.keys(groupedBySemester)
              .sort()
              .reverse()
              .map((year) => (
                <div key={year}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
                    {year}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedBySemester[year]
                      .sort((a, b) => a.semesterNumber - b.semesterNumber)
                      .map((semester) => (
                        <div
                          key={semester._id}
                          className="bg-white rounded-lg shadow hover:shadow-lg transition p-5 border-l-4 border-blue-500"
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Semester {semester.semesterNumber}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {semester.semesterName}
                              </p>
                            </div>
                            {getStatusBadge(semester)}
                          </div>

                          {/* Dates */}
                          <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2 text-sm">
                              <FiClock className="text-green-600" />
                              <div>
                                <p className="text-gray-600">Start</p>
                                <p className="font-semibold text-gray-900">
                                  {formatDate(semester.startDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FiClock className="text-red-600" />
                              <div>
                                <p className="text-gray-600">End</p>
                                <p className="font-semibold text-gray-900">
                                  {formatDate(semester.endDate)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="bg-blue-50 p-3 rounded mb-4">
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="text-lg font-bold text-blue-600">
                              {getDaysCount(
                                semester.startDate,
                                semester.endDate
                              )}{" "}
                              days
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingSemester(semester);
                                setFormData({
                                  academicYear: semester.academicYear,
                                  semesterNumber:
                                    semester.semesterNumber.toString(),
                                  startDate: semester.startDate.split("T")[0],
                                  endDate: semester.endDate.split("T")[0],
                                });
                                setShowModal(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition font-semibold"
                            >
                              <FiEdit2 size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(semester._id)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition font-semibold"
                            >
                              <FiTrash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiAlertCircle className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-lg">No semesters found</p>
            <p className="text-gray-500">Click "Create Semester" to add one</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSemester ? "Edit Semester" : "Create New Semester"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Academic Year *
                  </label>
                  {activeAcademicYear && (
                    <p className="text-sm text-green-600 mb-2">
                      Active: {activeAcademicYear}
                    </p>
                  )}
                  <select
                    value={formData.academicYear}
                    onChange={(e) =>
                      setFormData({ ...formData, academicYear: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Academic Year</option>
                    {allAcademicYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                        {year === activeAcademicYear ? " (Active)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Semester Number *
                  </label>
                  <select
                    value={formData.semesterNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        semesterNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        Semester {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  {editingSemester ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemesterManagement;
