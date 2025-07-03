import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import FormWrapper from "../components/FormWrapper.jsx";

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      login(data.user, token); // Mise à jour du contexte avec le nouveau user
      setMessage("✅ Profil mis à jour !");
      setForm({ ...form, currentPassword: "", newPassword: "" });
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <FormWrapper title="Mon Profil" onSubmit={handleSubmit}>
      <input name="username" value={form.username} onChange={handleChange} placeholder="Nom d'utilisateur" />
      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Mot de passe actuel" />
      <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="Nouveau mot de passe" />
      <button type="submit">Mettre à jour</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </FormWrapper>
  );
}
