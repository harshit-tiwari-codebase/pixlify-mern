const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    trim : true
  },
  post_url: {
    type: String,
    required: [true, "didnot post without image"],
  },
//   post_date: {
//     type: Date,
//   },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pixlify-user",
    required: [true, "can not create any post without user id "],
  },
});

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
