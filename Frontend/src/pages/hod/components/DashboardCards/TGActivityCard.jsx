export default function TGActivityCard({
  name,
  students,
  active,
  reports,
  attendance,
  darkMode,
}) {
  const infoCards = [
    {
      label: "Students",
      value: students,
      bg: darkMode ? "bg-blue-900/30" : "bg-blue-100",
      text: darkMode ? "text-blue-300" : "text-blue-800",
    },
    {
      label: "Reports",
      value: reports,
      bg: darkMode ? "bg-green-900/30" : "bg-green-100",
      text: darkMode ? "text-green-300" : "text-green-800",
    },
    {
      label: "Attendance",
      value: attendance,
      bg: darkMode ? "bg-purple-900/30" : "bg-purple-100",
      text: darkMode ? "text-purple-300" : "text-purple-800",
    },
  ];

  return (
    <div
      className={`rounded-lg p-4 mb-3 ${
        darkMode ? "bg-gray-700" : "bg-gray-50"
      }`}
    >
      {/* Top row: Name + Active status */}
      <div className="flex justify-between items-center mb-3">
        <p
          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          {name}
        </p>
        <span
          className={`text-sm font-medium ${
            active
              ? darkMode
                ? "text-green-400"
                : "text-green-600"
              : darkMode
              ? "text-gray-400"
              : "text-gray-500"
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
