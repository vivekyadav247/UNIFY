export default function AssignmentTable({ assignments }) {
  const statusStyle = {
    Submitted: "bg-blue-500",
    Pending: "bg-orange-500",
    Graded: "bg-green-500"
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">
        Submitted Assignments ({assignments.length})
      </h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="py-3">Student Name</th>
            <th>Student ID</th>
            <th>Assignment</th>
            <th>Section</th>
            <th>Submission Date</th>
            <th>Status</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a, i) => (
            <tr key={i} className="border-b">
              <td className="py-3">{a.name}</td>
              <td>{a.id}</td>
              <td>{a.assignment}</td>
              <td>{a.section}</td>
              <td>{a.date || "-"}</td>

              <td>
                <span
                  className={`text-white text-sm px-3 py-1 rounded-full ${statusStyle[a.status]}`}
                >
                  {a.status}
                </span>
              </td>

              <td>{a.grade || "-"}</td>

              <td className="space-x-2">
                <button className="border px-4 py-1 rounded-lg">
                  Review
                </button>
                {a.status !== "Pending" && (
                  <button className="border px-4 py-1 rounded-lg">
                    Grade
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
