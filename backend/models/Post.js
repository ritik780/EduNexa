import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String, default: "" },

  caption: { type: String, trim: true },

  mediaUrl: { type: String, required: true },

  mediaType: {
    type: String,
    enum: ["image", "video", "pdf"],
    required: true
  },

  likes: { type: Number, default: 0 },

  likedBy: {
    type: [String],
    default: []
  },

  comments: [
    {
      userId: String,
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Post", postSchema);
