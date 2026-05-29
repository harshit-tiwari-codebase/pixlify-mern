const express = require("express");

const postRouter = express.Router();

const post_controller = require("../controllers/post.controller");

const multer = require("multer");

const upload = multer({storage:multer.memoryStorage() });





/**
 * Post api
 */

postRouter.post(
  "/", upload.single("image"),post_controller.PostCreate,
);

/**
 *GET  /api/posts/  [protected : means the token based]
 */
postRouter.get("/" , post_controller.GetPost  );

/**
 * GET /api/posts/details/:postId
 */

postRouter.get("/details/:postId" , post_controller.GetPostDets )


module.exports = postRouter;
