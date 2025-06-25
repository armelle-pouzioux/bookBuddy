import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookRoutes from "./src/routes/book.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send("API BookBuddy connectée 📚");
});

//Routes
app.use("/books", bookRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => {
  console.log("✅ Connecté à MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error("❌ Erreur MongoDB :", error.message);
});