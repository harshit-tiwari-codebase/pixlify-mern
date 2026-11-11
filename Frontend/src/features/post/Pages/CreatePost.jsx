import React, { useState, useEffect } from "react";
import { usePost } from "../hooks/usePost";
import {
  ArrowLeft,
  X,
  Upload,
  Hash,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../components/BottomNavbar";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { handleCreatePost } = usePost();

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [image]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, "");
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  async function submitHandler(e) {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image");
      return;
    }
    if (!caption.trim()) {
      toast.error("Please write a caption");
      return;
    }

    try {
      setLoading(true);
      await handleCreatePost(caption.trim(), image, tags, location.trim());
      setCaption("");
      setImage(null);
      setTags([]);
      setLocation("");
      navigate("/feed");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-black text-white pb-24">
      <div className="w-full max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <header className="w-full h-16 flex items-center justify-between border-b border-zinc-800/80 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-bold">New Post</h1>
          </div>

          <button
            onClick={submitHandler}
            disabled={loading || !image || !caption.trim()}
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:hover:bg-violet-600 text-white text-xs font-semibold transition shadow-sm"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </header>

        {/* Content Layout: 2 Columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Image Upload Box */}
          <div className="w-full aspect-square bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center">
            {previewUrl ? (
              <div className="relative w-full h-full group">
                <img
                  src={previewUrl}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition shadow-lg"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-zinc-900/50 transition">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-105 transition">
                  <Upload size={28} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Choose Photo
                </h3>
                <p className="text-xs text-zinc-500 text-center max-w-xs mb-4">
                  PNG, JPG, WebP up to 10MB
                </p>
                <span className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-medium hover:border-zinc-500 transition">
                  Browse Files
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Form Details */}
          <div className="w-full space-y-5 bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5">
            {/* Caption */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-zinc-300">
                  Caption
                </label>
                <span
                  className={`text-xs ${
                    caption.length > 250 ? "text-amber-400" : "text-zinc-500"
                  }`}
                >
                  {caption.length}/280
                </span>
              </div>
              <textarea
                value={caption}
                maxLength={280}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a thoughtful caption, story, or thoughts..."
                className="w-full h-28 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 resize-none transition"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
                <MapPin size={13} className="text-violet-400" />
                <span>Add Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, California"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 transition"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
                <Hash size={13} className="text-violet-400" />
                <span>Tags</span>
              </label>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-medium"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-violet-300 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-violet-500 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={submitHandler}
              disabled={loading || !image || !caption.trim()}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:hover:bg-violet-600 font-semibold text-xs text-white transition shadow-sm mt-4"
            >
              {loading ? "Sharing..." : "Share Post"}
            </button>
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default CreatePost;
