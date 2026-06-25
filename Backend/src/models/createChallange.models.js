const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-user",
      required: true,
    },
    
    duration: {
      type: Number,
      required: true, // e.g. 30, 60, 100
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "DSA",
        "Development",
        "Fitness",
        "Reading",
        "Coding",
        "Custom",
      ],
      default: "Custom",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "cancelled"],
      default: "upcoming",
    },

    bannerImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pixlify-challenge", challengeSchema);