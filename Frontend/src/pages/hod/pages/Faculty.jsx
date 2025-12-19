import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { hodAPI } from "../../../services/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiLoader,
  FiAlertCircle,
  FiEye,
  FiX,
  FiSave,
} from "react-icons/fi";

export default function Faculty() {
  const { darkMode } = useOutletContext();
  const [facultyList, setFacultyList] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, view, edit
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    facultyId: "",
    email: "",
    mobileNumber: "",
    password: "",
    department: "",
    course: "",
    branch: "",
    section: "",
    gender: "",
    academicYear: [],
    assignedSubjects: [],
  });

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [hodProfile, setHodProfile] = useState(null);

  // Dropdown options
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    avgStudents: 0,
  });

  useEffect(() => {
    fetchHodProfile();
    fetchFaculty();
    fetchDropdownOptions();
  }, []);

  const fetchHodProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/hod/profile", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setHodProfile(data.hod);
      }
    } catch (error) {
      console.error("Failed to fetch HOD profile:", error);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const [deptRes, courseRes, branchRes, sectionRes, yearRes] =
        await Promise.all([
          fetch("http://localhost:3000/api/hod/departments", {
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/hod/courses", {
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/hod/branches", {
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/hod/sections", {
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/hod/academic-years", {
            credentials: "include",
          }),
        ]);

      if (deptRes.ok) {
        const data = await deptRes.json();
        setDepartments(data.departments || []);
      }
      if (courseRes.ok) {
        const data = await courseRes.json();
        setCourses(data.courses || []);
      }
      if (branchRes.ok) {
        const data = await branchRes.json();
        setBranches(data.branches || []);
      }
      if (sectionRes.ok) {
        const data = await sectionRes.json();
        setSections(data.sections || []);
      }
      if (yearRes.ok) {
        const data = await yearRes.json();
        setAcademicYears(data.academicYears || []);
      }
    } catch (error) {
      console.error("Failed to fetch dropdown options:", error);
    }
  };

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await hodAPI.getFaculties();
      if (response.faculty) {
        setFacultyList(response.faculty);
        setFilteredFaculty(response.faculty);
        calculateStats(response.faculty);
        setError(null);
      }
    } catch (error) {
      setError("Failed to fetch faculty members");
      setFacultyList([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (facList) => {
    const total = facList.length;
    const active = facList.filter((f) => f.status !== "inactive").length;
    const onLeave = facList.filter((f) => f.onLeave).length;

    setStats({
      total,
      active,
      onLeave,
      avgStudents: total > 0 ? Math.floor((total * 26) / total) : 0,
    });
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFaculty(facultyList);
    } else {
      const filtered = facultyList.filter(
        (fac) =>
          fac.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fac.facultyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fac.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaculty(filtered);
    }
  }, [searchTerm, facultyList]);

  const handleCreateClick = () => {
    setModalMode("create");
    setSelectedFaculty(null);
    setFormData({
      name: "",
      facultyId: "",
      email: "",
      mobileNumber: "",
      password: "",
      department: hodProfile?.department || "",
      course: hodProfile?.course || "",
      branch: "",
      section: "",
      gender: "",
      academicYear: [],
      assignedSubjects: [],
    });
    setSubjects([]);
    setShowModal(true);
  };

  const handleViewClick = (faculty) => {
    setModalMode("view");
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const handleEditClick = (faculty) => {
    setModalMode("edit");
    setSelectedFaculty(faculty);
    setFormData({
      name: faculty.name || "",
      facultyId: faculty.facultyId || "",
      email: faculty.email || "",
      mobileNumber: faculty.mobileNumber || "",
      department: faculty.department || "",
      course: faculty.course || "",
      branch: faculty.branch || "",
      section: faculty.section || "",
      gender: faculty.gender || "",
      academicYear: faculty.academicYear || [],
      assignedSubjects: faculty.assignedSubjects || [],
    });
    // Fetch subjects if course and branch are available
    if (faculty.course && faculty.branch) {
      fetchSubjects(faculty.course, faculty.branch);
    }
    setShowModal(true);
  };

  const handleDeleteClick = async (facultyId) => {
    if (
      !window.confirm("Are you sure you want to delete this faculty member?")
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/hod/delete-faculty/${facultyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete faculty");
      }

      await fetchFaculty();
      setSuccess("Faculty deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const fetchSubjects = async (course, branch) => {
    try {
      setLoadingSubjects(true);
      const department = hodProfile?.department || "";
      const response = await fetch(
        `http://localhost:3000/api/hod/subjects?department=${department}&course=${course}&branch=${branch}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
      }
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Fetch subjects when course or branch changes
    if (name === "course" || name === "branch") {
      const course = name === "course" ? value : formData.course;
      const branch = name === "branch" ? value : formData.branch;
      if (course && branch) {
        fetchSubjects(course, branch);
      }
    }
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      [name]: selectedValues,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      let response;

      if (modalMode === "create") {
        response = await fetch("http://localhost:3000/api/hod/create-faculty", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      } else if (modalMode === "edit") {
        response = await fetch(
          `http://localhost:3000/api/hod/edit-faculty/${selectedFaculty.facultyId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify(formData),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save faculty");
      }

      setSuccess(
        modalMode === "create"
          ? "Faculty created successfully"
          : "Faculty updated successfully"
      );
      setTimeout(() => setSuccess(null), 3000);

      await fetchFaculty();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div
        className={`p-6 flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Loading faculty...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Faculty Management
          </h1>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Manage all faculty members for your department
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FiPlus size={20} />
          Add Faculty
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg flex items-center gap-2">
          <FiAlertCircle />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div
          className={`p-6 rounded-xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Total Faculty
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.total}
          </p>
        </div>
        <div
          className={`p-6 rounded-xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Active
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.active}
          </p>
        </div>
        <div
          className={`p-6 rounded-xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            On Leave
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.onLeave}
          </p>
        </div>
        <div
          className={`p-6 rounded-xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Avg Students
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stats.avgStudents}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search by name, email, or Faculty ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {/* Faculty List */}
      {filteredFaculty.length === 0 ? (
        <div
          className={`text-center py-20 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <p className="text-lg">No faculty members found</p>
        </div>
      ) : (
        <div
          className={`rounded-xl border overflow-hidden ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Faculty ID
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Name
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Mobile
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Course
                  </th>
                  <th
                    className={`px-6 py-4 text-right text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredFaculty.map((faculty) => (
                  <tr
                    key={faculty._id}
                    className={
                      darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                    }
                  >
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {faculty.facultyId}
                    </td>
                    <td
                      className={`px-6 py-4 font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {faculty.name}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {faculty.email}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {faculty.mobileNumber}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {faculty.course}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewClick(faculty)}
                          className="p-2 text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors"
                          title="View"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditClick(faculty)}
                          className="p-2 text-green-600 hover:bg-green-600/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(faculty.facultyId)}
                          className="p-2 text-red-600 hover:bg-red-600/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-6 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {modalMode === "create" && "Add New Faculty"}
                {modalMode === "edit" && "Edit Faculty"}
                {modalMode === "view" && "Faculty Details"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalMode === "view" ? (
                <div className="space-y-4">
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Faculty ID
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedFaculty?.facultyId}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Name
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedFaculty?.name}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Email
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedFaculty?.email}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Mobile
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedFaculty?.mobileNumber}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Course
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedFaculty?.course}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Department
                    </p>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedFaculty?.department}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Faculty ID *
                      </label>
                      <input
                        type="text"
                        name="facultyId"
                        value={formData.facultyId}
                        onChange={handleInputChange}
                        required
                        disabled={modalMode === "edit"}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                            : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  </div>

                  {modalMode === "create" && (
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Course *
                      </label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                          <option key={course._id} value={course.name}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Branch
                      </label>
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch._id} value={branch.name}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Section
                      </label>
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select Section</option>
                        {sections.map((section) => (
                          <option key={section._id} value={section.name}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Academic Year (Hold Ctrl to select multiple)
                    </label>
                    <select
                      name="academicYear"
                      multiple
                      value={formData.academicYear}
                      onChange={handleMultiSelect}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      size="4"
                    >
                      {academicYears.map((year) => (
                        <option key={year._id} value={year.year}>
                          {year.year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.course && formData.branch && (
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Assigned Subjects (Hold Ctrl to select multiple)
                      </label>
                      {loadingSubjects ? (
                        <p
                          className={
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Loading subjects...
                        </p>
                      ) : subjects.length > 0 ? (
                        <select
                          name="assignedSubjects"
                          multiple
                          value={formData.assignedSubjects}
                          onChange={handleMultiSelect}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          size="5"
                        >
                          {subjects.map((subject) => (
                            <option
                              key={subject._id}
                              value={subject.subjectCode}
                            >
                              {subject.name} ({subject.subjectCode})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p
                          className={
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          No subjects available for selected course and branch
                        </p>
                      )}
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <FiSave />
                      {modalMode === "create"
                        ? "Create Faculty"
                        : "Update Faculty"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
