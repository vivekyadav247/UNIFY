import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { tgAPI } from "../../../services/api";
import { showError } from "../../../utils/notifications";
import { FiLoader, FiAlertCircle, FiCalendar } from "react-icons/fi";

export default function Schedule() {
  const { darkMode } = useOutletContext();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tgAPI.getSchedule();
      setSchedule(data.schedule || []);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to fetch schedule";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center py-12 ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <FiLoader className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <h1
        className={`text-3xl font-bold mb-6 flex items-center gap-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <FiCalendar /> Class Schedule
      </h1>

      {error && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            darkMode
              ? "bg-red-900/30 border border-red-700"
              : "bg-red-100 border border-red-400"
          }`}
        >
          <FiAlertCircle className="text-red-500" />
          <span className={darkMode ? "text-red-300" : "text-red-700"}>
            {error}
          </span>
        </div>
      )}

      {schedule.length === 0 ? (
        <div
          className={`p-8 rounded-2xl border text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <FiCalendar className="text-4xl mx-auto mb-3 text-gray-400" />
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No schedule available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((subject) => (
            <div
              key={subject._id}
              className={`p-6 rounded-2xl border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  : "bg-white border-gray-200 hover:border-blue-400"
              } transition-all`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {subject.subjectName}
              </h3>

              <div className="space-y-2">
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <span className="font-semibold">Code:</span>{" "}
                  {subject.subjectCode}
                </p>

                {subject.facultyId && (
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span className="font-semibold">Faculty:</span>{" "}
                    {subject.facultyId.name}
                  </p>
                )}

                {subject.credits && (
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span className="font-semibold">Credits:</span>{" "}
                    {subject.credits}
                  </p>
                )}

                {subject.type && (
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span className="font-semibold">Type:</span> {subject.type}
                  </p>
                )}

                {subject.semester && (
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span className="font-semibold">Semester:</span>{" "}
                    {subject.semester}
                  </p>
                )}
              </div>

              {subject.meetingLink && (
                <a
                  href={subject.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Join Meeting
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
