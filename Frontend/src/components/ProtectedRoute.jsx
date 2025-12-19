import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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
        const pathRole = extractRoleFromPath(location.pathname);

        if (pathRole) {
          try {
            // Get token from localStorage as backup
            const token = localStorage.getItem("token");

            // Try to verify with specific role endpoint based on URL path
            const url = `${API_BASE_URL}/${pathRole}/profile`;

            const response = await fetch(url, {
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            });

            if (response.ok) {
              const data = await response.json();

              if (
                data &&
                (data.hod ||
                  data.student ||
                  data.faculty ||
                  data.tg ||
                  data.admin)
              ) {
                setIsAuthenticated(true);
                setUserRole(pathRole);
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            // Auth verification failed
          }
        }

        setIsAuthenticated(false);
        setUserRole(null);
      } catch (error) {
        console.error("❌ Auth error:", error);
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
    if (pathname.startsWith("/student")) return "student";
    // Check for enrollment number pattern (e.g., /0901CS221080)
    if (/^\/[0-9]{4}[A-Z]{2}[0-9]+/.test(pathname)) return "student";
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
