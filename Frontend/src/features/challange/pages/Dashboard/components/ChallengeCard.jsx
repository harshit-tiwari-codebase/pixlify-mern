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
    text: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  completed: {
    text: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  failed: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  cancelled: {
    text: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  },
};

const ChallengeCard = ({
  challenge,
  selected,
  onSelect,
}) => {
  const style =
    statusStyles[challenge.status] ||
    statusStyles.active;

  const displayCategory =
    challenge?.category?.toLowerCase().trim() ===
    "custom"
      ? challenge.customCategory
      : challenge.category;

  return (
    <button
      onClick={() => onSelect(challenge)}
      className={`w-full rounded-3xl border p-5 text-left transition-all duration-300 ${
        selected
          ? "border-violet-500 bg-zinc-900 shadow-xl shadow-violet-500/20"
          : "border-zinc-800 bg-zinc-900/70 hover:border-violet-500/40 hover:-translate-y-1"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white capitalize">
            {displayCategory || "Untitled"}
          </h2>

          <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
            {challenge.description}
          </p>
        </div>

        <ChevronRight
          className="text-zinc-500"
          size={20}
        />
      </div>

      {/* Status */}
      <div
        className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
      >
        {challenge.status}
      </div>

      {/* Progress */}
      <div className="mt-6">
        <ProgressBar
          value={challenge.progress}
          showPercentage={false}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-zinc-400">
        <span>{challenge.progress}% completed</span>

        <span>
          Day {challenge.currentDay} /{" "}
          {challenge.duration}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-black/30 p-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <CheckCircle2 size={16} />
            <span className="text-xs">
              Completed
            </span>
          </div>

          <p className="mt-2 text-xl font-bold">
            {challenge.completedDays}
          </p>
        </div>

        <div className="rounded-2xl bg-black/30 p-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock3 size={16} />
            <span className="text-xs">
              Remaining
            </span>
          </div>

          <p className="mt-2 text-xl font-bold">
            {challenge.remainingDays}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <Calendar size={15} />

          <span className="text-xs">
            {new Date(
              challenge.startDate
            ).toLocaleDateString()}
          </span>
        </div>

        {challenge.status === "active" && (
          <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
            <Trophy size={14} />
            Active
          </div>
        )}

        {challenge.status ===
          "completed" && (
          <div className="flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
            <CheckCircle2 size={14} />
            Completed
          </div>
        )}

        {challenge.status === "failed" && (
          <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
            <XCircle size={14} />
            Failed
          </div>
        )}
      </div>
    </button>
  );
};

export default ChallengeCard;