import React from "react";
import {
  Trophy,
  Flame,
  Star,
  Medal,
  Target,
  Lock,
} from "lucide-react";

const AchievementCard = ({ challenge, progress }) => {
  const completion =
    progress?.completionPercentage ??
    progress?.progress ??
    0;

  const achievements = [
    {
      title: "First Check-in",
      description: "Complete your first day.",
      unlocked: progress?.completedDays >= 1,
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "7 Day Streak",
      description: "Complete 7 challenge days.",
      unlocked: progress?.completedDays >= 7,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Halfway There",
      description: "Reach 50% completion.",
      unlocked: completion >= 50,
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Challenge Master",
      description: "Complete the challenge.",
      unlocked: challenge?.status === "completed",
      icon: Trophy,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      {/* Header */}

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/10 p-3">
          <Medal
            size={22}
            className="text-violet-400"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Achievements
          </h2>

          <p className="text-sm text-zinc-500">
            Unlock badges by staying consistent.
          </p>
        </div>
      </div>

      {/* Badges */}

      <div className="mt-8 space-y-4">
        {achievements.map((badge) => {
          const Icon = badge.unlocked
            ? badge.icon
            : Lock;

          return (
            <div
              key={badge.title}
              className={`flex items-center justify-between rounded-2xl border p-4 transition

              ${
                badge.unlocked
                  ? "border-zinc-700 bg-black/30"
                  : "border-zinc-800 bg-zinc-900 opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-2xl p-3 ${
                    badge.unlocked
                      ? badge.bg
                      : "bg-zinc-800"
                  }`}
                >
                  <Icon
                    size={22}
                    className={
                      badge.unlocked
                        ? badge.color
                        : "text-zinc-500"
                    }
                  />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {badge.title}
                  </h3>

                  <p className="text-sm text-zinc-500">
                    {badge.description}
                  </p>
                </div>
              </div>

              {badge.unlocked ? (
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                  Unlocked
                </span>
              ) : (
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-500">
                  Locked
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion */}

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 p-5">
        <p className="text-sm text-zinc-400">
          Overall Completion
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {completion}%
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          Keep going. Every day counts.
        </p>
      </div>
    </div>
  );
};

export default AchievementCard;