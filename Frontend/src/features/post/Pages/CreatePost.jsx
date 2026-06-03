import React, { useState } from "react";
import { usePost } from "../hooks/usePost";
import { ArrowLeft, ChevronRight, HashIcon, LocationEdit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [image, setimage] = useState(null);
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const { handleCreatePost } = usePost();
  const [loading, setLoading] = useState(false);

  async function submitHandler() {
    if (!caption.trim()) return;
    if (!image) return;

    try {
      setLoading(true);
      await handleCreatePost(caption, image);

      setCaption("");
      setimage(null);

      navigate("/");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full min-h-screen flex justify-center bg-black text-amber-50">
      <div className="createPost-container w-full max-w-md lg:max-w-4xl xl:max-w-5xl">
        {/* Header */}
        <div className="nav w-full h-12 flex items-center justify-between px-4 border-b border-zinc-800">
          <button
            onClick={() => navigate(-1)}
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-full
              hover:bg-zinc-900
              active:bg-zinc-800
              transition-colors
              duration-150
            "
          >
            <ArrowLeft size={22} />
          </button>

          <h2 className="text-xl font-bold lg:text-2xl">Create Post</h2>
        </div>

        <div className="main w-full px-2 py-4 lg:px-8">
          {/* Preview */}
          <div className="preview w-full h-96 lg:w-3/4 lg:h-125 mx-auto rounded-2xl overflow-hidden">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full border-2 border-dashed border-zinc-700 bg-zinc-900 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                  📷
                </div>

                <h3 className="text-lg font-semibold text-white">
                  Add Photo or Video
                </h3>

                <p className="text-sm text-zinc-400 text-center px-4">
                  Drag and drop an image here or click to upload
                </p>

                <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition cursor-pointer">
                  Select File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setimage(e.target.files[0])}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="w-full h-px mt-8 bg-zinc-800"></div>

          {/* Caption */}
          <div className="caption w-full lg:w-3/4 mx-auto bg-black mt-8">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-xl font-bold">Caption</h1>
              <h3 className="text-xl">{caption.length}/280</h3>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="
    w-full
    h-32
    lg:h-40
    bg-zinc-900
    rounded-xl
    p-4
    text-white
    placeholder:text-zinc-500
    resize-none
    outline-none
    border
    border-zinc-800
    focus:border-zinc-700
    mt-4
  "
              placeholder="What's happening?"
            />

            <div className="flex py-4 border-b border-t items-center justify-between border-zinc-600 mt-8 px-2 lg:px-4">
              <div className="flex gap-6 items-center">
                <HashIcon className="text-xl text-blue-600" />
                <h2 className="text-xl">Add tags</h2>
              </div>
              <ChevronRight />
            </div>

            <div className="flex py-4 border-b items-center justify-between border-zinc-600 px-2 lg:px-4">
              <div className="flex gap-6 items-center">
                <LocationEdit />
                <h2 className="text-xl">Location</h2>
              </div>
              <ChevronRight />
            </div>

            <div className="flex justify-center mt-8 lg:w-full">
              <button
                disabled={loading}
                onClick={submitHandler}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 transition-all duration-200 font-semibold text-white"
              >
                {loading ? "Uploading..." : "Share Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
