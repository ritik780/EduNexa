import React, { useState, useEffect } from "react";
import BottomNavbar from "./BottomNavbar";
import { Heart, MessageCircle, Send, Music } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const ReelsPage = () => {
  const { user } = useUser();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH REELS (VIDEOS ONLY)
  useEffect(() => {
    fetch("http://localhost:5000/api/posts/reels")
      .then(res => res.json())
      .then(data => {
        setReels(data || []);
        setLoading(false);
      })
      .catch(() => {
        setReels([]);
        setLoading(false);
      });
  }, []);

  // LIKE SYSTEM
  const toggleLike = async (id) => {
    if (!user) return alert("Login to like reels");

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await res.json();

      setReels(prev =>
        prev.map(r =>
          r._id === id
            ? { ...r, likes: data.likes, liked: data.liked }
            : r
        )
      );

    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <div className="h-screen bg-black text-white overflow-y-scroll snap-y snap-mandatory">

      {/* LOADING */}
      {loading && (
        <p className="text-center py-10 text-gray-400">
          Loading reels...
        </p>
      )}

      {/* EMPTY */}
      {!loading && reels.length === 0 && (
        <p className="text-center py-20 text-gray-400">
          No reels uploaded yet 🎬
        </p>
      )}

      {/* REELS */}
      {reels.map((reel) => (
        <div 
          key={reel._id} 
          className="relative h-screen w-full snap-start"
        >

          {/* VIDEO */}
          <video
            src={`http://localhost:5000/${reel.mediaUrl}`}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40"></div>

          {/* RIGHT ACTION BAR */}
          <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">

            {/* LIKE */}
            <button onClick={() => toggleLike(reel._id)}>
              <Heart
                size={32}
                className={`transition-all duration-200 ${
                  reel.liked
                    ? "text-red-500 fill-red-500 scale-110 animate-pulse"
                    : "text-white hover:text-red-400"
                }`}
              />
              <p className="text-xs mt-1 text-center">
                {reel.likes || 0}
              </p>
            </button>

            {/* COMMENT */}
            <MessageCircle size={30} className="cursor-pointer hover:scale-110 transition" />

            {/* SHARE */}
            <Send size={30} className="cursor-pointer hover:scale-110 transition" />

          </div>

          {/* LEFT TEXT */}
          <div className="absolute bottom-16 left-4 max-w-[75%] space-y-2">

            <p className="font-semibold text-sm">
              @{reel.username || "EduNEXA User"}
            </p>

            <p className="text-sm text-gray-200">
              {reel.caption}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Music size={14} />
              Study Reel
            </div>

          </div>

        </div>
      ))}

      <BottomNavbar />
    </div>
  );
};

export default ReelsPage;
