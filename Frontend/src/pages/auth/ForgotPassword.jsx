import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { authAPI } from "../../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email & Enrollment, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Handle Email Submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !enrollmentNumber) {
      setError("Please enter email and enrollment number");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.sendForgotPasswordOtp(
        email,
        enrollmentNumber
      );
      if (response.message) {
        setSuccess("OTP sent to your email");
        setStep(2);
        setCanResendOtp(false);
        setResendTimer(60);
        startResendTimer();
      }
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter OTP");
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      setLoading(false);
      return;
    }

    // Move to next step - password reset will verify the OTP
    setSuccess("OTP received. Now enter your new password");
    setStep(3);
    setLoading(false);
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword(email, otp, newPassword);
      if (response.message) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.resendOtp(email);
      if (response.message) {
        setSuccess("OTP resent to your email");
        setCanResendOtp(false);
        setResendTimer(60);
        startResendTimer();
      }
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Timer for resend OTP
  const startResendTimer = () => {
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResendOtp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center relative overflow-hidden text-black">
      {/* Soft Background Glows */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-purple-300 opacity-10 blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[150px] bg-blue-300 opacity-10 blur-[100px]"></div>

      {/* Card */}
      <div className="w-[500px] bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg rounded-3xl p-10 animate-fadeInUp max-md:w-[90%]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/signin")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Forgot Password?</h1>
            <p className="text-sm text-gray-600">
              Reset your password in 3 steps
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          <div
            className={`h-1 flex-1 rounded-full ${
              step >= 1 ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-1 flex-1 rounded-full ${
              step >= 2 ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`h-1 flex-1 rounded-full ${
              step >= 3 ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg text-center font-semibold bg-red-100 text-red-700 animate-pulse">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 rounded-lg text-center font-semibold bg-green-100 text-green-700">
            {success}
          </div>
        )}

        {/* STEP 1: Email & Enrollment */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-medium">Enrollment Number</label>
              <div className="flex items-center bg-white/80 border border-white/20 p-3 rounded-2xl mt-1 shadow-md backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="0805CS001"
                  className="w-full bg-transparent outline-none text-black"
                  value={enrollmentNumber}
                  onChange={(e) => {
                    setEnrollmentNumber(e.target.value.toUpperCase());
                    setError("");
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-medium">Enter Your Email</label>
              <div className="flex items-center bg-white/80 border border-white/20 p-3 rounded-2xl mt-1 shadow-md backdrop-blur-sm">
                <FiMail className="text-gray-700 text-xl mr-2" />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full bg-transparent outline-none text-black"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Enter the email associated with your student account
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-purple-400 to-blue-400 text-white py-3 rounded-2xl mt-4 hover:scale-105 transition-all shadow-lg disabled:opacity-50 font-semibold"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-medium">Enter OTP</label>
              <p className="text-xs text-gray-600 mb-2">
                Check your email for the 6-digit OTP (Valid for 5 minutes)
              </p>
              <div className="flex items-center bg-white/80 border border-white/20 p-3 rounded-2xl shadow-md backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  className="w-full bg-transparent outline-none text-black text-center text-2xl tracking-widest font-bold"
                  value={otp}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setOtp(e.target.value);
                      setError("");
                    }
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-purple-400 to-blue-400 text-white py-3 rounded-2xl mt-2 hover:scale-105 transition-all shadow-lg disabled:opacity-50 font-semibold"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center">
              {canResendOtp ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-600 text-sm">
                  Resend OTP in{" "}
                  <span className="font-bold text-blue-600">
                    {resendTimer}s
                  </span>
                </p>
              )}
            </div>
          </form>
        )}

        {/* STEP 3: New Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
            <div>
              <label className="font-medium">New Password</label>
              <div className="flex items-center bg-white/80 border border-white/20 p-3 rounded-2xl mt-1 shadow-md backdrop-blur-sm">
                <FiLock className="text-gray-700 text-xl mr-2" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-transparent outline-none text-black"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-medium">Confirm Password</label>
              <div className="flex items-center bg-white/80 border border-white/20 p-3 rounded-2xl mt-1 shadow-md backdrop-blur-sm">
                <FiLock className="text-gray-700 text-xl mr-2" />
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full bg-transparent outline-none text-black"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-purple-400 to-blue-400 text-white py-3 rounded-2xl mt-4 hover:scale-105 transition-all shadow-lg disabled:opacity-50 font-semibold"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-gray-700 text-sm mt-6">
          Remember your password?
          <span
            className="text-blue-600 cursor-pointer hover:underline ml-1 font-medium"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
