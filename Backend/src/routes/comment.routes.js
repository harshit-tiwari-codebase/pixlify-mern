const express = require("express");

const commentRouter = express.Router();

const identifyUser = require("../middlewares/auth.middleware");

const commentController = require("../controllers/comment.controller");


commentRouter.post("/create/:postId" , identifyUser , commentController.createComment);
commentRouter.get("/get-comments/:postId" , identifyUser , commentController.getComments);

module.exports = commentRouter;

