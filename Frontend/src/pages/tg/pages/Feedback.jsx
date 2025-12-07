import { useOutletContext } from "react-router-dom";

export default function Feedback() {
  const { darkMode } = useOutletContext();

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Feedback
      </h1>

      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Feedback feature coming soon...
        </p>
      </div>
    </div>
  );
}