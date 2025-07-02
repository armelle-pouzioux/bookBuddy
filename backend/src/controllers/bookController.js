import Book from "../models/Book.js";
import { checkAndAwardRewards } from "../utils/rewardsChecker.js";

// POST /book
export const addBook = async (req, res) => {
  try {
    const userId = req.user.userId;
    const newBook = new Book({ ...req.body, userId });
    const savedBook = await newBook.save();

    await checkAndAwardRewards(userId);

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

// GET /book/:id
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /book/:id
export const updateBook = async (req, res) => {
  try {
    const updated = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Livre non trouvé" });

    await checkAndAwardRewards(req.user.userId);

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /book/:id/progress
export const updateProgress = async (req, res) => {
  try {
    const { lastPageRead } = req.body;
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!book) return res.status(404).json({ message: "Livre non trouvé" });

    book.lastPageRead = lastPageRead;
    await book.save();

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /book/:id/favorite
export const addFavorite = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });

    book.isFavorite = true;
    await book.save();

    await checkAndAwardRewards(req.user.userId);
    
    res.status(200).json({ message: "Ajouté aux favoris" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE /book/:id/favorite
export const removeFavorite = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });

    book.isFavorite = false;
    await book.save();
    res.status(200).json({ message: "Retiré des favoris" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /book/filter
export const filterBooks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, author, category, status, isFavorite, sort } = req.query;

    const filter = { userId };

    // Recherche floue par mots clés
    if (title) {
      const words = title.split(" ").map(w => `(?=.*${w})`).join("");
      filter.title = { $regex: new RegExp(words, "i") };
    }

    if (author) {
      const words = author.split(" ").map(w => `(?=.*${w})`).join("");
      filter.author = { $regex: new RegExp(words, "i") };
    }

    if (category) {
      filter.category = Array.isArray(category)
        ? { $in: category }
        : category;
    }

    if (status) {
      filter.status = Array.isArray(status)
        ? { $in: status }
        : status;
    }

    if (typeof isFavorite !== "undefined") {
      filter.isFavorite = isFavorite === "true";
    }

    const books = await Book.find(filter).sort(sort || "-createdAt");

    res.status(200).json(books);
  } catch (error) {
    console.error("Erreur filtre livres :", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




