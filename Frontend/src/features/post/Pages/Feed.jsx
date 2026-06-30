import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  } = usePost();

  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    handleGetFeed();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at top
      if (currentScrollY < 20) {
        setShowNavbar(true);
      }
      // Scrolling Down
      else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      }
      // Scrolling Up
      else {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center">
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

      <div className="w-full max-w-md lg:max-w-3xl pt-20">
        <div className="flex flex-col gap-5 px-2 pb-20">
          {loading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            feed?.map((post) => (
              <Post
                key={post._id}
                post={post}
                handleToggleLike={handleToggleLike}
                handleToggleFollow={handleToggleFollow}
                handleToggleSave={handleToggleSave}
              />
            ))
          )}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Feed;