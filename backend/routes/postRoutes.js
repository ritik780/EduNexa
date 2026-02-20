import express from "express";
import multer from "multer";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import fs from "fs";
import Post from "../models/Post.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// On Render the project dir is read-only; use /tmp so uploads work
const uploadsDir = process.env.RENDER
  ? path.join(os.tmpdir(), "edunexa-uploads")
  : path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const router = express.Router();

// STORAGE CONFIG – absolute path so uploads work from any cwd
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = (file.originalname || "file").replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, Date.now() + "-" + safeName);
  }
});

const upload = multer({ storage });


// ============================
// CREATE POST
// ============================
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    let mediaType = "image";

    if (file.mimetype.startsWith("video")) mediaType = "video";
    else if (file.mimetype === "application/pdf") mediaType = "pdf";

    const post = new Post({
      userId: req.body.userId || "guest",
      username: req.body.username || "Anonymous",
      avatar: req.body.avatar || "",
      caption: req.body.caption || "",
      mediaUrl: "uploads/" + file.filename,
      mediaType
    });

    await post.save();

    res.json(post);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});


// ============================
// GET FEED POSTS (IMAGES + PDFs)
// ============================
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({
      mediaType: { $in: ["image", "pdf"] }
    }).sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ============================
// GET REELS (VIDEOS ONLY)
// ============================
router.get("/reels", async (req, res) => {
  try {
    const reels = await Post.find({ mediaType: "video" })
      .sort({ createdAt: -1 });

    res.json(reels);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET POSTS BY USER (PROFILE)
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ============================
// LIKE / UNLIKE SYSTEM
// ============================
router.put("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likes = Math.max(post.likes - 1, 0);
      post.likedBy = post.likedBy.filter(id => id !== userId);
    } else {
      post.likes += 1;
      post.likedBy.push(userId);
    }

    await post.save();

    res.json({
      likes: post.likes,
      liked: !alreadyLiked
    });

  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
