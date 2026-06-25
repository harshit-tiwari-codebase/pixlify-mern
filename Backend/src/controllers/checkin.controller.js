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

    // Calculate current day
    const today = new Date();

    const currentDay = Math.floor(
      (today - challenge.startDate) /
        (1000 * 60 * 60 * 24)
    );

    if (currentDay <= 0) {
      return res.status(400).json({
        success: false,
        message: "Challenge has not started yet.",
      });
    }

    // Already checked in?
    const existingCheckIn =
      await ChallengeProgressModel.findOne({
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
    const uploadedImage =
      await imagekit.upload({
        file: req.file.buffer,
        fileName: Date.now() + ".jpg",
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
      date: today,
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

module.exports = checkIn