
export default function WeeklyTimetable() {
  const data = [
    ["Monday", "9:00 - 10:00", "Data Structures", "CS-3A", "Room 301"],
    ["Monday", "10:00 - 11:00", "Algorithm Analysis", "CS-3B", "Room 302"],
    ["Monday", "2:00 - 3:00", "Database Systems", "CS-4A", "Lab 1"],
    ["Tuesday", "9:00 - 10:00", "Data Structures Lab", "CS-3A", "Lab 2"],
    ["Wednesday", "3:00 - 4:00", "Research Guidance", "PG Students", "Room 205"],
    ["Friday", "11:00 - 12:00", "Faculty Meeting", "Department", "Conference Hall"]
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Weekly Timetable</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-600 border-b">
            <tr>
              <th className="text-left py-2">Day</th>
              <th className="text-left py-2">Time</th>
              <th className="text-left py-2">Subject</th>
              <th className="text-left py-2">Section</th>
              <th className="text-left py-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b">
                {row.map((cell, j) => (
                  <td key={j} className="py-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
