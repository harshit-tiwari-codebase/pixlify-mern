const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-user",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * One user can like one post only once
 */
likeSchema.index(
  { postId: 1, userId: 1 },
  { unique: true }
);

 

const likeModel = mongoose.model("like", likeSchema);

module.exports = likeModel;