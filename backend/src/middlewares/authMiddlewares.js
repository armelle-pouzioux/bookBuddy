const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Récupère le token dans les headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Tu peux utiliser req.user.userId ensuite
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = authMiddleware;
