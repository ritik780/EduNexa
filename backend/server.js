import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
].filter(Boolean);

// On Render the project dir is read-only; use /tmp so uploads work
const uploadsDir = process.env.RENDER
  ? path.join(os.tmpdir(), "edunexa-uploads")
  : path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}
// =======================
// MIDDLEWARE
// =======================
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// STATIC UPLOADS
// =======================
app.use("/uploads", express.static(uploadsDir));

// =======================
// ROOT TEST
// =======================
app.get("/", (req, res) => {
  res.send("EduNEXA Backend is Running 🚀");
});

// =======================
// API ROUTES
// =======================
app.use("/api/posts", postRoutes);

// =======================
// MONGODB CONNECT
// =======================
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/edunexa";
mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

// =======================
// START SERVER
// =======================
app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});
