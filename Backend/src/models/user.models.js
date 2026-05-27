const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username already exist"],
    required: [true, "the username must be required"],
  },
  email: {
    type: String,
    unique: [true, "email already exist"],
    match: [
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  "email invalid format"
],
    required: [true, "the email must be required"],
  },
  password: {
    type: String,
    minlength: [6, "the password contain more than 6 charecters"],
    required: [true, "the password must be required"],
  },
  bio: String,
  profile_img: {
    type: String,
    default:
      "https://ik.imagekit.io/zt6xsh95q/5abd985735a8fd4adcb0e795de6a1005.jpg",
  },
});

const userModel = mongoose.model("pixlify-user",userSchema);

module.exports = userModel;
