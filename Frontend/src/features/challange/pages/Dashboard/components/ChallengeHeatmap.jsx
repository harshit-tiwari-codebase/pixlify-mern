import React from "react";
import { CalendarDays } from "lucide-react";

const colors = {
  completed: "bg-[#D5F94C] text-black",
  missed: "bg-[#FFAEC0] text-black",
  today: "bg-[#FF6B4A] text-white",
  future: "bg-[#EBE6FB] text-zinc-600",
};

const legends = [
  {
    label: "Completed",
    color: "bg-[#D5F94C]",
  },
  {
    label: "Missed",
    color: "bg-[#FFAEC0]",
  },
  {
    label: "Today",
    color: "bg-[#FF6B4A]",
  },
  {
    label: "Future",
    color: "bg-[#EBE6FB]",
  },
];

const ChallengeHeatmap = ({ challenge, heatmap = [] }) => {
  return (
    <div className="rounded-[32px] border-[2.5px] border-black bg-white p-5 sm:p-6 shadow-[4px_4px_0px_#000]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border-2 border-black bg-[#A0E7D4] p-2 shadow-[2px_2px_0px_#000]">
            <CalendarDays size={18} className="text-black stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-black">
              Consistency Heatmap
            </h2>
            <p className="text-xs font-semibold text-zinc-600">
              Daily habit tracker
            </p>
          </div>
        </div>

        <span className="rounded-full border-2 border-black bg-[#D5F94C] px-3 py-0.5 text-xs font-extrabold text-black shadow-[1px_1px_0px_#000]">
          {heatmap.filter((d) => d.status === "completed").length}/{challenge.duration}
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="mt-5 overflow-x-auto pb-2">
        <div className="grid min-w-max grid-cols-7 gap-2.5">
          {heatmap.map((day) => (
            <div
              key={day.day}
              title={`Day ${day.day} • ${day.status}`}
              className="flex flex-col items-center"
            >
              <div
                className={`
                  h-7
                  w-7
                  rounded-xl
                  border-2
                  border-black
                  shadow-[1px_1px_0px_#000]
                  flex
                  items-center
                  justify-center
                  text-[10px]
                  font-extrabold
                  transition
                  hover:scale-110
                  ${colors[day.status] || colors.future}
                `}
              >
                {day.day}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-zinc-600 border-t-2 border-black/10 pt-3">
        {legends.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className={`h-3 w-3 rounded-md border border-black ${item.color}`}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Summary Row */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-2xl border-2 border-black bg-white p-3 shadow-[2px_2px_0px_#000]">
          <p className="text-[10px] font-bold text-zinc-500 uppercase">Duration</p>
          <h3 className="mt-0.5 text-lg font-black text-black">{challenge.duration}d</h3>
        </div>

        <div className="rounded-2xl border-2 border-black bg-[#D5F94C]/40 p-3 shadow-[2px_2px_0px_#000]">
          <p className="text-[10px] font-bold text-zinc-600 uppercase">Completed</p>
          <h3 className="mt-0.5 text-lg font-black text-black">
            {heatmap.filter((d) => d.status === "completed").length}
          </h3>
        </div>

        <div className="rounded-2xl border-2 border-black bg-[#FFAEC0]/40 p-3 shadow-[2px_2px_0px_#000]">
          <p className="text-[10px] font-bold text-zinc-600 uppercase">Missed</p>
          <h3 className="mt-0.5 text-lg font-black text-black">
            {heatmap.filter((d) => d.status === "missed").length}
          </h3>
        </div>

        <div className="rounded-2xl border-2 border-black bg-[#FED7A5]/40 p-3 shadow-[2px_2px_0px_#000]">
          <p className="text-[10px] font-bold text-zinc-600 uppercase">Remaining</p>
          <h3 className="mt-0.5 text-lg font-black text-black">
            {heatmap.filter((d) => d.status === "future" || d.status === "today").length}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ChallengeHeatmap;
