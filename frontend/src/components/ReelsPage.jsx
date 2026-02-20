import React, { useState, useEffect } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { Heart, MessageCircle, Send, Music } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useApi, useRefreshTrigger } from "../context/ApiContext";

const ReelsPage = () => {
  const { user } = useUser();
  const API = useApi();
  const refreshKey = useRefreshTrigger();

  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH REELS (refetches when refreshKey changes, e.g. after upload)
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/posts/reels`)
      .then(res => res.json())
      .then(data => {
        setReels(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Reels fetch error:", err);
        setLoading(false);
      });
  }, [API, refreshKey]);

  // REAL LIKE SYSTEM
  const toggleLike = async (id) => {
    if (!user) return alert("Login to like reels");

    try {
      const res = await fetch(`${API}/api/posts/${id}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await res.json();

      setReels(prev =>
        prev.map(reel =>
          reel._id === id
            ? { ...reel, likes: data.likes, liked: data.liked }
            : reel
        )
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const isLiked = (reel) =>
    reel.liked !== undefined ? reel.liked : (reel.likedBy || []).includes(user?.id);

  return (
    <div className="h-screen bg-black text-white overflow-y-scroll snap-y snap-mandatory">

      {/* LOADING */}
      {loading && (
        <p className="text-center mt-10 text-gray-300">
          Loading reels...
        </p>
      )}

      {/* EMPTY */}
      {!loading && reels.length === 0 && (
        <p className="text-center mt-10 text-gray-300">
          No reels uploaded yet 🎬
        </p>
      )}

      {/* REELS */}
      {reels.map((reel) => (
        <div key={reel._id} className="relative h-screen w-full snap-start">

          {/* VIDEO */}
          <video
            src={`${API}/${reel.mediaUrl}`}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/30"></div>

          {/* RIGHT ACTION BAR */}
          <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">

            {/* LIKE */}
            <button onClick={() => toggleLike(reel._id)}>
              <Heart
                size={32}
                className={`transition ${
                  isLiked(reel)
                    ? "text-red-500 fill-red-500 scale-110"
                    : "text-white"
                }`}
              />
              <p className="text-xs mt-1">
                {reel.likes ?? 0}
              </p>
            </button>

            {/* COMMENT */}
            <MessageCircle size={30} />

            {/* SHARE */}
            <Send size={30} />

          </div>

          {/* LEFT TEXT INFO */}
          <div className="absolute bottom-16 left-4 max-w-[75%]">

            <div className="flex items-center gap-3 mb-2">
              <img
                src={reel.avatar || "https://ui-avatars.com/api/?name=User"}
                className="w-8 h-8 rounded-full border border-white object-cover"
              />
              <p className="font-semibold">@{reel.username}</p>
            </div>

            <p className="text-sm">{reel.caption}</p>

            <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
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
