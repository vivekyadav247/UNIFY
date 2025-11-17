
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiUser, FiList } from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    enrollNo: "",
    gender: "",
    mobile: "",
    email: "",
    role: "",
    course: "",
    department: "",
    section: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    navigate("/login");
  };

  return (
    <div
      className="
        min-h-screen 
        bg-white 
        flex justify-center items-center 
        relative overflow-hidden
      "
    >
      {/* GLOWS */}
      <div className="absolute w-72 h-72 bg-purple-400 opacity-20 blur-[100px] -top-10 left-10 -z-10"></div>
      <div className="absolute w-72 h-72 bg-blue-400 opacity-20 blur-[100px] bottom-0 right-0 -z-10"></div>

      {/* CARD */}
      <div
        className="
          w-[900px] bg-white/80 backdrop-blur-md
          border border-gray-200 shadow-xl
          rounded-2xl p-10 animate-fadeInUp
        "
      >
        <h1 className="text-4xl font-bold text-center mb-2">Register</h1>
        <p className="text-center text-gray-600 mb-6">
          Create your account to continue.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* FIRST NAME */}
          <div>
            <label className="font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              required
            />
          </div>

          {/* ENROLLMENT NO */}
          <div>
            <label className="font-medium">Enrollment No</label>
            <input
              type="text"
              name="enrollNo"
              placeholder="Enter enrollment no"
              value={formData.enrollNo}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              required
            />
          </div>

          {/* GENDER */}
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
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* MOBILE */}
          <div>
            <label className="font-medium">Mobile No</label>
            <div className="flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1">
              <FiPhone className="text-gray-700 text-xl mr-2" />
              <input
                type="text"
                name="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="font-medium">Email</label>
            <div className="flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1">
              <FiMail className="text-gray-700 text-xl mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              required
            >
              <option value="">Select role</option>
              <option value="hod">HOD</option>
              <option value="tg">Teacher Guardian</option>
              <option value="student">Student</option>
            </select>
          </div>

          {/* COURSE */}
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
              <option value="btech">B.Tech</option>
              <option value="mtech">M.Tech</option>
              <option value="bca">BCA</option>
              <option value="bsc">B.Sc</option>
            </select>
          </div>

          {/* DEPARTMENT */}
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
              <option value="cs">Computer Science</option>
              <option value="it">Information Technology</option>
              <option value="mech">Mechanical</option>
              <option value="civil">Civil</option>
            </select>
          </div>

          {/* CLASS */}
<div>
  <label className="font-medium">Class</label>
  <select
    name="class"
    value={formData.class}
    onChange={handleChange}
    className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
    required
  >
    <option value="">Select class</option>
    <option value="1st">1st Year</option>
    <option value="2nd">2nd Year</option>
    <option value="3rd">3rd Year</option>
    <option value="4th">4th Year</option>
  </select>
</div>

{/* SECTION */}
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
  </select>
</div>

          {/* SUBMIT BUTTON */}
          <div className="col-span-2">
            <button
              type="submit"
              className="
                w-full bg-gradient-to-r from-purple-600 to-blue-600 
                text-white py-3 rounded-lg font-semibold
                hover:scale-105 transition-all
                shadow-[0_0_20px_rgba(138,43,226,0.5)]
              "
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
