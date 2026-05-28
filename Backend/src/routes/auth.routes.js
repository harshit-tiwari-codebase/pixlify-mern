

const express = require("express");

const authRouter = express.Router();




const auth_controllers = require("../controllers/auth.controller");



authRouter.post("/register", auth_controllers.registerController );

authRouter.post("/login", auth_controllers.loginController );

module.exports = authRouter;
