import PastEventRow from "./PastEventRow";

export default function PastEventsList({ events, darkMode }) {
  return (
    <div
      className={`border rounded-xl p-5 space-y-4 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {events.length === 0 ? (
        <div
          className={`text-center py-4 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No past events found
        </div>
      ) : (
        events.map((event, index) => (
          <PastEventRow key={index} event={event} darkMode={darkMode} />
        ))
      )}
    </div>
  );
}
