// src/utils/rewardsChecker.js
import Reward from "../models/Reward.js";
import Book from "../models/Book.js"; // ou comme tu l'as appelé
import createReward from "../controllers/rewardsController.js"; // la fonction à extraire/exporter

export const checkAndAwardRewards = async (userId) => {
  const userBooks = await Book.find({ user: userId });

  // Exemple 1 : Premier livre ajouté
  if (userBooks.length === 1) {
    await maybeGiveReward(userId, "firstBook", "📚 Premier livre ajouté");
  }

  // Exemple 2 : 5 livres ajoutés
  if (userBooks.length === 5) {
    await maybeGiveReward(userId, "fiveBooks", "🏆 5 livres ajoutés");
  }

  // Exemple 3 : Premier favori
  const hasFavorite = userBooks.some(book => book.isFavorite); // adapte à ton schéma
  if (hasFavorite) {
    await maybeGiveReward(userId, "firstFavorite", "❤️ Premier favori");
  }

  // Exemple 4 : Premier livre terminé
  const finishedBooks = userBooks.filter(book => book.status === "terminé");
  if (finishedBooks.length === 1) {
    await maybeGiveReward(userId, "firstFinished", "✅ Premier livre terminé");
  }

};

// Fonction d'aide : vérifie et crée la récompense
const maybeGiveReward = async (userId, type, name) => {
  const alreadyHasIt = await Reward.findOne({ user: userId, type });
  if (!alreadyHasIt) {
    await Reward.create({ user: userId, type, name });
  }
};
