import React, { useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Trash2,
  MoreHorizontal,
  MapPin,
  X,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  createComment,
  getComments,
  deleteCommentApi,
} from "../services/post.api";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";

const Post = ({
  post,
  handleToggleLike,
  handleToggleFollow,
  handleToggleSave,
  handleDeletePost,
}) => {
  const { user: currentUser } = useAuth();

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const lastTapRef = useRef(0);

  const handleCreateComment = async (postId, comment) => {
    try {
      if (!comment.trim()) return;
      const data = await createComment(postId, comment.trim());
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment");
    }
  };

  const handleOpenComments = async () => {
    try {
      setShowComments(true);
      setLoadingComments(true);
      const data = await getComments(post._id);
      setComments(data.comments || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentApi(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  // Double tap to like
  const handleImageTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        handleToggleLike(post._id);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    }
    lastTapRef.current = now;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/feed");
    toast.success("Link copied to clipboard!");
    setShowMenu(false);
  };

  const onDeletePostConfirm = async () => {
    if (!handleDeletePost) return;
    try {
      setDeleting(true);
      await handleDeletePost(post._id);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const isOwnPost =
    post.isOwnPost ||
    (currentUser && post.userId?._id && currentUser._id === post.userId._id);

  const userProfileLink = isOwnPost
    ? "/myProfile"
    : `/profile/${post.userId?.username}`;

  return (
    <article className="bg-zinc-950 text-white border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:border-zinc-700/80 transition-all duration-200">
      {/* Comments Drawer / Modal */}
      {showComments && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setShowComments(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 h-[75vh] sm:h-[650px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h2 className="font-semibold text-white text-base">Comments</h2>
              <button
                onClick={() => setShowComments(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingComments ? (
                <p className="text-center text-xs text-zinc-500 py-6">
                  Loading comments...
                </p>
              ) : comments.length === 0 ? (
                <p className="text-center text-xs text-zinc-500 py-6">
                  No comments yet. Say something nice!
                </p>
              ) : (
                comments.map((comment) => {
                  const canDelete =
                    currentUser &&
                    (currentUser._id === comment.userId?._id || isOwnPost);

                  return (
                    <div
                      key={comment._id}
                      className="flex items-start justify-between gap-2 group"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <Link
                          to={
                            comment.userId?.username === currentUser?.username
                              ? "/myProfile"
                              : `/profile/${comment.userId?.username}`
                          }
                          onClick={() => setShowComments(false)}
                        >
                          <img
                            src={
                              comment.userId?.profile_img ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                comment.userId?.username || "User"
                              )}&background=6366f1&color=fff`
                            }
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-zinc-800 flex-shrink-0"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-zinc-300 leading-snug break-words">
                            <Link
                              to={
                                comment.userId?.username === currentUser?.username
                                  ? "/myProfile"
                                  : `/profile/${comment.userId?.username}`
                              }
                              onClick={() => setShowComments(false)}
                              className="font-semibold text-white mr-1.5 hover:underline"
                            >
                              {comment.userId?.username}
                            </Link>
                            {comment.comment}
                          </p>
                          <span className="text-[10px] text-zinc-500 mt-0.5 block">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition"
                          title="Delete comment"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Comment */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateComment(post._id, commentText);
              }}
              className="border-t border-zinc-800 p-3 flex gap-2 bg-zinc-950"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-violet-500"
              />

              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800/60">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={userProfileLink} className="flex-shrink-0">
            <img
              className="w-9 h-9 rounded-full object-cover border border-zinc-800 hover:scale-105 transition"
              src={
                post.userId?.profile_img ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  post.userId?.username || "User"
                )}&background=8b5cf6&color=fff`
              }
              alt={post.userId?.username}
            />
          </Link>

          <div className="min-w-0">
            <Link
              to={userProfileLink}
              className="text-sm font-semibold hover:underline block truncate"
            >
              {post.userId?.username}
            </Link>
            {post.location && (
              <span className="flex items-center gap-1 text-[11px] text-zinc-400 truncate">
                <MapPin size={10} />
                {post.location}
              </span>
            )}
          </div>

          {!isOwnPost && handleToggleFollow && (
            <button
              onClick={() => handleToggleFollow(post.userId._id)}
              className={`ml-2 px-2.5 py-0.5 border rounded-full text-xs font-medium transition ${
                post.userId?.isFollowing
                  ? "border-zinc-700 text-zinc-400 hover:border-red-500 hover:text-red-400"
                  : "border-violet-500 bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white"
              }`}
            >
              {post.userId?.isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Options Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition"
            aria-label="Options"
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-2xl z-20">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 rounded-lg text-left"
              >
                <Share2 size={14} />
                Copy Link
              </button>

              {isOwnPost && handleDeletePost && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setConfirmDelete(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg text-left"
                >
                  <Trash2 size={14} />
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Image with Double Tap Heart */}
      <div
        onClick={handleImageTap}
        className="relative w-full aspect-square bg-black overflow-hidden select-none cursor-pointer flex items-center justify-center"
      >
        <img
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.01]"
          src={post.postUrl}
          alt={post.caption || "post"}
          loading="lazy"
        />

        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
            <Heart
              size={85}
              className="fill-red-500 text-red-500 drop-shadow-2xl scale-125 transition-transform"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleToggleLike(post._id)}
              className="transition active:scale-125 focus:outline-none"
              aria-label="Like post"
            >
              <Heart
                className={`w-6 h-6 transition ${
                  post.isLiked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-zinc-300 hover:text-white"
                }`}
              />
            </button>

            <button
              onClick={handleOpenComments}
              className="text-zinc-300 hover:text-white transition active:scale-110 focus:outline-none"
              aria-label="Comments"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            <button
              onClick={handleCopyLink}
              className="text-zinc-300 hover:text-white transition active:scale-110 focus:outline-none"
              aria-label="Share"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={() => handleToggleSave(post._id)}
            className="transition active:scale-110 focus:outline-none"
            aria-label="Save post"
          >
            <Bookmark
              className={`w-6 h-6 transition ${
                post.isSaved
                  ? "fill-white text-white"
                  : "text-zinc-300 hover:text-white"
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm mt-3 text-white">
          {post.likesCount || 0} {post.likesCount === 1 ? "like" : "likes"}
        </p>

        {/* Caption */}
        <p className="text-sm mt-1.5 text-zinc-200 leading-snug">
          <Link
            to={userProfileLink}
            className="font-semibold text-white mr-1.5 hover:underline"
          >
            {post.userId?.username}
          </Link>
          {post.caption}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map((t, idx) => (
              <span key={idx} className="text-xs text-violet-400 font-medium">
                #{t.replace(/^#/, "")}
              </span>
            ))}
          </div>
        )}

        {/* Comments Count / Link */}
        <button
          onClick={handleOpenComments}
          className="text-zinc-500 text-xs mt-2 block hover:text-zinc-400 transition"
        >
          View all comments
        </button>

        {/* Time */}
        <p className="text-zinc-600 text-[11px] mt-1">
          {new Date(post.createdAt || post.updatedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Post?</h3>
            <p className="text-xs text-zinc-400">
              Are you sure you want to delete this post? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-xs rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={onDeletePostConfirm}
                disabled={deleting}
                className="px-4 py-2 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default Post;
