import React from "react";

const PostSkeleton = () => {
  return (
    <div className="bg-white border-[2.5px] border-black rounded-[32px] p-5 shadow-[4px_4px_0px_#000] overflow-hidden animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl border-2 border-black bg-zinc-200"></div>

        <div className="flex flex-col gap-2">
          <div className="h-3.5 w-28 bg-zinc-200 rounded-md"></div>
          <div className="h-2.5 w-20 bg-zinc-100 rounded-md"></div>
        </div>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-[#FED7A5]/30 rounded-[24px] border-2 border-black mb-4"></div>

      {/* Actions */}
      <div className="flex gap-2 mb-3">
        <div className="w-20 h-8 rounded-2xl border-2 border-black bg-zinc-100"></div>
        <div className="w-20 h-8 rounded-2xl border-2 border-black bg-zinc-100"></div>
        <div className="w-9 h-8 rounded-2xl border-2 border-black bg-zinc-100"></div>
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-zinc-200 rounded"></div>
        <div className="h-3 w-3/4 bg-zinc-200 rounded"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;
