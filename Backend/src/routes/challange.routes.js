const express = require("express");
const router = express.Router();

const identifyUser = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

const {
  createChallenge,
  getMyChallenges,
  getChallengeById,
  deleteChallenge,
} = require("../controllers/challange.controller");

const checkIn = require("../controllers/checkin.controller");


// Create a challenge
router.post("/create", identifyUser, createChallenge);

// Get logged-in user's challenges
router.get("/my", identifyUser, getMyChallenges);

// Get challenge details
router.get("/:challengeId", identifyUser, getChallengeById);

// Delete challenge
router.delete("/:challengeId", identifyUser, deleteChallenge);

// Daily challenge check-in
router.post(
  "/:challengeId/checkin",
  identifyUser,
  upload.single("image"),
  checkIn
);

module.exports = router;