import React, { useState } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../components/BottomNavbar";
import { searchUsersApi } from "../services/post.api";

const Explore = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("For you");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const filters = ["For you", "Reels", "Travel", "Food", "Vibes"];

  const trendingItems = [
    {
      title: "street food",
      color: "bg-[#FF6B4A]",
      height: "h-56",
      tag: "food",
    },
    {
      title: "night sky",
      color: "bg-[#D5F94C]",
      height: "h-28",
      tag: "photography",
    },
    {
      title: "tiny homes",
      color: "bg-[#BFB9FA]",
      height: "h-36",
      tag: "architecture",
    },
    {
      title: "sketch walks",
      color: "bg-[#A0E7D4]",
      height: "h-56",
      tag: "art",
    },
    {
      title: "chai spots",
      color: "bg-[#FFAEC0]",
      height: "h-32",
      tag: "culture",
    },
    {
      title: "cycling",
      color: "bg-[#FED7A5]",
      height: "h-36",
      tag: "fitness",
    },
  ];

  const handleSearch = async (val) => {
    setQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const data = await searchUsersApi(val.trim());
      setSearchResults(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#EBE6FB] text-black flex flex-col items-center pb-28">
      <main className="w-full max-w-md sm:max-w-lg px-4 pt-4">
        {/* Search Bar matching Page 2 */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search people, places, vibes"
            className="w-full rounded-2xl border-2 border-black bg-white pl-11 pr-10 py-3 text-sm text-black placeholder:text-zinc-500 outline-none shadow-[2px_2px_0px_#000] focus:shadow-[3px_3px_0px_#000] transition"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSearchResults([]);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown/List */}
        {query && (
          <div className="mb-6 rounded-2xl border-2 border-black bg-white p-2 shadow-[3px_3px_0px_#000]">
            {searching ? (
              <p className="text-center text-xs text-zinc-500 py-4 font-bold">
                Searching...
              </p>
            ) : searchResults.length === 0 ? (
              <p className="text-center text-xs text-zinc-500 py-4 font-bold">
                No users found for "{query}"
              </p>
            ) : (
              <div className="divide-y divide-zinc-200">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="p-3 flex items-center justify-between hover:bg-[#EBE6FB] rounded-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl border-2 border-black bg-[#A0E7D4] flex items-center justify-center font-bold text-black text-sm">
                        {(user.username || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">
                          {user.username}
                        </p>
                        {user.bio && (
                          <p className="text-xs text-zinc-500 truncate max-w-[200px]">
                            {user.bio}
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

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {filters.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full border-2 border-black text-xs font-bold transition shadow-[2px_2px_0px_#000] active:scale-95 whitespace-nowrap ${
                  active
                    ? "bg-[#13141F] text-white"
                    : "bg-white text-black hover:bg-zinc-50"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Section Title: Trending now */}
        <h2 className="text-xl font-extrabold text-black tracking-tight mb-3 mt-1">
          Trending now
        </h2>

        {/* Bento Grid: 2 Columns of Colorful Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Column 1 */}
          <div className="flex flex-col gap-3.5">
            {/* Street Food - Tall Coral */}
            <div
              onClick={() => navigate("/feed")}
              className="bg-[#FF6B4A] rounded-[28px] border-2 border-black p-4 h-56 flex flex-col justify-end shadow-[3px_3px_0px_#000] cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <span className="font-extrabold text-lg text-black lowercase leading-tight">
                street food
              </span>
            </div>

            {/* Sketch walks - Tall Mint */}
            <div
              onClick={() => navigate("/feed")}
              className="bg-[#A0E7D4] rounded-[28px] border-2 border-black p-4 h-56 flex flex-col justify-end shadow-[3px_3px_0px_#000] cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <span className="font-extrabold text-lg text-black lowercase leading-tight">
                sketch walks
              </span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3.5">
            {/* Night sky - Lime */}
            <div
              onClick={() => navigate("/feed")}
              className="bg-[#D5F94C] rounded-[28px] border-2 border-black p-4 h-28 flex flex-col justify-end shadow-[3px_3px_0px_#000] cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <span className="font-extrabold text-lg text-black lowercase leading-tight">
                night sky
              </span>
            </div>

            {/* Tiny homes - Lavender */}
            <div
              onClick={() => navigate("/feed")}
              className="bg-[#BFB9FA] rounded-[28px] border-2 border-black p-4 h-36 flex flex-col justify-end shadow-[3px_3px_0px_#000] cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <span className="font-extrabold text-lg text-black lowercase leading-tight">
                tiny homes
              </span>
            </div>

            {/* Chai spots - Pink */}
            <div
              onClick={() => navigate("/feed")}
              className="bg-[#FFAEC0] rounded-[28px] border-2 border-black p-4 h-28 flex flex-col justify-end shadow-[3px_3px_0px_#000] cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <span className="font-extrabold text-lg text-black lowercase leading-tight">
                chai spots
              </span>
            </div>

            {/* Cycling - Peach */}
            <div
              onClick={() => navigate("/feed")}
              className="bg-[#FED7A5] rounded-[28px] border-2 border-black p-4 h-36 flex flex-col justify-end shadow-[3px_3px_0px_#000] cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <span className="font-extrabold text-lg text-black lowercase leading-tight">
                cycling
              </span>
            </div>
          </div>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
};

export default Explore;
