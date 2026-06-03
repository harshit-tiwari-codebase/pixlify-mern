import { getFeed, toggleLike } from "../services/post.api";
import { useContext } from "react";
import { PostContext } from "../post.context";
import { createPost } from "../services/post.api";
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

  async function handleCreatePost(caption, image) {
  try {
    const data = await createPost(caption, image);

    toast.success(data.message);

    return data;


  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to create post"
    );
  }
}

  return {
    loading,
    post,
    feed,
    handleGetFeed,
    handleToggleLike,
    handleCreatePost
  };
};