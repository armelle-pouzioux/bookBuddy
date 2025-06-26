const authMiddlewares = require("../middlewares/authMiddlewares"); // assure-toi d'avoir ce fichier
const express = require("express");
const Authroutes = express.Router();
const { body, validationResult } = require("express-validator");
const { registerUser } = require("../controllers/authController");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Exemple de route POST /api/auth/register
Authroutes.post("/register", (req, res) => {
  console.log("toto");
  res.send("Register route");
});

// Exemple de route protégée
Authroutes.get("/protected", authMiddlewares, (req, res) => {
  res.json({ message: `Bienvenue utilisateur ID : ${req.user.userId}` });
});

module.exports = Authroutes;