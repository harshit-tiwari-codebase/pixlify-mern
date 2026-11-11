import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UserCheck } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { toggleFollowApi } from "../services/post.api";
import BottomNavbar from "../components/BottomNavbar";
import toast from "react-hot-toast";

const Following = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [followingList, setFollowingList] = useState(user?.following || []);

  const handleToggleFollow = async (targetId) => {
    try {
      const data = await toggleFollowApi(targetId);
      setFollowingList((prev) =>
        prev.map((f) =>
          f._id === targetId ? { ...f, isFollowing: data.isFollowing } : f
        )
      );
      toast.success(data.message);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-black text-white pb-24">
      <div className="w-full max-w-2xl">
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md w-full h-14 flex items-center justify-between px-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-base font-bold">Following</h1>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            {followingList.length} {followingList.length === 1 ? "person" : "people"}
          </span>
        </header>

        <div className="p-3 sm:p-4">
          {followingList.length > 0 ? (
            <div className="flex flex-col gap-2">
              {followingList.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition"
                >
                  <Link
                    to={`/profile/${item.username}`}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <img
                      src={
                        item.profile_img ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          item.username
                        )}&background=8b5cf6&color=fff`
                      }
                      alt={item.username}
                      className="w-11 h-11 rounded-full object-cover border border-zinc-800 flex-shrink-0"
                    />

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white hover:underline truncate">
                        {item.username}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate">
                        @{item.username}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleToggleFollow(item._id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      item.isFollowing
                        ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-red-500 hover:text-red-400"
                        : "border-violet-500 bg-violet-600 hover:bg-violet-700 text-white"
                    }`}
                  >
                    {item.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center p-4">
              <UserCheck className="w-12 h-12 text-zinc-600 mb-3" />
              <h2 className="text-base font-semibold text-zinc-300">
                Not following anyone yet
              </h2>
              <p className="text-zinc-500 text-xs mt-1 max-w-xs">
                Explore the feed or search creators to find people to follow.
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Following;
