import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { usePost } from "../hooks/usePost";
import { editProfile } from "../../auth/services/auth.api";
import PostDetailModal from "../components/PostDetailModal";
import BottomNavbar from "../components/BottomNavbar";
import {
  Grid,
  Bookmark,
  Settings,
  Share2,
  UserRoundPen,
  ArrowLeft,
  LogOut,
  Mail,
  User,
  X,
  Plus,
  Play,
  Tag,
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
      toast.success("Profile updated!");
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
    toast.success("Profile link copied!");
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

  // Highlights list
  const highlights = [
    { label: "Travel", bg: "bg-[#A0E7D4]" },
    { label: "Food", bg: "bg-[#FED7A5]" },
    { label: "Work", bg: "bg-[#BFB9FA]" },
    { label: "Pets", bg: "bg-[#FFAEC0]" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#EBE6FB] text-black flex flex-col items-center pb-28">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Cover Graphic / Banner */}
        <div className="relative w-full h-36 sm:h-44 bg-[#D5F94C] border-b-[2.5px] border-black overflow-hidden flex items-end justify-center">
          {/* Playful geometric shapes in cover */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#FF6B4A] border-2 border-black" />
          <div className="absolute top-8 left-12 w-28 h-28 rounded-full bg-[#BFB9FA] border-2 border-black" />

          {/* Navigation over banner */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-2xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleShareProfile}
                className="w-9 h-9 rounded-2xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-9 h-9 rounded-2xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card / Header Info */}
        <div className="px-4 pt-0 pb-4">
          {/* Avatar and Action Buttons Row */}
          <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-3">
            {/* Avatar squircle */}
            <div className="relative z-10">
              {user.profile_img || user.profile ? (
                <img
                  src={user.profile_img || user.profile}
                  alt={user.username}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-[2.5px] border-black object-cover bg-white shadow-[3px_3px_0px_#000]"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-[2.5px] border-black bg-[#FFAEC0] flex items-center justify-center font-extrabold text-3xl sm:text-4xl text-black shadow-[3px_3px_0px_#000]">
                  {(user.username || "U")[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Action Buttons: Edit & Share */}
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => setIsEditOpen(true)}
                className="px-5 py-2 rounded-full border-2 border-black bg-[#FF6B4A] hover:bg-[#ff5a36] text-white font-bold text-xs shadow-[2px_2px_0px_#000] active:scale-95 transition"
              >
                Edit Profile
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-5 py-2 rounded-full border-2 border-black bg-white hover:bg-zinc-50 text-black font-bold text-xs shadow-[2px_2px_0px_#000] active:scale-95 transition"
              >
                Settings
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
            {user.bio ? (
              <p className="mt-1.5 text-xs font-medium text-black leading-relaxed">
                {user.bio}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-zinc-500 italic">
                Add a bio to introduce yourself to friends.
              </p>
            )}
          </div>

          {/* Stats Boxes (Posts, Followers, Following) */}
          <div className="grid grid-cols-3 gap-2.5 my-4">
            <div className="bg-white rounded-2xl border-2 border-black p-3 text-center shadow-[2px_2px_0px_#000]">
              <span className="font-extrabold text-lg block text-black">
                {user.posts?.length || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-500">Posts</span>
            </div>

            <Link
              to="/follower"
              className="bg-white rounded-2xl border-2 border-black p-3 text-center shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
            >
              <span className="font-extrabold text-lg block text-black">
                {user.followersCount || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                Followers
              </span>
            </Link>

            <Link
              to="/following"
              className="bg-white rounded-2xl border-2 border-black p-3 text-center shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
            >
              <span className="font-extrabold text-lg block text-black">
                {user.followingCount || 0}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                Following
              </span>
            </Link>
          </div>

          {/* Story Highlights */}
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

          {/* Tab Selector */}
          <div className="rounded-2xl border-2 border-black bg-white p-1 flex justify-around mb-4 shadow-[2px_2px_0px_#000]">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition ${
                activeTab === "posts"
                  ? "bg-[#13141F] text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <Grid size={16} />
              <span>Posts</span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition ${
                activeTab === "saved"
                  ? "bg-[#13141F] text-white shadow-sm"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <Bookmark size={16} />
              <span>Saved</span>
            </button>
          </div>

          {/* Posts Grid */}
          <div>
            {activeTab === "saved" && savedLoading ? (
              <p className="text-center text-xs text-zinc-500 py-12 font-bold">
                Loading saved posts...
              </p>
            ) : (activeTab === "posts" ? user?.posts : savedPosts)?.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border-2 border-black shadow-[3px_3px_0px_#000]">
                <p className="text-sm font-bold text-black">
                  {activeTab === "posts"
                    ? "No posts yet. Share your first moment!"
                    : "No saved posts yet."}
                </p>
                {activeTab === "posts" && (
                  <Link
                    to="/createPost"
                    className="mt-4 inline-flex items-center gap-1.5 px-5 py-2 bg-[#FF6B4A] hover:bg-[#ff5a36] text-white text-xs font-bold rounded-full border-2 border-black shadow-[2px_2px_0px_#000]"
                  >
                    <Plus size={15} />
                    <span>Create Post</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(activeTab === "posts" ? user?.posts : savedPosts)?.map(
                  (post, index) => {
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
                  }
                )}
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
          onPostDeleted={handlePostDeleted}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[28px] border-2 border-black bg-white p-5 shadow-[5px_5px_0px_#000] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <h2 className="text-base font-extrabold text-black">Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-xl border-2 border-black bg-zinc-100 flex items-center justify-center text-black hover:bg-zinc-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Account Info */}
            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2.5 text-xs font-bold text-black">
                <User size={15} />
                <span>@{user.username}</span>
              </div>
              {user.email && (
                <div className="flex items-center gap-2.5 text-xs text-zinc-600 font-medium">
                  <Mail size={15} />
                  <span>{user.email}</span>
                </div>
              )}
            </div>

            <div className="border-t-2 border-black/10 pt-2 space-y-2">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsEditOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-black hover:bg-[#EBE6FB] rounded-xl text-left transition"
              >
                <UserRoundPen size={15} />
                Edit Profile
              </button>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  handleShareProfile();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-black hover:bg-[#EBE6FB] rounded-xl text-left transition"
              >
                <Share2 size={15} />
                Share Profile Link
              </button>
            </div>

            {/* Danger Zone: Log Out */}
            <div className="border-t-2 border-black/10 pt-3">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white border-2 border-black rounded-2xl text-xs font-bold transition shadow-[2px_2px_0px_#000]"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[28px] border-2 border-black bg-white p-5 shadow-[5px_5px_0px_#000]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <h2 className="text-base font-extrabold text-black">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 rounded-xl border-2 border-black bg-zinc-100 flex items-center justify-center text-black"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">
                  Profile Photo
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
                  className="w-full text-xs rounded-xl bg-zinc-100 border-2 border-black px-3 py-2 outline-none"
                />

                {profilePreview && (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="mt-3 w-16 h-16 rounded-2xl border-2 border-black object-cover shadow-[2px_2px_0px_#000]"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1.5">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full min-h-24 rounded-2xl bg-zinc-100 border-2 border-black px-3 py-2 text-xs text-black outline-none resize-none"
                  placeholder="Share what you do or what you love..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-2xl border-2 border-black py-2.5 text-xs font-bold text-black hover:bg-zinc-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-[#FF6B4A] hover:bg-[#ff5a36] border-2 border-black text-white py-2.5 text-xs font-bold transition shadow-[2px_2px_0px_#000] disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav */}
      <BottomNavbar />
    </div>
  );
};

export default MyProfile;
