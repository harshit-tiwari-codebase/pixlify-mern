const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      trim: true,
      required: true,
    },

    postUrl: {
      type: String,
      required: [true, "Image is required"],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-user",
      required: true,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    // ---------------- Challenge Fields ----------------

    isChallengePost: {
      type: Boolean,
      default: false,
    },

    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-challenge",
      default: null,
    },

    challengeProgressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "challenge-progress",
      default: null,
    },

    dayNumber: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ userId: 1 });
postSchema.index({ isChallengePost: 1 });
postSchema.index({ challengeId: 1 });

module.exports = mongoose.model("Post", postSchema);