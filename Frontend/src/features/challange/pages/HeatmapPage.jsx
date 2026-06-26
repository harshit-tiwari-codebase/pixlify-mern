import React from "react";
import {
  Flame,
  Trophy,
  CalendarDays,
} from "lucide-react";

const generateHeatmapData = () => {
  const data = [];

  for (let i = 364; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 5),
    });
  }

  return data;
};

const HeatmapPage = () => {
  const heatmapData = generateHeatmapData();

  const getColor = (count) => {
    if (count === 0) return "bg-zinc-800";
    if (count === 1) return "bg-green-900";
    if (count === 2) return "bg-green-700";
    if (count === 3) return "bg-green-500";
    return "bg-green-400";
  };

  const activeDays = heatmapData.filter(
    (day) => day.count > 0
  ).length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          Streak Dashboard
        </h1>

        <p className="text-zinc-400 mb-8">
          Track your consistency and challenge progress.
        </p>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Flame size={24} />
              <h2 className="font-semibold">
                Current Streak
              </h2>
            </div>

            <p className="text-4xl font-bold">
              24
            </p>

            <span className="text-zinc-400">
              Days
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Trophy size={24} />
              <h2 className="font-semibold">
                Longest Streak
              </h2>
            </div>

            <p className="text-4xl font-bold">
              42
            </p>

            <span className="text-zinc-400">
              Days
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CalendarDays size={24} />
              <h2 className="font-semibold">
                Active Days
              </h2>
            </div>

            <p className="text-4xl font-bold">
              {activeDays}
            </p>

            <span className="text-zinc-400">
              This Year
            </span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-6">
            Activity Heatmap
          </h2>

          <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
            {heatmapData.map((day) => (
              <div
                key={day.date}
                title={`${day.date} - ${day.count} activities`}
                className={`
                  w-4 h-4 rounded-sm
                  ${getColor(day.count)}
                  hover:scale-125
                  transition-all
                  cursor-pointer
                `}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-6 text-xs text-zinc-400">
            <span>Less</span>

            <div className="w-3 h-3 rounded-sm bg-zinc-800" />
            <div className="w-3 h-3 rounded-sm bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />

            <span>More</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Recent Activity
          </h2>

          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              🔥 Day 24 — Solved 3 LeetCode Problems
            </div>

            <div className="border-b border-zinc-800 pb-3">
              🚀 Day 23 — Completed Pixlify Feed
            </div>

            <div className="border-b border-zinc-800 pb-3">
              💻 Day 22 — Finished Backend APIs
            </div>

            <div>
              🎯 Day 21 — Completed React Revision
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;