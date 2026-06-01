const crypto = require("crypto");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");



/**
 * http://localhost:3000/api/auth/register
 */
 const registerController = async (req, res) => {
  try {
    const { username, email, password, bio, profile_img } = req.body;

    const isUserExist = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserExist) {
      return res.status(409).json({
        message:
          isUserExist.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    const hash = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userModel.create({
      username,
      email,
      password: hash,
      bio,
      profile_img,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username : user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    res.cookie("register-cookie", token);

    return res.status(201).json({
      message: "user registered successfully ",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}


/**
 * http://localhost:3000/api/auth/login
 */
const loginController = async (req, res) => {
 try {
   const {username,email,password} = req.body ;

   const isUserExist = await userModel.findOne(  { $or : [{email : email} , {username : username}] }  );

   if (!isUserExist) {
      return res.status(404).json({
        message: "User not found"
    });
   }

   const isPasswordMatch =  isUserExist.password === crypto.createHash("sha256").update(password).digest("hex");
   
   if(!isPasswordMatch){
    return res.status(401).json({message : "incorrect password"})
   }

   const token = jwt.sign({
    id : isUserExist._id ,  username : isUserExist.username
   },process.env.JWT_SECRET , {expiresIn : "1d"} );

   res.cookie("login-cookie" , token );

   return res.status(200).json({
      message: "Login successful",
      token
    });

 } catch (error) {
   return res.status(500).json({
      message: error.message
    });
 }
}

const getMeController = async (req , res) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  res.status(200).json({
    user : user.username,
    email : user.email ,
    bio : user.bio,
    profile : user.profile_img
  })

}

module.exports = {registerController , loginController ,getMeController};

