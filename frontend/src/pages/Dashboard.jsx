import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortOrder, setSortOrder] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setBooks(data);

          const uniqueCategories = [...new Set(data.map((book) => book.category))].filter(Boolean);
          setCategories(uniqueCategories);
        } else {
          setError(data.message || "Erreur lors du chargement");
        }
      } catch (err) {
        setError("Erreur réseau : " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let result = [...books];

    if (statusFilter !== "all") {
      result = result.filter((book) => book.status === statusFilter);
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
  }, [books, search, statusFilter, sortOrder]);

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
        {/* Catégories dynamiques */}
        <select>
          <option>Toutes catégories</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && <p>⏳ Chargement des livres...</p>}
      {error && <p className="error">❌ {error}</p>}

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
        <button>➕</button>
        <button>❤️</button>
      </footer>
    </div>
  );
}