import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiKey,
  FiAlertCircle,
} from "react-icons/fi";

export default function HODManagement() {
  const [hods, setHods] = useState([]);
  const [filteredHods, setFilteredHods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedHod, setSelectedHod] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    hodId: "",
    email: "",
    mobileNumber: "",
    password: "",
    department: "",
    course: "",
    gender: "",
  });

  useEffect(() => {
    fetchHODs();
    fetchDepartments();
    fetchCourses();
  }, []);

  const fetchHODs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/hods", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setHods(data.hods);
        setFilteredHods(data.hods);
      }
    } catch (err) {
      setError("Failed to fetch HODs");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/departments",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.departments);
      }
    } catch (err) {}
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/courses", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHods(hods);
    } else {
      const filtered = hods.filter(
        (hod) =>
          hod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hod.hodId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hod.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHods(filtered);
    }
  }, [searchTerm, hods]);

  const handleCreateClick = () => {
    setModalMode("create");
    setSelectedHod(null);
    setFormData({
      name: "",
      hodId: "",
      email: "",
      mobileNumber: "",
      password: "",
      department: "",
      course: "",
      gender: "",
    });
    setShowModal(true);
  };

  const handleEditClick = (hod) => {
    setModalMode("edit");
    setSelectedHod(hod);
    setFormData({
      name: hod.name || "",
      hodId: hod.hodId || "",
      email: hod.email || "",
      mobileNumber: hod.mobileNumber || "",
      department: hod.department || "",
      course: hod.course || "",
      gender: hod.gender || "",
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (hodId) => {
    if (!window.confirm("Are you sure you want to delete this HOD?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/hod/${hodId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setSuccess("HOD deleted successfully");
        fetchHODs();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to delete HOD");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        modalMode === "create"
          ? "http://localhost:3000/api/admin/hod"
          : `http://localhost:3000/api/admin/hod/${selectedHod.hodId}`;

      const response = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(
          modalMode === "create"
            ? "HOD created successfully"
            : "HOD updated successfully"
        );
        fetchHODs();
        setShowModal(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">HOD Management</h1>
          <p className="text-gray-600 mt-1">Manage all Head of Departments</p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          <FiPlus size={20} />
          Add HOD
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <FiAlertCircle />
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search HODs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                HOD ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Department
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Mobile
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredHods.map((hod) => (
              <tr key={hod._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{hod.hodId}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {hod.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {hod.department}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{hod.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {hod.mobileNumber}
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditClick(hod)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(hod.hodId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
        {filteredHods.length === 0 && (
          <div className="text-center py-12 text-gray-500">No HODs found</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === "create" ? "Add New HOD" : "Edit HOD"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HOD ID *
                  </label>
                  <input
                    type="text"
                    name="hodId"
                    value={formData.hodId}
                    onChange={handleInputChange}
                    disabled={modalMode === "edit"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {modalMode === "create" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  {modalMode === "create" ? "Create HOD" : "Update HOD"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
