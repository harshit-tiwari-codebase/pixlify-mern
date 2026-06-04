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
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const followers = await followModel
      .find({ followee: id })
      .populate("follower", "username profile_img");

    const formattedFollowers = followers.map(
      (item) => item.follower
    );

    return res.status(200).json({
      count: formattedFollowers.length,
      followers: formattedFollowers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getFollowingController(req, res) {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const following = await followModel
      .find({ follower: id })
      .populate("followee", "username profile_img");

    const formattedFollowing = following.map(
      (item) => item.followee
    );

    return res.status(200).json({
      count: formattedFollowing.length,
      following: formattedFollowing,
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
