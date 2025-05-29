const { verifyToken } = require("../services/jwt");

const authenticate = async (req, res, next) => {
  try {
    // 1. Vérifier la présence du header Authorization
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required. Please provide a valid Bearer token",
      });
    }

    // 2. Extraire le token
    const token = authHeader.split(" ")[1];

    // 3. Vérifier et décoder le token
    const decoded = await verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      message: error.message || "Authentication failed",
    });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have the required permissions",
      });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
