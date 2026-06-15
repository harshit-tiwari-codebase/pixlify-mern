const commentModel = require("../models/comments.models");
const postModel = require("../models/post.models");

async function createComment(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;

    if (!comment?.trim()) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const newComment = await commentModel.create({
      postId,
      comment,
      userId,
    });

    const populatedComment = await commentModel
      .findById(newComment._id)
      .populate("userId", "username profile_img");

    return res.status(201).json({
      message: "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function getComments(req, res) {
  try {
    const { postId } = req.params;

    const response = await commentModel
      .find({ postId })
      .populate("userId", "username profile_img")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments: response,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = { createComment, getComments };
