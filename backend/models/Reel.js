import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
  userId: String,
  username: String,
  caption: String,
  videoUrl: String,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Reel", reelSchema);
