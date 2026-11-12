import React, { useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Trash2,
  MoreHorizontal,
  MapPin,
  X,
  Share2,
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
      toast.success("Post deleted");
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

  // Avatar pastel fallback
  const userInitial = (post.userId?.username || "U")[0].toUpperCase();
  const tagText = post.tags?.[0] ? post.tags[0].replace(/^#/, "") : "golden hour";

  return (
    <article className="rounded-[32px] border-[2.5px] border-black bg-white p-4 sm:p-5 shadow-[4px_4px_0px_#000] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={userProfileLink} className="flex-shrink-0 group">
            {post.userId?.profile_img ? (
              <img
                className="w-11 h-11 rounded-2xl border-2 border-black object-cover"
                src={post.userId.profile_img}
                alt={post.userId.username}
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl border-2 border-black bg-[#FFAEC0] flex items-center justify-center font-bold text-black text-lg">
                {userInitial}
              </div>
            )}
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to={userProfileLink}
                className="text-sm font-bold text-black hover:underline truncate"
              >
                {post.userId?.username}
              </Link>

              {!isOwnPost && handleToggleFollow && (
                <button
                  onClick={() => handleToggleFollow(post.userId._id)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border-2 border-black transition ${
                    post.userId?.isFollowing
                      ? "bg-zinc-100 text-zinc-600"
                      : "bg-[#FF6B4A] text-white"
                  }`}
                >
                  {post.userId?.isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            {post.location && (
              <p className="text-xs text-zinc-500 font-medium truncate flex items-center gap-1">
                <MapPin size={11} className="text-zinc-400" />
                {post.location}
              </p>
            )}
          </div>
        </div>

        {/* Options Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-xl border border-transparent hover:border-black text-zinc-600 hover:text-black transition"
            aria-label="Options"
          >
            <MoreHorizontal size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl border-2 border-black bg-white p-1.5 shadow-[4px_4px_0px_#000] z-20">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-black hover:bg-[#EBE6FB] rounded-xl text-left"
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
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl text-left"
                >
                  <Trash2 size={14} />
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Container with Lime Pill Badge */}
      <div
        onClick={handleImageTap}
        className="relative w-full aspect-square bg-[#FED7A5] rounded-[24px] border-2 border-black overflow-hidden select-none cursor-pointer flex items-center justify-center mb-3.5"
      >
        {/* Lime Pill Badge in Top-Left */}
        <span className="absolute top-3.5 left-3.5 bg-[#D5F94C] text-black font-bold text-xs px-3 py-1 rounded-full border-2 border-black shadow-[1px_1px_0px_#000] z-10 pointer-events-none">
          {tagText}
        </span>

        <img
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.01]"
          src={post.postUrl}
          alt={post.caption || "post"}
          loading="lazy"
        />

        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
            <Heart
              size={90}
              className="fill-[#FF6B4A] text-[#FF6B4A] drop-shadow-lg scale-125 transition-transform"
            />
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Like Pill Button */}
          <button
            onClick={() => handleToggleLike(post._id)}
            className="rounded-2xl border-2 border-black bg-white px-3.5 py-1.5 flex items-center gap-1.5 font-bold text-xs shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
            aria-label="Like post"
          >
            <Heart
              size={17}
              className={`transition ${
                post.isLiked
                  ? "fill-[#FF6B4A] text-[#FF6B4A]"
                  : "text-black"
              }`}
            />
            <span>{post.likesCount || 0}</span>
          </button>

          {/* Comment Pill Button */}
          <button
            onClick={handleOpenComments}
            className="rounded-2xl border-2 border-black bg-white px-3.5 py-1.5 flex items-center gap-1.5 font-bold text-xs shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
            aria-label="Comments"
          >
            <MessageCircle size={17} className="text-black" />
            <span>{comments.length || post.commentsCount || 0}</span>
          </button>

          {/* Share Squircle Button */}
          <button
            onClick={handleCopyLink}
            className="w-9 h-9 rounded-2xl border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
            aria-label="Share"
            title="Share"
          >
            <Send size={16} className="text-black" />
          </button>
        </div>

        {/* Bookmark Squircle Button */}
        <button
          onClick={() => handleToggleSave(post._id)}
          className="w-9 h-9 rounded-2xl border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
          aria-label="Save post"
          title="Save"
        >
          <Bookmark
            size={16}
            className={post.isSaved ? "fill-black text-black" : "text-black"}
          />
        </button>
      </div>

      {/* Caption */}
      <div className="text-sm text-black leading-relaxed">
        <Link
          to={userProfileLink}
          className="font-bold text-black mr-2 hover:underline"
        >
          {post.userId?.username}
        </Link>
        <span>{post.caption}</span>
      </div>

      {/* Comments Drawer / Modal */}
      {showComments && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setShowComments(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] bg-white border-2 border-black h-[75vh] sm:h-[620px] flex flex-col overflow-hidden shadow-[6px_6px_0px_#000] animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b-2 border-black bg-[#EBE6FB]">
              <h2 className="font-extrabold text-black text-base">Comments</h2>
              <button
                onClick={() => setShowComments(false)}
                className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center text-black hover:bg-zinc-100 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingComments ? (
                <p className="text-center text-xs text-zinc-500 py-6">
                  Loading comments...
                </p>
              ) : comments.length === 0 ? (
                <p className="text-center text-xs text-zinc-500 py-6">
                  No comments yet. Say something friendly!
                </p>
              ) : (
                comments.map((comment) => {
                  const canDelete =
                    currentUser &&
                    (currentUser._id === comment.userId?._id || isOwnPost);

                  return (
                    <div
                      key={comment._id}
                      className="p-3 rounded-2xl border-2 border-black bg-white flex items-start justify-between gap-2 shadow-[2px_2px_0px_#000] group"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <Link
                          to={
                            comment.userId?.username === currentUser?.username
                              ? "/myProfile"
                              : `/profile/${comment.userId?.username}`
                          }
                          onClick={() => setShowComments(false)}
                        >
                          <div className="w-8 h-8 rounded-xl border-2 border-black bg-[#A0E7D4] flex items-center justify-center font-bold text-xs text-black flex-shrink-0">
                            {(comment.userId?.username || "U")[0].toUpperCase()}
                          </div>
                        </Link>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-black leading-snug break-words">
                            <span className="font-bold mr-1.5">
                              {comment.userId?.username}
                            </span>
                            {comment.comment}
                          </p>
                          <span className="text-[10px] text-zinc-400 mt-0.5 block">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition"
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
              className="border-t-2 border-black p-3.5 pb-6 sm:pb-3.5 flex gap-2 bg-[#EBE6FB]"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-white border-2 border-black rounded-2xl px-4 py-2 text-xs text-black placeholder:text-zinc-500 outline-none"
              />

              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-[#FF6B4A] hover:bg-[#ff5a36] disabled:opacity-40 text-white rounded-2xl border-2 border-black text-xs font-bold transition shadow-[2px_2px_0px_#000]"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border-2 border-black rounded-[28px] p-5 max-w-sm w-full space-y-4 shadow-[5px_5px_0px_#000]">
            <h3 className="text-base font-bold text-black">Delete Post?</h3>
            <p className="text-xs text-zinc-600">
              Are you sure you want to delete this post? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border-2 border-black bg-white hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={onDeletePostConfirm}
                disabled={deleting}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-500 text-white border-2 border-black hover:bg-red-600 disabled:opacity-50"
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
