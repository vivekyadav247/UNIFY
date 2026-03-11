import { Calendar } from "lucide-react";

export default function PastEventRow({ event, darkMode }) {
  return (
    <div
      className={`flex justify-between items-center p-4 rounded-lg ${
        darkMode ? "bg-gray-700" : "bg-gray-50"
      }`}
    >
      <div className="flex gap-4 items-center">
        <div
          className={`p-2 rounded-lg ${
            darkMode ? "bg-gray-600" : "bg-gray-200"
          }`}
        >
          <Calendar className={darkMode ? "text-gray-300" : "text-gray-600"} />
        </div>
        <div>
          <h4
            className={`font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {event.title}
          </h4>
          <div className="flex gap-2 text-sm mt-1">
            <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
              {event.date}
            </span>
            <span
              className={`px-2 rounded ${
                darkMode
                  ? "bg-blue-900/40 text-blue-300"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {event.type}
            </span>
            <span
              className={`px-2 rounded ${
                darkMode
                  ? "bg-gray-600 text-gray-300"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {event.attended} attended
            </span>
          </div>
        </div>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-sm ${
          darkMode
            ? "text-green-400 bg-green-900/30"
            : "text-green-600 bg-green-100"
        }`}
      >
        Completed
      </span>
    </div>
  );
}
