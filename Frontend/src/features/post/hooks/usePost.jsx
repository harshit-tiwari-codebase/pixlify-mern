import {
  getFeed,
  toggleLike,
  toggleFollowApi,
  toggleSavePost,
  getSavedPosts,
  createPost,
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
              ? post.likesCount + 1
              : post.likesCount - 1,
          };
        })
      );
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
  const handleCreatePost = async (caption, image) => {
    try {
      const data = await createPost(caption, image);

      toast.success(data.message);

      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create post"
      );
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
          if (post.userId._id !== followeeId) return post;

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
    handleGetFeed,
    handleToggleLike,
    handleToggleSave,
    handleGetSavedPosts,
    handleCreatePost,
    handleToggleFollow,
  };
};