const ChallengeModel = require("../models/createChallange.models");
const ChallengeProgressModel = require("../models/challangeProgress.models")

/**
 * @route POST /api/challenge/create
 * @desc Create a new personal challenge
 * @access Private
 *
 * @body
 * {
 *   "title": "30 Days DSA Challenge",
 *   "description": "Solve 2 DSA problems daily",
 *   "duration": 30
 * }
 */

const createChallenge = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    // 1. Validate input
    if (!title || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: "Title, description and duration are required.",
      });
    }

    // 2. Check if user already has an active challenge
    const existingChallenge = await ChallengeModel.findOne({
      createdBy: req.user.id,
      title,
      status: "active",
    });

    if (existingChallenge) {
      return res.status(400).json({
        success: false,
        message: "You already have an active challenge.",
      });
    }

    // 3. Calculate dates
    const startDate = new Date();

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Number(duration));

    // 4. Create challenge
    const challenge = await ChallengeModel.create({
      title,
      description,
      duration,
      startDate,
      endDate,
      createdBy: req.user.id,
      status: "active",
    });

    // 5. Return response
    return res.status(201).json({
      success: true,
      message: "Challenge created successfully.",
      challenge,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
