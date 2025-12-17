
export default function CounselingSessions() {
  const sessions = [
    ["Alice Johnson", "CS001", "Career Guidance", "2025-12-15", "2:00 PM"],
    ["Bob Smith", "CS002", "Academic Performance", "2025-12-16", "3:00 PM"],
    ["Grace Wilson", "CS007", "Personal Issues", "2025-12-17", "11:00 AM"]
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Counseling Sessions</h2>
        <button className="bg-blue-600 text-white px-4 py-1 rounded">+ Add Session</button>
      </div>

      <div className="space-y-3">
        {sessions.map((s, i) => (
          <div key={i} className="border rounded-lg p-4">
            <p className="font-medium">{s[0]}</p>
            <p className="text-sm text-gray-500">{s[1]}</p>
            <p className="text-sm">{s[2]}</p>
            <p className="text-xs text-gray-500">{s[3]} • {s[4]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
