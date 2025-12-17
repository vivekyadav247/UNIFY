import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { tgAPI } from "../../../services/api";
import { showError, showSuccess } from "../../../utils/notifications";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

export default function Attendance() {
  const { darkMode } = useOutletContext();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tgAPI.getAttendanceRecords();
      setRecords(data.records || data.attendanceRecords || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to fetch attendance records";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center py-12 ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <FiLoader className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <h1
        className={`text-3xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Attendance Records
      </h1>

      {error && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            darkMode
              ? "bg-red-900/30 border border-red-700"
              : "bg-red-100 border border-red-400"
          }`}
        >
          <FiAlertCircle className="text-red-500" />
          <span className={darkMode ? "text-red-300" : "text-red-700"}>
            {error}
          </span>
        </div>
      )}

      {records.length === 0 ? (
        <div
          className={`p-8 rounded-2xl border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No attendance records found
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Date
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Subject
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {records.map((record, idx) => (
                  <tr
                    key={idx}
                    className={
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }
                  >
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {new Date(
                        record.date || record.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {record.subjectName ||
                        record.subject?.subjectName ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === "present" || record.status === "P"
                            ? "bg-green-100 text-green-800"
                            : record.status === "leave" || record.status === "L"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status === "P"
                          ? "Present"
                          : record.status === "L"
                          ? "Leave"
                          : record.status === "A"
                          ? "Absent"
                          : record.status}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {record.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
