import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
  FiEdit,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDroplet,
} from "react-icons/fi";
import { studentAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";

export default function Settings() {
  const { darkMode } = useOutletContext();
  const [activeTab, setActiveTab] = useState("password");
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    parentContact: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await studentAPI.getProfile();
      if (res.student) {
        setStudent(res.student);
        setProfileForm({
          name: res.student.name || "",
          email: res.student.email || "",
          mobileNumber: res.student.mobileNumber || "",
          dob: res.student.dob ? res.student.dob.split("T")[0] : "",
          gender: res.student.gender || "",
          bloodGroup: res.student.bloodGroup || "",
          parentContact: res.student.parentContact || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      showError("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordForm.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      newErrors.newPassword = "New password must be different from current";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileForm.name || !profileForm.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profileForm.email || !profileForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!profileForm.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(profileForm.mobileNumber)) {
      newErrors.mobileNumber = "Invalid mobile number";
    }

    if (!profileForm.dob) {
      newErrors.dob = "Date of birth is required";
    }

    if (!profileForm.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!profileForm.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    try {
      setLoading(true);
      await studentAPI.completeProfile({
        name: profileForm.name,
        email: profileForm.email,
        mobileNumber: profileForm.mobileNumber,
        dob: profileForm.dob,
        gender: profileForm.gender,
        bloodGroup: profileForm.bloodGroup,
        parentContact: profileForm.parentContact,
      });

      showSuccess("Profile completed successfully!");
      await fetchStudentProfile();
      setActiveTab("password");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to complete profile";
      showError(errorMsg);
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    try {
      setLoading(true);
      await studentAPI.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      showSuccess("Password changed successfully!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to change password";
      showError(errorMsg);
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1
          className={`text-4xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Settings
        </h1>
        <p
          className={`mt-2 text-lg ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Manage your account preferences and security
        </p>
      </div>

      {/* PROFILE STATUS */}
      {!student?.profileComplete && (
        <div
          className={`p-4 rounded-lg border ${
            darkMode
              ? "bg-yellow-900/20 border-yellow-700/50"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <FiAlertCircle
              className={`text-xl ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
            <div>
              <p
                className={`font-semibold ${
                  darkMode ? "text-yellow-300" : "text-yellow-900"
                }`}
              >
                Complete Your Profile
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-yellow-200" : "text-yellow-800"
                }`}
              >
                Fill in your profile details to complete registration. You can
                only do this once.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div
        className={`rounded-2xl border transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* TAB BUTTONS */}
        <div
          className={`flex border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {!student?.profileComplete && (
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "profile"
                  ? darkMode
                    ? "bg-blue-900/30 text-blue-300 border-b-2 border-blue-500"
                    : "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FiEdit className="inline mr-2" />
              Complete Profile
            </button>
          )}
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === "password"
                ? darkMode
                  ? "bg-blue-900/30 text-blue-300 border-b-2 border-blue-500"
                  : "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FiLock className="inline mr-2" />
            Security
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="p-8">
          {/* COMPLETE PROFILE TAB */}
          {!student?.profileComplete && activeTab === "profile" && (
            <div className="max-w-2xl">
              <h3
                className={`text-2xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Complete Your Profile
              </h3>

              <form onSubmit={handleCompleteProfile} className="space-y-6">
                {errors.general && (
                  <div
                    className={`p-4 rounded-lg flex items-center gap-3 ${
                      darkMode
                        ? "bg-red-900/20 border border-red-700/50"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <FiAlertCircle
                      className={`text-xl ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    />
                    <p
                      className={`${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.general}
                    </p>
                  </div>
                )}

                {/* NAME */}
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
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          name: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 pl-10 rounded-lg border transition-colors ${
                        errors.name
                          ? darkMode
                            ? "border-red-600 bg-red-900/10"
                            : "border-red-300 bg-red-50"
                          : darkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-white"
                      } ${darkMode ? "text-white" : "text-gray-900"}`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email *
                  </label>
                  <div className="relative">
                    <FiMail
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 pl-10 rounded-lg border transition-colors ${
                        errors.email
                          ? darkMode
                            ? "border-red-600 bg-red-900/10"
                            : "border-red-300 bg-red-50"
                          : darkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-white"
                      } ${darkMode ? "text-white" : "text-gray-900"}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* MOBILE NUMBER */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Mobile Number (10 digits) *
                  </label>
                  <div className="relative">
                    <FiPhone
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="tel"
                      value={profileForm.mobileNumber}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          mobileNumber: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      maxLength="10"
                      className={`w-full px-4 py-3 pl-10 rounded-lg border transition-colors ${
                        errors.mobileNumber
                          ? darkMode
                            ? "border-red-600 bg-red-900/10"
                            : "border-red-300 bg-red-50"
                          : darkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-white"
                      } ${darkMode ? "text-white" : "text-gray-900"}`}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                {/* DOB */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <FiCalendar
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="date"
                      value={profileForm.dob}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          dob: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 pl-10 rounded-lg border transition-colors ${
                        errors.dob
                          ? darkMode
                            ? "border-red-600 bg-red-900/10"
                            : "border-red-300 bg-red-50"
                          : darkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-white"
                      } ${darkMode ? "text-white" : "text-gray-900"}`}
                    />
                  </div>
                  {errors.dob && (
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.dob}
                    </p>
                  )}
                </div>

                {/* GENDER */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Gender *
                  </label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        gender: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.gender
                        ? darkMode
                          ? "border-red-600 bg-red-900/10"
                          : "border-red-300 bg-red-50"
                        : darkMode
                        ? "border-gray-600 bg-gray-700/30"
                        : "border-gray-300 bg-white"
                    } ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.gender}
                    </p>
                  )}
                </div>

                {/* BLOOD GROUP */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Blood Group *
                  </label>
                  <div className="relative">
                    <FiDroplet
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <select
                      value={profileForm.bloodGroup}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          bloodGroup: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 pl-10 rounded-lg border transition-colors ${
                        errors.bloodGroup
                          ? darkMode
                            ? "border-red-600 bg-red-900/10"
                            : "border-red-300 bg-red-50"
                          : darkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-white"
                      } ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  {errors.bloodGroup && (
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.bloodGroup}
                    </p>
                  )}
                </div>

                {/* PARENT CONTACT */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Parent/Guardian Contact (Optional)
                  </label>
                  <div className="relative">
                    <FiPhone
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="tel"
                      value={profileForm.parentContact}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          parentContact: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 pl-10 rounded-lg border ${
                        darkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-white"
                      } ${darkMode ? "text-white" : "text-gray-900"}`}
                      placeholder="Parent/Guardian contact number"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : darkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Completing...
                      </>
                    ) : (
                      <>
                        <FiCheck />
                        Complete Profile
                      </>
                    )}
                  </button>
                </div>

                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  * Required fields. This can only be done once.
                </p>
              </form>
            </div>
          )}

          {/* PROFILE COMPLETE MESSAGE */}
          {student?.profileComplete && activeTab === "profile" && (
            <div
              className={`p-6 rounded-lg text-center ${
                darkMode
                  ? "bg-green-900/20 border border-green-700/50"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <FiCheck
                className={`text-5xl mx-auto mb-4 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              <p
                className={`font-semibold text-lg ${
                  darkMode ? "text-green-300" : "text-green-900"
                }`}
              >
                Profile Complete
              </p>
              <p
                className={`mt-2 ${
                  darkMode ? "text-green-200" : "text-green-800"
                }`}
              >
                Your profile has been completed. You can now only manage your
                security settings.
              </p>
            </div>
          )}

          {/* PASSWORD TAB */}
          {activeTab === "password" && (
            <div className="max-w-2xl">
              <h3
                className={`text-2xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Change Password
              </h3>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                {errors.general && (
                  <div
                    className={`p-4 rounded-lg flex items-center gap-3 ${
                      darkMode
                        ? "bg-red-900/20 border border-red-700/50"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <FiAlertCircle
                      className={`text-xl ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    />
                    <p
                      className={`${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.general}
                    </p>
                  </div>
                )}

                {/* CURRENT PASSWORD */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      value={passwordForm.oldPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          oldPassword: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.oldPassword
                          ? darkMode
                            ? "border-red-600 bg-red-900/10"
                            : "border-red-300 bg-red-50"
                          : darkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-white"
                      } ${darkMode ? "text-white" : "text-gray-900"}`}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          old: !showPasswords.old,
                        })
                      }
                      className={`absolute right-3 top-3 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {showPasswords.old ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.oldPassword && (
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.oldPassword}
                    </p>
                  )}
                </div>

                {/* NEW PASSWORD */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.newPassword
                          ? darkMode
                            ? "border-red-600 bg-red-900/10"
                            : "border-red-300 bg-red-50"
                          : darkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-white"
                      } ${darkMode ? "text-white" : "text-gray-900"}`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className={`absolute right-3 top-3 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.newPassword}
                    </p>
                  )}
                  <p
                    className={`text-xs mt-2 ${
                      darkMode ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    Password must be at least 6 characters
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.confirmPassword
                          ? darkMode
                            ? "border-red-600 bg-red-900/10"
                            : "border-red-300 bg-red-50"
                          : darkMode
                          ? "border-gray-600 bg-gray-700/30"
                          : "border-gray-300 bg-white"
                      } ${darkMode ? "text-white" : "text-gray-900"}`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className={`absolute right-3 top-3 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      className={`text-sm mt-2 ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiCheck />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* PASSWORD REQUIREMENTS */}
              <div
                className={`mt-8 p-4 rounded-lg ${
                  darkMode
                    ? "bg-blue-900/20 border border-blue-700/50"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <p
                  className={`font-semibold mb-3 ${
                    darkMode ? "text-blue-300" : "text-blue-900"
                  }`}
                >
                  Password Requirements:
                </p>
                <ul
                  className={`space-y-2 ${
                    darkMode ? "text-blue-200" : "text-blue-800"
                  }`}
                >
                  <li>✓ Minimum 6 characters</li>
                  <li>✓ Different from current password</li>
                  <li>✓ Passwords must match</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
