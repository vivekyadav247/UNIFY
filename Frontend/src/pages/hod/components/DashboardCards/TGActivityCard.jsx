
export default function TGActivityCard({ name, students, active, reports, attendance }) {
  const infoCards = [
    { label: "Students", value: students, bg: "bg-blue-100", text: "text-blue-800" },
    { label: "Reports", value: reports, bg: "bg-green-100", text: "text-green-800" },
    { label: "Attendance", value: attendance, bg: "bg-purple-100", text: "text-purple-800" },
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      {/* Top row: Name + Active status */}
      <div className="flex justify-between items-center mb-3">
        <p className="font-medium text-gray-800">{name}</p>
        <span
          className={`text-sm font-medium ${
            active ? "text-green-600" : "text-gray-500"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Mini cards */}
      <div className="flex justify-between gap-3">
        {infoCards.map((card) => (
          <div
            key={card.label}
            className={`flex-1 p-2 rounded-lg ${card.bg} ${card.text} flex flex-col items-center`}
          >
            <span className="text-sm font-medium">{card.label}</span>
            <span className="font-bold text-lg">{card.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
