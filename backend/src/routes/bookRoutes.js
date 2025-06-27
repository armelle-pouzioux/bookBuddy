import express from "express";
import { addBook, getBooks, getBookById, updateBook, updateProgress, addFavorite, removeFavorite,filterBooks } from "../controllers/bookController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";

const bookRouter = express.Router();

bookRouter.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: `Bienvenue utilisateur ID : ${req.user.userId}` });
});

bookRouter.post("/add", authMiddleware, addBook);
bookRouter.get("/me", authMiddleware, getBooks);
bookRouter.get("/:id", authMiddleware, getBookById);
bookRouter.put("/:id", authMiddleware, updateBook);
bookRouter.put("/:id/progress", authMiddleware, updateProgress);
bookRouter.post("/:id/favorite", authMiddleware, addFavorite);
bookRouter.delete("/:id/favorite", authMiddleware, removeFavorite);
bookRouter.get("/filter", authMiddleware, filterBooks);


export default bookRouter;