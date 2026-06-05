const express = require("express");

const postRouter = express.Router();

const post_controller = require("../controllers/post.controller");

const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const identifyUser = require("../middlewares/auth.middleware");

/**
 * -----------------------------------------------------
 * POSTS ROUTES
 * Base URL: /api/posts
 * Authentication: Required (JWT Token)
 * -----------------------------------------------------
 */

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private
 *
 * Body (multipart/form-data):
 * - image   : File (required)
 * - caption : String (optional)
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
postRouter.post(
  "/",
  identifyUser,
  upload.single("image"),
  post_controller.PostCreate
);

/**
 * @route   GET /api/posts
 * @desc    Get all posts
 * @access  Private
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
postRouter.get("/", identifyUser, post_controller.GetPost);

/**
 * @route   GET /api/posts/details/:postId
 * @desc    Get details of a single post
 * @access  Private
 *
 * Params:
 * - postId : MongoDB Post ID
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
postRouter.get(
  "/details/:postId",
  identifyUser,
  post_controller.GetPostDets
);

/**
 * @route   POST /api/posts/toggle-like/:postId
 * @desc    Like or Unlike a post
 * @access  Private
 *
 * Params:
 * - postId : MongoDB Post ID
 *
 * Behavior:
 * - If post is not liked -> creates like
 * - If post is already liked -> removes like
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
postRouter.post(
  "/toggle-like/:postId",
  identifyUser,
  post_controller.toggleLike
);

/**
 * @route   GET /api/posts/getfeed
 * @desc    Get personalized feed posts
 * @access  Private
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
postRouter.get(
  "/getfeed",
  identifyUser,
  post_controller.getFeed
);

/**
 * @route   POST /api/posts/save/:postId
 * @desc    Save or Unsave a post
 * @access  Private
 *
 * Params:
 * - postId : MongoDB Post ID
 *
 * Behavior:
 * - If post is not saved -> saves post
 * - If post is already saved -> unsaves post
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
postRouter.post(
  "/save/:postId",
  identifyUser,
  post_controller.toggleSavePost
);


/**
 * @route   GET /api/posts/getSaved
 * @desc    Get all saved posts of the logged-in user
 * @access  Private
 *
 * Authentication:
 * - User is identified through JWT token
 *
 * Behavior:
 * - Fetches all posts saved by the authenticated user
 * - Returns saved post details along with populated post information
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
postRouter.get(
  "/getSaved",
  identifyUser,
  post_controller.getSavedPosts
);


module.exports = postRouter;