import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/AuthContext.jsx";
import FormWrapper from "../components/FormWrapper.jsx";
import { Trophy, Heart, CheckCircle, BookOpen, Gift } from 'lucide-react';

// Définition centralisée des types de récompenses
const REWARD_DEFINITIONS = {
  firstBook: { name: "📚 Premier livre ajouté", icon: BookOpen },
  firstFavorite: { name: "❤️ Premier favori", icon: Heart },
  firstFinished: { name: "✅ Premier livre terminé", icon: CheckCircle },
  fiveBooks: { name: "🏆 5 livres ajoutés", icon: Trophy },
};

const RewardSystem = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Simulation d'un utilisateur connecté
  const [user] = useState({ userId: 'user123', name: 'Utilisateur' });

  useEffect(() => {
    loadUserRewards();
  }, []);

  const loadUserRewards = () => {
    const savedRewards = JSON.parse(localStorage.getItem(`rewards_${user.userId}`) || '[]');
    setRewards(savedRewards);
  };

  const createReward = async (type) => {
    if (!REWARD_DEFINITIONS[type]) {
      showNotification("Type de récompense inconnu.", "error");
      return;
    }

    setLoading(true);

    try {
      const alreadyHasReward = rewards.find(reward => reward.type === type);

      if (alreadyHasReward) {
        showNotification("Récompense déjà obtenue.", "info");
        setLoading(false);
        return;
      }

      const newReward = {
        id: Date.now(),
        type,
        name: REWARD_DEFINITIONS[type].name,
        user: user.userId,
        createdAt: new Date().toISOString()
      };

      const updatedRewards = [...rewards, newReward];
      setRewards(updatedRewards);
      localStorage.setItem(`rewards_${user.userId}`, JSON.stringify(updatedRewards));

      showNotification("Récompense débloquée 🎉", "success");
    } catch (error) {
      console.error(error);
      showNotification("Erreur lors de la création de la récompense.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const clearAllRewards = () => {
    setRewards([]);
    localStorage.removeItem(`rewards_${user.userId}`);
    showNotification("Toutes les récompenses ont été effacées.", "info");
  };

  const getRewardIcon = (type) => {
    const IconComponent = REWARD_DEFINITIONS[type]?.icon || Gift;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🏆 Système de Récompenses
        </h1>
        <p className="text-gray-600 mb-6">
          Débloquez des récompenses en accomplissant différentes actions !
        </p>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
            notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
            'bg-blue-100 text-blue-800 border border-blue-300'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Actions disponibles :
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(REWARD_DEFINITIONS).map(([type, definition]) => (
              <button
                key={type}
                onClick={() => createReward(type)}
                disabled={loading || rewards.some(r => r.type === type)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  rewards.some(r => r.type === type)
                    ? 'bg-green-50 border-green-300 text-green-700 cursor-not-allowed'
                    : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getRewardIcon(type)}
                  <span className="font-medium">{definition.name}</span>
                  {rewards.some(r => r.type === type) && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Mes récompenses ({rewards.length})
            </h2>
            {rewards.length > 0 && (
              <button
                onClick={clearAllRewards}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Effacer tout
              </button>
            )}
          </div>

          {rewards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Aucune récompense débloquée pour le moment.</p>
              <p className="text-sm">Commencez par ajouter votre premier livre !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    {getRewardIcon(reward.type)}
                    <h3 className="font-semibold text-gray-800">
                      {reward.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Obtenue le {new Date(reward.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Statistiques</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {rewards.length}
              </div>
              <div className="text-sm text-gray-600">
                Récompenses obtenues
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((rewards.length / Object.keys(REWARD_DEFINITIONS).length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">
                Progression
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSystem;
