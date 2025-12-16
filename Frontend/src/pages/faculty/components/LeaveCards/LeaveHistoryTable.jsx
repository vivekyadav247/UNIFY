export default function LeaveHistoryTable() {
  const history = [
    {
      start: "2025-12-20",
      end: "2025-12-22",
      type: "Sick Leave",
      status: "Approved",
      by: "Dr. Robert Smith",
      remark: "Medical certificate verified",
    },
    {
      start: "2025-11-15",
      end: "2025-11-16",
      type: "Personal Leave",
      status: "Approved",
      by: "Dr. Robert Smith",
      remark: "Approved",
    },
    {
      start: "2025-09-05",
      end: "2025-09-05",
      type: "Personal Leave",
      status: "Rejected",
      by: "Dr. Robert Smith",
      remark: "Insufficient notice",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Leave History</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th>Start Date</th>
            <th>End Date</th>
            <th>Type</th>
            <th>Status</th>
            <th>Approved By</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item, index) => (
            <tr key={index} className="border-b">
              <td>{item.start}</td>
              <td>{item.end}</td>
              <td>{item.type}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    item.status === "Approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td>{item.by}</td>
              <td>{item.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
