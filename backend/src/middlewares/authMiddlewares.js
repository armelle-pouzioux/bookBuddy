// filepath: c:\Users\armel\bookBuddy\backend\src\middlewares\authMiddlewares.js
import jwt from "jsonwebtoken";

const authMiddlewares = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

export default authMiddlewares;