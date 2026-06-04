const express = require("express");

const followRouter = express.Router();

const identifyUser = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");

followRouter.post("/toggle-follow/:id" , identifyUser , userController.toggleFollowController );





followRouter.get("/getfollowers/:id" , identifyUser , userController.getfollowersController);


followRouter.get("/getfollowing/:id" , identifyUser , userController.getFollowingController);




module.exports = followRouter;