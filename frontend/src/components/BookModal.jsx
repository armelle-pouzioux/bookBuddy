import { useState } from "react";
import "../styles/bookmodal.css";

export default function BookModal({ book, onClose, onUpdate }) {
  const [status, setStatus] = useState(book.status || "à lire");
  const [lastPageRead, setLastPageRead] = useState(book.lastPageRead || 0);
  const [isFavorite, setIsFavorite] = useState(book.isFavorite || false);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      let localBookId = book._id;

      // livre externer sera sauvegardé dans la base de données locale
      if (book.source === "google") {
        const saveRes = await fetch("http://localhost:5000/book/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: book.title,
            author: book.author,
            pages: book.pages,
            category: book.category,
            coverImage: book.coverImage,
            status,
            lastPageRead,
            isFavorite
          })
        });

        if (!saveRes.ok) {
          alert("Erreur lors de la sauvegarde du livre Google");
          return;
        }

        const saved = await saveRes.json();
        localBookId = saved._id;
      } else {
        // Mise à jour du statut
        await fetch(`http://localhost:5000/book/${localBookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });

        // Mise à jour des pages lues
        if (status === "en cours") {
          await fetch(`http://localhost:5000/book/${localBookId}/progress`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ lastPageRead })
          });
        }

        // Mise à jour des favoris
        await fetch(`http://localhost:5000/book/${localBookId}/favorite`, {
          method: isFavorite ? "PUT" : "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      onUpdate();  // Rafraîchir
      onClose();   // Fermer la modale
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
        <p><strong>Pages :</strong> {book.pages || "?"}</p>

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
              max={book.pages || 9999}
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

        <button onClick={handleSave}> Enregistrer</button>
      </div>
    </div>
  );
}
