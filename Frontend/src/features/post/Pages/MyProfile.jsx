import React, { useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import ProfileSkeleton from "../components/ProfileSkeleton";
import {
  Grid3X3,
  Bookmark,
  Settings,
  Share2,
  UserRoundPen,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, handleGetMe } = useAuth();

  console.log(user)

  useEffect(() => {
    handleGetMe();
  }, []);

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-5xl">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-zinc-800">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-1 hover:bg-zinc-800 rounded-full transition"
              >
                <ArrowLeft size={22} />
              </button>

              <h1 className="font-bold text-lg">{user.user}</h1>
            </div>

            <Settings size={22} />
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user.profile}
              alt=""
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border border-zinc-700"
            />

            <div className="flex-1 w-full">
              <div className="flex justify-around text-center">
                <div>
                  <h2 className="font-bold text-lg">
                    {user.posts?.length || 0}
                  </h2>
                  <p className="text-zinc-400 text-sm">Posts</p>
                </div>

                <Link to={"/follower"}>
                  <div>
                    <h2 className="font-bold text-lg">
                      {user.followersCount == 0 ? "0" : user.followersCount}
                    </h2>

                    <p className="text-zinc-400 text-sm">Followers</p>
                  </div>
                </Link>

                <Link to={"/following"}>
                  <div>
                    <h2 className="font-bold text-lg">
                      {user.followingCount == 0 ? "0" : user.followingCount}
                    </h2>

                    <p className="text-zinc-400 text-sm">Following</p>
                  </div>
                </Link>
              </div>

              <div className="flex gap-2 mt-5">
                <button className="flex-1 bg-zinc-900 border border-zinc-700 py-2 rounded-lg flex items-center justify-center gap-2">
                  <UserRoundPen size={18} />
                  Edit Profile
                </button>

                <button className="flex-1 bg-zinc-900 border border-zinc-700 py-2 rounded-lg flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-zinc-400 whitespace-pre-line mt-2">{user.bio}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-zinc-800">
          <div className="flex">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border-t-2 border-white">
              <Grid3X3 size={18} />
              <span className="hidden sm:block">Posts</span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 py-3 text-zinc-500">
              <Bookmark size={18} />
              <span className="hidden sm:block">Saved</span>
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-3 gap-1 mt-8">
          {user?.posts?.map((post) => (
            <div
              key={post._id}
              className="group relative aspect-square overflow-hidden bg-zinc-900 cursor-pointer"
            >
              <img
                src={post.postUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-sm font-medium line-clamp-2">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-zinc-300">
                    ❤️ {post.likesCount || 0}
                  </span>

                  <span className="text-xs text-zinc-400">View</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
