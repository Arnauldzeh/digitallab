const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, userName: user.userName, department: user.department },
    "your_jwt_secret_key",
    {
      expiresIn: "24h",
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, "your_jwt_secret_key");
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = { generateToken, verifyToken };
