import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { FiFileText, FiUploadCloud, FiSend } from "react-icons/fi";
import { studentAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";

export default function LeaveRequest() {
  const { darkMode, student } = useOutletContext();
  const { enrollmentNumber } = useParams();

  const [formData, setFormData] = useState({
    leaveType: "sick",
    startDate: "",
    endDate: "",
    reason: "",
    attachment: null,
    attachmentName: "",
  });
  const [loading, setLoading] = useState(false);

  const leaveTypes = [
    { value: "sick", label: "Sick Leave" },
    { value: "personal", label: "Personal Leave" },
    { value: "medical", label: "Medical Leave" },
    { value: "emergency", label: "Emergency Leave" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError("File size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        attachment: file,
        attachmentName: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      showError("Please fill all required fields");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      showError("End date must be after start date");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("leaveType", formData.leaveType);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("reason", formData.reason);

      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }

      const response = await studentAPI.submitLeaveRequest(data);

      if (response.success) {
        showSuccess("Leave request submitted successfully");
        setFormData({
          leaveType: "sick",
          startDate: "",
          endDate: "",
          reason: "",
          attachment: null,
          attachmentName: "",
        });
        // Reset file input
        document.getElementById("attachment").value = "";
      } else {
        showError(response.message || "Failed to submit leave request");
      }
    } catch (err) {
      console.error("Error submitting leave request:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to submit leave request";
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1
          className={`text-4xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Leave Request
        </h1>
        <p
          className={`mt-2 text-lg ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Submit your leave request for approval by your TG
        </p>
      </div>

      {/* FORM CARD */}
      <div
        className={`p-8 rounded-2xl border transition-all ${
          darkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Leave Type
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 hover:border-blue-500"
                  : "bg-white text-gray-900 border-gray-300 hover:border-blue-500"
              } focus:outline-none focus:border-blue-500`}
            >
              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 hover:border-blue-500"
                    : "bg-white text-gray-900 border-gray-300 hover:border-blue-500"
                } focus:outline-none focus:border-blue-500`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 hover:border-blue-500"
                    : "bg-white text-gray-900 border-gray-300 hover:border-blue-500"
                } focus:outline-none focus:border-blue-500`}
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Reason for Leave *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please provide a detailed reason for your leave request"
              rows="5"
              className={`w-full px-4 py-3 rounded-lg border transition resize-none ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 hover:border-blue-500 placeholder-gray-500"
                  : "bg-white text-gray-900 border-gray-300 hover:border-blue-500 placeholder-gray-400"
              } focus:outline-none focus:border-blue-500`}
            />
          </div>

          {/* File Upload */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Attachment (Optional)
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                darkMode
                  ? "border-gray-600 hover:border-blue-500 hover:bg-blue-500/10"
                  : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <input
                type="file"
                id="attachment"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="attachment" className="cursor-pointer">
                <div
                  className={`flex flex-col items-center gap-2 ${
                    formData.attachmentName ? "text-green-500" : ""
                  }`}
                >
                  <FiUploadCloud
                    className={`text-3xl ${
                      formData.attachmentName
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  />
                  <p
                    className={`font-semibold ${
                      formData.attachmentName
                        ? "text-green-500"
                        : darkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {formData.attachmentName || "Click to upload or drag file"}
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <FiSend className={`${loading ? "animate-spin" : ""}`} />
              {loading ? "Submitting..." : "Submit Leave Request"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  leaveType: "sick",
                  startDate: "",
                  endDate: "",
                  reason: "",
                  attachment: null,
                  attachmentName: "",
                });
                document.getElementById("attachment").value = "";
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* INFO CARD */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode
            ? "bg-blue-900/20 border-blue-700/40"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className="flex gap-3">
          <FiFileText
            className={`text-2xl flex-shrink-0 ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <div>
            <h3
              className={`font-semibold mb-1 ${
                darkMode ? "text-blue-300" : "text-blue-900"
              }`}
            >
              Important Information
            </h3>
            <ul
              className={`text-sm space-y-1 ${
                darkMode ? "text-blue-300/80" : "text-blue-800"
              }`}
            >
              <li>• Your leave request will be sent to your TG for approval</li>
              <li>• Please provide a valid reason for your leave</li>
              <li>
                • Attachment is optional but recommended for medical leaves
              </li>
              <li>
                • You will receive notification once your request is
                approved/rejected
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
