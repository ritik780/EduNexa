import express from "express";
import multer from "multer";
import Reel from "../models/Reel.js";

const router = express.Router();

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// Upload Reel
router.post("/", upload.single("video"), async (req, res) => {
  try {
    const reel = new Reel({
      username: req.body.username,
      caption: req.body.caption,
      videoUrl: req.file.path
    });

    await reel.save();
    res.json({ message: "Reel uploaded successfully 🎬" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Reels
router.get("/", async (req, res) => {
  const reels = await Reel.find().sort({ createdAt: -1 });
  res.json(reels);
});

// Like Reel
router.put("/:id/like", async (req, res) => {
  await Reel.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
  res.json({ message: "Liked ❤️" });
});

export default router;
