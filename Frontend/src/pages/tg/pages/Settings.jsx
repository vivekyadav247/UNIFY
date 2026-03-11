import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiLock,
  FiMail,
  FiPhone,
  FiCalendar,
  FiLoader,
  FiEdit2,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { tgAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";

export default function Settings() {
  const { darkMode, tg } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Edit profile fields
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    dob: "",
  });

  useEffect(() => {
    if (tg) {
      setEditData({
        name: tg.name || "",
        email: tg.email || "",
        mobileNumber: tg.mobileNumber || "",
        dob: tg.dob ? new Date(tg.dob).toISOString().split("T")[0] : "",
      });
    }
  }, [tg]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!editData.name || !editData.email) {
      showError("Name and Email are required");
      return;
    }

    try {
      setLoading(true);
      await tgAPI.updateProfile(editData);
      showSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      showError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData({
      name: tg?.name || "",
      email: tg?.email || "",
      mobileNumber: tg?.mobileNumber || "",
      dob: tg?.dob ? new Date(tg.dob).toISOString().split("T")[0] : "",
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      showError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await tgAPI.changePassword({ oldPassword, newPassword });
      showSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1
        className={`text-3xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Settings
      </h1>

      {/* Profile Info Section */}
      <div
        className={`p-6 rounded-2xl border mb-6 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Profile Information
          </h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              editMode
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {editMode ? (
              <>
                <FiX /> Cancel
              </>
            ) : (
              <>
                <FiEdit2 /> Edit Profile
              </>
            )}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="Enter name"
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

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
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  placeholder="Enter email"
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={editData.mobileNumber}
                  onChange={(e) =>
                    setEditData({ ...editData, mobileNumber: e.target.value })
                  }
                  placeholder="Enter mobile number"
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editData.dob}
                  onChange={(e) =>
                    setEditData({ ...editData, dob: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all bg-green-600 hover:bg-green-700 text-white ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 rounded-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-all"
              >
                <FiX className="inline mr-2" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`text-xs font-semibold ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                NAME
              </label>
              <p
                className={`text-base font-medium mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {tg?.name || "N/A"}
              </p>
            </div>

            <div>
              <label
                className={`text-xs font-semibold flex items-center gap-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <FiMail size={14} /> EMAIL
              </label>
              <p
                className={`text-base font-medium mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {tg?.email || "N/A"}
              </p>
            </div>

            <div>
              <label
                className={`text-xs font-semibold flex items-center gap-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <FiPhone size={14} /> MOBILE
              </label>
              <p
                className={`text-base font-medium mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {tg?.mobileNumber || "N/A"}
              </p>
            </div>

            <div>
              <label
                className={`text-xs font-semibold flex items-center gap-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <FiCalendar size={14} /> DATE OF BIRTH
              </label>
              <p
                className={`text-base font-medium mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {tg?.dob ? new Date(tg.dob).toLocaleDateString() : "N/A"}
              </p>
            </div>

            <div>
              <label
                className={`text-xs font-semibold ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                DEPARTMENT
              </label>
              <p
                className={`text-base font-medium mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {tg?.department || "N/A"}
              </p>
            </div>

            <div>
              <label
                className={`text-xs font-semibold ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                SECTION
              </label>
              <p
                className={`text-base font-medium mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {tg?.section || "N/A"}
              </p>
            </div>

            <div>
              <label
                className={`text-xs font-semibold ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                SEMESTER
              </label>
              <p
                className={`text-base font-medium mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {tg?.semester ? `Sem ${tg.semester}` : "Sem 1"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <FiLock /> Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Old Password */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Current Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* New Password */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              New Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 6 characters)"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Confirm Password
            </label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Show Password Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Show passwords
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            } bg-blue-600 hover:bg-blue-700 text-white`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
