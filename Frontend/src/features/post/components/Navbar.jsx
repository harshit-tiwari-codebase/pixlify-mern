import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Send,
  Search,
  X,
  User,
  LogOut,
  Trophy,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { searchUsersApi } from "../services/post.api";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchUsersApi(searchQuery.trim());
        setSearchResults(data.users || []);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectUser = (targetUsername) => {
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
    setSearchQuery("");
    if (targetUsername === user?.username) {
      navigate("/myProfile");
    } else {
      navigate(`/profile/${targetUsername}`);
    }
  };

  const onLogout = async () => {
    try {
      await handleLogout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const avatarSrc =
    user?.profile ||
    user?.profile_img ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.user || user?.username || "User"
    )}&background=FFAEC0&color=000&bold=true`;

  return (
    <header className="w-full bg-[#EBE6FB]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="w-full max-w-xl lg:max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand: "pixlify." with a coral dot */}
        <Link to="/feed" className="flex items-center gap-1 group flex-shrink-0 select-none">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black transition-transform group-hover:scale-105">
            pixlify<span className="text-[#FF6B4A]">.</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div ref={searchRef} className="hidden sm:block flex-1 max-w-xs relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowSearchDropdown(true);
              }}
              placeholder="Search people, places, vibes"
              className="w-full rounded-2xl border-2 border-black bg-white pl-10 pr-9 py-2 text-xs sm:text-sm text-black placeholder:text-zinc-500 outline-none transition focus:shadow-[2px_2px_0px_#000]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-3 text-zinc-400 hover:text-black"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden z-50 max-h-80 overflow-y-auto">
              {searching ? (
                <div className="p-4 text-center text-xs text-zinc-500">
                  Searching people...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500">
                  No people found for "{searchQuery}"
                </div>
              ) : (
                <div className="py-1 divide-y divide-zinc-200">
                  {searchResults.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSelectUser(item.username)}
                      className="px-4 py-2.5 flex items-center justify-between hover:bg-[#EBE6FB] cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={
                            item.profile_img ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.username
                            )}&background=A0E7D4&color=000&bold=true`
                          }
                          alt={item.username}
                          className="w-9 h-9 rounded-xl object-cover border-2 border-black flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-black truncate">
                            {item.username}
                          </p>
                          {item.bio && (
                            <p className="text-xs text-zinc-600 truncate max-w-[180px]">
                              {item.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-bold text-[#FF6B4A]">
                        View
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Buttons: Heart & Direct Message Squircles */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="sm:hidden w-10 h-10 rounded-2xl border-2 border-black bg-white flex items-center justify-center text-black hover:bg-zinc-50 transition active:scale-95 shadow-[2px_2px_0px_#000]"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Heart Notification Button */}
          <Link
            to="/follower"
            className="w-10 h-10 rounded-2xl border-2 border-black bg-white flex items-center justify-center text-black hover:bg-zinc-50 transition active:scale-95 shadow-[2px_2px_0px_#000]"
            title="Activity"
          >
            <Heart size={19} className="stroke-[2.2]" />
          </Link>

          {/* Direct Message / Send Button */}
          <button
            onClick={() => toast("Direct Messages coming soon!")}
            className="w-10 h-10 rounded-2xl border-2 border-black bg-white flex items-center justify-center text-black hover:bg-zinc-50 transition active:scale-95 shadow-[2px_2px_0px_#000]"
            title="Messages"
          >
            <Send size={18} className="stroke-[2.2]" />
          </button>

          {/* User Profile Menu Avatar */}
          <div ref={profileMenuRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-2xl border-2 border-black overflow-hidden bg-white shadow-[2px_2px_0px_#000] active:scale-95 transition block focus:outline-none"
              aria-label="User profile menu"
            >
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border-2 border-black bg-white p-2 shadow-[4px_4px_0px_#000] z-50">
                <div className="px-3 py-2 border-b-2 border-black/10 mb-1">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase">Signed in as</p>
                  <p className="text-sm font-bold text-black truncate">
                    @{user?.username || "user"}
                  </p>
                </div>

                <Link
                  to="/myProfile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-[#EBE6FB] transition"
                >
                  <User size={15} />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/challangeFeed"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-[#EBE6FB] transition"
                >
                  <Trophy size={15} className="text-[#FF6B4A]" />
                  <span>Challenges</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-[#EBE6FB] transition"
                >
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                </Link>

                <div className="border-t-2 border-black/10 my-1" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition text-left"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <div className="sm:hidden px-4 pb-3 pt-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, places, vibes"
              className="w-full rounded-2xl border-2 border-black bg-white pl-10 pr-9 py-2 text-xs text-black placeholder:text-zinc-500 outline-none shadow-[2px_2px_0px_#000]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-3 text-zinc-400"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="mt-2 rounded-2xl border-2 border-black bg-white max-h-60 overflow-y-auto divide-y divide-zinc-200 shadow-[3px_3px_0px_#000]">
              {searching ? (
                <div className="p-3 text-center text-xs text-zinc-500">
                  Searching people...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-3 text-center text-xs text-zinc-500">
                  No people found
                </div>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectUser(item.username)}
                    className="px-3 py-2.5 flex items-center justify-between hover:bg-[#EBE6FB]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={
                          item.profile_img ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            item.username
                          )}&background=FFAEC0&color=000&bold=true`
                        }
                        alt=""
                        className="w-8 h-8 rounded-xl object-cover border-2 border-black"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-black truncate">
                          {item.username}
                        </p>
                        {item.bio && (
                          <p className="text-[11px] text-zinc-500 truncate max-w-[180px]">
                            {item.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#FF6B4A]">View</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
