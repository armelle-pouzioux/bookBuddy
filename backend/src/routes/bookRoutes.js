// filepath: c:\Users\armel\bookBuddy\backend\src\routes\bookRoutes.js
import express from "express";
import { addBook, getBooks } from "../controllers/bookController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";

const bookRouter = express.Router();

bookRouter.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Bienvenue utilisateur ID : ${req.user.userId}` });
});

bookRouter.post("/add", authMiddleware, addBook);
bookRouter.get("/me", authMiddleware, getBooks);

export default bookRouter;