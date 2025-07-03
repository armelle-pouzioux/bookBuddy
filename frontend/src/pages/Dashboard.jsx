import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import AddBookForm from "../components/AddBookForm";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // ✅ Fonction extraite (et mémorisée avec useCallback)
  const fetchBooksAndCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const bookRes = await fetch("http://localhost:5000/book/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookData = await bookRes.json();
      if (!bookRes.ok) throw new Error(bookData.message || "Erreur lors du chargement des livres");
      setBooks(bookData);

      const dynamicCategories = [...new Set(bookData.map((b) => b.category))].filter(Boolean);

      const catRes = await fetch("http://localhost:5000/book/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const catData = await catRes.json();
      if (!catRes.ok) throw new Error("Erreur lors de la récupération des catégories");

      const merged = [...new Set([...catData, ...dynamicCategories])];
      setCategories(merged);
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔁 Chargement initial
  useEffect(() => {
    fetchBooksAndCategories();
  }, [fetchBooksAndCategories]);

  // 🔍 Filtres
  useEffect(() => {
    let result = [...books];

    if (statusFilter !== "all") result = result.filter((b) => b.status === statusFilter);
    if (categoryFilter !== "all") result = result.filter((b) => b.category === categoryFilter);
    if (search.trim()) result = result.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

    result.sort((a, b) => {
      if (sortOrder === "alpha") return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredBooks(result);
  }, [books, search, statusFilter, categoryFilter, sortOrder]);

  return (
      <div className="dashboard">
        <h2 className="welcome">Bienvenue, {user?.username}</h2>

        {/* 🔍 Barre de recherche et tri */}
        <div className="search-bar">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="recent">📅 Récent</option>
            <option value="alpha">🔤 Alphabétique</option>
          </select>
        </div>

        {/* 📂 Filtres */}
        <div className="category-filter">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="à lire">À lire</option>
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* 📚 Livres */}
        {loading && <p>⏳ Chargement...</p>}
        {error && <p className="error">{error}</p>}

        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} onClick={setSelectedBook} />
          ))}
        </div>

        {/* 📖 Modale */}
        {selectedBook && (
          <BookModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onUpdate={fetchBooksAndCategories}
          />
        )}

      <footer className="footer">
        <button className="footer__button">
          <svg className="footer__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
            <path d="M292-120v-66.67h154.67v-140q-52.34-11-93.17-44.83T296-456q-74.33-8.33-125.17-61.83Q120-571.33 120-645.33V-688q0-27.67 19.5-47.17t47.17-19.5h96V-840h394.66v85.33h96q27.67 0 47.17 19.5T840-688v42.67q0 74-50.83 127.5Q738.33-464.33 664-456q-16.67 50.67-57.5 84.5t-93.17 44.83v140H668V-120H292Zm-9.33-406.67V-688h-96v42.67q0 42.66 27 75.16t69 43.5ZM480-390q54.67 0 92.67-38.33 38-38.34 38-93v-252H349.33v252q0 54.66 38 93Q425.33-390 480-390Zm197.33-136.67q42-11 69-43.5t27-75.16V-688h-96v161.33ZM480-582Z"/>
          </svg>
          <span className="footer__label">Rewards</span>
        </button>
        <button
          className={`footer__button ${showAddBookForm && 'footer__button--active'}`}
          onClick={() => setShowAddBookForm((prev) => !prev)}
          aria-expanded={showAddBookForm}
          aria-label={showAddBookForm ? "Fermer le formulaire" : "Ouvrir le formulaire d'ajout"}
        >
          <svg className="footer__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
            <path d="M448.67-280h66.66v-164H680v-66.67H515.33V-680h-66.66v169.33H280V-444h168.67v164Zm31.51 200q-82.83 0-155.67-31.5-72.84-31.5-127.18-85.83Q143-251.67 111.5-324.56T80-480.33q0-82.88 31.5-155.78Q143-709 197.33-763q54.34-54 127.23-85.5T480.33-880q82.88 0 155.78 31.5Q709-817 763-763t85.5 127Q880-563 880-480.18q0 82.83-31.5 155.67Q817-251.67 763-197.46q-54 54.21-127 85.84Q563-80 480.18-80Zm.15-66.67q139 0 236-97.33t97-236.33q0-139-96.87-236-96.88-97-236.46-97-138.67 0-236 96.87-97.33 96.88-97.33 236.46 0 138.67 97.33 236 97.33 97.33 236.33 97.33ZM480-480Z"/>
          </svg>
          <span className="footer__label">Ajouter</span>
        </button>
        <button className="footer__button" aria-label="Favoris">
          <svg className="footer__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
            <path d="m480-120.67-46.67-42q-104.18-95.08-172.25-164.04Q193-395.67 152.67-450.17q-40.34-54.5-56.5-99.16Q80-594 80-640q0-91.44 61.33-152.72 61.34-61.28 152-61.28 55.34 0 103.34 25.33 48 25.34 83.33 72.67 39.33-49.33 86.33-73.67 47-24.33 100.34-24.33 90.66 0 152 61.28Q880-731.44 880-640q0 46-16.17 90.67-16.16 44.66-56.5 99.16-40.33 54.5-108.41 123.46-68.07 68.96-172.25 164.04l-46.67 42Zm0-88.66q99.49-90.67 163.75-155.5Q708-429.67 745.67-478.17q37.66-48.5 52.66-86.42t15-75.31q0-64.1-41.33-105.77-41.33-41.66-105.18-41.66-50.02 0-92.59 29.83-42.56 29.83-65.56 81.5h-58q-22.34-51-64.9-81.17-42.57-30.16-92.59-30.16-63.85 0-105.18 41.66-41.33 41.67-41.33 105.88 0 37.46 15 75.62 15 38.17 52.66 87Q252-428.33 316.67-363.83q64.66 64.5 163.33 154.5Zm0-289Z"/>
          </svg>
          <span className="footer__label">Favoris</span>
        </button>
      </footer>
      {/* 📘 Formulaire d'ajout */}
      {showAddBookForm && <AddBookForm onClose={() => {
        setShowAddBookForm(false);
        fetchBooksAndCategories();
      }} />}
    </div>
  );
}


