import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiGrid,
  FiBookOpen,
  FiLayers,
  FiCalendar,
  FiTrendingUp,
  FiPlus,
} from "react-icons/fi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalHODs: 0,
    totalDepartments: 0,
    totalCourses: 0,
    totalBranches: 0,
    totalSections: 0,
    totalAcademicYears: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/dashboard",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total HODs",
      value: stats.totalHODs,
      icon: <FiUsers />,
      color: "bg-blue-500",
    },
    {
      title: "Departments",
      value: stats.totalDepartments,
      icon: <FiGrid />,
      color: "bg-green-500",
    },
    {
      title: "Courses",
      value: stats.totalCourses,
      icon: <FiBookOpen />,
      color: "bg-purple-500",
    },
    {
      title: "Branches",
      value: stats.totalBranches,
      icon: <FiLayers />,
      color: "bg-orange-500",
    },
    {
      title: "Sections",
      value: stats.totalSections,
      icon: <FiGrid />,
      color: "bg-pink-500",
    },
    {
      title: "Academic Years",
      value: stats.totalAcademicYears,
      icon: <FiCalendar />,
      color: "bg-indigo-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your institution's configuration
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {card.value}
                </p>
              </div>
              <div
                className={`${card.color} p-4 rounded-full text-white text-2xl`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiTrendingUp className="text-blue-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/hods")}
            className="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <FiPlus className="text-2xl" />
              <span className="font-semibold text-lg">Add New HOD</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/departments")}
            className="group relative overflow-hidden p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <FiPlus className="text-2xl" />
              <span className="font-semibold text-lg">Create Department</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/courses")}
            className="group relative overflow-hidden p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <FiPlus className="text-2xl" />
              <span className="font-semibold text-lg">Add Course</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/branches")}
            className="group relative overflow-hidden p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <FiPlus className="text-2xl" />
              <span className="font-semibold text-lg">Add Branch</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/sections")}
            className="group relative overflow-hidden p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <FiPlus className="text-2xl" />
              <span className="font-semibold text-lg">Create Section</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/academic-years")}
            className="group relative overflow-hidden p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <FiPlus className="text-2xl" />
              <span className="font-semibold text-lg">Add Academic Year</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/subjects")}
            className="group relative overflow-hidden p-6 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <FiPlus className="text-2xl" />
              <span className="font-semibold text-lg">Add Subject</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
