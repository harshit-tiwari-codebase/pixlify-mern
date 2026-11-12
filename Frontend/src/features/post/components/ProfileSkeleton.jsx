import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-[#EBE6FB] text-black flex justify-center animate-pulse">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Banner Skeleton */}
        <div className="w-full h-36 bg-zinc-200 border-b-2 border-black" />

        <div className="p-4">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-black bg-zinc-200 shadow-[3px_3px_0px_#000]" />
            <div className="flex gap-2">
              <div className="w-24 h-9 rounded-full border-2 border-black bg-zinc-200" />
              <div className="w-20 h-9 rounded-full border-2 border-black bg-zinc-200" />
            </div>
          </div>

          <div className="h-5 w-36 bg-zinc-200 rounded-md mb-2" />
          <div className="h-3 w-48 bg-zinc-200 rounded-md mb-4" />

          <div className="grid grid-cols-3 gap-2.5 my-4">
            <div className="h-16 rounded-2xl border-2 border-black bg-white" />
            <div className="h-16 rounded-2xl border-2 border-black bg-white" />
            <div className="h-16 rounded-2xl border-2 border-black bg-white" />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="aspect-square rounded-2xl border-2 border-black bg-zinc-200" />
            <div className="aspect-square rounded-2xl border-2 border-black bg-zinc-200" />
            <div className="aspect-square rounded-2xl border-2 border-black bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
