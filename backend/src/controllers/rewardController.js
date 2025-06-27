import Reward from "../models/Reward.js";

// Définition centralisée des types de récompenses
const REWARD_DEFINITIONS = {
  firstBook: "📚 Premier livre ajouté",
  firstFavorite: "❤️ Premier favori",
  firstFinished: "✅ Premier livre terminé",
  fiveBooks: "🏆 5 livres ajoutés",
};

export const createReward = async (req, res) => {
  const userId = req.user.userId;
  const { type } = req.params;

  if (!REWARD_DEFINITIONS[type]) {
    return res.status(400).json({ message: "Type de récompense inconnu." });
  }

  try {
    const alreadyHasReward = await Reward.findOne({ user: userId, type });

    if (alreadyHasReward) {
      return res.status(200).json({ message: "Récompense déjà obtenue." });
    }

    const reward = new Reward({
      type,
      name: REWARD_DEFINITIONS[type],
      user: userId
    });

    await reward.save();

    res.status(201).json({ message: "Récompense débloquée 🎉", reward });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la création de la récompense." });
  }
};

// GET /rewards (récompenses de l'utilisateur connecté)
export const getUserRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ userId: req.user.userId });
    res.status(200).json(rewards);
  } catch (err) {
    console.error("Erreur récupération des récompenses :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
