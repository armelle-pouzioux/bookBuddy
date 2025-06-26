// filepath: c:\Users\armel\bookBuddy\backend\src\controllers\bookController.js
import Book from "../models/Book.js";

// POST /book
export const addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error("Erreur création livre :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /book
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.userId });
    res.status(200).json(books);
  } catch (error) {
    console.error("Erreur récupération livres :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};