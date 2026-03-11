export default function AnnouncementCard({ color, heading, text, darkMode }) {
  return (
    <div className={`p-4 rounded-lg mb-4 ${color} w-full max-w-4xl mx-auto`}>
      <p
        className={`font-medium ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {heading}
      </p>
      <p
        className={`text-sm mt-1 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
