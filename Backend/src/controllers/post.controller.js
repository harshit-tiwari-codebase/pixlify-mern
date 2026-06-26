const PostModel = require("../models/post.models");
const likeModel = require("../models/like.model");
const followModel = require("../models/follow.models");
const saveModel = require("../models/save.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

/**
 * Initialize ImageKit
 */
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * @route POST /api/posts/create
 * @desc Create a new post with image upload
 * @access Private
 *
 * @body
 * FormData:
 * {
 *   "caption": "My first Pixlify post",
 *   "image": File
 * }
 *
 * @returns {Object} Created post details
 */
async function PostCreate(req, res) {
  try {
    /**
     * Validate caption
     */
    if (!req.body.caption) {
      return res.status(400).json({
        message: "Caption is required",
      });
    }

    /**
     * Validate image
     */
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    /**
     * Upload image to ImageKit
     */
    const uploadedFile = await imagekit.files.upload({
      file: await toFile(req.file.buffer, req.file.originalname),
      fileName: req.file.originalname,
      folder: "pixlifyPost",
    });

    /**
     * Create post in database
     */
    const post = await PostModel.create({
      caption: req.body.caption,
      postUrl: uploadedFile.url,
      userId: req.user.id,
    });

    /**
     * Success response
     */
    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    /**
     * Unexpected server error
     */
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route GET /api/posts/my-posts
 * @desc Get all posts created by the logged-in user
 * @access Private
 *
 * @returns {Array} User posts
 */
async function GetPost(req, res) {
  const user = req.user.id;

  let userPost = null;
  try {
    userPost = await PostModel.find({ userId: user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.status(200).json({
    message: "Posts fetched successfully",
    posts: userPost,
  });
}

/**
 * @route GET /api/posts/details/:postId
 * @desc Get a specific post by ID
 * @access Private
 *
 * @param {string} postId - MongoDB Post ID
 *
 * @returns {Object} Post details
 */
async function GetPostDets(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isAccessValid = post.userId.toString() === userId.toString();

    if (!isAccessValid) {
      return res.status(403).json({
        message: "Forbidden content",
      });
    }

    return res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

/**
 * @route POST /api/posts/toggle-like/:postId
 * @desc Like or unlike a post
 * @access Private
 *
 * @param {string} postId - MongoDB Post ID
 *
 * @returns {Object}
 * {
 *   success: true,
 *   liked: boolean,
 *   message: string
 * }
 */
async function toggleLike(req, res) {
  try {

    const { postId } = req.params;
    const userId = req.user.id;
    console.log(userId)
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    
    const existingLike = await likeModel.findOne({
      postId,
      userId,
    });

    if (existingLike) {
      await likeModel.findByIdAndDelete(existingLike._id);

      await PostModel.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 },
      });

      return res.status(200).json({
        success: true,
        liked: false,
        message: "Post unliked",
      });
    }

    await likeModel.create({
      postId,
      userId,
    });

    await PostModel.findByIdAndUpdate(postId, {
      $inc: { likesCount: 1 },
    });

    return res.status(200).json({
      success: true,
      liked: true,
      message: "Post liked",
    });
  } catch (error) {


  return res.status(500).json({
    success: false,
    message: error.message,
  });
}
}

/**
 * @route GET /api/posts/getfeed
 * @desc Get normal feed posts (excluding challenge posts)
 * @access Private
 */
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch only normal posts
    const dbPosts = await PostModel.find({
      isChallengePost: false,
    })
      .populate("userId")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Normal Feed Count:", dbPosts.length);
    console.log(
      dbPosts.map((post) => ({
        id: post._id,
        isChallengePost: post.isChallengePost,
        caption: post.caption,
      }))
    );

    const posts = await Promise.all(
      dbPosts.map(async (post) => {
        const [isLiked, isFollowing, isSaved] = await Promise.all([
          likeModel.findOne({
            postId: post._id,
            userId,
          }),
          followModel.findOne({
            follower: userId,
            followee: post.userId._id,
          }),
          saveModel.findOne({
            userId,
            postId: post._id,
          }),
        ]);

        return {
          ...post,
          userId: {
            ...post.userId,
            isFollowing: !!isFollowing,
          },
          isOwnPost: post.userId._id.toString() === userId.toString(),
          isLiked: !!isLiked,
          isSaved: !!isSaved,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * @route POST /api/posts/toggle-save/:postId
 * @desc Save or unsave a post
 * @access Private
 *
 * @param {string} postId - MongoDB Post ID
 *
 * @returns {Object}
 * {
 *   success: true,
 *   saved: boolean,
 *   message: string
 * }
 */
async function toggleSavePost (req , res){

  try {
    
    const postId = req.params.postId;
    const userId = req.user.id;

     const existingSave = await saveModel.findOne({
      userId,
      postId,
    }); 

    if(existingSave){
      await saveModel.findByIdAndDelete(existingSave._id);

      return res.status(200).json({
        success: true,
        saved: false,
        message: "Post unsaved successfully",
      });
    }

    const savedPost = await saveModel.create({
      userId : userId,
      postId : postId
    })

    res.status(200).json(
      {
        success: true,
        saved: true,
        message : "post saved successfully",
        savedPost
      }
    )
    
    










  } 
  
  
  catch (error) {
    return res.status(500).json({
      message : error.message
    })
  }

}

/**
 * @route GET /api/posts/saved
 * @desc Get all saved posts of the logged-in user
 * @access Private
 *
 * @returns {Array}
 * Saved posts with:
 * - post details
 * - post creator details
 */
async function getSavedPosts(req, res) {
  try {
    const savedPosts = await saveModel
      .find({ userId: req.user.id })
      .populate({
        path: "postId",
        populate: {
          path: "userId",
        },
      });

    res.status(200).json(savedPosts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


module.exports = {
  PostCreate,
  GetPost,
  GetPostDets,
  toggleLike,
  getFeed,
  toggleSavePost,
  getSavedPosts
};
