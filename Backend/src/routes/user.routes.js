const express = require("express");

const followRouter = express.Router();

const identifyUser = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");

followRouter.post("/toggle-follow/:id" , identifyUser , userController.toggleFollowController );





followRouter.get("/followers/:username" , identifyUser , userController.getfollowersController);


followRouter.get("/following/:username" , identifyUser , userController.getFollowingController);




module.exports = followRouter;