import React from "react";
import { Flame, Heart } from "lucide-react";

const ChallengeCard = ({ post }) => {
  const progress = post.progress?.percentage ?? 0;

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

        <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
          Day {post.progress?.currentDay}/{post.progress?.duration}
        </span>

      </div>

      {/* Category */}
      <div className="mt-4">
        <span className="inline-flex rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-white">
          {post.challenge?.category}
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
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

      {/* Proof */}
      <div className="mt-5 flex items-start gap-4">

        <img
          src={post.postUrl}
          alt="Challenge Proof"
          className="h-20 w-20 flex-shrink-0 rounded-xl border border-zinc-800 object-cover"
        />

        <p className="line-clamp-3 text-sm leading-6 text-zinc-300">
          {post.caption}
        </p>

      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">

        <div className="flex items-center gap-2">
          <Flame
            size={16}
            className="text-orange-400"
          />

          <span className="text-sm font-medium text-orange-300">
            {post.progress?.currentDay} Day Streak
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