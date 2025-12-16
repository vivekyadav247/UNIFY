
export default function ExtraClasses() {
  const classes = [
    ["Data Structures - Revision", "CS-3A", "2025-12-16", "4:00 PM"],
    ["Algorithm Analysis - Doubt Clearing", "CS-3B", "2025-12-18", "5:00 PM"]
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Extra Classes</h2>
        <button className="bg-blue-600 text-white px-4 py-1 rounded">
          + Schedule Class
        </button>
      </div>

      <div className="space-y-3">
        {classes.map((c, i) => (
          <div key={i} className="border rounded-lg p-4 flex justify-between">
            <div>
              <p className="font-medium">{c[0]}</p>
              <p className="text-sm text-gray-500">{c[2]} • {c[3]}</p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
              {c[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
