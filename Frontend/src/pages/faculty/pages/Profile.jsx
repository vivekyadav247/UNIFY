import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { facultyAPI } from "../../../services/api";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

export default function FacultyProfile() {
  const { darkMode } = useOutletContext();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await facultyAPI.getProfile();
      setFaculty(response.faculty);
      setFormData(response.faculty);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await facultyAPI.updateProfile(formData);
      setFaculty(formData);
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(faculty);
    setEditing(false);
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Faculty Profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiEdit2 /> Edit Profile
            </button>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div
          className={`rounded-xl shadow-lg p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Faculty ID */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Faculty ID
              </label>
              <input
                type="text"
                value={faculty?.facultyId || ""}
                disabled
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-2 rounded-lg ${
                  editing
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-white border border-gray-300"
                    : darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-2 rounded-lg ${
                  editing
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-white border border-gray-300"
                    : darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData?.mobileNumber || ""}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-2 rounded-lg ${
                  editing
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-white border border-gray-300"
                    : darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <input
                type="text"
                value={faculty?.department || ""}
                disabled
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={formData?.gender || ""}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-2 rounded-lg ${
                  editing
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-white border border-gray-300"
                    : darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-medium mb-2">Course</label>
              <input
                type="text"
                name="course"
                value={formData?.course || ""}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-2 rounded-lg ${
                  editing
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-white border border-gray-300"
                    : darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData?.bio || ""}
                onChange={handleChange}
                disabled={!editing}
                rows="4"
                className={`w-full px-4 py-2 rounded-lg ${
                  editing
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-white border border-gray-300"
                    : darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                <FiX /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <FiSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
