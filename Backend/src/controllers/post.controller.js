const PostModel = require("../models/post.models");
const likeModel = require("../models/like.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

/**
 * Initialize ImageKit
 */
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * Create a new post
 */
async function PostCreate(req, res) {
  try {
    /**
     * Validate caption
     */
    if (!req.body.caption) {
      return res.status(400).json({
        message: "Caption is required",
      });
    }

    /**
     * Validate image
     */
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    /**
     * Upload image to ImageKit
     */
    const uploadedFile = await imagekit.files.upload({
      file: await toFile(req.file.buffer, req.file.originalname),
      fileName: req.file.originalname,
      folder: "pixlifyPost",
    });

    /**
     * Create post in database
     */
    const post = await PostModel.create({
      caption: req.body.caption,
      postUrl: uploadedFile.url,
      userId: req.user.id,
    });

    /**
     * Success response
     */
    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    /**
     * Unexpected server error
     */
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function GetPost(req, res) {
  const user = req.user.id;

  let userPost = null;
  try {
    userPost = await PostModel.find({ userId: user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.status(200).json({
    message: "Posts fetched successfully",
    posts: userPost,
  });
}

async function GetPostDets(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isAccessValid = post.userId.toString() === userId.toString();

    if (!isAccessValid) {
      return res.status(403).json({
        message: "Forbidden content",
      });
    }

    return res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
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
async function getFeed(req, res) {
  try {
    const userId = req.user.id;

    const posts = await Promise.all(
      (await PostModel.find().populate("userId").lean()).map(async (post) => {
        const isLiked = await likeModel.findOne({
          postId: post._id,
          userId,
        });

        return {
          ...post,
          isLiked: !!isLiked,
        };
      }),
    );

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
module.exports = {
  PostCreate,
  GetPost,
  GetPostDets,
  toggleLike,
  getFeed,
};
