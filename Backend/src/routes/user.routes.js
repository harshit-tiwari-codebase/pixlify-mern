const express = require("express");

const followRouter = express.Router();

const identifyUser = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");

followRouter.post("/follow/:username" , identifyUser , userController.followUSerController );


followRouter.post("/unfollow/:username" , identifyUser , userController.unfollowUserController);


followRouter.get("/followers/:username" , identifyUser , userController.getfollowersController);


followRouter.get("/following/:username" , identifyUser , userController.getFollowingController);

module.exports = followRouter;