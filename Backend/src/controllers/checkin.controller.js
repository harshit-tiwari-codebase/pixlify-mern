const ChallengeModel = require("../models/createChallange.models");
const ChallengeProgressModel = require("../models/challangeProgress.models");
const PostModel = require("../models/post.models");
const imagekit = require("../config/ImageKit");




/**
 * ============================================================================
 * @route   POST /api/challenge/:challengeId/checkin
 * @desc    Submit today's challenge check-in with proof image and caption.
 *
 * Workflow:
 * 1. Validate image and caption.
 * 2. Find the challenge.
 * 3. Verify ownership.
 * 4. Ensure challenge is active.
 * 5. Calculate current challenge day.
 * 6. Prevent duplicate check-in for the same day.
 * 7. Verify no previous day was missed.
 * 8. Upload proof image to ImageKit.
 * 9. Create challenge post.
 * 10. Create challenge progress entry.
 * 11. Link Post ↔ ChallengeProgress.
 * 12. Auto-complete challenge if last day is reached.
 * 13. Return populated post.
 *
 * Business Rules:
 * - Only the challenge owner can check in.
 * - One check-in per challenge day.
 * - Missing any previous day immediately fails the challenge.
 * - Failed or completed challenges cannot accept new check-ins.
 * - Every successful check-in creates both:
 *      • A social post
 *      • A ChallengeProgress record
 *
 * Success Response:
 * 201 Created
 *
 * Failure Responses:
 * 400 - Invalid request / duplicate check-in / challenge failed
 * 403 - Unauthorized
 * 404 - Challenge not found
 * 500 - Internal server error
 *
 * @access  Private
 * ============================================================================
 */
const checkIn = async (req, res) => {
  try {
   const { challengeId } = req.params;
const { caption } = req.body;
const userId = req.user.id;

// -------------------------------
// Validation
// -------------------------------

if (!req.file) {
  return res.status(400).json({
    success: false,
    message: "Image is required.",
  });
}

if (!caption?.trim()) {
  return res.status(400).json({
    success: false,
    message: "Caption is required.",
  });
}

// -------------------------------
// Find Challenge
// -------------------------------

const challenge = await ChallengeModel.findById(challengeId);

if (!challenge) {
  return res.status(404).json({
    success: false,
    message: "Challenge not found.",
  });
}

if (challenge.createdBy.toString() !== userId) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized.",
  });
}

if (challenge.status === "failed") {
  return res.status(400).json({
    success: false,
    message: "Challenge has already failed.",
  });
}

if (challenge.status === "completed") {
  return res.status(400).json({
    success: false,
    message: "Challenge already completed.",
  });
}

// -------------------------------
// Calculate Current Day
// -------------------------------

const today = new Date();
today.setHours(0, 0, 0, 0);

const startDate = new Date(challenge.startDate);
startDate.setHours(0, 0, 0, 0);

let currentDay =
  Math.floor(
    (today.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  ) + 1;

if (currentDay < 1) {
  return res.status(400).json({
    success: false,
    message: "Challenge has not started yet.",
  });
}

if (currentDay > challenge.duration) {
  return res.status(400).json({
    success: false,
    message: "Challenge duration is over.",
  });
}

// -------------------------------
// Already checked in?
// -------------------------------

const existingCheckIn =
  await ChallengeProgressModel.findOne({
    challengeId,
    userId,
    dayNumber: currentDay,
  });

if (existingCheckIn) {
  return res.status(400).json({
    success: false,
    message: `Day ${currentDay} already completed.`,
  });
}

// -------------------------------
// IMPORTANT
// Check every previous day
// -------------------------------

for (let day = 1; day < currentDay; day++) {

  const exists =
    await ChallengeProgressModel.exists({
      challengeId,
      userId,
      dayNumber: day,
    });

  if (!exists) {

    challenge.status = "failed";
    challenge.failedDay = day;
    challenge.failedAt = new Date();

    await challenge.save();

    return res.status(400).json({
      success: false,
      message: `Challenge failed. You missed Day ${day}.`,
    });

  }

}
   // ------------------------------------
// Upload Image
// ------------------------------------

const uploadedImage = await imagekit.upload({
  file: req.file.buffer,
  fileName: `${Date.now()}-${req.file.originalname}`,
  folder: "pixlifyPost",
});

// ------------------------------------
// Create Post
// ------------------------------------

const post = await PostModel.create({
  caption: caption.trim(),
  postUrl: uploadedImage.url,
  userId,
  isChallengePost: true,
  challengeId,
  dayNumber: currentDay,
});

// ------------------------------------
// Create Progress
// ------------------------------------

const progress = await ChallengeProgressModel.create({
  challengeId,
  userId,
  dayNumber: currentDay,
  completed: true,
  date: today,
  postId: post._id,
});

// ------------------------------------
// Link Progress -> Post
// ------------------------------------

post.challengeProgressId = progress._id;
await post.save();

// ------------------------------------
// Auto Complete Challenge
// ------------------------------------

const completedDays =
  await ChallengeProgressModel.countDocuments({
    challengeId,
    userId,
    completed: true,
  });

if (completedDays === challenge.duration) {
  challenge.status = "completed";
  await challenge.save();
}

// ------------------------------------
// Return Updated Post
// ------------------------------------

const finalPost = await PostModel.findById(post._id)
  .populate("userId", "username profile_img")
  .populate(
    "challengeId",
    "category customCategory duration status failedDay failedAt"
  );

return res.status(201).json({
  success: true,
  message: "Check-in successful.",
  post: finalPost,
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
/**
 * @route GET /api/challenge/:challengeId/progress
 * @desc Get challenge progress
 * @access Private
 */

const getChallengeProgress = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    // Find challenge
    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Owner validation
    if (challenge.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Normalize dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Current challenge day (Day 1 starts on startDate)
    let currentDay =
      Math.floor(
        (today.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (currentDay < 1) currentDay = 1;

    if (currentDay > challenge.duration) {
      currentDay = challenge.duration;
    }

    // Completed days
    const completedDays = await ChallengeProgressModel.countDocuments({
      challengeId,
      userId,
      completed: true,
    });

    const remainingDays = Math.max(
      challenge.duration - completedDays,
      0
    );

    const progress = Number(
      (
        (completedDays / challenge.duration) *
        100
      ).toFixed(2)
    );

    // Already checked in today?
    const checkedInToday = await ChallengeProgressModel.exists({
      challengeId,
      userId,
      dayNumber: currentDay,
    });

    return res.status(200).json({
      success: true,
      progress: {
        challengeId: challenge._id,

        category: challenge.category,
        customCategory: challenge.customCategory,
        description: challenge.description,

        status: challenge.status,
        failedDay: challenge.failedDay,
        failedAt: challenge.failedAt,

        duration: challenge.duration,

        currentDay,
        completedDays,
        remainingDays,
        progress,

        canCheckIn:
          challenge.status === "active" && !checkedInToday,

        checkedInToday: Boolean(checkedInToday),

        nextCheckInDay: Math.min(
          completedDays + 1,
          challenge.duration
        ),

        startDate: challenge.startDate,
        endDate: challenge.endDate,
      },
    });
  } catch (error) {
    console.error("Get Challenge Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
/**
 * @route GET /api/challenge/:challengeId/checkins
 * @desc Get all check-ins for a challenge
 * @access Private
 */

const getChallengeCheckIns = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    // Find challenge
    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Owner validation
    if (challenge.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Get challenge posts
    const checkIns = await PostModel.find({
      challengeId,
      isChallengePost: true,
    })
      .populate("userId", "username profile_img")
      .select(
        "caption postUrl dayNumber likesCount createdAt challengeProgressId userId"
      )
      .sort({ dayNumber: 1 })
      .lean();

    const totalLikes = checkIns.reduce(
      (sum, post) => sum + post.likesCount,
      0
    );

    return res.status(200).json({
      success: true,

      challenge: {
        id: challenge._id,
        category: challenge.category,
        customCategory: challenge.customCategory,
        duration: challenge.duration,

        status: challenge.status,
        failedDay: challenge.failedDay,
        failedAt: challenge.failedAt,

        startDate: challenge.startDate,
        endDate: challenge.endDate,
      },

      stats: {
        totalCheckIns: checkIns.length,
        remainingDays: Math.max(
          challenge.duration - checkIns.length,
          0
        ),
        completionPercentage: Number(
          (
            (checkIns.length / challenge.duration) *
            100
          ).toFixed(2)
        ),
        totalLikes,
      },

      checkIns,
    });
  } catch (error) {
    console.error("Get Challenge CheckIns Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @route GET /api/challenge/:challengeId/heatmap
 * @desc Get challenge heatmap data
 * @access Private
 */

const getChallengeHeatmap = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    // Find challenge
    const challenge = await ChallengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    // Owner validation
    if (challenge.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Normalize dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(challenge.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Current challenge day
    let currentDay =
      Math.floor(
        (today.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (currentDay < 1) currentDay = 1;

    if (currentDay > challenge.duration) {
      currentDay = challenge.duration;
    }

    // Fetch completed days
    const progress = await ChallengeProgressModel.find({
      challengeId,
      userId,
      completed: true,
    }).select("dayNumber date");

    const completedMap = new Map();

    progress.forEach((item) => {
      completedMap.set(item.dayNumber, item.date);
    });

    const heatmap = [];

    let completedDays = 0;
    let missedDays = 0;

    for (let day = 1; day <= challenge.duration; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (day - 1));

      let status = "future";

      if (completedMap.has(day)) {
        status = "completed";
        completedDays++;
      } else {
        if (challenge.status === "failed") {
          if (day === challenge.failedDay) {
            status = "missed";
            missedDays++;
          } else if (day < challenge.failedDay) {
            status = "missed";
            missedDays++;
          } else {
            status = "future";
          }
        } else {
          if (day < currentDay) {
            status = "missed";
            missedDays++;
          } else if (day === currentDay) {
            status = "today";
          } else {
            status = "future";
          }
        }
      }

      heatmap.push({
        day,
        date,
        status,
      });
    }

    return res.status(200).json({
      success: true,

      challenge: {
        id: challenge._id,
        category: challenge.category,
        customCategory: challenge.customCategory,
        duration: challenge.duration,
        status: challenge.status,
        failedDay: challenge.failedDay,
        failedAt: challenge.failedAt,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
      },

      summary: {
        completedDays,
        missedDays,
        remainingDays: Math.max(
          challenge.duration - completedDays - missedDays,
          0
        ),
        completionPercentage: Number(
          (
            (completedDays / challenge.duration) *
            100
          ).toFixed(2)
        ),
      },

      heatmap,
    });
  } catch (error) {
    console.error("Get Challenge Heatmap Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @route GET /api/challenge/dashboard
 * @desc Get challenge dashboard
 * @access Private
 */

const getChallengeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const challenges = await ChallengeModel.find({
      createdBy: userId,
    });

    const totalChallenges = challenges.length;

    const activeChallenges = challenges.filter(
      (challenge) => challenge.status === "active"
    ).length;

    const completedChallenges = challenges.filter(
      (challenge) => challenge.status === "completed"
    ).length;

    const failedChallenges = challenges.filter(
      (challenge) => challenge.status === "failed"
    ).length;

    const cancelledChallenges = challenges.filter(
      (challenge) => challenge.status === "cancelled"
    ).length;

    const totalCheckIns =
      await ChallengeProgressModel.countDocuments({
        userId,
        completed: true,
      });

    const totalChallengeDays = challenges.reduce(
      (sum, challenge) => sum + challenge.duration,
      0
    );

    const completionRate =
      totalChallengeDays === 0
        ? 0
        : Number(
            (
              (totalCheckIns / totalChallengeDays) *
              100
            ).toFixed(2)
          );

    return res.status(200).json({
      success: true,

      dashboard: {
        totalChallenges,

        activeChallenges,
        completedChallenges,
        failedChallenges,
        cancelledChallenges,

        totalCheckIns,

        totalChallengeDays,

        completionRate,
      },
    });
  } catch (error) {
    console.error("Get Challenge Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * @route GET /api/challenge/feed
 * @desc Get challenge feed
 * @access Private
 */
const getChallengeFeed = async (req, res) => {
  try {
    const posts = await PostModel.find({
      isChallengePost: true,
    })
      .populate("userId", "username profile_img")
      .populate(
        "challengeId",
        "category customCategory duration status failedDay"
      )
      .sort({ createdAt: -1 })
      .lean();

    const feed = posts
      .filter((post) => post.userId && post.challengeId)
      .map((post) => {
        const duration = post.challengeId.duration;
        const completedDays = post.dayNumber;

        return {
          _id: post._id,

          caption: post.caption,
          postUrl: post.postUrl,

          likesCount: post.likesCount,

          createdAt: post.createdAt,

          challengeProgressId: post.challengeProgressId,

          progress: {
            currentDay: completedDays,
            completedDays,
            remainingDays: Math.max(
              duration - completedDays,
              0
            ),
            duration,

            percentage: Number(
              (
                (completedDays / duration) *
                100
              ).toFixed(2)
            ),
          },

          user: {
            _id: post.userId._id,
            username: post.userId.username,
            profile_img: post.userId.profile_img,
          },

          challenge: {
            _id: post.challengeId._id,
            category: post.challengeId.category,
            customCategory:
              post.challengeId.customCategory,

            status: post.challengeId.status,
            failedDay: post.challengeId.failedDay,
          },
        };
      });

    return res.status(200).json({
      success: true,
      totalPosts: feed.length,
      posts: feed,
    });
  } catch (error) {
    console.error("Challenge Feed Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
module.exports = {
  checkIn,
  getChallengeProgress,
  getChallengeCheckIns,
  getChallengeHeatmap,
  getChallengeDashboard,
  getChallengeFeed
};