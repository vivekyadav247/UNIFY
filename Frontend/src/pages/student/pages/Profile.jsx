import React from "react";
import { useOutletContext } from "react-router-dom";
import { FiMail, FiBook, FiUser, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";

export default function Profile() {
  const { darkMode } = useOutletContext();

  const studentData = {
    name: "Sakshi Bhadoriya",
    email: "sakshi.bhadoriya@example.com",
    phone: "+91 98765 43210",
    roll: "STU2025",
    course: "B.Sc. Computer Science",
    semester: "4th",
    gpa: "8.2",
    joinDate: "Aug 15, 2022",
    address: "123 Main Street, City, State 12345",
    avatar: "https://ui-avatars.com/api/?name=Sakshi+Bhadoriya&background=3b82f6&color=fff&size=200",
    fatherName: "Mr. Rajesh Bhadoriya",
    motherName: "Mrs. Priya Bhadoriya",
    dob: "Jan 10, 2004",
    bloodGroup: "O+",
    caste: "General",
    category: "General",
    aadhar: "XXXX XXXX 1234",
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          My Profile
        </h1>
        <p className={`mt-2 text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          View and manage your profile information
        </p>
      </div>

      {/* PROFILE HEADER CARD */}
      <div className={`p-8 rounded-2xl transition-colors duration-300 ${
        darkMode 
          ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/40" 
          : "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60"
      }`}>
        <div className="flex flex-col lg:flex-row items-center gap-8">

          {/* AVATAR */}
          <div className="flex-shrink-0">
            <img 
              src={studentData.avatar} 
              alt={studentData.name}
              className={`w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg`}
            />
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              {studentData.name}
            </h2>
            <p className={`text-lg mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {studentData.course}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <FiUser className="text-blue-500" />
                <span>Roll No: <strong>{studentData.roll}</strong></span>
              </div>
              <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <FiBook className="text-purple-500" />
                <span>Semester: <strong>{studentData.semester}</strong></span>
              </div>
              <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <FiMail className="text-green-500" />
                <span>GPA: <strong>{studentData.gpa}</strong></span>
              </div>
              <div className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <FiCalendar className="text-orange-500" />
                <span>Joined: <strong>{studentData.joinDate}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT INFORMATION */}
      <div className={`p-6 rounded-2xl transition-colors duration-300 ${
        darkMode 
          ? "bg-gray-800/50 border border-gray-700" 
          : "bg-white border border-gray-200"
      }`}>
        <h3 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <div className="flex items-center gap-3 mb-2">
              <FiMail className={`text-lg ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Email</p>
            </div>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.email}</p>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <div className="flex items-center gap-3 mb-2">
              <FiPhone className={`text-lg ${darkMode ? "text-green-400" : "text-green-600"}`} />
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Phone</p>
            </div>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.phone}</p>
          </div>

          <div className={`p-4 rounded-lg md:col-span-2 ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <div className="flex items-center gap-3 mb-2">
              <FiMapPin className={`text-lg ${darkMode ? "text-orange-400" : "text-orange-600"}`} />
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Address</p>
            </div>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.address}</p>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className={`p-6 rounded-2xl transition-colors duration-300 ${
        darkMode 
          ? "bg-gray-800/50 border border-gray-700" 
          : "bg-white border border-gray-200"
      }`}>
        <h3 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Date of Birth</p>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.dob}</p>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Blood Group</p>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.bloodGroup}</p>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Category</p>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.category}</p>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Caste</p>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.caste}</p>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Aadhar Number</p>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.aadhar}</p>
          </div>
        </div>
      </div>

      {/* PARENT INFORMATION */}
      <div className={`p-6 rounded-2xl transition-colors duration-300 ${
        darkMode 
          ? "bg-gray-800/50 border border-gray-700" 
          : "bg-white border border-gray-200"
      }`}>
        <h3 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Parent Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Father's Name</p>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.fatherName}</p>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700/30 border border-gray-600" : "bg-slate-50 border border-gray-200"}`}>
            <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Mother's Name</p>
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{studentData.motherName}</p>
          </div>
        </div>
      </div>

      {/* EDIT BUTTON */}
      <div className="flex gap-4">
        <button className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          darkMode 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}>
          Edit Profile
        </button>
        <button className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          darkMode 
            ? "border border-gray-600 text-white hover:bg-gray-700" 
            : "border border-gray-300 text-gray-900 hover:bg-gray-100"
        }`}>
          Download Profile
        </button>
      </div>

    </div>
  );
}