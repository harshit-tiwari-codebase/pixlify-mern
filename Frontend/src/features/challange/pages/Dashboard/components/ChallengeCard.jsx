import React from "react";
import {
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Trophy,
} from "lucide-react";
import ProgressBar from "./ProgressBar";

const statusStyles = {
  active: {
    bg: "bg-[#D5F94C]",
    text: "text-black",
  },
  completed: {
    bg: "bg-[#A0E7D4]",
    text: "text-black",
  },
  failed: {
    bg: "bg-[#FFAEC0]",
    text: "text-black",
  },
  cancelled: {
    bg: "bg-zinc-200",
    text: "text-black",
  },
};

const ChallengeCard = ({ challenge, selected, onSelect }) => {
  const style = statusStyles[challenge.status] || statusStyles.active;

  const displayCategory =
    challenge?.category?.toLowerCase().trim() === "custom"
      ? challenge.customCategory
      : challenge.category;

  return (
    <button
      onClick={() => onSelect(challenge)}
      className={`w-full rounded-[28px] border-2 border-black p-4 sm:p-5 text-left transition-all duration-200 ${
        selected
          ? "bg-[#FED7A5]/50 shadow-[4px_4px_0px_#000] scale-[1.01]"
          : "bg-white shadow-[2px_2px_0px_#000] hover:bg-[#EBE6FB]/30 hover:-translate-y-0.5"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <h2 className="text-base font-extrabold text-black capitalize truncate">
            {displayCategory || "Untitled"}
          </h2>
          <p className="mt-1 line-clamp-2 text-xs font-semibold text-zinc-600">
            {challenge.description}
          </p>
        </div>

        <div className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#000]">
          <ChevronRight className="text-black" size={16} />
        </div>
      </div>

      {/* Status Pill */}
      <div className="mt-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border-2 border-black px-3 py-0.5 text-[11px] font-extrabold capitalize shadow-[1px_1px_0px_#000] ${style.bg} ${style.text}`}
        >
          {challenge.status}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <ProgressBar value={challenge.progress} showPercentage={false} />
      </div>

      <div className="mt-2 flex justify-between text-[11px] font-bold text-zinc-600">
        <span>{challenge.progress}% done</span>
        <span>
          Day {challenge.currentDay} / {challenge.duration}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border-2 border-black bg-white p-2.5 shadow-[1px_1px_0px_#000]">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <CheckCircle2 size={13} />
            <span className="text-[10px] font-bold">Completed</span>
          </div>
          <p className="mt-1 text-base font-black text-black">
            {challenge.completedDays}d
          </p>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-2.5 shadow-[1px_1px_0px_#000]">
          <div className="flex items-center gap-2 text-zinc-500">
            <Clock3 size={13} />
            <span className="text-[10px] font-bold">Remaining</span>
          </div>
          <p className="mt-1 text-base font-black text-black">
            {challenge.remainingDays}d
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t-2 border-black/10 pt-3">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Calendar size={13} />
          <span className="text-[10px] font-bold">
            {new Date(challenge.startDate).toLocaleDateString()}
          </span>
        </div>

        {challenge.status === "active" && (
          <span className="text-[10px] font-extrabold text-[#FF6B4A]">
            Active Streak
          </span>
        )}
      </div>
    </button>
  );
};

export default ChallengeCard;
