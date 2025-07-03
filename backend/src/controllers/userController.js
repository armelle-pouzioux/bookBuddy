import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET /user/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /user/:id
export const updateUser = async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;

  try {
    // ⚠️ Vérifier que l'utilisateur connecté correspond à l'ID demandé
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // ⚠️ Vérification du mot de passe actuel
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    // Mise à jour des champs
    if (username) user.username = username;
    if (email) user.email = email;

    if (newPassword && newPassword.length > 0) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Réponse sans le mot de passe
    res.json({
      message: "Profil mis à jour",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Erreur update user:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
