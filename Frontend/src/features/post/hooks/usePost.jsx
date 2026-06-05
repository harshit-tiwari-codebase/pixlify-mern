import { getFeed, toggleLike , toggleFollowApi, toggleSavePost, getSavedPosts } from "../services/post.api";
import { useContext } from "react";
import { PostContext } from "../post.context";
import { createPost } from "../services/post.api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../auth/hooks/useAuth";


export const usePost = () => {
  const context = useContext(PostContext);
  const { handleGetMe } = useAuth();

  const {
    loading,
    setloading,
    post,
    setpost,
    feed,
    setfeed,
  } = context;

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

  const handleGetSavedPosts = async () => {
    const data = await getSavedPosts();
    return data.map((savedPost) => savedPost.postId).filter(Boolean);
  };

  async function handleCreatePost(caption, image) {
  try {
    const data = await createPost(caption, image);

    toast.success(data.message);
    await handleGetMe();

    return data;


  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to create post"
    );
  }
}

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
    await handleGetMe();

  } catch (error) {
  console.log(error);
  console.log(error.response?.data);

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
    handleToggleFollow
  };
};
