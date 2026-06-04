import React from "react";
import Post from "../components/Post";
import PostSkeleton from "../components/PostSkeleton";
import { usePost } from "../hooks/usePost";
import { useEffect } from "react";


import Navbar from "../components/Navbar";

const Feed = () => {
  const { feed, handleGetFeed, loading, handleToggleLike } = usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center">
      <div className="w-full max-w-md lg:max-w-3xl">
        <Navbar />

        <div className="flex flex-col gap-5 px-2">
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
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;