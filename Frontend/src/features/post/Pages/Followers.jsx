import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UserX, Search } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { toggleFollowApi } from "../services/post.api";
import BottomNavbar from "../components/BottomNavbar";
import toast from "react-hot-toast";

const Followers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [followersList, setFollowersList] = useState(user?.followers || []);

  const handleToggleFollow = async (targetId, currentStatus) => {
    try {
      const data = await toggleFollowApi(targetId);
      setFollowersList((prev) =>
        prev.map((f) =>
          f._id === targetId ? { ...f, isFollowing: data.isFollowing } : f
        )
      );
      toast.success(data.message);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const activeNow = [
    { name: "arjun", initial: "A", bg: "bg-[#A0E7D4]" },
    { name: "zoya", initial: "Z", bg: "bg-[#BFB9FA]" },
    { name: "dev", initial: "D", bg: "bg-[#FED7A5]" },
    { name: "riya", initial: "R", bg: "bg-[#FFAEC0]" },
    { name: "kabir", initial: "K", bg: "bg-[#D5F94C]" },
  ];

  return (
    <div className="w-full min-h-screen flex justify-center bg-[#EBE6FB] text-black pb-28">
      <div className="w-full max-w-md sm:max-w-lg px-4 pt-3">
        {/* Header */}
        <header className="w-full h-14 flex items-center justify-between mb-4 border-b-2 border-black">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-extrabold text-black tracking-tight">
              Followers
            </h1>
          </div>
          <span className="text-xs font-bold text-zinc-600 bg-white px-3 py-1 rounded-full border-2 border-black shadow-[1px_1px_0px_#000]">
            {followersList.length}
          </span>
        </header>

        {/* Active Now Tray matching Screenshot 4 */}
        <div className="mb-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-600 mb-2">
            Active now
          </h2>
          <div className="flex items-center gap-3 overflow-x-auto py-1 no-scrollbar">
            {activeNow.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer"
              >
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl border-2 border-black ${item.bg} flex items-center justify-center font-extrabold text-xl text-black shadow-[2px_2px_0px_#000] group-hover:scale-105 transition`}
                  >
                    {item.initial}
                  </div>
                  {/* Green Active Dot with black border */}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#D5F94C] border-2 border-black" />
                </div>
                <span className="text-xs font-bold text-black lowercase">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Followers List */}
        <div>
          {followersList.length > 0 ? (
            <div className="flex flex-col gap-3">
              {followersList.map((follower, index) => {
                const pastelBgs = [
                  "bg-[#A0E7D4]",
                  "bg-[#FED7A5]",
                  "bg-[#BFB9FA]",
                  "bg-[#FFAEC0]",
                  "bg-[#D5F94C]",
                ];
                const bg = pastelBgs[index % pastelBgs.length];

                return (
                  <div
                    key={follower._id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:scale-[1.01] transition"
                  >
                    <Link
                      to={`/profile/${follower.username}`}
                      className="flex items-center gap-3 min-w-0 flex-1"
                    >
                      {follower.profile_img ? (
                        <img
                          src={follower.profile_img}
                          alt={follower.username}
                          className="w-12 h-12 rounded-2xl border-2 border-black object-cover flex-shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-2xl border-2 border-black ${bg} flex items-center justify-center font-extrabold text-lg text-black flex-shrink-0`}
                        >
                          {(follower.username || "U")[0].toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-black truncate">
                          {follower.username}
                        </h3>
                        <p className="text-xs text-zinc-500 font-medium truncate">
                          @{follower.username}
                        </p>
                      </div>
                    </Link>

                    <button
                      onClick={() =>
                        handleToggleFollow(follower._id, follower.isFollowing)
                      }
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 border-black shadow-[1px_1px_0px_#000] transition active:scale-95 ${
                        follower.isFollowing
                          ? "bg-white text-black hover:bg-zinc-100"
                          : "bg-[#FF6B4A] text-white hover:bg-[#ff5a36]"
                      }`}
                    >
                      {follower.isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-white border-2 border-black rounded-[32px] shadow-[4px_4px_0px_#000]">
              <div className="w-14 h-14 rounded-2xl bg-[#FFAEC0] border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_#000]">
                <UserX size={26} />
              </div>
              <h2 className="text-base font-extrabold text-black">
                No followers yet
              </h2>
              <p className="text-zinc-600 text-xs mt-1 max-w-xs font-medium">
                When friends and creators follow you, they'll appear right here.
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Followers;
