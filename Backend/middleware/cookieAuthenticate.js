const { verifyToken } = require("../services/authentication");

function cookieAuthenticate(req, res, next) {
  try {
    // Check for token in cookies
    const cookieToken = req.cookies.token || req.cookies.authToken;

    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    let headerToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      headerToken = authHeader.slice(7);
    }

    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
      const userPayload = verifyToken(token);
      req.user = userPayload;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Authentication error" });
  }
}

// Middleware that doesn't fail if token is missing (optional auth)
function optionalAuth(req, res, next) {
  try {
    const cookieToken = req.cookies.token || req.cookies.authToken;
    const authHeader = req.headers.authorization;
    let headerToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      headerToken = authHeader.slice(7);
    }

    const token = cookieToken || headerToken;

    if (token) {
      try {
        const userPayload = verifyToken(token);
        req.user = userPayload;
      } catch (error) {
        // Token is invalid but that's okay for optional auth
      }
    }
    next();
  } catch (error) {
    next();
  }
}

// Role-based access control middleware
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Please login" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
}

module.exports = { cookieAuthenticate, optionalAuth, authorize };
