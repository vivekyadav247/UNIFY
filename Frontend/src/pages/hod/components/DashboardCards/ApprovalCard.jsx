export default function ApprovalCard({ title, name, date, darkMode }) {
  return (
    <div
      className={`rounded-lg p-5 mb-4 flex justify-between items-center ${
        darkMode ? "bg-gray-700" : "bg-gray-50"
      }`}
    >
      {/* Left side: title + name + date */}
      <div className="space-y-1">
        <p
          className={`font-semibold text-lg ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-base ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {name}
        </p>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {date}
        </p>
      </div>

      {/* Right side: buttons */}
      <div className="flex gap-4">
        <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition">
          Approve
        </button>
        <button
          className={`border px-5 py-2 rounded-md transition ${
            darkMode
              ? "border-gray-600 text-gray-300 hover:bg-gray-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
