import Book from "../models/Book.js";

// POST /books
export const createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error("Erreur création livre :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};