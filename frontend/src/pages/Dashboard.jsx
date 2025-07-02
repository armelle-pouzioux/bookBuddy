import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AddBookForm from "../components/AddBookForm";  

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddBookForm, setShowAddBookForm] = useState(false);

  // 🔁 Charger les livres et les catégories statiques
  useEffect(() => {
    const fetchBooksAndCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        // Requête pour les livres de l'utilisateur
        const bookRes = await fetch("http://localhost:5000/book/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const bookData = await bookRes.json();

        if (!bookRes.ok) {
          throw new Error(bookData.message || "Erreur lors du chargement des livres");
        }

        setBooks(bookData);

        // Récupération des catégories issues des livres de l'utilisateur
        const dynamicCategories = [...new Set(bookData.map((book) => book.category))].filter(Boolean);

        // Requête pour les catégories disponibles
        const catRes = await fetch("http://localhost:5000/book/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const catData = await catRes.json();

        if (!catRes.ok) {
          throw new Error("Erreur lors de la récupération des catégories");
        }

        // Fusionner sans doublons
        const mergedCategories = [...new Set([...catData, ...dynamicCategories])];
        setCategories(mergedCategories);

      } catch (err) {
        setError("❌ " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndCategories();
  }, []);

  // 🔍 Filtres
  useEffect(() => {
    let result = [...books];

    if (statusFilter !== "all") {
      result = result.filter((book) => book.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((book) => book.category === categoryFilter);
    }

    if (search.trim() !== "") {
      result = result.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOrder === "alpha") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "recent") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredBooks(result);
  }, [books, search, statusFilter, categoryFilter, sortOrder]);

  return (
    <div className="dashboard">
      <h2 className="welcome">Bienvenue, {user?.username}</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="recent">📅 Récent</option>
          <option value="alpha">🔤 Alphabétique</option>
        </select>
      </div>

      <div className="category-filter">
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="all">Tous les statuts</option>
          <option value="à lire">À lire</option>
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>

        <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
          <option value="all">Toutes catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && <p>⏳ Chargement des livres...</p>}
      {error && <p className="error">{error}</p>}

      <div className="books-grid">
        {filteredBooks.length === 0 && !loading ? (
          <p>Aucun livre trouvé</p>
        ) : (
          filteredBooks.map((book) => (
            <div className="book-card" key={book._id}>
              <p><strong>{book.title}</strong></p>
              <p>{book.author}</p>
              <p className="status">{book.status}</p>
            </div>
          ))
        )}
      </div>

      <footer className="dashboard-footer">
        <button>🏠</button>
        <button onClick={() => setShowAddBookForm((prev) => !prev)}>➕</button>
        <button>❤️</button>
      </footer>
      {showAddBookForm && <AddBookForm />}
    </div>
  );
}
