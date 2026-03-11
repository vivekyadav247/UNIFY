import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
  FiEdit2,
  FiCalendar,
} from "react-icons/fi";

export default function Settings() {
  const { darkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    dob: "",
    department: "",
    course: "",
    gender: "",
  });

  // Password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/hod/profile", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.hod.name || "",
          email: data.hod.email || "",
          mobileNumber: data.hod.mobileNumber || "",
          dob: data.hod.dob ? data.hod.dob.split("T")[0] : "",
          department: data.hod.department || "",
          course: data.hod.course || "",
          gender: data.hod.gender || "",
        });
      }
    } catch (err) {
      setError("Failed to fetch profile");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/hod/update-profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(profileData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/hod/change-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch (err) {
      setError("Failed to change password");
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

      {/* Success/Error Messages */}
      {success && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            darkMode
              ? "bg-green-900/30 border border-green-700"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <FiCheckCircle className="text-green-600" size={20} />
          <span className={darkMode ? "text-green-400" : "text-green-700"}>
            {success}
          </span>
        </div>
      )}

      {error && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            darkMode
              ? "bg-red-900/30 border border-red-700"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <FiAlertCircle className="text-red-600" size={20} />
          <span className={darkMode ? "text-red-400" : "text-red-700"}>
            {error}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            activeTab === "profile"
              ? darkMode
                ? "bg-blue-600 text-white"
                : "bg-blue-600 text-white"
              : darkMode
              ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FiUser />
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            activeTab === "password"
              ? darkMode
                ? "bg-blue-600 text-white"
                : "bg-blue-600 text-white"
              : darkMode
              ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FiLock />
          Change Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div
          className={`p-8 rounded-2xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <FiEdit2
              className={darkMode ? "text-blue-400" : "text-blue-600"}
              size={24}
            />
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Edit Profile Information
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Full Name *
                </label>
                <div className="relative">
                  <FiUser
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Mobile Number *
                </label>
                <div className="relative">
                  <FiPhone
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="tel"
                    value={profileData.mobileNumber}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        mobileNumber: e.target.value,
                      })
                    }
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Gender *
                </label>
                <select
                  value={profileData.gender}
                  onChange={(e) =>
                    setProfileData({ ...profileData, gender: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <FiCalendar
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="date"
                    value={profileData.dob}
                    onChange={(e) =>
                      setProfileData({ ...profileData, dob: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              {/* Department - Read Only */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Department
                </label>
                <input
                  type="text"
                  value={profileData.department}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? "bg-gray-900 border-gray-600 text-gray-500"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                  } cursor-not-allowed`}
                  disabled
                />
              </div>

              {/* Course - Read Only */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Course
                </label>
                <input
                  type="text"
                  value={profileData.course}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode
                      ? "bg-gray-900 border-gray-600 text-gray-500"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                  } cursor-not-allowed`}
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white transition-colors`}
              >
                <FiSave />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div
          className={`p-8 rounded-2xl border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <FiLock
              className={darkMode ? "text-blue-400" : "text-blue-600"}
              size={24}
            />
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Change Password
            </h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
            {/* Current Password */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Current Password *
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                New Password *
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
                required
                minLength={6}
              />
              <p
                className={`mt-1 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white transition-colors`}
              >
                <FiLock />
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
