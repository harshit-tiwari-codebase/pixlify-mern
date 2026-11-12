import React from "react";
import {
  Trophy,
  Flame,
  CheckCircle2,
  Target,
} from "lucide-react";

const StatsCards = ({ dashboard }) => {
  const cards = [
    {
      title: "Total Challenges",
      value: dashboard?.totalChallenges || 0,
      icon: Trophy,
      bg: "bg-[#BFB9FA]",
    },
    {
      title: "Active",
      value: dashboard?.activeChallenges || 0,
      icon: Target,
      bg: "bg-[#A0E7D4]",
    },
    {
      title: "Check-ins",
      value: dashboard?.totalCheckIns || 0,
      icon: CheckCircle2,
      bg: "bg-[#D5F94C]",
    },
    {
      title: "Completion",
      value: `${dashboard?.completionRate || 0}%`,
      icon: Flame,
      bg: "bg-[#FFAEC0]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-[28px] border-2 border-black bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#000] transition-transform hover:scale-[1.02]"
          >
            <div
              className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black ${card.bg} text-black shadow-[1px_1px_0px_#000]`}
            >
              <Icon size={20} className="stroke-[2.5]" />
            </div>

            <p className="text-xs font-bold text-zinc-500">
              {card.title}
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-black">
              {card.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
