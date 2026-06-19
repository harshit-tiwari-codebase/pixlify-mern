const router = require("express").Router();
const identifyUser = require("../middlewares/auth.middleware");

const {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  joinChallenge,
  leaveChallenge,
} = require("../controllers/challange.controller");

router.post("/create", identifyUser, createChallenge);
router.get("/", getAllChallenges);
router.get("/:challengeId", getChallengeById);
router.post("/join/:challengeId", identifyUser, joinChallenge);
router.post("/leave/:challengeId", identifyUser, leaveChallenge);

module.exports = router;