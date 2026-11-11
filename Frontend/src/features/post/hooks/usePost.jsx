import {
  getFeed,
  toggleLike,
  toggleFollowApi,
  toggleSavePost,
  getSavedPosts,
  createPost,
  deletePostApi,
} from "../services/post.api";

import { useContext } from "react";
import { PostContext } from "../post.context";
import { toast } from "react-hot-toast";

export const usePost = () => {
  const context = useContext(PostContext);

  const {
    loading,
    setloading,
    post,
    setpost,
    feed,
    setfeed,
  } = context;

  // ==============================
  // Get Feed
  // ==============================
  const handleGetFeed = async () => {
    try {
      setloading(true);
      const data = await getFeed();
      setfeed(data.posts);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  // ==============================
  // Like / Unlike
  // ==============================
  const handleToggleLike = async (postId) => {
    try {
      const data = await toggleLike(postId);

      setfeed((prevFeed) =>
        prevFeed.map((post) => {
          if (post._id !== postId) return post;

          return {
            ...post,
            isLiked: data.liked,
            likesCount: data.liked
              ? (post.likesCount || 0) + 1
              : Math.max(0, (post.likesCount || 0) - 1),
          };
        })
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // ==============================
  // Save / Unsave
  // ==============================
  const handleToggleSave = async (postId) => {
    try {
      const data = await toggleSavePost(postId);

      setfeed((prevFeed) =>
        prevFeed.map((post) => {
          if (post._id !== postId) return post;

          return {
            ...post,
            isSaved: data.saved,
          };
        })
      );

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ==============================
  // Saved Posts
  // ==============================
  const handleGetSavedPosts = async () => {
    const data = await getSavedPosts();
    return data.map((savedPost) => savedPost.postId).filter(Boolean);
  };

  // ==============================
  // Create Post
  // ==============================
  const handleCreatePost = async (caption, image, tags = [], location = "") => {
    try {
      const data = await createPost(caption, image, tags, location);
      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create post"
      );
      throw error;
    }
  };

  // ==============================
  // Delete Post
  // ==============================
  const handleDeletePost = async (postId) => {
    try {
      const data = await deletePostApi(postId);
      setfeed((prevFeed) => prevFeed.filter((p) => p._id !== postId));
      toast.success(data.message || "Post deleted");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
      return false;
    }
  };

  // ==============================
  // Follow / Unfollow
  // ==============================
  const handleToggleFollow = async (followeeId) => {
    try {
      const data = await toggleFollowApi(followeeId);

      setfeed((prevFeed) =>
        prevFeed.map((post) => {
          if (post.userId?._id !== followeeId) return post;

          return {
            ...post,
            userId: {
              ...post.userId,
              isFollowing: data.isFollowing,
            },
          };
        })
      );

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  return {
    loading,
    post,
    feed,
    setfeed,
    handleGetFeed,
    handleToggleLike,
    handleToggleSave,
    handleGetSavedPosts,
    handleCreatePost,
    handleDeletePost,
    handleToggleFollow,
  };
};
