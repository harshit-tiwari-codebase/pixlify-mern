const express = require("express");

const postRouter = express.Router();

const post_controller = require("../controllers/post.controller");

const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const identifyUser = require("../middlewares/auth.middleware");

postRouter.post(
  "/",
  identifyUser,
  upload.single("image"),
  post_controller.PostCreate
);

postRouter.get("/", identifyUser, post_controller.GetPost);

postRouter.get(
  "/details/:postId",
  identifyUser,
  post_controller.GetPostDets
);

postRouter.post(
  "/toggle-like/:postId",
  identifyUser,
  post_controller.toggleLike
);

postRouter.get(
  "/getfeed",
  identifyUser,
  post_controller.getFeed
);

postRouter.post(
  "/save/:postId",
  identifyUser,
  post_controller.toggleSavePost
);

postRouter.get(
  "/getSaved",
  identifyUser,
  post_controller.getSavedPosts
);

postRouter.delete(
  "/:postId",
  identifyUser,
  post_controller.deletePost
);

module.exports = postRouter;
