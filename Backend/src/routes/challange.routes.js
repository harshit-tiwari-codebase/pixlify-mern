const express = require("express");
const router = express.Router();

const identifyUser = require("../middlewares/auth.middleware");

const {
  createChallenge,
  getMyChallenges,
  getChallengeById,
  deleteChallenge,
} = require("../controllers/challange.controller");

// Create a challenge
router.post("/create", identifyUser, createChallenge);

// Get logged-in user's challenges
router.get("/my", identifyUser, getMyChallenges);

// Get challenge details
router.get("/:challengeId", identifyUser, getChallengeById);

// Delete challenge
router.delete("/:challengeId", identifyUser, deleteChallenge);

module.exports = router;