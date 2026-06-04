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

async function toggleFollowController(req, res) {
  try {
    
    const followerId = req.user.id;

    const followeeId = req.params.id;

    // Searching for is Followee user exist in the database or not
    const user = await userModel.findById(followeeId);
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

    //to check the follower already following or not
    const existingFollow = await followModel.findOne({
      follower: followerId,
      followee: followeeId,
    });

    //unfollow logic
    if (existingFollow) {
      await followModel.findByIdAndDelete(existingFollow._id);

      return res.status(200).json({
        isFollowing: false,
        message: `You unfollowed ${user.username} successfully`,
      });
    }

    const follow = await followModel.create({
      follower: followerId,
      followee: followeeId,
    });

    return res.status(201).json({
      isFollowing: true,
      message: `You followed ${user.username} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getfollowersController(req, res) {
  const username = req.params.username;

  const followers = await followModel
    .find({ followee: username })
    .select("follower -_id");

  res.status(200).json({
    count: followers.length,
    followers,
  });
}

async function getFollowingController(req, res) {
  try {
    const username = req.params.username;

    const following = await followModel.find({
      follower: username,
    });

    return res.status(200).json({
      count: following.length,
      following,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getUserProfile(req, res) {
  const { username } = req.params;
}

module.exports = {
  toggleFollowController,
  getfollowersController,
  getFollowingController,
  getUserProfile,
};
