const crypto = require("crypto");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const PostModel = require("../models/post.models");
const followModel = require("../models/follow.models");

const AUTH_COOKIE_NAME = "auth-token";

/**
 * http://localhost:3000/api/auth/register
 */
const registerController = async (req, res) => {
  try {
    const { username, email, password, bio, profile_img } = req.body;

    const isUserExist = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserExist) {
      return res.status(409).json({
        message:
          isUserExist.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    const hash = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userModel.create({
      username,
      email,
      password: hash,
      bio,
      profile_img,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      message: "user registered successfully ",
      user: {
        user: user.username,
        email: user.email,
        bio: user.bio,
        profile: user.profile_img,
        posts: [],
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * http://localhost:3000/api/auth/login
 */
const loginController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isUserExist = await userModel
      .findOne({ $or: [{ email: email }, { username: username }] })
      .select("+password");

    if (!isUserExist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordMatch =
      isUserExist.password ===
      crypto.createHash("sha256").update(password).digest("hex");

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "incorrect password" });
    }

    const token = jwt.sign(
      {
        id: isUserExist._id,
        username: isUserExist.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user: isUserExist.username,
        email: isUserExist.email,
        bio: isUserExist.bio,
        profile: isUserExist.profile_img,
        posts: [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getMeController = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const posts = await PostModel.find({ userId }).select(
      "caption postUrl likesCount createdAt",
    );

    // Followers
    const followers = await followModel
      .find({ followee: userId })
      .populate("follower", "username profile_img");

    // Following
    const following = await followModel
      .find({ follower: userId })
      .populate("followee", "username profile_img");

    const followersList = followers.map((item) => ({
      _id: item.follower._id,
      username: item.follower.username,
      profile_img: item.follower.profile_img,
      isFollowing: true,
    }));

    const followingList = following.map((item) => ({
      _id: item.followee._id,
      username: item.followee.username,
      profile_img: item.followee.profile_img,
      isFollowing: true,
    }));

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile_img: user.profile_img,
      },

      followersCount: followersList.length,
      followingCount: followingList.length,

      followers: followersList,
      following: followingList,

      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = { registerController, loginController, getMeController };
