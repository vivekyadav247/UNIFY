import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { tgAPI } from "../../../services/api";
import { showError } from "../../../utils/notifications";
import { FiLoader, FiAlertCircle, FiTrendingUp } from "react-icons/fi";

export default function Reports() {
  const { darkMode } = useOutletContext();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tgAPI.getReports();
      setReports(data.reports || []);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch reports";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "attendance")
      return parseFloat(b.attendance) - parseFloat(a.attendance);
    return 0;
  });

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
        className={`text-3xl font-bold mb-6 flex items-center gap-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <FiTrendingUp /> Attendance Reports
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

      <div className="mb-6">
        <label
          className={`block text-sm font-medium mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="name">Student Name</option>
          <option value="attendance">Attendance %</option>
        </select>
      </div>

      {reports.length === 0 ? (
        <div
          className={`p-8 rounded-2xl border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No attendance data available
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
                    Student
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Enrollment
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Present Days
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Total Days
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Attendance %
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {sortedReports.map((report, idx) => (
                  <tr
                    key={idx}
                    className={
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }
                  >
                    <td
                      className={`px-6 py-4 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {report.name}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {report.enrollmentNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {report.presentDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {report.totalDays}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-bold ${
                          report.attendance >= 75
                            ? "bg-green-100 text-green-800"
                            : report.attendance >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {report.attendance}%
                      </span>
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
