import React from "react";

const PostSkeleton = () => {
  return (
    <div className="bg-black border border-zinc-800 rounded-md overflow-hidden animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-full bg-zinc-800"></div>

        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-zinc-800 rounded"></div>
          <div className="h-2 w-16 bg-zinc-800 rounded"></div>
        </div>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-zinc-800"></div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex gap-4 mb-4">
          <div className="w-6 h-6 rounded-full bg-zinc-800"></div>
          <div className="w-6 h-6 rounded-full bg-zinc-800"></div>
          <div className="w-6 h-6 rounded-full bg-zinc-800"></div>
        </div>

        {/* Likes */}
        <div className="h-3 w-20 bg-zinc-800 rounded mb-3"></div>

        {/* Caption */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-zinc-800 rounded"></div>
          <div className="h-3 w-3/4 bg-zinc-800 rounded"></div>
        </div>

        {/* Time */}
        <div className="h-2 w-16 bg-zinc-800 rounded mt-4"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;