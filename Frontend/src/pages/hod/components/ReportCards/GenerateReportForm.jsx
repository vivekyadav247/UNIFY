export default function GenerateReportForm() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-semibold text-lg mb-4">Generate New Report</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select className="border rounded-lg p-2">
          <option>Attendance Report</option>
          <option>Performance Report</option>
        </select>

        <select className="border rounded-lg p-2">
          <option>Last Month</option>
          <option>Last Semester</option>
        </select>

        <button className="bg-blue-600 text-white rounded-lg px-4 py-2">
          Generate Report
        </button>
      </div>
    </div>
  );
}
