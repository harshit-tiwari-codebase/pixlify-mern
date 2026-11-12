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
      bg: "bg-[#FED7A5]",
    },
    {
      title: "7 Day Streak",
      description: "Complete 7 challenge days.",
      unlocked: progress?.completedDays >= 7,
      icon: Flame,
      bg: "bg-[#FFAEC0]",
    },
    {
      title: "Halfway There",
      description: "Reach 50% completion.",
      unlocked: completion >= 50,
      icon: Target,
      bg: "bg-[#BFB9FA]",
    },
    {
      title: "Challenge Master",
      description: "Complete the challenge.",
      unlocked: challenge?.status === "completed",
      icon: Trophy,
      bg: "bg-[#D5F94C]",
    },
  ];

  return (
    <div className="rounded-[32px] border-[2.5px] border-black bg-white p-6 shadow-[4px_4px_0px_#000]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border-2 border-black bg-[#BFB9FA] p-2.5 shadow-[2px_2px_0px_#000]">
          <Medal size={22} className="text-black" />
        </div>

        <div>
          <h2 className="text-base font-extrabold text-black">
            Achievements
          </h2>
          <p className="text-xs font-semibold text-zinc-600">
            Unlock badges by staying consistent.
          </p>
        </div>
      </div>

      {/* Badges List */}
      <div className="mt-6 space-y-3">
        {achievements.map((badge) => {
          const Icon = badge.unlocked ? badge.icon : Lock;

          return (
            <div
              key={badge.title}
              className={`flex items-center justify-between rounded-2xl border-2 border-black p-3.5 transition shadow-[2px_2px_0px_#000] ${
                badge.unlocked ? "bg-white" : "bg-zinc-100 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#000] ${
                    badge.unlocked ? badge.bg : "bg-zinc-200"
                  }`}
                >
                  <Icon size={18} className="text-black stroke-[2.5]" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-black">
                    {badge.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-zinc-500">
                    {badge.description}
                  </p>
                </div>
              </div>

              {badge.unlocked ? (
                <span className="rounded-full border border-black bg-[#D5F94C] px-2.5 py-0.5 text-[10px] font-extrabold text-black shadow-[1px_1px_0px_#000]">
                  Unlocked
                </span>
              ) : (
                <span className="rounded-full border border-zinc-400 bg-zinc-200 px-2.5 py-0.5 text-[10px] font-bold text-zinc-500">
                  Locked
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      <div className="mt-6 rounded-2xl border-2 border-black bg-[#EBE6FB] p-4 shadow-[2px_2px_0px_#000]">
        <p className="text-xs font-bold text-zinc-600">
          Overall Completion
        </p>
        <h2 className="mt-1 text-3xl font-black text-black">
          {completion}%
        </h2>
        <p className="mt-1 text-[11px] font-semibold text-zinc-600">
          Keep going. Every day counts.
        </p>
      </div>
    </div>
  );
};

export default AchievementCard;
