import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookRouter from "./src/routes/bookRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import rewardRouter from "./src/routes/rewardRoutes.js";

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

// Routes
app.use("/auth", authRouter);
app.use("/book", bookRouter);
app.use("/user", userRouter);
app.use("/reward", rewardRouter);

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