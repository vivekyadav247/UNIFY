import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiPhone } from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  // Redirect if no role is provided
  useEffect(() => {
    if (!role) navigate("/select-role");
  }, [role, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    gender: "",
    mobileNumber: "",
    email: "",
    course: "",
    department: "",
    branch: "",
    section: "",
    academicYear: "",
    dob: "",
    password: "",
    employeeId: "",
    designation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API endpoint can be dynamic based on role if needed
    let endpoint = "student";
    if (role === "faculty") endpoint = "faculty";
    if (role === "hod") endpoint = "hod";
    if (role === "tg") endpoint = "tg";

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Registration Successful");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // Field rules based on role
  const fieldRules = {
    student: [
      "name",
      "email",
      "mobileNumber",
      "password",
      "enrollmentNumber",
      "dob",
      "course",
      "department",
      "branch",
      "section",
      "academicYear",
      "gender",
    ],
    faculty: ["name", "email", "mobileNumber", "password", "employeeId", "designation", "department"],
    hod: ["name", "email", "mobileNumber", "password", "department", "employeeId", "designation"],
    tg: ["name", "email", "mobileNumber", "password", "employeeId", "designation", "department", "section"],
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center relative overflow-hidden">
      {/* BACKGROUND GLOWS */}
      <div className="absolute w-72 h-72 bg-purple-400 opacity-20 blur-[100px] -top-10 left-10 -z-10"></div>
      <div className="absolute w-72 h-72 bg-blue-400 opacity-20 blur-[100px] bottom-0 right-0 -z-10"></div>

      {/* CARD */}
      <div className="w-[950px] bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-10 animate-fadeInUp">
        <h1 className="text-4xl font-bold text-center mb-2">{role?.toUpperCase()} Registration</h1>
        <p className="text-center text-gray-600 mb-6">
          Create your {role} account to continue.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* Name */}
          {fieldRules[role]?.includes("name") && (
            <div>
              <label className="font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              />
            </div>
          )}

          {/* Email */}
          {fieldRules[role]?.includes("email") && (
            <div>
              <label className="font-medium">Email</label>
              <div className="flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1">
                <FiMail className="text-gray-700 text-xl mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full bg-transparent outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Mobile */}
          {fieldRules[role]?.includes("mobileNumber") && (
            <div>
              <label className="font-medium">Mobile Number</label>
              <div className="flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1">
                <FiPhone className="text-gray-700 text-xl mr-2" />
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full bg-transparent outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          {fieldRules[role]?.includes("password") && (
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              />
            </div>
          )}

          {/* Enrollment Number */}
          {fieldRules[role]?.includes("enrollmentNumber") && (
            <div>
              <label className="font-medium">Enrollment Number</label>
              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                placeholder="e.g., 0805CS231234"
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none uppercase"
                required
              />
            </div>
          )}

          {/* DOB */}
          {fieldRules[role]?.includes("dob") && (
            <div>
              <label className="font-medium">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              />
            </div>
          )}

          {/* Course */}
          {fieldRules[role]?.includes("course") && (
            <div>
              <label className="font-medium">Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              >
                <option value="">Select course</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
          )}

          {/* Department */}
          {fieldRules[role]?.includes("department") && (
            <div>
              <label className="font-medium">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              >
                <option value="">Select department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
                <option value="BT">BT</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
          )}

          {/* Branch */}
          {fieldRules[role]?.includes("branch") && (
            <div>
              <label className="font-medium">Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              >
                <option value="">Select branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="CSE(AI&ML)">CSE (AI & ML)</option>
                <option value="CSE(DS)">CSE (DS)</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
                <option value="BT">Biotech</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
          )}

          {/* Section */}
          {fieldRules[role]?.includes("section") && (
            <div>
              <label className="font-medium">Section</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              >
                <option value="">Select section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
              </select>
            </div>
          )}

          {/* Academic Year */}
          {fieldRules[role]?.includes("academicYear") && (
            <div>
              <label className="font-medium">Academic Year</label>
              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              >
                <option value="">Select academic year</option>
                <option value="2022-2026">2022–2026</option>
                <option value="2023-2027">2023–2027</option>
                <option value="2024-2028">2024–2028</option>
                <option value="2025-2029">2025–2029</option>
                <option value="2026-2030">2026–2030</option>
              </select>
            </div>
          )}

          {/* Gender */}
          {fieldRules[role]?.includes("gender") && (
            <div>
              <label className="font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          {/* Employee ID */}
          {fieldRules[role]?.includes("employeeId") && (
            <div>
              <label className="font-medium">
                Employee ID {role === "hod" && <span className="text-gray-400 text-sm">(optional)</span>}
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="Enter employee ID"
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required={role !== "hod"} // optional for HOD
              />
            </div>
          )}

          {/* Designation */}
          {fieldRules[role]?.includes("designation") && (
            <div>
              <label className="font-medium">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Enter designation"
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
                required
              />
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 
              text-white py-3 rounded-lg font-semibold
              hover:scale-105 transition-all
              shadow-[0_0_20px_rgba(138,43,226,0.5)]"
            >
              Register
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
