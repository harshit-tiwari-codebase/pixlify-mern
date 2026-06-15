import React from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { useState } from "react";

import { createComment, getComments } from "../services/post.api";

const Post = ({
  post,
  handleToggleLike,
  handleToggleFollow,
  handleToggleSave,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

 const handleCreateComment = async (postId, comment) => {
  try {
    if (!comment.trim()) return;

    const data = await createComment(postId, comment);

    setComments((prev) => [data.comment, ...prev]);

    setCommentText("");
  } catch (error) {
    console.log(error);
  }
};

const handleOpenComments = async () => {
  try {
    const data = await getComments(post._id);


    setComments(data.comments || []);

    setShowComments(true);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="bg-black text-white border border-zinc-800 rounded-md overflow-hidden">
      {/* {comment section} */}
      {showComments && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-end z-50">
          <div className="bg-zinc-900 w-full max-w-md h-[70vh] rounded-t-2xl flex flex-col lg:max-w-3xl">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-zinc-700">
              <h2 className="font-semibold">Comments</h2>

              <button
                onClick={() => setShowComments(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-zinc-500">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <img
                      src={comment.userId?.profile_img}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />

                    <div>
                      <p className="font-semibold text-sm">
                        {comment.userId?.username}
                      </p>

                      <p className="text-sm text-zinc-300">{comment.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <div className="border-t border-zinc-700 p-3 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-zinc-800 rounded-md px-3 py-2 outline-none"
              />

              <button
                onClick={() => handleCreateComment(post._id, commentText)}
                className="text-blue-500 font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={post.userId?.profile_img}
            alt={post.userId?.username}
          />

          <h2 className="text-sm font-semibold">{post.userId?.username}</h2>

          {!post.isOwnPost && (
            <button
              onClick={() => handleToggleFollow(post.userId._id)}
              className="px-2 py-0.5 border border-white rounded text-sm"
            >
              {post.userId?.isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        <button className="text-lg font-bold">•••</button>
      </div>

      {/* Post Image */}
      <img
        className="w-full aspect-square object-cover"
        src={post.postUrl}
        alt="post"
      />

      {/* Actions */}
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Heart
              onClick={() => handleToggleLike(post._id)}
              className={`w-6 h-6 cursor-pointer hover:scale-110 transition ${
                post.isLiked ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />

            <MessageCircle
              onClick={handleOpenComments}
              className="w-6 h-6 cursor-pointer hover:scale-110 transition"
            />

            <Send className="w-6 h-6 cursor-pointer hover:scale-110 transition" />
          </div>

          <Bookmark
            onClick={() => handleToggleSave(post._id)}
            className={`w-6 h-6 cursor-pointer hover:scale-110 transition ${
              post.isSaved ? "fill-white text-white" : "text-white"
            }`}
          />
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mt-3">
          {post.likesCount || 0} likes
        </p>

        {/* Caption */}
        <p className="text-sm mt-2">
          <span className="font-semibold mr-2">{post.userId?.username}</span>
          {post.caption}
        </p>

        {/* Time */}
        <p className="text-zinc-500 text-xs mt-2">
          {new Date(post.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Post;
