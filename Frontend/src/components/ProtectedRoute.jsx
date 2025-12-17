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
        // Extract role from current route path
        const pathRole = extractRoleFromPath(location.pathname);

        if (pathRole) {
          try {
            // Try to verify with specific role endpoint based on URL path
            const response = await axios.get(
              `${API_BASE_URL}/${pathRole}/profile`,
              {
                withCredentials: true,
                timeout: 3000,
              }
            );

            // Check if successful response (role data exists)
            if (response.data.success || response.data[pathRole]) {
              setIsAuthenticated(true);
              setUserRole(pathRole);
              setLoading(false);
              return;
            }
          } catch (err) {
            // If path-based check fails, user is not authenticated for this role
            setIsAuthenticated(false);
            setUserRole(null);
            setLoading(false);
            return;
          }
        }

        // Fallback for public routes (no role in path)
        // Try all endpoints in order
        const endpoints = [
          { path: "/tg/profile", role: "tg" },
          { path: "/hod/profile", role: "hod" },
          { path: "/faculty/profile", role: "faculty" },
          { path: "/student/profile", role: "student" },
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
                timeout: 2000,
              }
            );

            if (response.status === 200 && response.data.success) {
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

  // Extract role from current path
  function extractRoleFromPath(pathname) {
    if (pathname.startsWith("/tg")) return "tg";
    if (pathname.startsWith("/hod")) return "hod";
    if (pathname.startsWith("/faculty")) return "faculty";
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.match(/^\/[A-Z0-9]+/)) return "student"; // enrollment number pattern
    return null;
  }

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
