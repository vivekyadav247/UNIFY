import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { authAPI } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [credentials, setCredentials] = useState({
    enrollmentNumber: "",
    hodId: "",
    tgId: "",
    facultyId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = { role, password: credentials.password };

    if (role === "student") {
      body.enrollmentNumber = credentials.enrollmentNumber;
      if (!credentials.enrollmentNumber || !credentials.password) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }
    } else if (role === "hod") {
      body.hodId = credentials.hodId;
      if (!credentials.hodId || !credentials.password) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }
    } else if (role === "tg") {
      body.tgId = credentials.tgId;
      if (!credentials.tgId || !credentials.password) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }
    } else if (role === "faculty") {
      body.facultyId = credentials.facultyId;
      if (!credentials.facultyId || !credentials.password) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await authAPI.login(body);
      setLoading(false);

      if (res.success) {
        // For student, use enrollment number in URL
        if (role === "student") {
          const enrollmentNumber = credentials.enrollmentNumber;
          navigate(`/${enrollmentNumber}`);
        } else if (role === "faculty") navigate("/faculty/dashboard");
        else if (role === "hod") navigate("/hod/dashboard");
        else if (role === "tg") navigate("/tg/dashboard");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Server error. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center relative overflow-hidden text-black">
      {/* Soft Background Glows */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-purple-300 opacity-10 blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[150px] bg-blue-300 opacity-10 blur-[100px]"></div>

      {/* Card */}
      <div className="w-[900px] bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg rounded-3xl p-10 animate-fadeInUp flex items-center gap-10 max-md:flex-col max-md:w-[90%]">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center w-1/2 max-md:w-full">
          <img
            src="/assets/logo.png"
            alt="UNIFY Logo"
            className="w-36 h-36 rounded-xl mb-3 shadow-lg"
          />
          <h1 className="text-5xl font-extrabold bg-linear-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text animate-fadeInUp">
            UNIFY
          </h1>
        </div>

        {/* Form Section */}
        <div className="w-1/2 max-md:w-full">
          <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
          <p className="text-center text-gray-700 mb-6">
            Welcome back! Please sign in to continue.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-center font-semibold bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Role Select */}
            <div>
              <label className="font-medium">Select Role</label>
              <div className="flex items-center bg-white/80 border border-white/20 p-3 rounded-2xl mt-1 shadow-md backdrop-blur-sm">
                <FiUser className="text-gray-700 text-xl mr-2" />
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setCredentials({
                      enrollmentNumber: "",
                      hodId: "",
                      tgId: "",
                      facultyId: "",
                      password: "",
                    });
                    setError("");
                  }}
                  className="w-full bg-transparent outline-none text-black"
                >
                  <option value="student">Student</option>
                  <option value="hod">HOD</option>
                  <option value="tg">Teacher Guardian</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>
            </div>

            {/* ID/Enrollment Field */}
            <div>
              <label className="font-medium">
                {role === "student"
                  ? "Enrollment Number"
                  : role === "hod"
                  ? "HOD ID"
                  : role === "tg"
                  ? "TG ID"
                  : "Faculty ID"}
              </label>
              <div className="flex items-center bg-white/80 border border-white/20 p-3 rounded-2xl mt-1 shadow-md backdrop-blur-sm">
                <FiMail className="text-gray-700 text-xl mr-2" />
                <input
                  type="text"
                  name={
                    role === "student"
                      ? "enrollmentNumber"
                      : role === "hod"
                      ? "hodId"
                      : role === "tg"
                      ? "tgId"
                      : "facultyId"
                  }
                  placeholder={`Enter ${
                    role === "student"
                      ? "enrollment number"
                      : role === "hod"
                      ? "HOD ID"
                      : role === "tg"
                      ? "TG ID"
                      : "Faculty ID"
                  }`}
                  className="w-full bg-transparent outline-none text-black"
                  value={
                    role === "student"
                      ? credentials.enrollmentNumber
                      : role === "hod"
                      ? credentials.hodId
                      : role === "tg"
                      ? credentials.tgId
                      : credentials.facultyId
                  }
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-medium">Password</label>
              <div className="flex items-center bg-white/80 border border-white/20 p-3 rounded-2xl mt-1 shadow-md backdrop-blur-sm">
                <FiLock className="text-gray-700 text-xl mr-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full bg-transparent outline-none text-black"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <p
                className="text-right text-blue-500 text-sm mt-1 cursor-pointer hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-purple-400 to-blue-400 text-white py-3 rounded-2xl mt-2 hover:scale-105 transition-all shadow-lg disabled:opacity-50 font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-700 text-sm mt-4">
            Don't have an account?
            <span
              className="text-blue-600 cursor-pointer hover:underline ml-1"
              onClick={() => navigate("/signup")}
            >
              SignUp
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
