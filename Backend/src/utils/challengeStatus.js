const ChallengeProgressModel = require("../models/challangeProgress.models");

const DAY_MS = 1000 * 60 * 60 * 24;

const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const evaluateAndFailMissedChallenge = async (
  challenge,
  userId
) => {
  if (!challenge || challenge.status !== "active") {
    return false;
  }

  const today = normalizeDate(new Date());
  const startDate = normalizeDate(challenge.startDate);

  const currentDay =
    Math.floor((today.getTime() - startDate.getTime()) / DAY_MS) + 1;

  if (currentDay < 2) {
    return false;
  }

  const maxDayToCheck = Math.min(
    currentDay - 1,
    challenge.duration
  );

  if (maxDayToCheck < 1) {
    return false;
  }

  for (let day = 1; day <= maxDayToCheck; day += 1) {
    const exists = await ChallengeProgressModel.exists({
      challengeId: challenge._id,
      userId,
      dayNumber: day,
    });

    if (!exists) {
      challenge.status = "failed";
      challenge.failedDay = day;
      challenge.failedAt = new Date();
      await challenge.save();
      return true;
    }
  }

  return false;
};

module.exports = {
  evaluateAndFailMissedChallenge,
};
