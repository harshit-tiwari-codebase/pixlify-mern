import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { usePost } from "../hooks/usePost";
import { editProfile } from "../../auth/services/auth.api";
import PostDetailModal from "../components/PostDetailModal";
import BottomNavbar from "../components/BottomNavbar";
import {
  Grid3X3,
  Bookmark,
  Settings,
  Share2,
  UserRoundPen,
  ArrowLeft,
  LogOut,
  Mail,
  User,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, handleGetMe, handleLogout } = useAuth();
  const { handleGetSavedPosts } = usePost();
  const [activeTab, setActiveTab] = useState("posts");
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (profilePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  useEffect(() => {
    if (!user) return;
    setBio(user.bio || "");
    setProfilePreview(user.profile_img || user.profile || "");
  }, [user]);

  useEffect(() => {
    handleGetMe();
  }, []);

  async function handleSaveProfile() {
    try {
      setSaving(true);
      await editProfile(bio, profileImage);
      await handleGetMe();
      toast.success("Profile updated successfully");
      setIsEditOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (activeTab !== "saved") return;

    async function loadSavedPosts() {
      try {
        setSavedLoading(true);
        const posts = await handleGetSavedPosts();
        setSavedPosts(posts);
      } finally {
        setSavedLoading(false);
      }
    }

    loadSavedPosts();
  }, [activeTab]);

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  const onLogout = async () => {
    try {
      await handleLogout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const handlePostDeleted = (deletedId) => {
    handleGetMe();
    setSavedPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center pb-24">
      <div className="w-full max-w-3xl">
        {/* Header */}
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
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </header>

        {/* Profile Card */}
        <div className="p-4 sm:p-6 border-b border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={
                user.profile_img ||
                user.profile ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.username
                )}&background=8b5cf6&color=fff`
              }
              alt={user.username}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-violet-500/30 ring-4 ring-black"
            />

            <div className="flex-1 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold text-white">{user.username}</h2>

                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <UserRoundPen size={16} />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={handleShareProfile}
                    className="p-2 bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white transition"
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
                    {user.posts?.length || 0}
                  </span>
                  <span className="text-xs text-zinc-400">Posts</span>
                </div>

                <Link to="/follower" className="text-center sm:text-left hover:opacity-80 transition">
                  <span className="font-bold text-base block text-white">
                    {user.followersCount || 0}
                  </span>
                  <span className="text-xs text-zinc-400">Followers</span>
                </Link>

                <Link to="/following" className="text-center sm:text-left hover:opacity-80 transition">
                  <span className="font-bold text-base block text-white">
                    {user.followingCount || 0}
                  </span>
                  <span className="text-xs text-zinc-400">Following</span>
                </Link>
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

        {/* Tabs */}
        <div className="border-b border-zinc-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === "posts"
                  ? "border-b-2 border-violet-500 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Grid3X3 size={16} />
              <span>Posts</span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === "saved"
                  ? "border-b-2 border-violet-500 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Bookmark size={16} />
              <span>Saved</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="p-1 sm:p-2">
          {activeTab === "saved" && savedLoading ? (
            <p className="text-center text-xs text-zinc-500 py-12">
              Loading saved posts...
            </p>
          ) : (activeTab === "posts" ? user?.posts : savedPosts)?.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <p className="text-sm">
                {activeTab === "posts"
                  ? "No posts yet. Share your first moment!"
                  : "No saved posts yet."}
              </p>
              {activeTab === "posts" && (
                <Link
                  to="/createPost"
                  className="mt-4 inline-block px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition"
                >
                  Create Post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {(activeTab === "posts" ? user?.posts : savedPosts)?.map((post) => (
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
          onPostDeleted={handlePostDeleted}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <h2 className="text-base font-bold text-white">Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Account Info */}
            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <User size={15} className="text-violet-400" />
                <span>@{user.username}</span>
              </div>
              {user.email && (
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <Mail size={15} className="text-violet-400" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800/80 pt-2 space-y-1">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsEditOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900 rounded-lg text-left transition"
              >
                <UserRoundPen size={15} />
                Edit Profile
              </button>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  handleShareProfile();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-900 rounded-lg text-left transition"
              >
                <Share2 size={15} />
                Share Profile
              </button>
            </div>

            {/* Danger Zone: Log Out */}
            <div className="border-t border-zinc-800/80 pt-3">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition"
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Edit Profile</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setProfileImage(file);
                    if (file) {
                      setProfilePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-xs rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-violet-500"
                />

                {profilePreview && (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="mt-3 w-16 h-16 rounded-full object-cover border border-zinc-700"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full min-h-24 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-violet-500 resize-none"
                  placeholder="Write a short bio..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-xl border border-zinc-800 py-2 text-xs text-zinc-300 hover:bg-zinc-900 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white py-2 text-xs font-semibold transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
};

export default MyProfile;
