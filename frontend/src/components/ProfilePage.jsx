import React, { useEffect, useState } from "react";
// import { useUser } from "@clerk/clerk-react";
import { useUser, UserButton } from "@clerk/clerk-react";

import BottomNavbar from "../components/BottomNavbar";

const ProfilePage = () => {
  const { user } = useUser();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/posts/user/${user.id}`)
      .then(res => res.json())
      .then(data => setMyPosts(data));
  }, [user]);

  return (
    <div className="min-h-screen pb-32 bg-[#F6F7FB] dark:bg-[#0B1120] text-[#2E3232] dark:text-white">

      {/* HEADER */}
     <header className="bg-white dark:bg-[#0F172A] border-b shadow-sm px-6 py-5 flex justify-between items-center">
  <h1 className="text-xl font-extrabold">My Profile</h1>

  {/* Clerk Menu (Logout inside) */}
  <UserButton afterSignOutUrl="/" />
</header>


      {/* PROFILE INFO */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center gap-6">
        <img
          src={user?.imageUrl}
          className="w-24 h-24 rounded-full border-4 border-[#8335ED]"
        />

        <div>
          <h2 className="text-xl font-bold">{user?.fullName}</h2>
          <p className="text-gray-500 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
          <p className="mt-2 text-sm">
            {myPosts.length} Posts
          </p>
        </div>
      </div>

      {/* USER POSTS GRID */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 gap-4">

        {myPosts.map(post => (
          <div key={post._id} className="relative group rounded-xl overflow-hidden shadow">

            {/* IMAGE */}
            {post.mediaType === "image" && (
              <img
                src={`http://localhost:5000/${post.mediaUrl}`}
                className="w-full h-44 object-cover"
              />
            )}

            {/* VIDEO */}
            {post.mediaType === "video" && (
              <video
                src={`http://localhost:5000/${post.mediaUrl}`}
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

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-semibold">
              ❤️ {post.likes}
            </div>

          </div>
        ))}

        {myPosts.length === 0 && (
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
