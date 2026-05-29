const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    trim : true
  },
  postUrl: {
    type: String,
    required: [true, "didnot post without image"],
  },
//   post_date: {
//     type: Date,
//   },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pixlify-user",
    required: [true, "can not create any post without user id "],
  },
});

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
