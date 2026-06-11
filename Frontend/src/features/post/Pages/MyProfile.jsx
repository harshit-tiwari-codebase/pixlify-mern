import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { usePost } from "../hooks/usePost";
import { editProfile } from "../../auth/services/auth.api";
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
  const { handleGetSavedPosts } = usePost();
  const [activeTab, setActiveTab] = useState("posts");
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
    setProfilePreview(user.profile || "");
  }, [user]);

  useEffect(() => {
    handleGetMe();
  }, []);

  async function handleSaveProfile() {
    try {
      setSaving(true);
      await editProfile(bio, profileImage);
      await handleGetMe();
      setIsEditOpen(false);
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
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 py-2 rounded-lg flex items-center justify-center gap-2"
                >
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
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 ${
                activeTab === "posts"
                  ? "border-t-2 border-white text-white"
                  : "text-zinc-500"
              }`}
            >
              <Grid3X3 size={18} />
              <span className="hidden sm:block">Posts</span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 ${
                activeTab === "saved"
                  ? "border-t-2 border-white text-white"
                  : "text-zinc-500"
              }`}
            >
              <Bookmark size={18} />
              <span className="hidden sm:block">Saved</span>
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-3 gap-1 mt-8">
          {(activeTab === "posts" ? user?.posts : savedPosts)?.map((post) => (
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

        {activeTab === "saved" && savedLoading && (
          <p className="text-center text-zinc-500 mt-8">Loading saved posts...</p>
        )}

        {activeTab === "saved" && !savedLoading && savedPosts.length === 0 && (
          <p className="text-center text-zinc-500 mt-8">No saved posts yet.</p>
        )}
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
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
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:border-white"
                />

                {profilePreview && (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="mt-3 w-20 h-20 rounded-full object-cover border border-zinc-700"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full min-h-32 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:border-white resize-none"
                  placeholder="Write a short bio..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-lg border border-zinc-700 py-2 text-zinc-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-white text-black py-2 font-medium disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
