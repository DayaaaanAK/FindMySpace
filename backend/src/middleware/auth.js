const authenticateUserRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== requiredRole) {
      console.log("Role not authorized");
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

module.exports = { authenticateUserRole };
