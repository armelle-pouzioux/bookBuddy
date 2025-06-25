const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { registerUser } = require("../controllers/authController");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// POST /api/auth/register
router.post(
  "/register",
  [
    // Validation rules
    body("email").isEmail().withMessage("Email invalide"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Normalement ici tu enregistrerais dans la base MongoDB (quand elle sera prête)
      // Simu d'un user enregistré :
      const user = {
        id: "123abc", // ce sera l'ID Mongo plus tard
        email,
        password: hashedPassword,
      };

      // Création du token JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        message: "Utilisateur inscrit avec succès",
        token,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Erreur serveur");
    }
  }
);

const authMiddleware = require("../middlewares/authMiddleware"); // assure-toi d'avoir ce fichier

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Bienvenue utilisateur ID : ${req.user.userId}` });
});

module.exports = router;
