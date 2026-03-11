import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center px-6">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700 mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <FiArrowLeft />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-8 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <FiHome />
            Home Page
          </button>
        </div>

        {/* Footer Message */}
        <p className="text-gray-500 dark:text-gray-400 mt-12">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
