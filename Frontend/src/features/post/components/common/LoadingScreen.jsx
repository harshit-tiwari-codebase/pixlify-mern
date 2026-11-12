import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#EBE6FB] flex items-center justify-center z-[200]">
      <div className="flex flex-col items-center">
        {/* Animated Brand Squircle */}
        <div className="relative w-24 h-24 rounded-[28px] border-[2.5px] border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_#000] animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-[#D5F94C] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <span className="text-3xl font-black text-black">p</span>
          </div>
        </div>

        {/* Brand */}
        <h1 className="mt-6 text-3xl font-black tracking-tight text-black flex items-baseline">
          pixlify<span className="text-[#FF6B4A] text-4xl leading-none">.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-1.5 text-xs font-bold text-zinc-600">
          Preparing your feed...
        </p>

        {/* Animated Dots */}
        <div className="flex gap-2 mt-5">
          <div className="h-3 w-3 rounded-full border border-black bg-[#FF6B4A] animate-bounce"></div>
          <div
            className="h-3 w-3 rounded-full border border-black bg-[#D5F94C] animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="h-3 w-3 rounded-full border border-black bg-[#BFB9FA] animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
