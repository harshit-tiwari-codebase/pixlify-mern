const mongoose = require("mongoose");

const challengeProgressSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-challenge",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-user",
      required: true,
    },

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    date: {
      type: Date,
      required: true,
    },

    completed: {
      type: Boolean,
      default: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-post",
      required: true,
    },

    checkedInAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// A user can check in only once for a specific day of a challenge
challengeProgressSchema.index(
  {
    challengeId: 1,
    userId: 1,
    dayNumber: 1,
  },
  {
    unique: true,
  }
);

// Helpful indexes for querying
challengeProgressSchema.index({ userId: 1 });
challengeProgressSchema.index({ challengeId: 1 });
challengeProgressSchema.index({ date: 1 });

module.exports = mongoose.model(
  "challenge-progress",
  challengeProgressSchema
);