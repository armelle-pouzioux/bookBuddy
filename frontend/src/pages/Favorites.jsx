import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/book/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allBooks = await res.json();
      const favoriteBooks = allBooks.filter(b => b.isFavorite);
      setBooks(favoriteBooks);
    } catch (err) {
      console.error("Erreur chargement favoris :", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>❤️ Mes livres favoris</h2>

      {books.length === 0 ? (
        <p>Tu n’as pas encore de favoris.</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onClick={setSelectedBook} />
          ))}
        </div>
      )}

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={fetchFavorites}
        />
      )}
    </div>
  );
}
