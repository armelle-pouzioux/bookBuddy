// filepath: c:\Users\armel\bookBuddy\backend\src\routes\authRoutes.js
import express from "express";
import authMiddlewares from "../middlewares/authMiddlewares.js";
import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import { body } from "express-validator";

const authRouter = express.Router();

// Example route POST /api/auth/register
authRouter.post(
  "/register",
  [
    body("username", "Nom requis").notEmpty(),
    body("email", "Email invalide").isEmail(),
    body("password", "Mot de passe requis (6 caractères min)").isLength({ min: 6 }),
  ],
  registerUser
);

authRouter.post(
  "/login",
  [
    body("email", "Email invalide").isEmail(),
    body("password", "Mot de passe requis").notEmpty().withMessage("Mot de passe vide").exists().withMessage("Mot de passe manquant"),
  ],
  loginUser
);


// Example protected route
authRouter.get("/protected", authMiddlewares, (req, res) => {
  res.json({ message: `Bienvenue utilisateur ID : ${req.user.userId}` });
});

export default authRouter;