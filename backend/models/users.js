import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: String,
  name: String,
  email: String,
  avatar: String,
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
