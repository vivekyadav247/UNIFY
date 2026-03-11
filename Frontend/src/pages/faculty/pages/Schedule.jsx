import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { facultyAPI } from "../../../services/api";

export default function Schedule() {
  const { darkMode } = useOutletContext();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(new Date().getDay());

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await facultyAPI.getSchedule();
      setSchedule(response.schedule || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getClassesForDay = (dayIndex) => {
    return schedule.filter((item) => item.dayOfWeek === dayIndex);
  };

  if (loading) {
    return (
      <div className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="animate-pulse">
          <div
            className={`h-8 rounded w-1/4 mb-6 ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          ></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-24 rounded ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 space-y-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Weekly Schedule</h1>
        <div
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Today: {daysOfWeek[currentDay - 1] || "Sunday"}
        </div>
      </div>

      {schedule.length === 0 ? (
        <div
          className={`rounded-lg shadow p-8 text-center ${
            darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
          }`}
        >
          <p>No schedule assigned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {daysOfWeek.map((day, index) => {
            const dayClasses = getClassesForDay(index + 1);
            const isToday = currentDay === index + 1;

            return (
              <div
                key={day}
                className={`rounded-lg shadow p-4 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } ${isToday ? "border-l-4 border-blue-500" : ""}`}
              >
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  {day}
                  {isToday && (
                    <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                      Today
                    </span>
                  )}
                </h3>

                {dayClasses.length === 0 ? (
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    No classes scheduled
                  </p>
                ) : (
                  <div className="space-y-2">
                    {dayClasses
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((classItem, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded border ${
                            darkMode
                              ? "bg-gray-700 border-gray-600"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                darkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {classItem.subjectName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {classItem.branch} - {classItem.section} (
                              {classItem.academicYear})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-600">
                              {classItem.startTime} - {classItem.endTime}
                            </p>
                            <p className="text-xs text-gray-500">
                              {classItem.room}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
