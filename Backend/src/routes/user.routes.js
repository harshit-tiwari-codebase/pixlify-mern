const express = require("express");

const followRouter = express.Router();

const identifyUser = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");

followRouter.post("/follow/:username" , identifyUser , userController.followUSerController );


followRouter.post("/unfollow/:username" , identifyUser , userController.unfollowUserController);

module.exports = followRouter;