const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "development-only-change-me";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Authentication is required" });

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Your session is invalid or has expired" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ error: "You do not have permission for this action" });
    }
    next();
  };
}

module.exports = { JWT_SECRET, requireAuth, requireRole };
