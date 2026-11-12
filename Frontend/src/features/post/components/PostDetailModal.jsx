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
      toast.success(data.message || (data.saved ? "Saved" : "Removed"));
    } catch (err) {
      toast.error("Action failed");
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
      toast.error("Follow failed");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white border-[2.5px] border-black rounded-[32px] overflow-hidden shadow-[6px_6px_0px_#000] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center text-black hover:bg-zinc-100 shadow-[2px_2px_0px_#000] transition"
        >
          <X size={18} />
        </button>

        {loading ? (
          <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-bold text-sm">
            Loading post...
          </div>
        ) : !post ? (
          <div className="w-full h-80 flex items-center justify-center text-zinc-500 font-bold text-sm">
            Post not found
          </div>
        ) : (
          <>
            {/* Left: Image Container */}
            <div className="w-full md:w-3/5 bg-[#FED7A5]/30 flex items-center justify-center max-h-[45vh] md:max-h-[85vh] overflow-hidden select-none border-b-2 md:border-b-0 md:border-r-2 border-black">
              <img
                src={post.postUrl}
                alt={post.caption}
                className="w-full h-full object-contain max-h-[45vh] md:max-h-[85vh]"
              />
            </div>

            {/* Right: Details & Comments */}
            <div className="w-full md:w-2/5 flex flex-col max-h-[45vh] md:max-h-[85vh] bg-white">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b-2 border-black bg-[#EBE6FB]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Link
                    to={`/profile/${post.userId?.username}`}
                    onClick={onClose}
                    className="flex-shrink-0"
                  >
                    <div className="w-9 h-9 rounded-xl border-2 border-black bg-[#FFAEC0] flex items-center justify-center font-bold text-black text-sm">
                      {(post.userId?.username || "U")[0].toUpperCase()}
                    </div>
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to={`/profile/${post.userId?.username}`}
                      onClick={onClose}
                      className="text-xs font-bold text-black hover:underline truncate block"
                    >
                      {post.userId?.username}
                    </Link>
                    {post.location && (
                      <span className="flex items-center gap-1 text-[11px] text-zinc-500 truncate">
                        <MapPin size={10} />
                        {post.location}
                      </span>
                    )}
                  </div>

                  {!isOwner && (
                    <button
                      onClick={handleFollow}
                      className={`ml-1 px-3 py-0.5 text-xs font-bold rounded-full border-2 border-black transition ${
                        post.userId?.isFollowing
                          ? "bg-zinc-100 text-zinc-600"
                          : "bg-[#FF6B4A] text-white"
                      }`}
                    >
                      {post.userId?.isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>

                {/* More options menu */}
                <div className="relative mr-8 md:mr-0">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-zinc-600 hover:text-black rounded-lg"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-44 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] p-1.5 z-30">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleShare();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-black hover:bg-[#EBE6FB] rounded-xl flex items-center gap-2"
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
                          className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2"
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
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {/* Caption */}
                <div className="p-3 rounded-2xl bg-zinc-50 border-2 border-black shadow-[2px_2px_0px_#000]">
                  <p className="text-black leading-relaxed">
                    <span className="font-bold mr-1.5">
                      {post.userId?.username}
                    </span>
                    {post.caption}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D5F94C] border border-black"
                        >
                          #{t.replace(/^#/, "")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  {loadingComments ? (
                    <p className="text-center text-xs text-zinc-500 py-3">
                      Loading comments...
                    </p>
                  ) : comments.length === 0 ? (
                    <p className="text-center text-xs text-zinc-500 py-3">
                      No comments yet.
                    </p>
                  ) : (
                    comments.map((comment) => {
                      const canDeleteComment =
                        currentUser &&
                        (currentUser._id === comment.userId?._id || isOwner);

                      return (
                        <div
                          key={comment._id}
                          className="flex items-start justify-between gap-2 p-2.5 rounded-xl border border-black/20 bg-white"
                        >
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

                          {canDeleteComment && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-zinc-400 hover:text-red-500 p-1"
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
              <div className="p-3.5 border-t-2 border-black bg-[#EBE6FB]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLike}
                      className="px-3 py-1 rounded-full border-2 border-black bg-white flex items-center gap-1.5 text-xs font-bold shadow-[2px_2px_0px_#000] active:scale-95"
                    >
                      <Heart
                        size={15}
                        className={
                          post.isLiked
                            ? "fill-[#FF6B4A] text-[#FF6B4A]"
                            : "text-black"
                        }
                      />
                      <span>{post.likesCount || 0}</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_#000] active:scale-95"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_#000] active:scale-95"
                  >
                    <Bookmark
                      size={14}
                      className={post.isSaved ? "fill-black text-black" : ""}
                    />
                  </button>
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white border-2 border-black rounded-2xl px-3.5 py-1.5 text-xs text-black placeholder:text-zinc-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submittingComment}
                    className="px-4 py-1.5 bg-[#FF6B4A] hover:bg-[#ff5a36] disabled:opacity-40 text-white rounded-2xl border-2 border-black text-xs font-bold transition shadow-[2px_2px_0px_#000]"
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border-2 border-black rounded-[28px] p-5 max-w-sm w-full space-y-4 shadow-[5px_5px_0px_#000]">
            <h3 className="text-base font-bold text-black">Delete Post?</h3>
            <p className="text-xs text-zinc-600">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border-2 border-black bg-white hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-500 text-white border-2 border-black hover:bg-red-600 disabled:opacity-50"
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
