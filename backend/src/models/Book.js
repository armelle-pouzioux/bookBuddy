import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true },
  author: String,
  coverImage: String,
  status: {
    type: String,
    enum: ["à lire", "en cours", "terminé"],
    default: "à lire"
  },
  pages: Number,
  lastPageRead: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: [
       'fantasy',
  'romance',
  'science fiction',
  'horror',
  'history',
  'mystery',
  'biography',
  'children',
  'philosophy',
    ]
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: "book"
});

export default mongoose.model("Book", bookSchema);