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

// On Render use memory storage (no disk write in multer), then we write to /tmp in the route
const storage = process.env.RENDER
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadsDir),
      filename: (req, file, cb) => {
        const safeName = (file.originalname || "file").replace(/[^a-zA-Z0-9.-]/g, "_");
        cb(null, Date.now() + "-" + safeName);
      }
    });

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB for videos
});

// Multer error handler (e.g. file too large, no file)
const handleMulterError = (err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large (max 100MB)" });
  }
  if (err) {
    console.error("Multer error:", err);
    return res.status(400).json({ error: err.message || "Upload error" });
  }
  next();
};

// ============================
// CREATE POST
// ============================
router.post("/", upload.single("media"), handleMulterError, async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    let filename = file.filename;
    if (process.env.RENDER && file.buffer) {
      filename = Date.now() + "-" + (file.originalname || "file").replace(/[^a-zA-Z0-9.-]/g, "_");
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, file.buffer);
    }

    let mediaType = "image";
    if (file.mimetype.startsWith("video")) mediaType = "video";
    else if (file.mimetype === "application/pdf") mediaType = "pdf";

    const post = new Post({
      userId: req.body.userId || "guest",
      username: req.body.username || "Anonymous",
      avatar: req.body.avatar || "",
      caption: req.body.caption || "",
      mediaUrl: "uploads/" + filename,
      mediaType
    });

    await post.save();

    res.json(post);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message || "Upload failed" });
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
