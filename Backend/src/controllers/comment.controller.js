const commentModel = require("../models/comments.models");
const postModel = require("../models/post.models");

/**
 * @route POST /api/comment/create/:postId
 * @desc Create a comment on a post
 * @access Private
 */
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

/**
 * @route GET /api/comment/get-comments/:postId
 * @desc Get all comments of a specific post
 * @access Private
 */
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

/**
 * @route DELETE /api/comment/:commentId
 * @desc Delete a comment
 * @access Private
 */
async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const post = await postModel.findById(comment.postId);
    const isCommentOwner = comment.userId.toString() === userId.toString();
    const isPostOwner = post && post.userId.toString() === userId.toString();

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    await commentModel.findByIdAndDelete(commentId);

    return res.status(200).json({
      message: "Comment deleted successfully",
      commentId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createComment,
  getComments,
  deleteComment,
};
