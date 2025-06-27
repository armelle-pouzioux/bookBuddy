import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  type: { type: String, required: true }, // ex: "firstBook", "fiveBooks"
  name: { type: String, required: true }, // ex: "📚 Premier livre ajouté"
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  unlockedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model("Reward", rewardSchema);
