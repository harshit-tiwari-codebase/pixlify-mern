const { default: mongoose } = require("mongoose");
const followModel = require("../models/follow.models");
const PostModel = require("../models/post.models");
const userModel = require("../models/user.models");

/**
 * 
const followSchema = mongoose.Schema({
  followers: {
    types: mongoose.Schema.Types.ObjectId,
    ref: "pixlify-user",
    required : [true , "Follower is required"]
  },
  followee: {
    types: mongoose.Schema.Types.ObjectId,
    ref: "pixlify-user",
     required : [true , "Followee is required"]
  },
} , {timestamps : true } );

 */

async function followUSerController(req, res) {
  try {
    const followerId = req.user.username;

    const followeeId = req.params.username;

    const user = await userModel.findOne({ username: followeeId });

    if (!user) {
      return res.status(404).json({
        message: "followee is not found",
      });
    }

    if (followerId === followeeId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const isAlreadyFollowing = await followModel.findOne({
      follower: followerId,
      followee: followeeId,
    });

    if (isAlreadyFollowing) {
      return res.status(409).json({
        message: `You already following ${followeeId}`,
      });
    }

    const follow = await followModel.create({
      follower: followerId,
      followee: followeeId,
    });

    res.status(200).json({
      message: `You follwed  ${followeeId} successfully`,
      follow: follow,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function unfollowUserController(req, res) {
  const followerId = req.user.username;

  const followeeId = req.params.username;

  const isUserFollowing = await followModel.findOne({
    follower: followerId,
    followee: followeeId,
  });
  
  if(!isUserFollowing){
    return res.status(404).json({
        message: `You are not following ${followeeId}`
    })
  }

    await followModel.findByIdAndDelete(isUserFollowing._id);

    res.status(200).json({
        message: `You unfollowed ${followeeId}`
    })

}

module.exports = {
  followUSerController,
  unfollowUserController
};
