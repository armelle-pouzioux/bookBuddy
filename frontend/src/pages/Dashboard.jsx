import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AddBookForm from "../components/AddBookForm";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";

const CATEGORIES = [
  "fantasy", "romance", "science fiction", "horror", "history",
  "mystery", "biography", "children", "philosophy"
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddBookForm, setShowAddBookForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// livres locaux
  const fetchLocalBooks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/book/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors du chargement des livres");

      return data.map(book => ({ ...book, source: "local" }));
    } catch (err) {
      throw err;
    }
  }, []);

  // 🌍 2. Récupération des livres externes (Google Books)
  const fetchGoogleBooks = async (category) => {
    if (!category) return [];

    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=20`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur lors du chargement des livres Google");

      return data.items?.map(item => ({
        _id: `google-${item.id}`,
        title: item.volumeInfo.title || "Titre inconnu",
        author: item.volumeInfo.authors?.[0] || "Auteur inconnu",
        category,
        status: "à lire",
        coverImage: item.volumeInfo.imageLinks?.thumbnail || "/default-cover.png",
        isFavorite: false,
        createdAt: item.volumeInfo.publishedDate || new Date().toISOString(),
        source: "google"
      })) || [];

    } catch (err) {
      throw err;
    }
  };


  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [localBooks, googleBooks] = await Promise.all([
        fetchLocalBooks(),
        fetchGoogleBooks(selectedCategory)
      ]);

      const combined = [...localBooks, ...googleBooks];
      setBooks(combined);

      // Catégories uniques
      const dynamicCategories = [...new Set(localBooks.map(b => b.category).filter(Boolean))];
      setCategories([...new Set([...CATEGORIES, ...dynamicCategories])]);

    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchLocalBooks, selectedCategory]);


  useEffect(() => {
    let result = [...books];

    if (statusFilter !== "all") result = result.filter(b => b.status === statusFilter);
    if (categoryFilter !== "all") result = result.filter(b => b.category === categoryFilter);
    if (search.trim()) result = result.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

    result.sort((a, b) => {
      if (sortOrder === "alpha") return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredBooks(result);
  }, [books, search, statusFilter, categoryFilter, sortOrder]);


  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  return (
    <div className="dashboard dashboard--small">
      <h2 className="welcome">Bienvenue, {user?.username}</h2>

      <div className="search-bar">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="recent"> Récent</option>
          <option value="alpha"> Alphabétique</option>
        </select>
      </div>

      <div className="category-filter">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="à lire">À lire</option>
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">Ma bibliothèque</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value=""> 🌍 Explorer des livres Google</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && <p> Chargement...</p>}
      {error && <p className="error">{error}</p>}
      <div className="books-grid books-grid--small">
        {filteredBooks.map((book) => (
          <BookCard key={book._id} book={book} onClick={setSelectedBook} small />
        ))}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onUpdate={loadBooks}
        />
      )}

      {showAddBookForm && (
        <AddBookForm onClose={() => {
          setShowAddBookForm(false);
          loadBooks();
        }} />
      )}

      <footer className="footer">
        <button className="footer__button">
          <span className="footer__label">🏆 Rewards</span>
        </button>
        <button
          className={`footer__button ${showAddBookForm && 'footer__button--active'}`}
          onClick={() => setShowAddBookForm(prev => !prev)}
        >
          <span className="footer__label">➕ Ajouter</span>
        </button>
        <button
          className="footer__button"
          onClick={() => navigate("/favorites")}
        >
          <span className="footer__label">❤️ Favoris</span>
        </button>
      </footer>
    </div>
  );
}
