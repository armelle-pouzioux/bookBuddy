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
    "Roman",
    "BD",
    "Livre Jeunesse & ADO",
    "Livre Cuisine",
    "Développement personnel et bien-être",
    "Art et Loisir"
  ]
},
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model("Book", bookSchema);