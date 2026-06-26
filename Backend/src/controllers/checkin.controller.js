const ChallengeModel = require("../models/createChallange.models");
const ChallengeProgressModel = require("../models/challangeProgress.models");
const PostModel = require("../models/post.models");
const imagekit = require("../config/ImageKit");

const checkIn = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { caption } = req.body;
    const userId = req.user.id;

    // Image validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    // Caption validation
    if (!caption) {
      return res.status(400).json({
        success: false,
        message: "Caption is required.",
      });
    }

    // Find challenge
    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Owner validation
    if (challenge.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Challenge status
    if (challenge.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Challenge is not active.",
      });
    }

    // ===============================
    // Calculate Current Day
    // ===============================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);

    const diff = today.getTime() - startDate.getTime();

    const currentDay = Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );

    console.log("Today:", today);
    console.log("Start Date:", startDate);
    console.log("Current Day:", currentDay);

    // Day 0 = Challenge creation day
    if (currentDay <= 0) {
      return res.status(400).json({
        success: false,
        message: "Challenge has not started yet.",
      });
    }

    // Challenge completed
    if (currentDay > challenge.duration) {
      return res.status(400).json({
        success: false,
        message: "Challenge has already ended.",
      });
    }

    // Already checked in today?
    const existingCheckIn = await ChallengeProgressModel.findOne({
      challengeId,
      userId,
      dayNumber: currentDay,
    });

    if (existingCheckIn) {
      return res.status(400).json({
        success: false,
        message: "You already checked in today.",
      });
    }

    // Upload image
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "pixlifyPost",
    });

    // Create Post
    const post = await PostModel.create({
      caption,
      postUrl: uploadedImage.url,
      userId,
      isChallengePost: true,
      challengeId,
      dayNumber: currentDay,
    });

    // Create Progress
    await ChallengeProgressModel.create({
      challengeId,
      userId,
      dayNumber: currentDay,
      completed: true,
      date: new Date(),
      postId: post._id,
    });

    return res.status(201).json({
      success: true,
      message: "Check-in successful.",
      post,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
/**
 * @route GET /api/challenge/:challengeId/progress
 * @desc Get challenge progress
 * @access Private
 */

const getChallengeProgress = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    // Find challenge
    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Owner validation
    if (challenge.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Current day
    let currentDay = Math.floor(
      (today.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Prevent negative values
    if (currentDay < 0) {
      currentDay = 0;
    }

    // Don't exceed challenge duration
    if (currentDay > challenge.duration) {
      currentDay = challenge.duration;
    }

    // Count completed days
    const completedDays = await ChallengeProgressModel.countDocuments({
      challengeId,
      userId,
      completed: true,
    });

    const remainingDays = challenge.duration - completedDays;

    const progress =
      challenge.duration === 0
        ? 0
        : Number(
            ((completedDays / challenge.duration) * 100).toFixed(2)
          );

    return res.status(200).json({
      success: true,
      progress: {
        challengeId: challenge._id,
        category: challenge.category,
        description: challenge.description,
        status: challenge.status,

        duration: challenge.duration,
        currentDay,
        completedDays,
        remainingDays,
        progress,

        startDate: challenge.startDate,
        endDate: challenge.endDate,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @route GET /api/challenge/:challengeId/checkins
 * @desc Get all check-ins for a challenge
 * @access Private
 */

const getChallengeCheckIns = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    // Find challenge
    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Owner validation
    if (challenge.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Get all challenge posts
    const checkIns = await PostModel.find({
      challengeId,
      isChallengePost: true,
    })
      .select("caption postUrl dayNumber createdAt likesCount")
      .sort({ dayNumber: 1 });

    return res.status(200).json({
      success: true,
      totalCheckIns: checkIns.length,
      checkIns,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @route GET /api/challenge/:challengeId/heatmap
 * @desc Get challenge heatmap data
 * @access Private
 */

const getChallengeHeatmap = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    // Find challenge
    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Owner validation
    if (challenge.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Fetch completed days
    const completedDays = await ChallengeProgressModel.find({
      challengeId,
      userId,
      completed: true,
    }).select("dayNumber date");

    // Convert to map for O(1) lookup
    const completedMap = new Map();

    completedDays.forEach((item) => {
      completedMap.set(item.dayNumber, item.date);
    });

    // Build heatmap
    const heatmap = [];

    for (let day = 1; day <= challenge.duration; day++) {
      const currentDate = new Date(challenge.startDate);
      currentDate.setDate(currentDate.getDate() + day);

      heatmap.push({
        day,
        date: currentDate,
        completed: completedMap.has(day),
      });
    }

    return res.status(200).json({
      success: true,
      challengeId,
      duration: challenge.duration,
      heatmap,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


/**
 * @route GET /api/challenge/dashboard
 * @desc Get challenge dashboard
 * @access Private
 */

const getChallengeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const challenges = await ChallengeModel.find({
      createdBy: userId,
    });

    const activeChallenges = challenges.filter(
      (challenge) => challenge.status === "active"
    ).length;

    const completedChallenges = challenges.filter(
      (challenge) => challenge.status === "completed"
    ).length;

    const cancelledChallenges = challenges.filter(
      (challenge) => challenge.status === "cancelled"
    ).length;

    const totalChallenges = challenges.length;

    const totalCheckIns = await ChallengeProgressModel.countDocuments({
      userId,
      completed: true,
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        totalChallenges,
        activeChallenges,
        completedChallenges,
        cancelledChallenges,
        totalCheckIns,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


/**
 * @route GET /api/challenge/feed
 * @desc Get challenge feed
 * @access Private
 */
const getChallengeFeed = async (req, res) => {
  try {
    const posts = await PostModel.find({
      isChallengePost: true,
    })
      .populate("userId", "username profile_img")
      .populate("challengeId", "category duration")
      .sort({ createdAt: -1 })
      .lean();

    const feed = posts.map((post) => ({
      ...post,

      progress: Number(
        (
          (post.dayNumber / post.challengeId.duration) *
          100
        ).toFixed(2)
      ),
    }));

    return res.status(200).json({
      success: true,
      totalPosts: feed.length,
      posts: feed,
    });
  } catch (error) {
    console.error("Challenge Feed Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
module.exports = {
  checkIn,
  getChallengeProgress,
  getChallengeCheckIns,
  getChallengeHeatmap,
  getChallengeDashboard,
  getChallengeFeed
};