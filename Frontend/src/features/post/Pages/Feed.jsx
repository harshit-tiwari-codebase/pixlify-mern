import React, { useEffect } from "react";
import Post from "../components/Post";
import PostSkeleton from "../components/PostSkeleton";
import Navbar from "../components/Navbar"
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

  useEffect(() => {
    handleGetFeed();
  }, []);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center">
      <div className="w-full max-w-md lg:max-w-3xl">
        <Navbar />

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