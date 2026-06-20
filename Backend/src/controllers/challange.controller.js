const ChallengeModel = require("../models/createChallange.models");

/**
 * @route POST /api/challenge/create
 * @desc Create a new challenge
 * @access Private
 *
 * @body
 * {
 *   "title": "30 Days DSA Challenge",
 *   "description": "Solve 2 DSA problems daily",
 *   "startDate": "2026-06-20",
 *   "endDate": "2026-07-20"
 * }
 *
 * @returns {Object} Newly created challenge
 */
const createChallenge = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    const challenge = await ChallengeModel.create({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user.id,
      participants: [req.user.id],
    });

    res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      challenge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while creating challenge",
    });
  }
};

/**
 * @route GET /api/challenge
 * @desc Get all challenges
 * @access Public
 *
 * @returns {Array} List of all challenges sorted by newest first
 */
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await ChallengeModel.find()
      .populate("createdBy", "username profile_img")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * @route GET /api/challenge/:challengeId
 * @desc Get challenge details by ID
 * @access Public
 *
 * @param {string} challengeId - MongoDB Challenge ID
 *
 * @returns {Object} Challenge details with creator and participants
 */
const getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await ChallengeModel.findById(challengeId)
      .populate("createdBy", "username profile_img")
      .populate("participants", "username profile_img");

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * @route POST /api/challenge/join/:challengeId
 * @desc Join an existing challenge
 * @access Private
 *
 * @param {string} challengeId - MongoDB Challenge ID
 *
 * @returns {Object} Success message
 */
const joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    const alreadyJoined = challenge.participants.includes(userId);

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this challenge",
      });
    }

    challenge.participants.push(userId);
    await challenge.save();

    res.status(200).json({
      success: true,
      message: "Challenge joined successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * @route POST /api/challenge/leave/:challengeId
 * @desc Leave a joined challenge
 * @access Private
 *
 * @param {string} challengeId - MongoDB Challenge ID
 *
 * @returns {Object} Success message
 */
const leaveChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    challenge.participants = challenge.participants.filter(
      (participant) => participant.toString() !== userId
    );

    await challenge.save();

    res.status(200).json({
      success: true,
      message: "Challenge left successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  joinChallenge,
  leaveChallenge,
};