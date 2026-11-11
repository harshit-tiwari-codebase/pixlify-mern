import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, Grid3X3, Sparkles } from "lucide-react";
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
      <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-500 mt-3">Loading profile...</p>
      </div>
    );
  }

  if (!profileData?.user) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <p className="text-zinc-400 mb-4">User not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { user, followersCount, followingCount, isFollowing, posts } =
    profileData;

  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center pb-24">
      <div className="w-full max-w-3xl">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-zinc-900 rounded-full transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-base truncate">{user.username}</h1>
          </div>

          <button
            onClick={handleShareProfile}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
            title="Share Profile"
          >
            <Share2 size={19} />
          </button>
        </header>

        {/* Profile Card */}
        <div className="p-4 sm:p-6 border-b border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={
                user.profile_img ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.username
                )}&background=8b5cf6&color=fff`
              }
              alt={user.username}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-violet-500/30 ring-4 ring-black"
            />

            <div className="flex-1 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {user.username}
                  </h2>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <button
                    onClick={handleToggleFollow}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                      isFollowing
                        ? "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-red-500 hover:text-red-400"
                        : "bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>

                  <button
                    onClick={handleShareProfile}
                    className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white hover:border-zinc-700 transition"
                    title="Share Profile"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-around sm:justify-start sm:gap-10 py-3 border-y sm:border-y-0 border-zinc-900">
                <div className="text-center sm:text-left">
                  <span className="font-bold text-base block text-white">
                    {posts?.length || 0}
                  </span>
                  <span className="text-xs text-zinc-400">Posts</span>
                </div>

                <div className="text-center sm:text-left">
                  <span className="font-bold text-base block text-white">
                    {followersCount || 0}
                  </span>
                  <span className="text-xs text-zinc-400">Followers</span>
                </div>

                <div className="text-center sm:text-left">
                  <span className="font-bold text-base block text-white">
                    {followingCount || 0}
                  </span>
                  <span className="text-xs text-zinc-400">Following</span>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="mt-3 text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Posts Tab Header */}
        <div className="px-4 py-3 flex items-center justify-center gap-2 border-b border-zinc-800 text-xs font-semibold tracking-wider uppercase text-zinc-400">
          <Grid3X3 size={16} />
          <span>Posts</span>
        </div>

        {/* Posts Grid */}
        <div className="p-1 sm:p-2">
          {posts?.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {posts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => setSelectedPostId(post._id)}
                  className="group relative aspect-square overflow-hidden bg-zinc-900 cursor-pointer rounded-sm sm:rounded-lg"
                >
                  <img
                    src={post.postUrl}
                    alt={post.caption || "post"}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-2 text-center">
                    <span className="text-xs font-semibold text-white">
                      ❤️ {post.likesCount || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}

      <BottomNavbar />
    </div>
  );
};

export default UserProfile;
