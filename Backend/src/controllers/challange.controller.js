const ChallengeModel = require("../models/createChallange.models");
const ChallengeProgressModel = require("../models/challangeProgress.models")

/**
 * @route POST /api/challenge/create
 * @desc Create a new personal challenge
 * @access Private
 */

const createChallenge = async (req, res) => {
  try {
    const {
      category,
      customCategory,
      description,
      duration,
      visibility,
    } = req.body;

    // Validate required fields
    if (!category || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: "Category, description and duration are required.",
      });
    }

    // If category is custom, customCategory is required
    if (category === "custom" && !customCategory) {
      return res.status(400).json({
        success: false,
        message: "Custom category name is required.",
      });
    }

    // Duplicate check
    const query = {
      createdBy: req.user.id,
      status: "active",
    };

    if (category === "custom") {
      query.category = "custom";
      query.customCategory = customCategory.toLowerCase().trim();
    } else {
      query.category = category;
    }

    const existingChallenge = await ChallengeModel.findOne(query);

    if (existingChallenge) {
      return res.status(400).json({
        success: false,
        message: "You already have an active challenge in this category.",
      });
    }

    // Dates
    const startDate = new Date();

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Number(duration));

    // Create challenge
    const challenge = await ChallengeModel.create({
      category,
      customCategory:
        category === "custom"
          ? customCategory.toLowerCase().trim()
          : "",
      description,
      duration,
      startDate,
      endDate,
      visibility: visibility || "public",
      createdBy: req.user.id,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Challenge created successfully.",
      challenge,
    });
  } catch (error) {
    console.error("Create Challenge Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @route GET /api/challenge/my
 * @desc Get all challenges created by the logged-in user
 * @access Private
 */
const getMyChallenges = async (req, res) => {
  try {
    const userId = req.user.id;

    const challenges = await ChallengeModel.find({
      createdBy: userId,
    }).sort({ createdAt: -1 });

    const today = new Date();

    const formattedChallenges = challenges.map((challenge) => {
      const currentDay = Math.max(
        0,
        Math.floor(
          (today - challenge.startDate) / (1000 * 60 * 60 * 24)
        )
      );

      const progress = Math.min(
        100,
        Math.floor((currentDay / challenge.duration) * 100)
      );

      return {
        ...challenge.toObject(),
        currentDay,
        progress,
      };
    });

    return res.status(200).json({
      success: true,
      totalChallenges: formattedChallenges.length,
      challenges: formattedChallenges,
    });
  } catch (error) {
    console.error("Get My Challenges Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


/**
 * @route GET /api/challenge/:challengeId
 * @desc Get challenge details by ID
 * @access Private
 */
const getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await ChallengeModel.findById(challengeId)
      .populate("createdBy", "username profile_img");

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    const today = new Date();

    const currentDay = Math.max(
      0,
      Math.floor(
        (today - challenge.startDate) /
          (1000 * 60 * 60 * 24)
      )
    );

    const progress = Math.min(
      100,
      Math.floor(
        (currentDay / challenge.duration) * 100
      )
    );

    return res.status(200).json({
      success: true,
      challenge,
      currentDay,
      progress,
    });
  } catch (error) {
    console.error("Get Challenge Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


/**
 * @route DELETE /api/challenge/:challengeId
 * @desc Delete a challenge
 * @access Private
 */
const deleteChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    // Check if challenge exists
    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Check ownership
    if (challenge.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this challenge.",
      });
    }

    // Check if any check-ins exist
    const progressExists = await ChallengeProgressModel.exists({
      challengeId,
    });

    if (progressExists) {
      return res.status(400).json({
        success: false,
        message:
          "Challenge cannot be deleted because progress has already been recorded.",
      });
    }

    // Delete challenge
    await ChallengeModel.findByIdAndDelete(challengeId);

    return res.status(200).json({
      success: true,
      message: "Challenge deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Challenge Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = {
  createChallenge,
  getMyChallenges,
  getChallengeById,
  deleteChallenge
};
