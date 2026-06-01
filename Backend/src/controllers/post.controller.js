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

async function likePost(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    /**
     * Validate Post
     */
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    /**
     * Check if already liked
     */
    const existingLike = await likeModel.findOne({
      postId,
      userId,
    });

    if (existingLike) {
      return res.status(409).json({
        success: false,
        message: "Post already liked",
      });
    }

    /**
     * Create Like
     */
    const like = await likeModel.create({
      postId,
      userId,
    });
    await PostModel.findByIdAndUpdate(postId, {
      $inc: {
        likesCount: 1,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Post liked successfully",
      data: like,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function dislikePost(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const deletedLike = await likeModel.findOneAndDelete({
      postId,
      userId,
    });

    if (!deletedLike) {
      return res.status(404).json({
        success: false,
        message: "You have not liked this post",
      });
    }

    await PostModel.findByIdAndUpdate(postId, {
      $inc: {
        likesCount: -1,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  PostCreate,
  GetPost,
  GetPostDets,
  likePost,
  dislikePost,
};
