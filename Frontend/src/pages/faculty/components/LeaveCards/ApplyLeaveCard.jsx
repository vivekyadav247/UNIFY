import { useState } from "react";

export default function ApplyLeaveCard() {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    alert("Leave Application Submitted");
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-6">Apply for Leave</h2>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-3 rounded-lg outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-3 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* Leave Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Leave Type</label>
        <select
          name="leaveType"
          value={form.leaveType}
          onChange={handleChange}
          className="w-full bg-gray-100 px-4 py-3 rounded-lg outline-none"
        >
          <option value="">Select leave type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Personal Leave">Personal Leave</option>
          <option value="Conference">Conference</option>
        </select>
      </div>

      {/* Reason */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Reason</label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Enter reason for leave..."
          className="w-full bg-gray-100 px-4 py-3 rounded-lg outline-none h-28 resize-none"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Submit Leave Application
      </button>
    </div>
  );
}
