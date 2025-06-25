const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Exemple de route protégée
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Bienvenue utilisateur ID : ${req.user.userId}` });
});

router.get("/me", authMiddleware, getUserBooks);
router.post("/add", authMiddleware, addBook);

module.exports = router;