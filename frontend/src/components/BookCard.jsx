import "../styles/bookcard.css";

export default function BookCard({ book, onClick }) {
  const status = book.status || "Inconnu";
  const statusClass = `status ${status.replace(" ", "-")}`;

  return (
<div className={`book-card ${book.source === "google" ? "book-card--external" : ""}`} onClick={() => onClick(book)}>
  <img src={book.coverImage || "/default-cover.png"} alt={book.title} className="book-cover" />
  <div className="book-info">
    <h3>{book.title}</h3>
    <p>{book.author}</p>
    <span className={`status ${book.status?.replace(" ", "-")}`}>{book.status}</span>
    {book.isFavorite && <span className="favorite">❤️</span>}
    {book.source === "google" && <span className="source-badge">🌐 Google</span>}
  </div>
</div>

  );
}
