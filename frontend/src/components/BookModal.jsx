import { useState } from "react";
import "../styles/bookmodal.css";

export default function BookModal({ book, onClose, onUpdate }) {
  const [status, setStatus] = useState(book.status);
  const [lastPageRead, setLastPageRead] = useState(book.lastPageRead);
  const [isFavorite, setIsFavorite] = useState(book.isFavorite);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      // Update statut
      await fetch(`http://localhost:5000/book/${book._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      // Update page lue
      if (status === "en cours") {
        await fetch(`http://localhost:5000/book/${book._id}/progress`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ lastPageRead })
        });
      }

      // Favori
      await fetch(`http://localhost:5000/book/${book._id}/favorite`, {
        method: isFavorite ? "POST" : "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      onUpdate(); // Rafraîchir la liste
      onClose();  // Fermer la modale
    } catch (err) {
      alert("Erreur lors de la mise à jour");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close" onClick={onClose}>✖</button>
        <h2>{book.title}</h2>
        <p><strong>Auteur :</strong> {book.author}</p>
        <p><strong>Pages :</strong> {book.pages}</p>

        <label>Statut :
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="à lire">À lire</option>
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
        </label>

        {status === "en cours" && (
          <label>Dernière page lue :
            <input
              type="number"
              value={lastPageRead}
              onChange={(e) => setLastPageRead(Number(e.target.value))}
              min="0"
              max={book.pages}
            />
          </label>
        )}

        <label>
          <input
            type="checkbox"
            checked={isFavorite}
            onChange={() => setIsFavorite(!isFavorite)}
          />
          ❤️ Ajouter aux favoris
        </label>

        <button onClick={handleSave}>💾 Enregistrer</button>
      </div>
    </div>
  );
}
