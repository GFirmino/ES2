const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "greenherb-sprint1-secret";

function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers && req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token em falta." });
  }

  const token = authorizationHeader.slice(7);

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalido." });
  }
}

module.exports = authMiddleware;
