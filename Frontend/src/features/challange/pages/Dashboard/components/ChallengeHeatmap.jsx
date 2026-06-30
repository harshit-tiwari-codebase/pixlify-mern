import React from "react";
import { CalendarDays } from "lucide-react";

const colors = {
  completed: "bg-green-500",
  missed: "bg-red-500",
  today: "bg-violet-500 ring-1 ring-violet-400",
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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-violet-500/10 p-2">
            <CalendarDays
              size={18}
              className="text-violet-400"
            />
          </div>

          <div>
            <h2 className="font-semibold">
              Challenge Heatmap
            </h2>

            <p className="text-xs text-zinc-500">
              Daily consistency tracker
            </p>
          </div>
        </div>

        <span className="text-sm text-zinc-400">
          {heatmap.filter(
            (d) => d.status === "completed"
          ).length}
          /{challenge.duration}
        </span>
      </div>

      {/* Heatmap */}

      <div className="mt-6 overflow-x-auto">
        <div className="grid min-w-max grid-cols-7 gap-2">
          {heatmap.map((day) => (
            <div
              key={day.day}
              title={`Day ${day.day} • ${day.status}`}
              className="flex flex-col items-center"
            >
              <div
                className={`
                  h-6
                  w-6
                  rounded-md
                  border
                  border-zinc-700/70
                  transition
                  duration-200
                  hover:scale-110
                  ${colors[day.status]}
                `}
              />

              <span className="mt-1 text-[10px] text-zinc-500">
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
        {legends.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2"
          >
            <div
              className={`h-3 w-3 rounded ${item.color}`}
            />

            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Summary */}

      <div className="mt-6 grid grid-cols-4 gap-3">
        <div className="rounded-xl bg-black/30 p-3">
          <p className="text-[11px] text-zinc-500">
            Duration
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            {challenge.duration}
          </h3>
        </div>

        <div className="rounded-xl bg-black/30 p-3">
          <p className="text-[11px] text-zinc-500">
            Completed
          </p>

          <h3 className="mt-1 text-lg font-semibold text-green-400">
            {
              heatmap.filter(
                (d) => d.status === "completed"
              ).length
            }
          </h3>
        </div>

        <div className="rounded-xl bg-black/30 p-3">
          <p className="text-[11px] text-zinc-500">
            Missed
          </p>

          <h3 className="mt-1 text-lg font-semibold text-red-400">
            {
              heatmap.filter(
                (d) => d.status === "missed"
              ).length
            }
          </h3>
        </div>

        <div className="rounded-xl bg-black/30 p-3">
          <p className="text-[11px] text-zinc-500">
            Remaining
          </p>

          <h3 className="mt-1 text-lg font-semibold text-violet-400">
            {
              heatmap.filter(
                (d) =>
                  d.status === "future" ||
                  d.status === "today"
              ).length
            }
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ChallengeHeatmap;