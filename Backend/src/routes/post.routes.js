const express = require("express");

const postRouter = express.Router();

const post_controller = require("../controllers/post.controller");

const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const identifyUser = require("../middlewares/auth.middleware");

/**
 * Post api
 */

postRouter.post(
  "/",
  identifyUser,
  upload.single("image"),
  post_controller.PostCreate
);

/**
 *GET  /api/posts/  [protected : means the token based]
 */
postRouter.get("/", identifyUser, post_controller.GetPost);

/**
 * GET /api/posts/details/:postId
 */

postRouter.get("/details/:postId", identifyUser, post_controller.GetPostDets);

/**
 * POST /api/toggle-like/:postId
 */
postRouter.post(
  "/toggle-like/:postId",
  identifyUser,
  post_controller.toggleLike,
);

/**
 * GET /api/posts/getFeed
 */
postRouter.get("/getfeed", identifyUser, post_controller.getFeed);



module.exports = postRouter;
