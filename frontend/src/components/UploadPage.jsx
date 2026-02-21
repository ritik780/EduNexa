import React, { useState } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useApi, useTriggerRefresh } from "../context/ApiContext";
import { useUser } from "@clerk/clerk-react";

const UploadPage = () => {
  const API = useApi();
  const triggerRefresh = useTriggerRefresh();
  const { user } = useUser();

  const [mode, setMode] = useState(null); // null | post | reel
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

 const handleUpload = async () => {
  if (!file) return alert("Select a file");

  try {
    const formData = new FormData();

    formData.append("media", file);
    formData.append("username", user?.fullName || "EduNEXA User");
    formData.append("userId", user?.id);
    formData.append("avatar", user?.imageUrl);
    formData.append("caption", caption);
    formData.append("type", mode); // post or reel

    setLoading(true);

    const res = await fetch(`${API}/api/posts`, {
      method: "POST",
      body: formData
    });

    const text = await res.text();
    const data = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};
    const msg = data.message || data.error || (res.ok ? null : `Server ${res.status}`);

    if (!res.ok) throw new Error(msg || "Upload failed");

    triggerRefresh();
    alert("Uploaded Successfully 🚀");

    setFile(null);
    setCaption("");
    setMode(null);

  } catch (err) {
    console.error("Upload error:", err);
    const message = err.message || "Upload failed ❌";
    alert(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen pb-32 bg-[#F6F7FB] dark:bg-[#0B1120] text-[#2E3232] dark:text-white">

      {/* HEADER */}
      <header className="bg-white dark:bg-[#0F172A] border-b shadow-sm px-6 py-5">
        <h1 className="text-xl font-extrabold bg-linear-to-r from-[#8335ED] to-[#16B9AB] bg-clip-text text-transparent">
          Upload
        </h1>
      </header>

      {/* MODE SELECT */}
      {!mode && (
        <div className="max-w-4xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* POST OPTION */}
          <button 
            onClick={() => setMode("post")}
            className="group bg-white dark:bg-[#1E293B] p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition text-left"
          >
            <div className="text-5xl mb-4">📸</div>
            <h2 className="text-xl font-bold group-hover:text-[#8335ED]">
              Upload Post
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Upload notes, images, PDFs & study material
            </p>
          </button>

          {/* REEL OPTION */}
          <button 
            onClick={() => setMode("reel")}
            className="group bg-white dark:bg-[#1E293B] p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition text-left"
          >
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="text-xl font-bold group-hover:text-[#16B9AB]">
              Upload Study Reel
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Upload short video reels for quick learning
            </p>
          </button>

        </div>
      )}

      {/* UPLOAD FORM */}
      {mode && (
        <div className="max-w-xl mx-auto px-6 py-12">

          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-lg p-6 space-y-5">

            <p className="text-sm font-semibold text-gray-500">
              Mode: <span className="text-[#8335ED] uppercase">{mode}</span>
            </p>

            {/* FILE INPUT */}
            <label className="block border-2 border-dashed border-[#8335ED]/60 p-6 rounded-xl text-center cursor-pointer hover:bg-[#8335ED]/10 transition">
              <input 
                type="file"
                accept={mode === "reel" ? "video/*" : "image/*,video/*,.pdf"}
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
              <p className="text-sm font-semibold">
                {file ? file.name : "Click to choose file"}
              </p>
            </label>

            {/* CAPTION */}
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-white/10 rounded-lg p-3 text-sm outline-none"
            />

            {/* BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={() => setMode(null)}
                className="w-1/3 border border-gray-400 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition"
              >
                Back
              </button>

              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-2/3 bg-[#8335ED] text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>

            </div>

          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
};

export default UploadPage;
