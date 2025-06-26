import express from "express";
import { createBook, getBooks } from "../controllers/book.controller.js";

const router = express.Router();

router.post("/", createBook); // POST /book
router.get("/:userId", getBooks); // GET /book/:userId

export default router;