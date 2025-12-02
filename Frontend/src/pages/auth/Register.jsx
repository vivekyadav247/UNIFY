import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone } from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();

  // Form data for student-only registration
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
  });

  // OTP system states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // SEND OTP
  // -----------------------------
  const sendOtp = async () => {
    if (!formData.email) {
      alert("Please enter an email first.");
      return;
    }

    setSendingOtp(true);

    try {
      const res = await fetch("http://localhost:5000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      setSendingOtp(false);

      if (data.success) {
        setOtpSent(true);
        alert("OTP sent to email");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setSendingOtp(false);
      console.error(err);
      alert("Server error while sending OTP");
    }
  };

  // -----------------------------
  // VERIFY OTP
  // -----------------------------
  const verifyOtp = async () => {
    if (!enteredOtp) {
      alert("Enter OTP first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: enteredOtp }),
      });

      const data = await res.json();

      if (data.success) {
        setVerified(true);
        alert("Email verified successfully!");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while verifying OTP");
    }
  };

  // -----------------------------
  // REGISTER STUDENT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verified) {
      alert("Please verify OTP before registering.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/student/register", {
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

  return (
    <div className="min-h-screen bg-white flex justify-center items-center relative overflow-hidden">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute w-72 h-72 bg-purple-400 opacity-20 blur-[100px] -top-10 left-10 -z-10"></div>
      <div className="absolute w-72 h-72 bg-blue-400 opacity-20 blur-[100px] bottom-0 right-0 -z-10"></div>

      {/* CARD */}
      <div className="w-[950px] bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-10 animate-fadeInUp">
        <h1 className="text-4xl font-bold text-center mb-2">
          Student Registration
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Create your student account to continue.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <label className="font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="font-medium">Email</label>
            <div className="flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1">
              <FiMail className="text-gray-700 text-xl mr-2" />
              <input
                type="email"
                name="email"
                className="w-full bg-transparent outline-none"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* MOBILE */}
          <div>
            <label className="font-medium">Mobile Number</label>
            <div className="flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1">
              <FiPhone className="text-gray-700 text-xl mr-2" />
              <input
                type="text"
                name="mobileNumber"
                className="w-full bg-transparent outline-none"
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* ENROLLMENT NUMBER */}
          <div>
            <label className="font-medium">Enrollment Number</label>
            <input
              type="text"
              name="enrollmentNumber"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none uppercase"
              placeholder="e.g., 0805CS231234"
              value={formData.enrollmentNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* DOB */}
          <div>
            <label className="font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          {/* COURSE */}
          <div>
            <label className="font-medium">Course</label>
            <select
              name="course"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Select course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MBA">MBA</option>
              <option value="MCA">MCA</option>
            </select>
          </div>

          {/* DEPARTMENT */}
          <div>
            <label className="font-medium">Department</label>
            <select
              name="department"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              value={formData.department}
              onChange={handleChange}
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

          {/* BRANCH */}
          <div>
            <label className="font-medium">Branch</label>
            <select
              name="branch"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              value={formData.branch}
              onChange={handleChange}
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

          {/* SECTION */}
          <div>
            <label className="font-medium">Section</label>
            <select
              name="section"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              value={formData.section}
              onChange={handleChange}
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

          {/* ACADEMIC YEAR */}
          <div>
            <label className="font-medium">Academic Year</label>
            <select
              name="academicYear"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              value={formData.academicYear}
              onChange={handleChange}
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

          {/* ---------------- OTP SECTION ---------------- */}
          <div className="col-span-2 flex gap-4 items-center mt-4">

            {/* Send OTP */}
            {!otpSent && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={sendingOtp || !formData.email}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </button>
            )}

            {/* Resend OTP */}
            {otpSent && (
              <button
                type="button"
                onClick={sendOtp}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                Resend OTP
              </button>
            )}

            {/* OTP Input */}
            {otpSent && (
              <input
                type="text"
                maxLength="6"
                placeholder="Enter OTP"
                className="p-3 border rounded-lg w-40"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
              />
            )}

            {/* Verify OTP */}
            {otpSent && !verified && (
              <button
                type="button"
                onClick={verifyOtp}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Verify
              </button>
            )}

            {/* Verified badge */}
            {verified && (
              <span className="text-green-600 font-semibold">✔ Verified</span>
            )}
          </div>

          {/* REGISTER BUTTON */}
          <div className="col-span-2 mt-6">
            <button
              type="submit"
              disabled={!verified}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 
              text-white py-3 rounded-lg font-semibold
              hover:scale-105 transition-all
              shadow-[0_0_20px_rgba(138,43,226,0.5)]
              disabled:opacity-40 disabled:cursor-not-allowed"
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
