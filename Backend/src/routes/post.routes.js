const express = require("express");

const postRouter = express.Router();

const post_controller = require("../controllers/post.controller");

const multer = require("multer");

const upload = multer({storage:multer.memoryStorage() });





/**
 * Post api
 */

postRouter.post(
  "/", 

  upload.single("image"),

  post_controller.PostCreate,
);

module.exports = postRouter;
