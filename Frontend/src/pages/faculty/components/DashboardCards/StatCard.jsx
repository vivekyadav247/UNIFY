// components/FacultyDashboardCards/StatCard.jsx
export default function StatCard({ title, value, icon, color, darkMode }) {
  return (
    <div
      className={`rounded-2xl p-6 shadow flex justify-between items-center ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {title}
        </p>
        <h2
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </h2>
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
    </div>
  );
}
