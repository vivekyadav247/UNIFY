
export default function UpcomingEvents() {
  const events = [
    { title: "Mid-Semester Exam", date: "2025-12-20", type: "Exam" },
    { title: "Project Presentation - CS-3A", date: "2025-12-18", type: "Event" },
    { title: "Department Seminar", date: "2025-12-22", type: "Event" },
    { title: "End-Semester Exam", date: "2026-01-10", type: "Exam" }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>

      <div className="space-y-3">
        {events.map((e, i) => (
          <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{e.title}</p>
              <p className="text-sm text-gray-500">{e.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs text-white ${
              e.type === "Exam" ? "bg-red-500" : "bg-blue-500"
            }`}>
              {e.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
