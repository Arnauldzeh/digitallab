const { verifyToken } = require("../services/jwt");

const authenticate = async (req, res, next) => {
  try {
    // 1. Vérifier la présence du header Authorization
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required. Please provide a valid token",
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
    console.log("Rôle de l'utilisateur :", req.user); // 👈 AJOUTE CECI
    if (
      !req.user ||
      !req.user.department ||
      !allowedRoles.includes(req.user.department)
    ) {
      return res.status(403).json({
        message: "Forbidden: You do not have the required permissions",
      });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
