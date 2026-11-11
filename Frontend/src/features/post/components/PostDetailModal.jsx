import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Trash2,
  MoreHorizontal,
  MapPin,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getPostDetails,
  toggleLike,
  toggleSavePost,
  toggleFollowApi,
  createComment,
  getComments,
  deleteCommentApi,
  deletePostApi,
} from "../services/post.api";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";

const PostDetailModal = ({ postId, initialPost, onClose, onPostDeleted }) => {
  const { user: currentUser } = useAuth();

  const [post, setPost] = useState(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load post details if not provided
  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const data = await getPostDetails(postId);
        setPost(data.post);
      } catch (error) {
        console.error("Failed to load post details", error);
        toast.error("Could not load post");
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchDetails();
    }
  }, [postId]);

  // Load comments
  useEffect(() => {
    async function loadPostComments() {
      if (!postId) return;
      try {
        setLoadingComments(true);
        const data = await getComments(postId);
        setComments(data.comments || []);
      } catch (error) {
        console.error("Failed to load comments", error);
      } finally {
        setLoadingComments(false);
      }
    }

    loadPostComments();
  }, [postId]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleLike = async () => {
    if (!post) return;
    try {
      const data = await toggleLike(post._id);
      setPost((prev) => ({
        ...prev,
        isLiked: data.liked,
        likesCount: data.liked
          ? (prev.likesCount || 0) + 1
          : Math.max(0, (prev.likesCount || 0) - 1),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!post) return;
    try {
      const data = await toggleSavePost(post._id);
      setPost((prev) => ({
        ...prev,
        isSaved: data.saved,
      }));
      toast.success(data.message);
    } catch (err) {
      toast.error("Failed to save post");
    }
  };

  const handleFollow = async () => {
    if (!post?.userId?._id) return;
    try {
      const data = await toggleFollowApi(post.userId._id);
      setPost((prev) => ({
        ...prev,
        userId: {
          ...prev.userId,
          isFollowing: data.isFollowing,
        },
      }));
      toast.success(data.message);
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const data = await createComment(post._id, commentText.trim());
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
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

  const handleDeletePost = async () => {
    try {
      setDeleting(true);
      await deletePostApi(post._id);
      toast.success("Post deleted successfully");
      if (onPostDeleted) onPostDeleted(post._id);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
      setDeleting(false);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/feed`;
    navigator.clipboard.writeText(postUrl);
    toast.success("Post link copied to clipboard!");
  };

  const isOwner =
    post?.isOwnPost ||
    (currentUser && post?.userId?._id && currentUser._id === post.userId._id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80 transition"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="w-full h-80 flex items-center justify-center text-zinc-500">
            Loading post...
          </div>
        ) : !post ? (
          <div className="w-full h-80 flex items-center justify-center text-zinc-500">
            Post not found
          </div>
        ) : (
          <>
            {/* Left: Image Container */}
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center max-h-[50vh] md:max-h-[85vh] overflow-hidden select-none">
              <img
                src={post.postUrl}
                alt={post.caption}
                className="w-full h-full object-contain max-h-[50vh] md:max-h-[85vh]"
              />
            </div>

            {/* Right: Details & Comments */}
            <div className="w-full md:w-2/5 flex flex-col max-h-[42vh] md:max-h-[85vh] border-t md:border-t-0 md:border-l border-zinc-800/80 bg-zinc-950">
              {/* Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-zinc-800/80">
                <div className="flex items-center gap-3 min-w-0">
                  <Link
                    to={`/profile/${post.userId?.username}`}
                    onClick={onClose}
                    className="flex-shrink-0"
                  >
                    <img
                      src={
                        post.userId?.profile_img ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          post.userId?.username || "User"
                        )}&background=6366f1&color=fff`
                      }
                      alt={post.userId?.username}
                      className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                    />
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to={`/profile/${post.userId?.username}`}
                      onClick={onClose}
                      className="text-sm font-semibold text-white hover:underline truncate block"
                    >
                      {post.userId?.username}
                    </Link>
                    {post.location && (
                      <span className="flex items-center gap-1 text-[11px] text-zinc-400 truncate">
                        <MapPin size={11} />
                        {post.location}
                      </span>
                    )}
                  </div>

                  {!isOwner && (
                    <button
                      onClick={handleFollow}
                      className={`ml-2 px-2.5 py-1 text-xs font-semibold rounded-md border transition ${
                        post.userId?.isFollowing
                          ? "border-zinc-700 text-zinc-300 hover:border-red-500 hover:text-red-400"
                          : "border-violet-500 bg-violet-600 text-white hover:bg-violet-700"
                      }`}
                    >
                      {post.userId?.isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>

                {/* More options menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-zinc-400 hover:text-white rounded-md"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-44 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl p-1 z-30">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleShare();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                      >
                        <Share2 size={14} />
                        Copy Link
                      </button>

                      {isOwner && (
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setConfirmDelete(true);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete Post
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Caption & Comments List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-sm divide-y divide-zinc-900">
                {/* Caption item */}
                <div className="flex items-start gap-3 pb-2">
                  <img
                    src={
                      post.userId?.profile_img ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        post.userId?.username || "User"
                      )}&background=6366f1&color=fff`
                    }
                    alt=""
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-200 leading-snug">
                      <span className="font-semibold text-white mr-1.5">
                        {post.userId?.username}
                      </span>
                      {post.caption}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-xs text-violet-400 font-medium"
                          >
                            #{t.replace(/^#/, "")}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="text-[11px] text-zinc-500 mt-1 block">
                      {new Date(post.createdAt || post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Comments */}
                <div className="pt-2 space-y-3">
                  {loadingComments ? (
                    <p className="text-center text-xs text-zinc-500 py-4">
                      Loading comments...
                    </p>
                  ) : comments.length === 0 ? (
                    <p className="text-center text-xs text-zinc-500 py-4">
                      No comments yet. Start the conversation!
                    </p>
                  ) : (
                    comments.map((comment) => {
                      const canDeleteComment =
                        currentUser &&
                        (currentUser._id === comment.userId?._id || isOwner);

                      return (
                        <div
                          key={comment._id}
                          className="flex items-start justify-between gap-2 group"
                        >
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <img
                              src={
                                comment.userId?.profile_img ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  comment.userId?.username || "User"
                                )}&background=4f46e5&color=fff`
                              }
                              alt=""
                              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-zinc-200 leading-snug break-words">
                                <span className="font-semibold text-white mr-1.5">
                                  {comment.userId?.username}
                                </span>
                                {comment.comment}
                              </p>
                              <span className="text-[10px] text-zinc-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {canDeleteComment && (
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
              </div>

              {/* Actions & Comment Input */}
              <div className="p-3 border-t border-zinc-800/80 bg-zinc-950">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLike}
                      className="transition active:scale-125"
                    >
                      <Heart
                        size={22}
                        className={
                          post.isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-zinc-300 hover:text-white"
                        }
                      />
                    </button>

                    <button
                      onClick={handleShare}
                      className="text-zinc-300 hover:text-white transition"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>

                  <button
                    onClick={handleSave}
                    className="transition active:scale-110"
                  >
                    <Bookmark
                      size={22}
                      className={
                        post.isSaved
                          ? "fill-white text-white"
                          : "text-zinc-300 hover:text-white"
                      }
                    />
                  </button>
                </div>

                <p className="text-xs font-semibold text-white mb-2">
                  {post.likesCount || 0} {post.likesCount === 1 ? "like" : "likes"}
                </p>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submittingComment}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Post?</h3>
            <p className="text-xs text-zinc-400">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-xs rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="px-4 py-2 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailModal;
