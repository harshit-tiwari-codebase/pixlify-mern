import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  X,
  User,
  LogOut,
  Trophy,
  LayoutDashboard,
  Compass,
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
    )}&background=8b5cf6&color=fff`;

  return (
    <div className="w-full bg-black/90 backdrop-blur-xl border-b border-zinc-800/80 sticky top-0 z-50">
      <nav className="w-full max-w-5xl mx-auto h-16 px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/feed" className="flex items-center gap-2 group flex-shrink-0">
          <h1 className="text-2xl font-black italic tracking-wide bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent group-hover:opacity-90 transition">
            Pixlify
          </h1>
        </Link>

        {/* Desktop / Tablet Search */}
        <div ref={searchRef} className="hidden sm:block flex-1 max-w-sm relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowSearchDropdown(true);
              }}
              placeholder="Search users..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pl-9 pr-9 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-500 focus:bg-zinc-900"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-3 text-zinc-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-zinc-800 bg-zinc-900/95 shadow-2xl backdrop-blur-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
              {searching ? (
                <div className="p-4 text-center text-xs text-zinc-400">
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500">
                  No users found for "{searchQuery}"
                </div>
              ) : (
                <div className="py-2 divide-y divide-zinc-800/50">
                  {searchResults.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSelectUser(item.username)}
                      className="px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800/60 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={
                            item.profile_img ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              item.username
                            )}&background=6366f1&color=fff`
                          }
                          alt={item.username}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-700 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {item.username}
                          </p>
                          {item.bio && (
                            <p className="text-xs text-zinc-400 truncate max-w-[200px]">
                              {item.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-violet-400 font-medium ml-2">
                        View
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile search toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="sm:hidden p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900 transition"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Create Post */}
          <Link
            to="/createPost"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium hover:opacity-95 transition shadow-sm hover:scale-[1.02]"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Create</span>
          </Link>

          {/* Quick links on desktop */}
          <Link
            to="/challangeFeed"
            className="hidden md:flex p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
            title="Challenges"
          >
            <Trophy size={20} />
          </Link>

          <Link
            to="/dashboard"
            className="hidden md:flex p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition"
            title="Dashboard"
          >
            <LayoutDashboard size={20} />
          </Link>

          {/* Profile Menu Dropdown */}
          <div ref={profileMenuRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-violet-500/40 hover:ring-violet-500 transition block focus:outline-none"
            >
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl backdrop-blur-xl z-50">
                <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                  <p className="text-xs text-zinc-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.username || "Pixlify User"}
                  </p>
                </div>

                <Link
                  to="/myProfile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/challangeFeed"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition"
                >
                  <Trophy size={16} />
                  <span>Challenges</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>

                <div className="border-t border-zinc-800/80 my-1" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar Expansion */}
      {showMobileSearch && (
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-zinc-800/50 bg-black/95">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-9 pr-9 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-violet-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-3 text-zinc-400"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-900/95 max-h-60 overflow-y-auto divide-y divide-zinc-800/60">
              {searching ? (
                <div className="p-3 text-center text-xs text-zinc-400">
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-3 text-center text-xs text-zinc-500">
                  No users found
                </div>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectUser(item.username)}
                    className="px-3 py-2.5 flex items-center justify-between hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={
                          item.profile_img ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            item.username
                          )}&background=6366f1&color=fff`
                        }
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {item.username}
                        </p>
                        {item.bio && (
                          <p className="text-xs text-zinc-400 truncate max-w-[180px]">
                            {item.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-violet-400">View</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
