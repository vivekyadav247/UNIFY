import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    // Redirect role-wise
    navigate(`/${role}/dashboard`);
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
          <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
          <p className="text-center text-gray-700 mb-6">
            Welcome back! Please login to continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="font-medium">Email</label>
              <div className="flex items-center bg-white/80 border border-white/20 p-3 rounded-2xl mt-1 shadow-md backdrop-blur-sm">
                <FiMail className="text-gray-700 text-xl mr-2" />
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full bg-transparent outline-none text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Enter password"
                  className="w-full bg-transparent outline-none text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="text-right text-blue-500 text-sm mt-1 cursor-pointer hover:underline">
                Forgot Password?
              </p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="bg-linear-to-r from-purple-400 to-blue-400 text-white py-3 rounded-2xl mt-2 hover:scale-105 transition-all shadow-lg"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-700 text-sm mt-4">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
