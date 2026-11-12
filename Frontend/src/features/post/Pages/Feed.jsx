import React, { useEffect, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Post from "../components/Post";
import PostSkeleton from "../components/PostSkeleton";
import Navbar from "../components/Navbar";
import BottomNavbar from "../components/BottomNavbar";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../../auth/hooks/useAuth";

const Feed = () => {
  const {
    feed,
    handleGetFeed,
    loading,
    handleToggleLike,
    handleToggleFollow,
    handleToggleSave,
    handleDeletePost,
  } = usePost();

  const { user } = useAuth();

  useEffect(() => {
    handleGetFeed();
  }, []);

  // Story avatars with pastel backgrounds matching Screenshot 1
  const stories = [
    { id: "maya", name: "maya", initial: "M", bg: "bg-[#FFAEC0]" },
    { id: "arjun", name: "arjun", initial: "A", bg: "bg-[#A0E7D4]" },
    { id: "zoya", name: "zoya", initial: "Z", bg: "bg-[#BFB9FA]" },
    { id: "dev", name: "dev", initial: "D", bg: "bg-[#FED7A5]" },
    { id: "riya", name: "riya", initial: "R", bg: "bg-[#D5F94C]" },
    { id: "kabir", name: "kabir", initial: "K", bg: "bg-[#FFAEC0]" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#EBE6FB] text-black flex flex-col items-center">
      {/* Navbar */}
      <Navbar />

      <main className="w-full max-w-md sm:max-w-lg px-3 sm:px-0 pt-2 pb-28">
        {/* Stories Horizontal Tray */}
        <section className="flex items-center gap-3 overflow-x-auto py-3 mb-4 no-scrollbar px-1">
          {/* Your Story */}
          <Link
            to="/createPost"
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-black bg-white flex items-center justify-center font-bold text-2xl text-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
              <Plus size={24} className="stroke-[3]" />
            </div>
            <span className="text-xs font-bold text-black tracking-tight">
              Your story
            </span>
          </Link>

          {/* Friend Stories */}
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-black ${story.bg} flex items-center justify-center font-extrabold text-xl sm:text-2xl text-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform`}
              >
                {story.initial}
              </div>
              <span className="text-xs font-bold text-black lowercase tracking-tight">
                {story.name}
              </span>
            </div>
          ))}
        </section>

        {/* Post Feed */}
        <section className="flex flex-col gap-6">
          {loading ? (
            <div className="space-y-4">
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : feed?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white border-[2.5px] border-black rounded-[32px] shadow-[4px_4px_0px_#000] mt-2">
              <div className="w-14 h-14 rounded-2xl bg-[#D5F94C] border-2 border-black flex items-center justify-center mb-4 text-black shadow-[2px_2px_0px_#000]">
                <Sparkles size={28} />
              </div>
              <h2 className="text-lg font-extrabold text-black mb-1">
                Your Feed is Fresh
              </h2>
              <p className="text-xs text-zinc-600 max-w-xs mb-6">
                Be the first to share a moment, post photos, or discover creators!
              </p>
              <Link
                to="/createPost"
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5a36] text-white border-2 border-black font-bold text-xs uppercase tracking-wider transition shadow-[2px_2px_0px_#000] active:scale-95"
              >
                <Plus size={16} className="stroke-[3]" />
                Create First Post
              </Link>
            </div>
          ) : (
            feed?.map((post) => (
              <Post
                key={post._id}
                post={post}
                handleToggleLike={handleToggleLike}
                handleToggleFollow={handleToggleFollow}
                handleToggleSave={handleToggleSave}
                handleDeletePost={handleDeletePost}
              />
            ))
          )}
        </section>
      </main>

      {/* Floating Bottom Navigation Dock */}
      <BottomNavbar />
    </div>
  );
};

export default Feed;
