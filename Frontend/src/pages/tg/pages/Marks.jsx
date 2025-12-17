import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { tgAPI } from "../../../services/api";
import { showError } from "../../../utils/notifications";
import { FiLoader, FiAlertCircle, FiBarChart2 } from "react-icons/fi";

export default function Marks() {
  const { darkMode } = useOutletContext();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tgAPI.getMarks();
      setMarks(data.marks || []);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch marks";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredMarks = marks.filter(
    (m) =>
      !filter ||
      (m.studentId?.name &&
        m.studentId.name.toLowerCase().includes(filter.toLowerCase())) ||
      (m.studentId?.enrollmentNumber &&
        m.studentId.enrollmentNumber
          .toLowerCase()
          .includes(filter.toLowerCase()))
  );

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
        <FiBarChart2 /> Marks Management
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
        <input
          type="text"
          placeholder="Search student by name or enrollment number..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>

      {filteredMarks.length === 0 ? (
        <div
          className={`p-8 rounded-2xl border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {filter
              ? "No marks found matching your search"
              : "No marks available"}
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
                    Student Name
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Enrollment
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Subject
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Marks
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {filteredMarks.map((mark) => (
                  <tr
                    key={mark._id}
                    className={
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }
                  >
                    <td
                      className={`px-6 py-4 text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {mark.studentId?.name || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {mark.studentId?.enrollmentNumber || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {mark.subjectId?.subjectName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-bold ${
                          mark.totalMarks >= 80
                            ? "bg-green-100 text-green-800"
                            : mark.totalMarks >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {mark.totalMarks || 0}
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
