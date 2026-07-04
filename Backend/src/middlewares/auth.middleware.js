const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("../utils/tokenBlacklist");

const AUTH_COOKIE_NAME = "auth-token";

const identifyUser = (req, res, next) => {
  try {
    // Get JWT from cookie
    const token = req.cookies[AUTH_COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = identifyUser;