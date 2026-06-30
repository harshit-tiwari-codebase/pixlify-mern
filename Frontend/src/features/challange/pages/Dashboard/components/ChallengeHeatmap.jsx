import React from "react";
import { CalendarDays } from "lucide-react";

const colors = {
  completed: "bg-green-500",
  missed: "bg-red-500",
  today: "bg-violet-500 animate-pulse",
  future: "bg-zinc-800",
};

const legends = [
  {
    label: "Completed",
    color: "bg-green-500",
  },
  {
    label: "Missed",
    color: "bg-red-500",
  },
  {
    label: "Today",
    color: "bg-violet-500",
  },
  {
    label: "Future",
    color: "bg-zinc-800",
  },
];

const ChallengeHeatmap = ({
  challenge,
  heatmap = [],
}) => {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      {/* Header */}

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/10 p-3">
          <CalendarDays
            size={22}
            className="text-violet-400"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Challenge Heatmap
          </h2>

          <p className="text-sm text-zinc-500">
            Daily consistency tracker
          </p>
        </div>
      </div>

      {/* Heatmap */}

      <div className="mt-8 overflow-x-auto">
        <div className="grid min-w-max grid-cols-7 gap-3">
          {heatmap.map((day) => (
            <div
              key={day.day}
              title={`Day ${day.day} • ${day.status}`}
              className="group flex flex-col items-center"
            >
              <div
                className={`
                  h-10
                  w-10
                  rounded-xl
                  border
                  border-zinc-700
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:border-white
                  ${colors[day.status]}
                `}
              />

              <span className="mt-2 text-xs text-zinc-500">
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}

      <div className="mt-8 flex flex-wrap gap-5">
        {legends.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2"
          >
            <div
              className={`h-4 w-4 rounded ${item.color}`}
            />

            <span className="text-sm text-zinc-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-black/30 p-4">
          <p className="text-xs text-zinc-500">
            Duration
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {challenge.duration}
          </h2>
        </div>

        <div className="rounded-2xl bg-black/30 p-4">
          <p className="text-xs text-zinc-500">
            Completed
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-400">
            {
              heatmap.filter(
                (item) =>
                  item.status === "completed"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-2xl bg-black/30 p-4">
          <p className="text-xs text-zinc-500">
            Missed
          </p>

          <h2 className="mt-2 text-2xl font-bold text-red-400">
            {
              heatmap.filter(
                (item) =>
                  item.status === "missed"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-2xl bg-black/30 p-4">
          <p className="text-xs text-zinc-500">
            Remaining
          </p>

          <h2 className="mt-2 text-2xl font-bold text-violet-400">
            {
              heatmap.filter(
                (item) =>
                  item.status === "future" ||
                  item.status === "today"
              ).length
            }
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ChallengeHeatmap;