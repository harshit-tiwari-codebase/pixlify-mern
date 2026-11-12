import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, Grid, Sparkles, Send } from "lucide-react";
import { getUserProfileApi, toggleFollowApi } from "../services/post.api";
import { useAuth } from "../../auth/hooks/useAuth";
import PostDetailModal from "../components/PostDetailModal";
import BottomNavbar from "../components/BottomNavbar";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // If viewing self, redirect to /myProfile
  useEffect(() => {
    if (currentUser?.username && username === currentUser.username) {
      navigate("/myProfile", { replace: true });
    }
  }, [currentUser, username, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfileApi(username);
      setProfileData(data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleToggleFollow = async () => {
    if (!profileData?.user?._id) return;
    try {
      const data = await toggleFollowApi(profileData.user._id);
      setProfileData((prev) => ({
        ...prev,
        isFollowing: data.isFollowing,
        followersCount: data.isFollowing
          ? prev.followersCount + 1
          : Math.max(0, prev.followersCount - 1),
      }));
      toast.success(data.message);
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#EBE6FB] text-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-[#FF6B4A] rounded-full animate-spin" />
        <p className="text-xs font-bold text-zinc-600 mt-3">Loading profile...</p>
      </div>
    );
  }

  if (!profileData?.user) {
    return (
      <div className="w-full min-h-screen bg-[#EBE6FB] text-black flex flex-col items-center justify-center p-4">
        <p className="text-sm font-bold text-black mb-4">User not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-full border-2 border-black bg-white text-xs font-bold shadow-[2px_2px_0px_#000]"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { user, followersCount, followingCount, isFollowing, posts } =
    profileData;

  const highlights = [
    { label: "Travel", bg: "bg-[#A0E7D4]" },
    { label: "Food", bg: "bg-[#FED7A5]" },
    { label: "Work", bg: "bg-[#BFB9FA]" },
    { label: "Pets", bg: "bg-[#FFAEC0]" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#EBE6FB] text-black flex flex-col items-center pb-28">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Colorful Banner Header */}
        <div className="relative w-full h-36 sm:h-44 bg-[#D5F94C] border-b-[2.5px] border-black overflow-hidden flex items-end justify-center">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#FF6B4A] border-2 border-black" />
          <div className="absolute top-8 left-12 w-28 h-28 rounded-full bg-[#BFB9FA] border-2 border-black" />

          {/* Top Bar Actions */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-2xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={handleShareProfile}
              className="w-9 h-9 rounded-2xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-4 pt-0 pb-4">
          {/* Avatar and Buttons */}
          <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-3">
            <div className="relative z-10">
              {user.profile_img ? (
                <img
                  src={user.profile_img}
                  alt={user.username}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-[2.5px] border-black object-cover bg-white shadow-[3px_3px_0px_#000]"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-[2.5px] border-black bg-[#FFAEC0] flex items-center justify-center font-extrabold text-3xl sm:text-4xl text-black shadow-[3px_3px_0px_#000]">
                  {(user.username || "U")[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={handleToggleFollow}
                className={`px-6 py-2 rounded-full border-2 border-black font-bold text-xs shadow-[2px_2px_0px_#000] active:scale-95 transition ${
                  isFollowing
                    ? "bg-white text-black hover:bg-zinc-50"
                    : "bg-[#FF6B4A] hover:bg-[#ff5a36] text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              <button
                onClick={() => toast("Messaging coming soon!")}
                className="px-5 py-2 rounded-full border-2 border-black bg-white hover:bg-zinc-50 text-black font-bold text-xs shadow-[2px_2px_0px_#000] active:scale-95 transition"
              >
                Message
              </button>
            </div>
          </div>

          {/* User Name & Bio */}
          <div>
            <h1 className="text-2xl font-extrabold text-black tracking-tight">
              {user.user || user.username}
            </h1>
            <p className="text-sm font-semibold text-zinc-600">
              @{user.username}
            </p>
            {user.bio && (
              <p className="mt-1.5 text-xs font-medium text-black leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>

          {/* Stats Boxes */}
          <div className="grid grid-cols-3 gap-2.5 my-4">
            <div className="bg-white rounded-2xl border-2 border-black p-3 text-center shadow-[2px_2px_0px_#000]">
              <span className="font-extrabold text-lg block text-black">
                {posts?.length || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-500">Posts</span>
            </div>

            <div className="bg-white rounded-2xl border-2 border-black p-3 text-center shadow-[2px_2px_0px_#000]">
              <span className="font-extrabold text-lg block text-black">
                {followersCount || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                Followers
              </span>
            </div>

            <div className="bg-white rounded-2xl border-2 border-black p-3 text-center shadow-[2px_2px_0px_#000]">
              <span className="font-extrabold text-lg block text-black">
                {followingCount || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                Following
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex items-center gap-3 overflow-x-auto py-2 mb-4 no-scrollbar">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl border-2 border-black ${item.bg} flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_#000] group-hover:scale-105 transition`}
                >
                  {item.label[0]}
                </div>
                <span className="text-xs font-bold text-black">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Posts Tab Header */}
          <div className="rounded-2xl border-2 border-black bg-white p-1 flex justify-around mb-4 shadow-[2px_2px_0px_#000]">
            <div className="py-2 px-6 flex items-center justify-center gap-2 rounded-xl text-xs font-bold bg-[#13141F] text-white">
              <Grid size={16} />
              <span>Posts</span>
            </div>
          </div>

          {/* Posts Grid */}
          <div>
            {posts?.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border-2 border-black shadow-[3px_3px_0px_#000]">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#FF6B4A]" />
                <p className="text-sm font-bold text-black">No posts yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {posts.map((post, index) => {
                  const fallbackColors = [
                    "bg-[#A0E7D4]",
                    "bg-[#FF6B4A]",
                    "bg-[#BFB9FA]",
                    "bg-[#FED7A5]",
                    "bg-[#D5F94C]",
                    "bg-[#FFAEC0]",
                  ];
                  const bg = fallbackColors[index % fallbackColors.length];

                  return (
                    <div
                      key={post._id}
                      onClick={() => setSelectedPostId(post._id)}
                      className={`group relative aspect-square overflow-hidden ${bg} border-2 border-black rounded-2xl cursor-pointer shadow-[2px_2px_0px_#000] active:scale-95 transition-transform`}
                    >
                      <img
                        src={post.postUrl}
                        alt={post.caption || "post"}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-2 text-center">
                        <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-1 rounded-full border border-white/50">
                          ❤️ {post.likesCount || 0}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}

      {/* Floating Bottom Nav */}
      <BottomNavbar />
    </div>
  );
};

export default UserProfile;
