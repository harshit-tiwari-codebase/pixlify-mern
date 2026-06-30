const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#0B0B0F] flex items-center justify-center">
      <div className="flex flex-col items-center">

        {/* Animated Ring */}
        <div className="relative h-24 w-24">

          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>

          {/* Animated Gradient Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 border-r-fuchsia-500 animate-spin"></div>

          {/* Inner Circle */}
          <div className="absolute inset-3 rounded-full bg-[#111111] flex items-center justify-center shadow-xl">

            <span className="text-3xl font-black text-white">
              P
            </span>

          </div>

        </div>

        {/* Brand */}
        <h1 className="mt-8 text-3xl font-bold text-white tracking-wide">
          Pixlify
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-zinc-500 text-sm">
          Preparing your feed...
        </p>

        {/* Animated Dots */}
        <div className="flex gap-2 mt-6">

          <div className="h-2 w-2 rounded-full bg-violet-500 animate-bounce"></div>

          <div
            className="h-2 w-2 rounded-full bg-fuchsia-500 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>

          <div
            className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>

        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;