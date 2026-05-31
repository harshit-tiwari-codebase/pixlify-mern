const mongoose = require("mongoose");
const { applyTimestamps } = require("./post.models");

const followSchema = mongoose.Schema({
  follower: {
    type: String
  },
  followee: {
    type: String
  },
} , {timestamps : true } );

const followModel = mongoose.model("follow" , followSchema);

followSchema.index({follower:1 , followee:1},{unique:true})

module.exports = followModel;
