

const express = require("express");

const authRouter = express.Router();




const auth_controllers = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware");



authRouter.post("/register", auth_controllers.registerController );

authRouter.post("/login", auth_controllers.loginController );

authRouter.get("/getme" , identifyUser , auth_controllers.getMeController);

authRouter.put("/editProfile" , identifyUser , userController.editProfile);


module.exports = authRouter;
