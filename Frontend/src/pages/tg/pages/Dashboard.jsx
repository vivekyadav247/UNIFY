import { useOutletContext } from "react-router-dom";
import { FiUsers, FiCheckSquare, FiBarChart2, FiBook } from "react-icons/fi";

export default function Dashboard() {
  const { darkMode } = useOutletContext();

  const stats = [
    { title: "Total Students", value: "245", icon: <FiUsers />, color: "blue" },
    { title: "Attendance Rate", value: "92%", icon: <FiCheckSquare />, color: "green" },
    { title: "Avg. Marks", value: "78.5", icon: <FiBarChart2 />, color: "purple" },
    { title: "Assignments", value: "12", icon: <FiBook />, color: "orange" },
  ];

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Dashboard
      </h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`p-6 rounded-2xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`text-3xl p-4 rounded-xl ${
                stat.color === "blue" ? "bg-blue-100 text-blue-600" :
                stat.color === "green" ? "bg-green-100 text-green-600" :
                stat.color === "purple" ? "bg-purple-100 text-purple-600" :
                "bg-orange-100 text-orange-600"
              }`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}