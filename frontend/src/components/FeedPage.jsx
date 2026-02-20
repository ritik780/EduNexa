import React, { useState, useEffect, use } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useApi } from "../context/ApiContext";

const FeedPage = () => {
  const { user } = useUser();
  const API=useApi();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH POSTS
  useEffect(() => {
    fetch(`${API}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data || []);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, []);

  // LIKE SYSTEM
  const likePost = async (id) => {
    if (!user) return alert("Login to like posts");
 try {
      fetch(`${API}/api/posts/${id}/like`,{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await res.json();

      setPosts(prev =>
        prev.map(post =>
          post._id === id
            ? { ...post, likes: data.likes, liked: data.liked }
            : post
        )
      );

    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#F6F7FB] dark:bg-[#0B1120] text-[#2E3232] dark:text-white">

      {/* HEADER */}
      <header className="bg-white dark:bg-[#0F172A] border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-5 py-4 flex justify-between items-center">
          <h1 className="text-xl font-extrabold bg-linear-to-r from-[#8335ED] to-[#16B9AB] bg-clip-text text-transparent">
            EduNEXA Feed
          </h1>
          <span className="text-sm text-gray-500">📚 Notes & Posts</span>
        </div>
      </header>

      {/* LOADING */}
      {loading && (
        <p className="text-center py-10 text-gray-500">
          Loading posts...
        </p>
      )}

      {/* EMPTY STATE */}
      {!loading && posts.length === 0 && (
        <p className="text-center py-16 text-gray-500">
          No posts yet. Upload something 🚀
        </p>
      )}

      {/* POSTS */}
      <section className="max-w-5xl mx-auto px-4 py-6 space-y-8">

        {posts.map(post => (
          <div 
            key={post._id} 
            className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-lg overflow-hidden"
          >

            {/* USER BAR */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">

                {/* Clerk Avatar */}
                <img 
                  src={post.avatar || "https://ui-avatars.com/api/?name=User"}
                  className="w-10 h-10 rounded-full border border-[#8335ED] shadow-md object-cover"
                />

                <div>
                  <p className="font-semibold text-sm">
                    {post.username || "EduNEXA User"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>

              </div>

              <span className="text-gray-400 cursor-pointer">⋮</span>
            </div>

            {/* IMAGE */}
            {post.mediaType === "image" && (
              <img 
                src={`${API}/${post.mediaUrl}`}
                className="w-full object-cover"
              />
            )}

            {/* VIDEO */}
            {post.mediaType === "video" && (
              <video 
                src={`${API}/${post.mediaUrl}`}
                className="w-full" 
                controls 
              />
            )}

            {/* PDF */}
            {post.mediaType === "pdf" && (
              <div className="p-6 flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-[#0F172A]">
                <div className="text-5xl">📄</div>
                <p className="font-semibold text-[#8335ED]">
                  PDF Notes Uploaded
                </p>

                <a
                  href={`${API}/${post.mediaUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-4 py-2 text-sm bg-[#8335ED] text-white rounded-lg hover:scale-105 transition"
                >
                  Open PDF →
                </a>
              </div>
            )}

            {/* ACTION BAR */}
            <div className="flex justify-between px-4 py-3">

              <div className="flex gap-5">
                <button onClick={() => likePost(post._id)}>
                  <Heart 
                    size={26}
                    className={`transition-all duration-200 ${
                      post.liked
                        ? "text-red-500 fill-red-500 scale-110 animate-pulse"
                        : "text-gray-600 dark:text-gray-300 hover:text-red-400"
                    }`}
                  />
                </button>

                <MessageCircle size={24} className="cursor-pointer text-gray-600 dark:text-gray-300" />
                <Send size={24} className="cursor-pointer text-gray-600 dark:text-gray-300" />
              </div>

              <Bookmark size={24} className="cursor-pointer text-gray-600 dark:text-gray-300" />
            </div>

            {/* LIKES */}
            <p className="px-4 text-sm font-semibold">
              {post.likes || 0} {post.likes === 1 ? "like" : "likes"}
            </p>

            {/* CAPTION */}
            <p className="px-4 py-2 text-sm">
              <span className="font-semibold mr-2">{post.username}</span>
              {post.caption}
            </p>

            {/* COMMENT */}
            <div className="px-4 py-3 border-t dark:border-white/10">
              <input 
                placeholder="Add a comment..." 
                className="w-full bg-transparent text-sm outline-none text-gray-600 dark:text-gray-300"
              />
            </div>

          </div>
        ))}

      </section>

      <BottomNavbar />
    </div>
  );
};

export default FeedPage;
