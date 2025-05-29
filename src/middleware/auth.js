const { verifyToken } = require("../services/jwt");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied: No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res
      .status(401)
      .json({
        message: "Invalid authentication token format. Use 'Bearer <token>'",
      });
  }

  const token = parts[1];

  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed: Invalid or expired token",
    });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: "Forbidden: You do not have the required permissions",
        });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
