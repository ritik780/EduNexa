import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes.js";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;
// =======================
// MIDDLEWARE
// =======================
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// STATIC UPLOADS
// =======================
app.use("/uploads", express.static(path.resolve("uploads")));

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
mongoose.connect("mongodb://127.0.0.1:27017/edunexa")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

// =======================
// START SERVER
// =======================
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
