import React from "react";
import {
  Home,
  Search,
  Plus,
  Play,
  User,
  Trophy,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavbar = () => {
  const location = useLocation();

  const isHome = location.pathname.toLowerCase() === "/feed";
  const isSearch = location.pathname.toLowerCase() === "/search" || location.pathname.toLowerCase() === "/explore";
  const isCreate = location.pathname.toLowerCase() === "/createpost";
  const isChallenge =
    location.pathname.toLowerCase() === "/challangefeed" ||
    location.pathname.toLowerCase() === "/dashboard";
  const isProfile = location.pathname.toLowerCase() === "/myprofile";

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 pointer-events-none z-30 flex justify-center px-4">
      <nav className="pointer-events-auto bg-[#13141F] border-2 border-black rounded-[32px] p-2 flex items-center justify-between gap-1 sm:gap-2 shadow-[0_12px_30px_rgba(0,0,0,0.35)] w-full max-w-sm">
        {/* Home */}
        <Link
          to="/feed"
          className={`flex items-center justify-center transition-all ${
            isHome
              ? "bg-[#D5F94C] text-black w-11 h-11 rounded-2xl border-2 border-black shadow-[1px_1px_0px_#000]"
              : "text-white/70 hover:text-white w-10 h-10 flex items-center justify-center"
          }`}
          aria-label="Home Feed"
        >
          <Home size={21} className={isHome ? "stroke-[2.5]" : "stroke-[2]"} />
        </Link>

        {/* Search */}
        <Link
          to="/explore"
          className={`flex items-center justify-center transition-all ${
            isSearch
              ? "bg-[#D5F94C] text-black w-11 h-11 rounded-2xl border-2 border-black shadow-[1px_1px_0px_#000]"
              : "text-white/70 hover:text-white w-10 h-10 flex items-center justify-center"
          }`}
          aria-label="Search and Explore"
        >
          <Search size={21} className={isSearch ? "stroke-[2.5]" : "stroke-[2]"} />
        </Link>

        {/* Center Create Post (+) */}
        <Link
          to="/createPost"
          className="bg-[#FF6B4A] hover:bg-[#ff5a36] text-white w-12 h-11 rounded-2xl border-2 border-black flex items-center justify-center transition active:scale-95 shadow-[1px_1px_0px_#000]"
          aria-label="Create Post"
        >
          <Plus size={24} className="stroke-[3]" />
        </Link>

        {/* Challenges / Reels */}
        <Link
          to="/challangeFeed"
          className={`flex items-center justify-center transition-all ${
            isChallenge
              ? "bg-[#D5F94C] text-black w-11 h-11 rounded-2xl border-2 border-black shadow-[1px_1px_0px_#000]"
              : "text-white/70 hover:text-white w-10 h-10 flex items-center justify-center"
          }`}
          aria-label="Challenges and Activity"
        >
          <Play size={20} className={isChallenge ? "stroke-[2.5] fill-black" : "stroke-[2]"} />
        </Link>

        {/* Profile */}
        <Link
          to="/myProfile"
          className={`flex items-center justify-center transition-all ${
            isProfile
              ? "bg-[#D5F94C] text-black w-11 h-11 rounded-2xl border-2 border-black shadow-[1px_1px_0px_#000]"
              : "text-white/70 hover:text-white w-10 h-10 flex items-center justify-center"
          }`}
          aria-label="My Profile"
        >
          <User size={21} className={isProfile ? "stroke-[2.5]" : "stroke-[2]"} />
        </Link>
      </nav>
    </div>
  );
};

export default BottomNavbar;
