import React, { useState, useEffect } from "react";
import { usePost } from "../hooks/usePost";
import {
  ArrowLeft,
  X,
  Upload,
  Hash,
  MapPin,
  Image as ImageIcon,
  Sparkles,
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
  const [tags, setTags] = useState(["vibe"]);
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
      toast.error("Please select a photo");
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
      setTags(["vibe"]);
      setLocation("");
      toast.success("Post shared!");
      navigate("/feed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to share post");
    } finally {
      setLoading(false);
    }
  }

  const suggestedTags = ["golden hour", "vibes", "street food", "travel", "tiny homes", "cycling"];

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#EBE6FB] text-black pb-28">
      <div className="w-full max-w-md sm:max-w-lg px-4 pt-4">
        {/* Header */}
        <header className="w-full h-16 flex items-center justify-between border-b-2 border-black mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-extrabold text-black tracking-tight">
              New Post
            </h1>
          </div>

          <button
            onClick={submitHandler}
            disabled={loading || !image || !caption.trim()}
            className="px-6 py-2 rounded-full border-2 border-black bg-[#FF6B4A] hover:bg-[#ff5a36] disabled:opacity-40 text-white text-xs font-bold transition shadow-[2px_2px_0px_#000] active:scale-95"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </header>

        {/* Content Box */}
        <div className="flex flex-col gap-5">
          {/* Image Upload Box */}
          <div className="w-full aspect-square bg-white border-2 border-black rounded-[32px] overflow-hidden relative flex flex-col items-center justify-center shadow-[4px_4px_0px_#000]">
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
                  className="absolute top-3.5 right-3.5 p-2 bg-white border-2 border-black text-black rounded-2xl shadow-[2px_2px_0px_#000] hover:bg-red-50 transition"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer bg-[#FED7A5]/20 hover:bg-[#FED7A5]/40 transition">
                <div className="w-16 h-16 rounded-2xl bg-[#D5F94C] border-2 border-black flex items-center justify-center text-black mb-4 shadow-[2px_2px_0px_#000] group-hover:scale-105 transition">
                  <Upload size={28} />
                </div>
                <h3 className="text-base font-extrabold text-black mb-1">
                  Choose Photo
                </h3>
                <p className="text-xs text-zinc-600 text-center max-w-xs mb-4 font-medium">
                  PNG, JPG, WebP photos and memories
                </p>
                <span className="px-5 py-2 bg-white border-2 border-black rounded-full text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 transition">
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

          {/* Form Card */}
          <div className="w-full space-y-4 bg-white border-2 border-black rounded-[32px] p-5 shadow-[4px_4px_0px_#000]">
            {/* Caption */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-black">Caption</label>
                <span className="text-xs text-zinc-500 font-semibold">
                  {caption.length}/280
                </span>
              </div>
              <textarea
                value={caption}
                maxLength={280}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Golden hour at the old fort..."
                className="w-full h-24 bg-zinc-50 border-2 border-black rounded-2xl p-3 text-xs text-black placeholder:text-zinc-500 outline-none resize-none"
              />
            </div>

            {/* Quick Tag Pills */}
            <div>
              <label className="text-xs font-bold text-black block mb-1.5">
                Trending Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!tags.includes(tag)) setTags([...tags, tag]);
                    }}
                    className="px-3 py-1 rounded-full border-2 border-black bg-white hover:bg-[#D5F94C] text-xs font-bold text-black transition shadow-[1px_1px_0px_#000]"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Tags */}
            <div>
              <label className="text-xs font-bold text-black flex items-center gap-1.5 mb-1.5">
                <Hash size={13} />
                <span>Tags</span>
              </label>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#D5F94C] border-2 border-black text-black text-xs font-bold shadow-[1px_1px_0px_#000]"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-black hover:text-red-600"
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
                placeholder="Type tag and press Enter..."
                className="w-full bg-zinc-50 border-2 border-black rounded-2xl px-3.5 py-2 text-xs text-black placeholder:text-zinc-500 outline-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-bold text-black flex items-center gap-1.5 mb-1.5">
                <MapPin size={13} className="text-[#FF6B4A]" />
                <span>Add Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Old Fort, Delhi"
                className="w-full bg-zinc-50 border-2 border-black rounded-2xl px-3.5 py-2 text-xs text-black placeholder:text-zinc-500 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={submitHandler}
              disabled={loading || !image || !caption.trim()}
              className="w-full py-3.5 rounded-full bg-[#FF6B4A] hover:bg-[#ff5a36] disabled:opacity-40 text-white font-extrabold text-xs uppercase tracking-wider border-2 border-black transition shadow-[3px_3px_0px_#000] active:scale-95 mt-2"
            >
              {loading ? "Sharing Post..." : "Share to Pixlify"}
            </button>
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default CreatePost;
