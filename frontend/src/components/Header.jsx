import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ background: "#7b2cbf", padding: "1rem", color: "white" }}>
      <nav>
        <Link to="/" style={{ marginRight: "1rem", color: "white" }}>Accueil</Link>
        <Link to="/login" style={{ marginRight: "1rem", color: "white" }}>Connexion</Link>
        <Link to="/register" style={{ color: "white" }}>Inscription</Link>
      </nav>
    </header>
  );
}
