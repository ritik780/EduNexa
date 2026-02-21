import React, { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import BottomNavbar from "../components/BottomNavbar";
import { useApi, useRefreshTrigger, useMediaUrl } from "../context/ApiContext";

const FETCH_TIMEOUT = 25000;

const ProfilePage = () => {
  const { user } = useUser();
  const API = useApi();
  const getMediaUrl = useMediaUrl();
  const refreshKey = useRefreshTrigger();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    fetch(`${API}/api/posts/user/${user.id}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setMyPosts(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Profile fetch error:", err);
        setError(err.name === "AbortError" ? "Taking too long." : "Couldn't load profile.");
        setLoading(false);
      })
      .finally(() => clearTimeout(timeoutId));
  }, [user, API, refreshKey]);

  return (
    <div className="min-h-screen pb-32 bg-[#F6F7FB] dark:bg-[#0B1120] text-[#2E3232] dark:text-white">

      {/* HEADER */}
      <header className="bg-white dark:bg-[#0F172A] border-b shadow-sm px-6 py-5 flex justify-between items-center">
        <h1 className="text-xl font-extrabold">My Profile</h1>

        {/* Clerk Logout Button */}
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* PROFILE INFO */}
      {user && (
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center gap-6">
          <img
            src={user.imageUrl}
            className="w-24 h-24 rounded-full border-4 border-[#8335ED]"
          />

          <div>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-gray-500 text-sm">
              {user.primaryEmailAddress?.emailAddress}
            </p>
            <p className="mt-2 text-sm font-semibold">
              {myPosts.length} Posts
            </p>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">
          Loading your posts...
        </p>
      )}

      {!loading && error && (
        <p className="text-center text-gray-500 mt-10">{error}</p>
      )}

      {/* USER POSTS GRID */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 gap-4">

        {myPosts.map(post => (
          <div key={post._id} className="relative group rounded-xl overflow-hidden shadow">

            {/* IMAGE */}
            {post.mediaType === "image" && (
              <img
                src={getMediaUrl(post.mediaUrl)}
                className="w-full h-44 object-cover"
              />
            )}

            {/* VIDEO */}
            {post.mediaType === "video" && (
              <video
                src={getMediaUrl(post.mediaUrl)}
                className="w-full h-44 object-cover"
                muted
              />
            )}

            {/* PDF */}
            {post.mediaType === "pdf" && (
              <div className="h-44 flex items-center justify-center bg-gray-100 dark:bg-[#1E293B]">
                📄 PDF
              </div>
            )}

            {/* OVERLAY LIKE COUNT */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-semibold">
              ❤️ {post.likes}
            </div>

          </div>
        ))}

        {!loading && myPosts.length === 0 && (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No posts yet. Upload something 🚀
          </p>
        )}

      </section>

      <BottomNavbar />
    </div>
  );
};

export default ProfilePage;
