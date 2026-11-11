const PostModel = require("../models/post.models");
const likeModel = require("../models/like.model");
const followModel = require("../models/follow.models");
const saveModel = require("../models/save.model");
const commentModel = require("../models/comments.models");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

/**
 * Initialize ImageKit
 */
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * @route POST /api/posts/create
 * @desc Create a new post with image upload
 * @access Private
 */
async function PostCreate(req, res) {
  try {
    if (!req.body.caption) {
      return res.status(400).json({
        message: "Caption is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const uploadedFile = await imagekit.files.upload({
      file: await toFile(req.file.buffer, req.file.originalname),
      fileName: req.file.originalname,
      folder: "pixlifyPost",
    });

    const post = await PostModel.create({
      caption: req.body.caption,
      postUrl: uploadedFile.url,
      userId: req.user.id,
      location: req.body.location || "",
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route GET /api/posts/my-posts
 * @desc Get all posts created by the logged-in user
 * @access Private
 */
async function GetPost(req, res) {
  const user = req.user.id;

  try {
    const userPost = await PostModel.find({ userId: user }).sort({ createdAt: -1 });
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: userPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route GET /api/posts/details/:postId
 * @desc Get a specific post by ID with populated user & interactions
 * @access Private
 */
async function GetPostDets(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await PostModel.findById(postId).populate("userId", "username profile_img bio");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const [isLiked, isSaved, isFollowing] = await Promise.all([
      likeModel.findOne({ postId, userId }),
      saveModel.findOne({ postId, userId }),
      followModel.findOne({ follower: userId, followee: post.userId._id }),
    ]);

    const postData = {
      ...post.toObject(),
      userId: {
        ...post.userId.toObject(),
        isFollowing: !!isFollowing,
      },
      isOwnPost: post.userId._id.toString() === userId.toString(),
      isLiked: !!isLiked,
      isSaved: !!isSaved,
    };

    return res.status(200).json({
      message: "Post fetched successfully",
      post: postData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route POST /api/posts/toggle-like/:postId
 * @desc Like or unlike a post
 * @access Private
 */
async function toggleLike(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const existingLike = await likeModel.findOne({
      postId,
      userId,
    });

    if (existingLike) {
      await likeModel.findByIdAndDelete(existingLike._id);

      await PostModel.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 },
      });

      return res.status(200).json({
        success: true,
        liked: false,
        message: "Post unliked",
      });
    }

    await likeModel.create({
      postId,
      userId,
    });

    await PostModel.findByIdAndUpdate(postId, {
      $inc: { likesCount: 1 },
    });

    return res.status(200).json({
      success: true,
      liked: true,
      message: "Post liked",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * @route GET /api/posts/getfeed
 * @desc Get normal feed posts (excluding challenge posts)
 * @access Private
 */
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    const dbPosts = await PostModel.find({
      isChallengePost: false,
    })
      .populate("userId")
      .sort({ createdAt: -1 })
      .lean();

    const posts = await Promise.all(
      dbPosts.map(async (post) => {
        if (!post.userId) return null;

        const [isLiked, isFollowing, isSaved] = await Promise.all([
          likeModel.findOne({
            postId: post._id,
            userId,
          }),
          followModel.findOne({
            follower: userId,
            followee: post.userId._id,
          }),
          saveModel.findOne({
            userId,
            postId: post._id,
          }),
        ]);

        return {
          ...post,
          userId: {
            ...post.userId,
            isFollowing: !!isFollowing,
          },
          isOwnPost: post.userId._id.toString() === userId.toString(),
          isLiked: !!isLiked,
          isSaved: !!isSaved,
        };
      })
    );

    const validPosts = posts.filter(Boolean);

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: validPosts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route POST /api/posts/save/:postId
 * @desc Save or unsave a post
 * @access Private
 */
async function toggleSavePost(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const existingSave = await saveModel.findOne({
      userId,
      postId,
    });

    if (existingSave) {
      await saveModel.findByIdAndDelete(existingSave._id);

      return res.status(200).json({
        success: true,
        saved: false,
        message: "Post unsaved successfully",
      });
    }

    const savedPost = await saveModel.create({
      userId,
      postId,
    });

    res.status(200).json({
      success: true,
      saved: true,
      message: "Post saved successfully",
      savedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route GET /api/posts/getSaved
 * @desc Get all saved posts of the logged-in user
 * @access Private
 */
async function getSavedPosts(req, res) {
  try {
    const savedPosts = await saveModel
      .find({ userId: req.user.id })
      .populate({
        path: "postId",
        populate: {
          path: "userId",
        },
      });

    res.status(200).json(savedPosts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route DELETE /api/posts/:postId
 * @desc Delete a post owned by the logged-in user
 * @access Private
 */
async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    await PostModel.findByIdAndDelete(postId);
    await likeModel.deleteMany({ postId });
    await saveModel.deleteMany({ postId });
    await commentModel.deleteMany({ postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      postId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  PostCreate,
  GetPost,
  GetPostDets,
  toggleLike,
  getFeed,
  toggleSavePost,
  getSavedPosts,
  deletePost,
};
