/**
 * ============================================
 * Pixlify User Controller
 * ============================================
 * Handles:
 * - Follow / Unfollow Users
 * - Followers List
 * - Following List
 * - User Profiles
 * - Profile Editing
 * - Profile Image Uploads
 * - User Search
 *
 * Author: Harshit Tiwari
 * Project: Pixlify
 * ============================================
 */

const { default: mongoose } = require("mongoose");
const followModel = require("../models/follow.models");
const PostModel = require("../models/post.models");
const userModel = require("../models/user.models");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * @route POST /api/user/toggle-follow/:id
 * @desc Follow or unfollow a user
 * @access Private
 */
async function toggleFollowController(req, res) {
  try {
    const followerId = req.user.id;
    const followeeId = req.params.id;

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

    const existingFollow = await followModel.findOne({
      follower: followerId,
      followee: followeeId,
    });

    if (existingFollow) {
      await followModel.findByIdAndDelete(existingFollow._id);

      return res.status(200).json({
        isFollowing: false,
        message: `You unfollowed ${user.username} successfully`,
      });
    }

    await followModel.create({
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

/**
 * @route GET /api/user/getfollowing/:id
 * @desc Get all users followed by a specific user
 * @access Private
 */
async function getFollowingController(req, res) {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user.id;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const following = await followModel
      .find({ follower: id })
      .populate("followee", "username profile_img");

    const formattedFollowing = await Promise.all(
      following.map(async (item) => {
        if (!item.followee) return null;
        const isFollowing = await followModel.exists({
          follower: loggedInUserId,
          followee: item.followee._id,
        });

        return {
          _id: item.followee._id,
          username: item.followee.username,
          profile_img: item.followee.profile_img,
          isFollowing: !!isFollowing,
        };
      })
    );

    const validFollowing = formattedFollowing.filter(Boolean);

    return res.status(200).json({
      count: validFollowing.length,
      following: validFollowing,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route GET /api/user/getfollowers/:id
 * @desc Get all followers of a specific user
 * @access Private
 */
async function getFollowersController(req, res) {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user.id;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const followers = await followModel
      .find({ followee: id })
      .populate("follower", "username profile_img");

    const formattedFollowers = await Promise.all(
      followers.map(async (item) => {
        if (!item.follower) return null;
        const isFollowing = await followModel.exists({
          follower: loggedInUserId,
          followee: item.follower._id,
        });

        return {
          _id: item.follower._id,
          username: item.follower.username,
          profile_img: item.follower.profile_img,
          isFollowing: !!isFollowing,
        };
      })
    );

    const validFollowers = formattedFollowers.filter(Boolean);

    return res.status(200).json({
      count: validFollowers.length,
      followers: validFollowers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route GET /api/user/search
 * @desc Search users by query
 * @access Private
 */
async function searchUsersController(req, res) {
  try {
    const { q } = req.query;
    const loggedInUserId = req.user?.id;

    if (!q || !q.trim()) {
      return res.status(200).json({ users: [] });
    }

    const queryRegex = new RegExp(q.trim(), "i");
    const users = await userModel
      .find({ username: queryRegex })
      .select("username bio profile_img")
      .limit(15);

    const formattedUsers = await Promise.all(
      users.map(async (u) => {
        let isFollowing = false;
        if (loggedInUserId && loggedInUserId.toString() !== u._id.toString()) {
          const exists = await followModel.exists({
            follower: loggedInUserId,
            followee: u._id,
          });
          isFollowing = !!exists;
        }

        return {
          _id: u._id,
          username: u.username,
          bio: u.bio,
          profile_img: u.profile_img,
          isFollowing,
          isSelf: loggedInUserId ? loggedInUserId.toString() === u._id.toString() : false,
        };
      })
    );

    return res.status(200).json({ users: formattedUsers });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route GET /api/user/profile/:username
 * @desc Get public profile information by username
 * @access Private
 */
async function getUserProfile(req, res) {
  try {
    const { username } = req.params;
    const loggedInUserId = req.user?.id;

    const user = await userModel.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const posts = await PostModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select("caption postUrl likesCount createdAt");

    const followersCount = await followModel.countDocuments({ followee: user._id });
    const followingCount = await followModel.countDocuments({ follower: user._id });

    let isFollowing = false;
    if (loggedInUserId && loggedInUserId.toString() !== user._id.toString()) {
      const exists = await followModel.exists({
        follower: loggedInUserId,
        followee: user._id,
      });
      isFollowing = !!exists;
    }

    const isOwnProfile = loggedInUserId ? loggedInUserId.toString() === user._id.toString() : false;

    return res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        bio: user.bio,
        profile_img: user.profile_img,
      },
      followersCount,
      followingCount,
      isFollowing,
      isOwnProfile,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route PUT /api/user/edit-profile
 * @desc Update logged-in user's profile
 * @access Private
 */
async function editProfile(req, res) {
  try {
    const userId = req.user.id;
    const { bio, username, email, password, profile_img } = req.body;

    const currentUser = await userModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (username !== undefined || email !== undefined || password !== undefined) {
      return res.status(400).json({
        message: "You can only edit bio and profile image",
      });
    }

    const updates = {};
    if (bio !== undefined) {
      updates.bio = bio;
    }

    if (req.file) {
      const uploadedFile = await imagekit.files.upload({
        file: await toFile(req.file.buffer, req.file.originalname),
        fileName: req.file.originalname,
        folder: "pixlifyProfile",
      });

      updates.profile_img = uploadedFile.url;
    } else if (profile_img !== undefined) {
      updates.profile_img = profile_img;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Please provide bio or profile image to update",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        user: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profile: updatedUser.profile_img,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  toggleFollowController,
  getFollowersController,
  getFollowingController,
  searchUsersController,
  getUserProfile,
  editProfile,
};
