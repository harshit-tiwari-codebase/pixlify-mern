

const express = require("express");

const authRouter = express.Router();




const controllers = require("../controllers/auth.controllers");



authRouter.post("/register", controllers.registerController );

authRouter.post("/login", controllers.loginController );

module.exports = authRouter;
