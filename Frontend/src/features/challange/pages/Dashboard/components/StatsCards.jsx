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
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      title: "Active",
      value: dashboard?.activeChallenges || 0,
      icon: Target,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Check-ins",
      value: dashboard?.totalCheckIns || 0,
      icon: CheckCircle2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Completion",
      value: `${dashboard?.completionRate || 0}%`,
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl transition duration-300 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10"
          >
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}
            >
              <Icon
                size={24}
                className={card.color}
              />
            </div>

            <p className="text-sm text-zinc-400">
              {card.title}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {card.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;