const userModel = require("../models/user.models");

const express = require("express");

const authRouter = express.Router();

/**
 * http://localhost:3000/api/auth/register
 */
authRouter.post("/register", async (req, res) => {
  const { username, email, password, bio, profile_img } = req.body;

  const isEmailExist = await userModel.findOne({ email });

  if (isEmailExist) {
    return res.status(409).json({
      message: "email already exist",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
    bio,
    profile_img,
  });
});
