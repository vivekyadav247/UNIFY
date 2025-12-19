export default function GenerateReportForm({ darkMode }) {
  return (
    <div
      className={`rounded-xl p-6 shadow ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h3
        className={`font-semibold text-lg mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Generate New Report
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className={`border rounded-lg p-2 ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <option>Attendance Report</option>
          <option>Performance Report</option>
        </select>

        <select
          className={`border rounded-lg p-2 ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <option>Last Month</option>
          <option>Last Semester</option>
        </select>

        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors">
          Generate Report
        </button>
      </div>
    </div>
  );
}
