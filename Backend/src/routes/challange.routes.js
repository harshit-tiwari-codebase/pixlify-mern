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

const {
  checkIn,
  getChallengeProgress,
  getChallengeCheckIns,
  getChallengeHeatmap,
  getChallengeDashboard,
  getChallengeFeed
} = require("../controllers/checkin.controller");

// =====================
// Static Routes
// =====================

// Create challenge
router.post("/create", identifyUser, createChallenge);

//get challange feed 
router.get("/feed", identifyUser, getChallengeFeed);

// Dashboard
router.get("/dashboard", identifyUser, getChallengeDashboard);

// My challenges
router.get("/my", identifyUser, getMyChallenges);

// =====================
// Dynamic Routes
// =====================

// Challenge Progress
router.get("/:challengeId/progress", identifyUser, getChallengeProgress);

// Challenge Timeline
router.get("/:challengeId/checkins", identifyUser, getChallengeCheckIns);

// Challenge Heatmap
router.get("/:challengeId/heatmap", identifyUser, getChallengeHeatmap);

// Daily Check-in
router.post(
  "/:challengeId/checkin",
  identifyUser,
  upload.single("image"),
  checkIn
);

// Challenge Details
router.get("/:challengeId", identifyUser, getChallengeById);

// Delete Challenge
router.delete("/:challengeId", identifyUser, deleteChallenge);



module.exports = router;