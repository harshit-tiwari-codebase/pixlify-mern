const PostModel = require("../models/post.models");
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
     * Get authentication token from cookies
     */
    const token = req.cookies["login-cookie"];

    /**
     * Check if token exists
     */
    if (!token) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    /**
     * Verify JWT token
     */
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

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
      file: await toFile(
        req.file.buffer,
        req.file.originalname
      ),
      fileName: req.file.originalname,
      folder: "pixlifyPost",
    });

    /**
     * Create post in database
     */
    const post = await PostModel.create({
      caption: req.body.caption,
      postUrl: uploadedFile.url,
      userId: decoded.id,
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

module.exports = {
  PostCreate,
};