
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/${role}/dashboard`);
  };

  return (
    <div
      className="
        min-h-screen 
        bg-white
        flex justify-center items-center 
        text-black relative overflow-hidden
      "
    >
      {/* PURPLE GLOW */}
      <div className="absolute w-72 h-72 bg-purple-400 opacity-20 blur-[100px] -top-10 left-10 -z-10"></div>
      <div className="absolute w-72 h-72 bg-blue-400 opacity-20 blur-[100px] bottom-0 right-0 -z-10"></div>

      {/* CARD */}
      <div
        className="
          w-[900px] bg-white/80 backdrop-blur-md
          border border-gray-200 shadow-xl
          rounded-2xl p-10 animate-fadeInUp
          flex items-center gap-10
        "
      >
        {/* LEFT SIDE – LOGO */}
        <div className="flex flex-col items-center justify-center w-1/2">
          <img
            src="/assets/logo.png"
            alt="UNIFY Logo"
            className="w-36 h-36 rounded-xl mb-3 shadow-md"
          />

          <h1
            className="
              text-5xl font-extrabold 
              bg-gradient-to-r from-purple-600 to-blue-600 
              text-transparent bg-clip-text
            "
          >
            UNIFY
          </h1>
        </div>

        {/* RIGHT SIDE – FORM */}
        <div className="w-1/2">
          <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
          <p className="text-center text-gray-600 mb-6">
            Welcome back! Please login to continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* EMAIL */}
            <div>
              <label className="font-medium">Email</label>
              <div className="flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1">
                <FiMail className="text-gray-700 text-xl mr-2" />
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full bg-transparent outline-none text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="font-medium">Password</label>
              <div className="flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1">
                <FiLock className="text-gray-700 text-xl mr-2" />
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full bg-transparent outline-none text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* FORGOT PASSWORD */}
              <p className="text-right text-blue-600 text-sm mt-1 cursor-pointer hover:underline">
                Forgot Password?
              </p>
            </div>

            {/* ROLE SELECT */}
            <div>
              <label className="font-medium">Select Role</label>
              <div className="flex items-center bg-gray-100 border border-gray-300 p-3 rounded-lg mt-1">
                <FiUser className="text-gray-700 text-xl mr-2" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-transparent outline-none text-black"
                >
                  <option value="hod">HOD</option>
                  <option value="tg">Teacher Guardian</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="
                bg-gradient-to-r from-purple-600 to-blue-600 
                py-3 rounded-lg mt-2 font-semibold text-white
                hover:scale-105 transition-all
                shadow-[0_0_20px_rgba(138,43,226,0.5)]
              "
            >
              Login
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="text-center text-gray-600 text-sm mt-4">
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
};

export default Login;
