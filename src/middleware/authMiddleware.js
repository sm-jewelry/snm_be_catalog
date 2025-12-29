import axios from "axios";

const CUSTOMER_SERVICE_URL =
  process.env.CUSTOMER_SERVICE_URL || "http://localhost:4001";

/**
 * Verify token with customer service and attach user to request
 */
export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized. No token provided",
      });
    }

    // Verify token with customer service
    const response = await axios.post(
      `${CUSTOMER_SERVICE_URL}/api/auth/verify-token`,
      {},
      {
        headers: { Authorization: authHeader },
        timeout: 5000, // 5 second timeout
      }
    );

    if (response.data.success && response.data.data.valid) {
      // Attach user info to request
      req.user = response.data.data.user;
      next();
    } else {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Customer service returned an error
      return res.status(error.response.status).json({
        message: error.response.data.message || "Authentication failed",
      });
    } else if (error.code === "ECONNREFUSED") {
      // Customer service is down
      console.error("Customer service is unavailable");
      return res.status(503).json({
        message: "Authentication service unavailable",
      });
    } else {
      // Other errors
      console.error("Authentication error:", error.message);
      return res.status(500).json({
        message: "Internal authentication error",
      });
    }
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: "Role not found" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};
