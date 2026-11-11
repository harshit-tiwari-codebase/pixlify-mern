const express = require("express");

const followRouter = express.Router();

const identifyUser = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");

followRouter.post("/toggle-follow/:id", identifyUser, userController.toggleFollowController);

followRouter.get("/getfollowers/:id", identifyUser, userController.getFollowersController);

followRouter.get("/getfollowing/:id", identifyUser, userController.getFollowingController);

followRouter.get("/search", identifyUser, userController.searchUsersController);

followRouter.get("/profile/:username", identifyUser, userController.getUserProfile);

module.exports = followRouter;
