const ChallengeModel = require("../models/createChallange.models");
const ChallengeProgressModel = require("../models/challangeProgress.models");

/**
 * @route POST /api/challenge/create
 * @desc Create a new personal challenge
 * @access Private
 */

const createChallenge = async (req, res) => {
  try {
    let {
      category,
      customCategory,
      description,
      duration,
      visibility,
    } = req.body;

    // Trim inputs
    category = category?.trim().toLowerCase();
    customCategory = customCategory?.trim();
    description = description?.trim();

    duration = Number(duration);

    // Validate required fields
    if (!category || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: "Category, description and duration are required.",
      });
    }

    // Validate duration
    if (!Number.isInteger(duration) || duration < 1) {
      return res.status(400).json({
        success: false,
        message: "Duration must be at least 1 day.",
      });
    }

    // Validate custom category
    if (category === "custom" && !customCategory) {
      return res.status(400).json({
        success: false,
        message: "Custom category name is required.",
      });
    }

    // Duplicate active challenge
    const query = {
      createdBy: req.user.id,
      status: "active",
    };

    if (category === "custom") {
      query.category = "custom";
      query.customCategory = customCategory.toLowerCase();
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
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration - 1);

    // Create Challenge
    const challenge = await ChallengeModel.create({
      category,
      customCategory:
        category === "custom"
          ? customCategory.toLowerCase()
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
    today.setHours(0, 0, 0, 0);

    const formattedChallenges = await Promise.all(
      challenges.map(async (challenge) => {
        const startDate = new Date(challenge.startDate);
        startDate.setHours(0, 0, 0, 0);

        let currentDay =
          Math.floor(
            (today.getTime() - startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1;

        if (currentDay < 1) currentDay = 1;

        if (currentDay > challenge.duration) {
          currentDay = challenge.duration;
        }

        const completedDays =
          await ChallengeProgressModel.countDocuments({
            challengeId: challenge._id,
            userId,
            completed: true,
          });

        const remainingDays = Math.max(
          challenge.duration - completedDays,
          0
        );

        const progress = Number(
          (
            (completedDays / challenge.duration) *
            100
          ).toFixed(2)
        );

        return {
          ...challenge.toObject(),

          currentDay,
          completedDays,
          remainingDays,
          progress,
        };
      })
    );

    return res.status(200).json({
      success: true,
      totalChallenges: formattedChallenges.length,
      challenges: formattedChallenges,
    });
  } catch (error) {
    console.error("Get My Challenges Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
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
    const userId = req.user.id;

    const challenge = await ChallengeModel.findById(challengeId).populate(
      "createdBy",
      "username profile_img",
    );

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Normalize dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Calculate current challenge day
    let currentDay =
      Math.floor(
        (today.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (currentDay < 1) currentDay = 1;

    if (currentDay > challenge.duration) {
      currentDay = challenge.duration;
    }

    // Completed days
    const completedDays =
      await ChallengeProgressModel.countDocuments({
        challengeId,
        userId: challenge.createdBy._id,
        completed: true,
      });

    const remainingDays = Math.max(
      challenge.duration - completedDays,
      0
    );

    const progress = Number(
      (
        (completedDays / challenge.duration) *
        100
      ).toFixed(2)
    );

    return res.status(200).json({
      success: true,
      challenge,

      stats: {
        currentDay,
        completedDays,
        remainingDays,
        progress,
        status: challenge.status,
        failedDay: challenge.failedDay,
        failedAt: challenge.failedAt,
      },
    });
  } catch (error) {
    console.error("Get Challenge Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
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

    // Find challenge owned by user
    const challenge = await ChallengeModel.findOne({
      _id: challengeId,
      createdBy: userId,
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Prevent deleting completed challenges
    if (challenge.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed challenges cannot be deleted.",
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
  deleteChallenge,
};
