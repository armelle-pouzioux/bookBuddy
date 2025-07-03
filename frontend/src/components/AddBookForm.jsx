import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FormWrapper from "./FormWrapper";

const AddBookForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    coverImage: "",
    status: "à lire",
    pages: "",
    lastPageRead: 0,
    category: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Roman",
    "BD",
    "Livre Jeunesse & ADO",
    "Livre Cuisine",
    "Développement personnel et bien-être",
    "Art et Loisir",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pages" || name === "lastPageRead" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("❌ Vous devez être connecté pour ajouter un livre.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/book/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("📚 Livre ajouté avec succès !");
      setFormData({
        title: "",
        author: "",
        coverImage: "",
        status: "à lire",
        pages: "",
        lastPageRead: 0,
        category: "",
      });

      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.data?.message) {
        setError("❌ " + err.response.data.message);
      } else {
        setError("❌ Erreur serveur");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return <p className="login-required">🔒 Vous devez être connecté pour ajouter un livre.</p>;
  }

  return (
    <FormWrapper title="Ajouter un Livre" onSubmit={handleSubmit}>
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Titre*" required />
      <input name="author" value={formData.author} onChange={handleChange} placeholder="Auteur" />
      <input name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="Image de couverture" />

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="à lire">À lire</option>
        <option value="en cours">En cours</option>
        <option value="terminé">Terminé</option>
      </select>

      <input type="number" name="pages" value={formData.pages} onChange={handleChange} placeholder="Nombre de pages" />
      <input type="number" name="lastPageRead" value={formData.lastPageRead} onChange={handleChange} placeholder="Dernière page lue" />

      <select name="category" value={formData.category} onChange={handleChange} required>
        <option value="">-- Catégorie --</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Ajout en cours..." : "Ajouter le livre"}
      </button>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </FormWrapper>
  );
};

export default AddBookForm;
