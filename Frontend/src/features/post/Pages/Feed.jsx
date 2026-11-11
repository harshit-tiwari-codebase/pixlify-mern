import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

import Post from "../components/Post";
import PostSkeleton from "../components/PostSkeleton";
import Navbar from "../components/Navbar";
import BottomNavbar from "../components/BottomNavbar";
import { usePost } from "../hooks/usePost";

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

  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    handleGetFeed();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 20) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center">
      {/* Animated Navbar */}
      <motion.div
        initial={{ y: 0 }}
        animate={{
          y: showNavbar ? 0 : -100,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <Navbar />
      </motion.div>

      <main className="w-full max-w-lg lg:max-w-xl pt-20 px-3 sm:px-0">
        <div className="flex flex-col gap-6 pb-24">
          {loading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : feed?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-zinc-950 border border-zinc-800 rounded-2xl mt-4">
              <div className="w-14 h-14 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
                <Sparkles size={26} />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">
                Your Feed is Quiet
              </h2>
              <p className="text-sm text-zinc-400 max-w-xs mb-6">
                Be the first to share a moment, or discover creators to follow!
              </p>
              <Link
                to="/createPost"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition"
              >
                <PlusCircle size={18} />
                Create Post
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
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Feed;
