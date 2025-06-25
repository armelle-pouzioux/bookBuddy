import express from "express";
import { createBook } from "../controllers/book.controller.js";

const router = express.Router();

router.post("/", createBook); // POST /books

export default router;