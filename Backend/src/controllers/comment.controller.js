const commentModel = require("../models/comments.models");

async function createComment(req , res) {
    const {postId} = req.params;
    const userId = req.user.id;
    const comment = req.body.comment;

    

    res.status(200).json({
        message : `comment created successfully by ${userId}`,
        comment,
        postId
    })
}

module.exports = {createComment}