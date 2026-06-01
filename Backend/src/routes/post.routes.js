const express = require("express");

const postRouter = express.Router();

const post_controller = require("../controllers/post.controller");

const multer = require("multer");

const upload = multer({storage:multer.memoryStorage() });

const identifyUser = require("../middlewares/auth.middleware")



/**
 * Post api
 */

postRouter.post(
  "/", upload.single("image"),identifyUser,post_controller.PostCreate,
);

/**
 *GET  /api/posts/  [protected : means the token based]
 */
postRouter.get("/",identifyUser , post_controller.GetPost  );

/**
 * GET /api/posts/details/:postId
 */

postRouter.get("/details/:postId",identifyUser , post_controller.GetPostDets )

/**
 * POST /api/like/:postId
 */
postRouter.post("/like/:postId" , identifyUser , post_controller.likePost)

/**
 * POST /api/dislike/:postId
 */
postRouter.post("/dislike/:postId" , identifyUser , post_controller.dislikePost)

module.exports = postRouter;
