import React from "react";
import { Flame, Heart, Trophy, XCircle, Clock3 } from "lucide-react";

const ChallengeCard = ({ post }) => {
  const progress = post.progress?.percentage ?? 0;

  const status = post.challenge?.status;

  const statusConfig = {
    active: {
      icon: <Clock3 size={14} />,
      text: "Active",
      color:
        "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },

    completed: {
      icon: <Trophy size={14} />,
      text: "Completed",
      color:
        "bg-green-500/15 text-green-400 border-green-500/30",
    },

    failed: {
      icon: <XCircle size={14} />,
      text: "Failed",
      color:
        "bg-red-500/15 text-red-400 border-red-500/30",
    },
  };

  const badge =
    statusConfig[status] ?? statusConfig.active;

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <img
            src={post.user?.profile_img}
            alt={post.user?.username}
            className="h-11 w-11 rounded-full object-cover"
          />

          <div>

            <h2 className="font-semibold text-white">
              {post.user?.username}
            </h2>

            <p className="text-xs text-zinc-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>

          </div>

        </div>

        <span
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${badge.color}`}
        >
          {badge.icon}
          {badge.text}
        </span>

      </div>

      {/* Category */}

      <div className="mt-4 flex items-center gap-2">

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-white">

          {post.challenge?.category === "custom"
            ? post.challenge?.customCategory
            : post.challenge?.category}

        </span>

        <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">

          Day {post.progress?.currentDay}/
          {post.progress?.duration}

        </span>

      </div>

      {/* Progress */}

      <div className="mt-5">

        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">

          <span>Challenge Progress</span>

          <span>{progress.toFixed(0)}%</span>

        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">

          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === "completed"
                ? "bg-green-500"
                : status === "failed"
                ? "bg-red-500"
                : "bg-white"
            }`}
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* Image */}

      <div className="mt-5 flex items-start gap-4">

        <img
          src={post.postUrl}
          alt="Challenge"
          className="h-20 w-20 rounded-xl border border-zinc-800 object-cover"
        />

        <p className="line-clamp-3 text-sm leading-6 text-zinc-300">
          {post.caption}
        </p>

      </div>

      {/* Failed Banner */}

      {status === "failed" && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3">

          <p className="text-sm text-red-400">

            Failed on Day {post.challenge.failedDay}

          </p>

        </div>
      )}

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">

        <div className="flex items-center gap-2">

          <Flame
            size={16}
            className="text-orange-400"
          />

          <span className="text-sm font-medium text-orange-300">

            Day {post.progress?.completedDays} Completed

          </span>

        </div>

        <button className="flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white">

          <Heart size={16} />

          Appreciate

        </button>

      </div>

    </div>
  );
};

export default ChallengeCard;