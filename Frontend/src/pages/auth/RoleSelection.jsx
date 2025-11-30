import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  const selectRole = (role) => {
    navigate(`/register?role=${role}`);
  };

  const roles = [
    { name: "Student", value: "student" },
    { name: "Faculty", value: "faculty" },
    { name: "Teacher Guardian", value: "tg" },
    { name: "HOD", value: "hod" },
  ];

  return (
    <div className="min-h-screen flex justify-center items-center bg-white relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute w-72 h-72 bg-purple-400 opacity-10 blur-[100px] -top-10 left-10 -z-10"></div>
      <div className="absolute w-72 h-72 bg-blue-400 opacity-10 blur-[100px] bottom-0 right-0 -z-10"></div>

      <div className="bg-white/80 backdrop-blur-lg shadow-lg border border-gray-200 p-10 rounded-2xl w-[600px]">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">Select Your Role</h1>
        <p className="text-center text-gray-600 mb-8">
          Choose your role to continue with the registration.
        </p>

        <div className="grid grid-cols-2 gap-6 text-center">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => selectRole(role.value)}
              className="
                p-5 rounded-lg text-lg font-medium 
                bg-gray-100 text-gray-800 
                hover:bg-gray-200 
                border border-gray-300 
                shadow-sm 
                transition-colors duration-200
              "
            >
              {role.name}
            </button>
          ))}
        </div>

        <p
          className="text-center mt-6 text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
