import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiCalendar,
  FiCheck,
  FiX,
  FiUsers,
  FiLoader,
  FiEdit2,
} from "react-icons/fi";
import { tgAPI } from "../../../services/api";
import { showSuccess, showError } from "../../../utils/notifications";

const Attendance = () => {
  const { darkMode } = useOutletContext();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [todayAttendanceTaken, setTodayAttendanceTaken] = useState(false);
  const [todayStats, setTodayStats] = useState({
    present: 0,
    absent: 0,
    total: 0,
  });
  const [filterDate, setFilterDate] = useState("");
  const [currentSemester, setCurrentSemester] = useState(null);

  useEffect(() => {
    fetchCurrentSemesterInfo();
    fetchData();
  }, []);

  const fetchCurrentSemesterInfo = async () => {
    try {
      const data = await tgAPI.getCurrentSemesterStudentData();
      setCurrentSemester(data.currentSemester || data.data?.currentSemester);

      const semesterStudents = data.students || data.data?.students || [];
      setStudents(semesterStudents);
    } catch (err) {
      setCurrentSemester(null);
      setStudents([]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const recordsRes = await tgAPI.getAttendanceRecords();

      // Axios interceptor already extracts .data, so no need for .data again
      const records = recordsRes?.records || recordsRes?.data?.records || [];

      setAttendanceRecords(records);

      // Check if today's attendance is already taken
      const today = new Date().toISOString().split("T")[0];
      const todayRecords = records.filter((r) => {
        const recordDate = new Date(r.date).toISOString().split("T")[0];
        return recordDate === today;
      });

      if (todayRecords.length > 0) {
        setTodayAttendanceTaken(true);
        const present = todayRecords.filter(
          (r) => r.status?.toLowerCase() === "present"
        ).length;
        const absent = todayRecords.filter(
          (r) => r.status?.toLowerCase() === "absent"
        ).length;
        setTodayStats({ present, absent, total: todayRecords.length });
      } else {
        setTodayAttendanceTaken(false);
        setTodayStats({ present: 0, absent: 0, total: studentsList.length });
      }

      // Initialize attendance data for modal
      const initialData = {};
      studentsList.forEach((student) => {
        initialData[student._id] = "Present";
      });
      setAttendanceData(initialData);
    } catch (error) {
      showError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAttendance = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
    const initialData = {};
    students.forEach((student) => {
      initialData[student._id] = "Present";
    });
    setAttendanceData(initialData);
    setShowModal(true);
  };

  const handleEditAttendance = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = attendanceRecords.filter((r) => {
      const recordDate = new Date(r.date).toISOString().split("T")[0];
      return recordDate === today;
    });

    // Pre-fill with existing data - match by enrollment number
    const existingData = {};
    students.forEach((student) => {
      const record = todayRecords.find(
        (r) => r.enrollmentNumber === student.enrollmentNumber
      );
      existingData[student._id] = record?.status || "Present";
    });

    setAttendanceData(existingData);
    setSelectedDate(today);
    setShowModal(true);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    students.forEach((student) => {
      allPresent[student._id] = "Present";
    });
    setAttendanceData(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    students.forEach((student) => {
      allAbsent[student._id] = "Absent";
    });
    setAttendanceData(allAbsent);
  };

  const handleSubmitAttendance = async () => {
    try {
      setSubmitting(true);

      const records = Object.entries(attendanceData).map(
        ([studentId, status]) => ({
          studentId,
          status,
        })
      );

      await tgAPI.takeAttendance({
        date: selectedDate,
        records,
      });

      showSuccess("Attendance submitted successfully!");
      setShowModal(false);
      fetchData();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter records by date
  const filteredRecords = filterDate
    ? attendanceRecords.filter((r) => {
        const recordDate = new Date(r.date).toISOString().split("T")[0];
        return recordDate === filterDate;
      })
    : attendanceRecords;

  // Get unique dates for filter dropdown
  const uniqueDates = [
    ...new Set(
      attendanceRecords.map((r) => new Date(r.date).toISOString().split("T")[0])
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  // Stats for filtered view
  const filteredStats = {
    present: filteredRecords.filter(
      (r) => r.status?.toLowerCase() === "present"
    ).length,
    absent: filteredRecords.filter((r) => r.status?.toLowerCase() === "absent")
      .length,
    total: filteredRecords.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-2xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Attendance Management
          </h1>
          <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Track and manage student attendance
          </p>
          {currentSemester && (
            <p
              className={`text-xs mt-2 font-semibold ${
                darkMode ? "text-blue-300" : "text-blue-700"
              }`}
            >
              Semester {currentSemester.semesterNumber} (
              {currentSemester.academicYear})
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {todayAttendanceTaken ? (
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                  darkMode
                    ? "bg-green-900/30 text-green-400 border border-green-700/50"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
              >
                <FiCheck className="text-lg" />
                <span className="font-medium">Today's Attendance Done</span>
              </div>
              <button
                onClick={handleEditAttendance}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FiEdit2 />
                Edit
              </button>
            </div>
          ) : (
            <button
              onClick={handleTakeAttendance}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25"
            >
              <FiCalendar />
              Take Attendance
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Students */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-linear-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40"
              : "bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Students
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {students.length}
              </p>
            </div>
            <div
              className={`p-4 rounded-xl ${
                darkMode ? "bg-blue-700/40" : "bg-blue-200"
              }`}
            >
              <FiUsers
                className={`text-2xl ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Present */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-linear-to-br from-green-900/30 to-green-800/20 border-green-700/40"
              : "bg-linear-to-br from-green-50 to-green-100/50 border-green-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {filterDate
                  ? "Present (Selected)"
                  : todayAttendanceTaken
                  ? "Present Today"
                  : "Present"}
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {filterDate ? filteredStats.present : todayStats.present}
              </p>
            </div>
            <div
              className={`p-4 rounded-xl ${
                darkMode ? "bg-green-700/40" : "bg-green-200"
              }`}
            >
              <FiCheck
                className={`text-2xl ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Absent */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            darkMode
              ? "bg-linear-to-br from-red-900/30 to-red-800/20 border-red-700/40"
              : "bg-linear-to-br from-red-50 to-red-100/50 border-red-200/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {filterDate
                  ? "Absent (Selected)"
                  : todayAttendanceTaken
                  ? "Absent Today"
                  : "Absent"}
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {filterDate ? filteredStats.absent : todayStats.absent}
              </p>
            </div>
            <div
              className={`p-4 rounded-xl ${
                darkMode ? "bg-red-700/40" : "bg-red-200"
              }`}
            >
              <FiX
                className={`text-2xl ${
                  darkMode ? "text-red-300" : "text-red-600"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div
        className={`rounded-2xl border overflow-hidden ${
          darkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div
          className={`p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Attendance Records
          </h2>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className={`px-4 py-2 rounded-xl border transition-all ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            }`}
          >
            <option value="">All Dates</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? "bg-gray-700/50" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Student
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Enrollment No.
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Date
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className={`px-6 py-12 text-center ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <FiCalendar
                        className={`text-4xl mb-3 ${
                          darkMode ? "text-gray-600" : "text-gray-300"
                        }`}
                      />
                      <p className="text-lg font-medium">
                        No attendance records found
                      </p>
                      <p className="text-sm mt-1">
                        {!todayAttendanceTaken &&
                          "Click 'Take Attendance' to start marking attendance"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <tr
                    key={index}
                    className={`transition-colors ${
                      darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {record.studentName?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {record.studentName || "Unknown Student"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {record.enrollmentNumber || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {new Date(record.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                          record.status?.toLowerCase() === "present"
                            ? darkMode
                              ? "bg-green-900/30 text-green-400 border border-green-700/50"
                              : "bg-green-100 text-green-700"
                            : darkMode
                            ? "bg-red-900/30 text-red-400 border border-red-700/50"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status?.toLowerCase() === "present" ? (
                          <FiCheck className="text-xs" />
                        ) : (
                          <FiX className="text-xs" />
                        )}
                        {record.status?.charAt(0).toUpperCase() +
                          record.status?.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Take Attendance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {todayAttendanceTaken
                      ? "Edit Attendance"
                      : "Take Attendance"}
                  </h2>
                  <p
                    className={`text-sm mt-1 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Mark attendance for all students
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Date and Quick Actions */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Date:
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className={`px-3 py-2 rounded-lg border transition-all ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllPresent}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      darkMode
                        ? "bg-green-900/30 text-green-400 hover:bg-green-900/50 border border-green-700/50"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <FiCheck />
                    Mark All Present
                  </button>
                  <button
                    onClick={markAllAbsent}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      darkMode
                        ? "bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-700/50"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    <FiX />
                    Mark All Absent
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div
                className={`mt-4 flex items-center gap-4 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span>
                  Total:{" "}
                  <span
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {students.length}
                  </span>
                </span>
                <span
                  className={darkMode ? "text-green-400" : "text-green-600"}
                >
                  Present:{" "}
                  <span className="font-semibold">
                    {
                      Object.values(attendanceData).filter(
                        (s) => s === "Present"
                      ).length
                    }
                  </span>
                </span>
                <span className={darkMode ? "text-red-400" : "text-red-600"}>
                  Absent:{" "}
                  <span className="font-semibold">
                    {
                      Object.values(attendanceData).filter(
                        (s) => s === "Absent"
                      ).length
                    }
                  </span>
                </span>
              </div>
            </div>

            {/* Modal Body - Student List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {students.map((student, index) => (
                  <div
                    key={student._id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      attendanceData[student._id] === "Present"
                        ? darkMode
                          ? "bg-green-900/20 border-green-700/50"
                          : "bg-green-50 border-green-200"
                        : darkMode
                        ? "bg-red-900/20 border-red-700/50"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                          darkMode
                            ? "bg-gray-700 text-gray-200"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {student.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {student.name}
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {student.enrollmentNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(student._id, "Present")
                        }
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
                          attendanceData[student._id] === "Present"
                            ? "bg-green-600 text-white shadow-lg shadow-green-500/25"
                            : darkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-green-900/30 hover:text-green-400"
                            : "bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-700"
                        }`}
                      >
                        <FiCheck />
                        Present
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(student._id, "Absent")
                        }
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
                          attendanceData[student._id] === "Absent"
                            ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                            : darkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-red-900/30 hover:text-red-400"
                            : "bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-700"
                        }`}
                      >
                        <FiX />
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`p-4 border-t flex items-center justify-end gap-3 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => setShowModal(false)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAttendance}
                disabled={submitting || students.length === 0}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                {submitting ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiCheck />
                    Submit Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
