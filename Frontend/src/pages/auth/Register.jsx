import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone } from "react-icons/fi";
import { authAPI } from "../../services/api";

const Register = () => {
  const navigate = useNavigate();

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

  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const sendOtp = async () => {
    if (!formData.email) {
      setError("Please enter an email first.");
      return;
    }

    setSendingOtp(true);
    setError("");

    try {
      const res = await authAPI.sendOtp({ email: formData.email });
      setSendingOtp(false);

      if (res.success) {
        setOtpSent(true);
        setError("OTP sent to your email!");
      } else {
        setError(res.message || "Failed to send OTP");
      }
    } catch (err) {
      setSendingOtp(false);
      setError(
        err.response?.data?.message || "Server error. Please try again."
      );
    }
  };

  const verifyOtp = async () => {
    if (!enteredOtp) {
      setError("Enter OTP first");
      return;
    }

    setSendingOtp(true);
    setError("");

    try {
      const res = await authAPI.verifyOtp({
        email: formData.email,
        otp: enteredOtp,
      });
      setSendingOtp(false);

      if (res.success) {
        setVerified(true);
        setError("Email verified successfully!");
      } else {
        setError(res.message || "Invalid OTP");
      }
    } catch (err) {
      setSendingOtp(false);
      setError(
        err.response?.data?.message || "Server error while verifying OTP"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verified) {
      setError("Please verify OTP before registering.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await authAPI.register(formData);
      setLoading(false);

      if (res.success) {
        setError("Registration Successful! Redirecting...");
        const enrollmentNumber = formData.enrollmentNumber;
        setTimeout(() => {
          navigate(res.redirectUrl || `/${enrollmentNumber}`);
        }, 1500);
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-purple-400 opacity-20 blur-[100px] -top-10 left-10 -z-10"></div>
      <div className="absolute w-72 h-72 bg-blue-400 opacity-20 blur-[100px] bottom-0 right-0 -z-10"></div>

      <div className="w-[950px] bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-10 animate-fadeInUp">
        <h1 className="text-4xl font-bold text-center mb-2">
          Student Registration
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Create your student account to continue.
        </p>

        {error && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-semibold ${
              error.includes("verified") || error.includes("Successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
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
                disabled={otpSent}
              />
            </div>
          </div>

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
            </select>
          </div>

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
            </select>
          </div>

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

          <div>
            <label className="font-medium">Gender</label>
            <select
              name="gender"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1 outline-none"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-span-2 flex gap-4 items-center mt-4 flex-wrap">
            {!otpSent && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={sendingOtp || !formData.email || verified}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </button>
            )}

            {otpSent && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={sendingOtp || verified}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
              >
                {sendingOtp ? "Sending..." : "Resend OTP"}
              </button>
            )}

            {otpSent && (
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                className="p-3 border rounded-lg w-40"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                disabled={verified}
              />
            )}

            {otpSent && !verified && (
              <button
                type="button"
                onClick={verifyOtp}
                disabled={sendingOtp || !enteredOtp}
                className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
              >
                {sendingOtp ? "Verifying..." : "Verify"}
              </button>
            )}

            {verified && (
              <span className="text-green-600 font-semibold text-lg">
                Verified
              </span>
            )}
          </div>

          <div className="col-span-2 mt-6">
            <button
              type="submit"
              disabled={!verified || loading}
              className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgba(138,43,226,0.5)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?
              <span
                className="text-blue-600 cursor-pointer hover:underline ml-1"
                onClick={() => navigate("/signin")}
              >
                SignIn
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
