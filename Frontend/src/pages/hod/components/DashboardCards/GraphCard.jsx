export default function GraphCard({ title, children, darkMode }) {
  return (
    <div
      className={`rounded-xl p-5 shadow-sm border transition-colors ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
