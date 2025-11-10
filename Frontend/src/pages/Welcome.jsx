import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Button click hone par login page pe le jaayega
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #a2c2e6, #dbeafe)",
        color: "#1e3a8a",
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
      }}
    >
      {/* Heading */}
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "10px" }}>
        UNIFY
      </h1>

      {/* Subtext */}
      <p style={{ fontSize: "1.2rem", marginBottom: "40px", color: "#1e40af" }}>
        Mini ERP System for College Management
      </p>

      {/* Developer Info Card */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px 40px",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginBottom: "10px", color: "#1d4ed8" }}>Developed By</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#333" }}>
          <li>👩‍💻 Sakshi Chouhan</li>
          <li>👨‍💻 [Your Teammate 2]</li>
          <li>👨‍💻 [Your Teammate 3]</li>
        </ul>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        style={{
          backgroundColor: "#1d4ed8",
          color: "white",
          border: "none",
          padding: "12px 30px",
          borderRadius: "30px",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
      >
        Continue to Unify →
      </button>

      {/* Footer */}
      <footer style={{ marginTop: "40px", fontSize: "0.9rem", color: "#334155" }}>
        © {new Date().getFullYear()} UNIFY | Minor Project
      </footer>
    </div>
  );
};

export default Welcome;
