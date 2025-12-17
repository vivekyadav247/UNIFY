import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiLoader,
  FiAlertCircle,
  FiEye,
  FiX,
} from "react-icons/fi";

export default function TGManagement() {
  const { darkMode } = useOutletContext();
  const [tgList, setTgList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, view, edit
  const [selectedTG, setSelectedTG] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    qualifications: "",
    experience: "",
    specialization: "",
  });

  useEffect(() => {
    fetchTGList();
  }, []);

  const fetchTGList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/hod/tg/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setTgList(Array.isArray(data.tgList) ? data.tgList : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching TG list:", err);
      setError("Failed to fetch Teacher Guardians");
      setTgList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setModalMode("create");
    setSelectedTG(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      qualifications: "",
      experience: "",
      specialization: "",
    });
    setShowModal(true);
  };

  const handleViewClick = (tg) => {
    setModalMode("view");
    setSelectedTG(tg);
    setFormData(tg);
    setShowModal(true);
  };

  const handleEditClick = (tg) => {
    setModalMode("edit");
    setSelectedTG(tg);
    setFormData(tg);
    setShowModal(true);
  };

  const handleDeleteClick = async (tgId) => {
    if (!window.confirm("Are you sure you want to delete this Teacher Guardian?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/hod/tg/${tgId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete TG");
      }

      setTgList(tgList.filter((tg) => tg._id !== tgId));
      setSuccess("Teacher Guardian deleted successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      let response;

      if (modalMode === "create") {
        response = await fetch(
          "http://localhost:3000/api/hod/tg/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify(formData),
          }
        );
      } else if (modalMode === "edit") {
        response = await fetch(
          `http://localhost:3000/api/hod/tg/${selectedTG._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify(formData),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save TG");
      }

      const data = await response.json();
      setSuccess(
        modalMode === "create"
          ? "Teacher Guardian created successfully"
          : "Teacher Guardian updated successfully"
      );
      setTimeout(() => setSuccess(null), 3000);

      fetchTGList();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTG = tgList.filter(
    (tg) =>
      tg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Teacher Guardians Management
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Create, view, and manage teacher guardians
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all"
        >
          <FiPlus />
          Create TG
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-700 border border-green-200">
          <p className="font-semibold">✓ {success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-200 flex items-start gap-3">
          <FiAlertCircle className="mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
          }`}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div
          className={`p-12 rounded-2xl border flex items-center justify-center ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <FiLoader className="animate-spin text-2xl mr-3" />
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Loading Teacher Guardians...
          </p>
        </div>
      ) : filteredTG.length === 0 ? (
        <div
          className={`p-12 rounded-2xl border text-center ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <p
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No Teacher Guardians found
          </p>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Click "Create TG" to add your first Teacher Guardian
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <table className="w-full">
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTG.map((tg) => (
                <tr
                  key={tg._id}
                  className={`border-t ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700/50"
                      : "border-gray-200 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 font-medium">{tg.name}</td>
                  <td className="px-6 py-4 text-sm">{tg.email}</td>
                  <td className="px-6 py-4 text-sm">{tg.phone || "N/A"}</td>
                  <td className="px-6 py-4 text-sm">
                    {tg.experience || "N/A"} years
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tg.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {tg.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewClick(tg)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode
                            ? "hover:bg-gray-600 text-gray-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        }`}
                        title="View"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleEditClick(tg)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode
                            ? "hover:bg-gray-600 text-gray-400 hover:text-white"
                            : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        }`}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tg._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode
                            ? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
                            : "hover:bg-red-50 text-red-600 hover:text-red-700"
                        }`}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TGModal
          mode={modalMode}
          tg={selectedTG}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

// Modal Component
function TGModal({
  mode,
  tg,
  formData,
  onInputChange,
  onSubmit,
  onClose,
  darkMode,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
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
            {mode === "create"
              ? "Create Teacher Guardian"
              : mode === "view"
              ? "View Teacher Guardian"
              : "Edit Teacher Guardian"}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                    : "bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50"
                }`}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                    : "bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50"
                }`}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                    : "bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50"
                }`}
              />
            </div>

            {/* Department */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={onInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                    : "bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50"
                }`}
              />
            </div>

            {/* Experience */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={onInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                    : "bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50"
                }`}
              />
            </div>

            {/* Qualifications */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Qualifications
              </label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={onInputChange}
                disabled={mode === "view"}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                    : "bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50"
                }`}
              />
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Specialization
            </label>
            <textarea
              name="specialization"
              value={formData.specialization}
              onChange={onInputChange}
              disabled={mode === "view"}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white disabled:opacity-50"
                  : "bg-gray-50 border-gray-200 text-gray-900 disabled:opacity-50"
              }`}
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>

            {mode !== "view" && (
              <button
                type="submit"
                className="px-6 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
              >
                {mode === "create" ? "Create" : "Update"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}