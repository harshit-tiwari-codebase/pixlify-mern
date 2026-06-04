import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center animate-pulse">
      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-5xl">

        {/* Header */}
        <div className="border-b border-zinc-800 px-4 py-3">
          <div className="h-6 w-32 bg-zinc-800 rounded"></div>
        </div>

        {/* Profile */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Profile Image */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-zinc-800"></div>

            {/* Stats */}
            <div className="flex-1 w-full">
              <div className="flex justify-around">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="text-center">
                    <div className="h-6 w-10 bg-zinc-800 rounded mx-auto"></div>
                    <div className="h-4 w-14 bg-zinc-800 rounded mt-2"></div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-5">
                <div className="flex-1 h-10 bg-zinc-800 rounded-lg"></div>
                <div className="flex-1 h-10 bg-zinc-800 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-5">
            <div className="h-5 w-32 bg-zinc-800 rounded"></div>
            <div className="h-4 w-64 bg-zinc-800 rounded mt-3"></div>
            <div className="h-4 w-48 bg-zinc-800 rounded mt-2"></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-zinc-800">
          <div className="flex">
            <div className="flex-1 h-12 bg-zinc-900"></div>
            <div className="flex-1 h-12 bg-zinc-900"></div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-0.5">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-zinc-800"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;