import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { caption, userId, username } = req.body;

    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const mediaType = req.file?.mimetype.includes("video") ? "video" : "image";

    const post = await Post.create({
      caption,
      userId,
      username,
      mediaUrl,
      mediaType
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};
