// middleware/authorize.js
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: "Role not found" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "You do not have permission to access this resource" });
    }

    next();
  };
};
