const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "coding",
        "leetcode",
        "development",
        "gym",
        "reading",
        "fitness",
        "custom",
      ],
      required: true,
    },
    customCategory: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pixlify-user",
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Helpful indexes
challengeSchema.index({ createdBy: 1, category: 1, status: 1 });
challengeSchema.index({ createdBy: 1 });

module.exports = mongoose.model("pixlify-challenge", challengeSchema);
