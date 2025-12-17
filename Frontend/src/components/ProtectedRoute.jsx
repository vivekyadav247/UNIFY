import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Try to get profile to verify authentication
        const endpoints = [
          { path: "/student/profile", role: "student" },
          { path: "/faculty/profile", role: "faculty" },
          { path: "/hod/profile", role: "hod" },
          { path: "/tg/profile", role: "tg" },
          { path: "/admin/profile", role: "admin" },
        ];

        let authenticated = false;
        let detectedRole = null;

        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(
              `${API_BASE_URL}${endpoint.path}`,
              {
                withCredentials: true,
                timeout: 3000,
              }
            );

            if (
              response.data.success ||
              response.data.student ||
              response.data.faculty ||
              response.data.hod ||
              response.data.tg ||
              response.data.admin
            ) {
              authenticated = true;
              detectedRole = endpoint.role;
              break;
            }
          } catch (err) {
            // Continue to next endpoint
            continue;
          }
        }

        setIsAuthenticated(authenticated);
        setUserRole(detectedRole);
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
