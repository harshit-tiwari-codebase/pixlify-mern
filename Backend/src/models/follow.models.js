const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-user",
      required: true,
    },

    followee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-user",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "accepted", // public account
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate follows
followSchema.index(
  { follower: 1, followee: 1 },
  { unique: true }
);

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;