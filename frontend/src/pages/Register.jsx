import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import FormWrapper from "../components/FormWrapper.jsx";


export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log(":", form);  //tu peux supprimer apres ANNE

    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
   
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      login(data.user, data.token);
      navigate("/");
    } else {
      alert(data.msg || "Erreur à l'inscription");
    }
  };

  return (
    <FormWrapper title="Inscription" onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Nom" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
    </FormWrapper>
  );
}
