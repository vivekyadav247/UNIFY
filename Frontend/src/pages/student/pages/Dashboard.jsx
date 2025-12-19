import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiTrendingUp,
  FiBook,
  FiCheckCircle,
  FiCalendar,
  FiBarChart2,
  FiMessageCircle,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import AttendanceProgress from "../components/DashboardCards/AttendanceProgress";
import MarksDistribution from "../components/DashboardCards/MarksDistribution";
import AssignmentCardList from "../components/DashboardCards/AssignmentCardList";
import EventCard from "../components/DashboardCards/EventCard";
import FeedbackCard from "../components/DashboardCards/FeedbackCard";
import { studentAPI } from "../../../services/api";
import {
  showSuccess,
  showError,
  showInfo,
  notifyMarksReleased,
  notifyNewAnnouncement,
} from "../../../utils/notifications";

export default function Dashboard() {
  const { darkMode, student } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [classTeacher, setClassTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(
    student?.semesterNumber || 1
  );
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    // Generate semester options (1 to current semester)
    const maxSemester = student?.semesterNumber || 1;
    const semesterOptions = Array.from(
      { length: maxSemester },
      (_, i) => i + 1
    );
    setSemesters(semesterOptions);

    // Fetch class teacher info
    fetchClassTeacher();

    // Fetch dashboard data for selected semester
    fetchDashboardData(selectedSemester);

    // Auto-refresh every 2 minutes
    const interval = setInterval(
      () => fetchDashboardData(selectedSemester),
      120000
    );
    return () => clearInterval(interval);
  }, [selectedSemester, student?.semesterNumber]);

  const fetchClassTeacher = async () => {
    try {
      const data = await studentAPI.getClassTeacher();
      setClassTeacher(data.classTeacher);
    } catch (err) {
      console.log("No class teacher assigned yet");
      setClassTeacher(null);
    }
  };

  const fetchDashboardData = async (semester) => {
    try {
      setRefreshing(true);
      setError(null);

      // Fetch all dashboard data in parallel with semester filter
      const [
        attendanceRes,
        marksRes,
        assignmentsRes,
        announcementsRes,
        feedbackRes,
      ] = await Promise.all([
        studentAPI
          .getAttendance({ semesterNumber: semester })
          .catch(() => null),
        studentAPI.getMarks({ semesterNumber: semester }).catch(() => null),
        studentAPI
          .getAssignments({ semesterNumber: semester })
          .catch(() => null),
        studentAPI
          .getAnnouncements({ semesterNumber: semester })
          .catch(() => null),
        studentAPI.getFeedback({ semesterNumber: semester }).catch(() => null),
      ]);

      // Process attendance data
      const classStats = attendanceRes?.classStats || {};
      const attendancePercent = parseFloat(classStats.percentage) || 0;

      // Process marks data
      let internalMarks = [];
      let externalMarks = [];
      let newMarksNotified = false;
      if (marksRes?.marks && Array.isArray(marksRes.marks)) {
        marksRes.marks.slice(0, 5).forEach((mark) => {
          if (mark.internalMarks) internalMarks.push(mark.internalMarks);
          if (mark.externalMarks) externalMarks.push(mark.externalMarks);
          if (!newMarksNotified && mark.externalMarks) {
            notifyMarksReleased(mark.subject || "Subject", mark.externalMarks);
            newMarksNotified = true;
          }
        });
      }
      const avgMarks = marksRes?.averageMarks
        ? parseFloat(marksRes.averageMarks).toFixed(1)
        : 0;

      // Process assignments - count pending
      let assignmentList = [];
      let pendingCount = 0;
      if (
        assignmentsRes?.assignments &&
        Array.isArray(assignmentsRes.assignments)
      ) {
        assignmentList = assignmentsRes.assignments.slice(0, 3).map((a) => ({
          title: a.title || "Untitled Assignment",
          subject: a.subject || "Unknown Subject",
          due: new Date(a.deadline).toLocaleDateString(),
          status: a.status || "pending",
        }));
        pendingCount = assignmentsRes.assignments.filter(
          (a) => a.status === "pending"
        ).length;
      }

      // Process announcements
      let eventList = [];
      let newAnnouncementCount = 0;
      if (
        announcementsRes?.announcements &&
        Array.isArray(announcementsRes.announcements)
      ) {
        eventList = announcementsRes.announcements.slice(0, 3).map((ann) => ({
          title: ann.title || "Announcement",
          date: new Date(ann.createdAt).toLocaleDateString(),
        }));
        newAnnouncementCount = announcementsRes.announcements.length;
        if (newAnnouncementCount > 0) {
          notifyNewAnnouncement(eventList[0]?.title || "New Announcement");
        }
      }

      // Process feedback
      let feedbackList = [];
      if (feedbackRes?.feedbacks && Array.isArray(feedbackRes.feedbacks)) {
        feedbackList = feedbackRes.feedbacks.slice(0, 2).map((fb) => ({
          by: fb.postedBy || "Faculty",
          tag: fb.category || "Academic",
          text: fb.comments || "No feedback",
          date: new Date(fb.createdAt).toLocaleDateString(),
        }));
      }

      // Set state
      setStats({
        attendance: Math.round(attendancePercent),
        avgMarks: parseFloat(avgMarks),
        pending: pendingCount,
        events: eventList.length,
      });

      setMarksData({
        internal: internalMarks.length > 0 ? internalMarks : [0, 0, 0, 0, 0],
        external: externalMarks.length > 0 ? externalMarks : [0, 0, 0, 0, 0],
      });

      setAssignments(assignmentList);
      setAnnouncements(eventList);
      setFeedback(feedbackList);

      // Show success notification on manual refresh
      if (refreshing) {
        showSuccess("Dashboard updated!");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      showError("Failed to load dashboard data");
      // Fallback to empty data
      setStats({
        attendance: 0,
        avgMarks: 0,
        pending: 0,
        events: 0,
      });
      setMarksData({
        internal: [0, 0, 0, 0, 0],
        external: [0, 0, 0, 0, 0],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome back, {student?.name || "Student"}! 👋
          </h1>
          <p
            className={`mt-2 text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Here's your academic performance overview
          </p>
        </div>

        {/* Semester Selector */}
        <div className="flex flex-col items-end gap-2">
          <label
            className={`text-sm font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Select Semester
          </label>
          <div className="flex gap-2">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg border font-semibold transition-all ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
              } disabled:opacity-50 cursor-pointer`}
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchDashboardData(selectedSemester)}
              disabled={refreshing}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              }`}
            >
              <FiRefreshCw
                className={`text-xl ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
          <button
            onClick={() => fetchDashboardData(selectedSemester)}
            className="mt-2 text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* CLASS TEACHER CARD */}
      {classTeacher && (
        <div
          className={`p-5 rounded-2xl border ${
            darkMode
              ? "bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-700/50"
              : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
          }`}
        >
          <div className="flex items-center gap-4">
            {classTeacher.profilePic ? (
              <img
                src={classTeacher.profilePic}
                alt={classTeacher.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-indigo-700" : "bg-indigo-500"
                }`}
              >
                <FiUser className="text-white text-2xl" />
              </div>
            )}
            <div className="flex-1">
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  darkMode ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                Your Class Teacher (TG)
              </p>
              <h3
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {classTeacher.name}
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {classTeacher.class} • {classTeacher.academicYear}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={`mailto:${classTeacher.email}`}
                className={`p-3 rounded-lg transition-all ${
                  darkMode
                    ? "bg-indigo-700/50 hover:bg-indigo-600 text-indigo-200"
                    : "bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
                }`}
                title={classTeacher.email}
              >
                <FiMail className="text-xl" />
              </a>
              <a
                href={`tel:${classTeacher.mobileNumber}`}
                className={`p-3 rounded-lg transition-all ${
                  darkMode
                    ? "bg-green-700/50 hover:bg-green-600 text-green-200"
                    : "bg-green-100 hover:bg-green-200 text-green-600"
                }`}
                title={classTeacher.mobileNumber}
              >
                <FiPhone className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div
            className={`text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading your dashboard...
          </div>
        </div>
      ) : stats ? (
        <>
          {/* 4 STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className={`
                p-6 rounded-2xl border transition-all duration-300
                ${
                  darkMode
                    ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/40 hover:border-blue-600/60"
                    : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60 hover:border-blue-300"
                }
                hover:shadow-lg
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-blue-700/40" : "bg-blue-200"
                  }`}
                >
                  <FiCheckCircle
                    className={`text-2xl ${
                      darkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold text-green-500">
                  Live
                </span>
              </div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Attendance
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.attendance}%
              </p>
              <p
                className={`text-xs mt-2 ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                This semester
              </p>
            </div>

            <div
              className={`
                p-6 rounded-2xl border transition-all duration-300
                ${
                  darkMode
                    ? "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/40 hover:border-purple-600/60"
                    : "bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60 hover:border-purple-300"
                }
                hover:shadow-lg
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-purple-700/40" : "bg-purple-200"
                  }`}
                >
                  <FiTrendingUp
                    className={`text-2xl ${
                      darkMode ? "text-purple-300" : "text-purple-600"
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold text-green-500">
                  Real
                </span>
              </div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Average Marks
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.avgMarks}
              </p>
              <p
                className={`text-xs mt-2 ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Latest Data
              </p>
            </div>

            <div
              className={`
                p-6 rounded-2xl border transition-all duration-300
                ${
                  darkMode
                    ? "bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700/40 hover:border-orange-600/60"
                    : "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/60 hover:border-orange-300"
                }
                hover:shadow-lg
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-orange-700/40" : "bg-orange-200"
                  }`}
                >
                  <FiBook
                    className={`text-2xl ${
                      darkMode ? "text-orange-300" : "text-orange-600"
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold text-red-500">
                  Urgent
                </span>
              </div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Pending
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.pending}
              </p>
              <p
                className={`text-xs mt-2 ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Assignments
              </p>
            </div>

            <div
              className={`
                p-6 rounded-2xl border transition-all duration-300
                ${
                  darkMode
                    ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/40 hover:border-green-600/60"
                    : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60 hover:border-green-300"
                }
                hover:shadow-lg
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-green-700/40" : "bg-green-200"
                  }`}
                >
                  <FiCalendar
                    className={`text-2xl ${
                      darkMode ? "text-green-300" : "text-green-600"
                    }`}
                  />
                </div>
              </div>
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Upcoming Events
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stats.events}
              </p>
              <p
                className={`text-xs mt-2 ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Coming soon
              </p>
            </div>
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Attendance Trend
              </h2>
              <AttendanceProgress
                percent={stats.attendance}
                trend={[90, 92, 88, 94, 90, 88]}
                darkMode={darkMode}
              />
            </div>

            <div>
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Marks Distribution
              </h2>
              <MarksDistribution
                internal={marksData?.internal || [0, 0, 0, 0, 0]}
                external={marksData?.external || [0, 0, 0, 0, 0]}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* ASSIGNMENTS + EVENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <AssignmentCardList items={assignments} darkMode={darkMode} />
            </div>

            <div>
              <EventCard events={announcements} darkMode={darkMode} />
            </div>
          </div>

          {/* FEEDBACK - AT THE BOTTOM */}
          <div>
            <FeedbackCard items={feedback} darkMode={darkMode} />
          </div>
        </>
      ) : null}
    </div>
  );
}
