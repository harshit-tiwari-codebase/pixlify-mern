import React from "react";
import { Flame, Heart, Trophy, XCircle, Clock3 } from "lucide-react";

const ChallengeCard = ({ post }) => {
  const progress = post.progress?.percentage ?? 0;
  const status = post.challenge?.status;

  const statusConfig = {
    active: {
      icon: <Clock3 size={13} />,
      text: "Active",
      color: "bg-[#D5F94C] text-black border-2 border-black",
    },
    completed: {
      icon: <Trophy size={13} />,
      text: "Completed",
      color: "bg-[#A0E7D4] text-black border-2 border-black",
    },
    failed: {
      icon: <XCircle size={13} />,
      text: "Failed",
      color: "bg-[#FFAEC0] text-black border-2 border-black",
    },
  };

  const badge = statusConfig[status] ?? statusConfig.active;

  return (
    <div className="rounded-[32px] border-[2.5px] border-black bg-white p-5 shadow-[4px_4px_0px_#000]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.user?.profile_img ? (
            <img
              src={post.user?.profile_img}
              alt={post.user?.username}
              className="h-11 w-11 rounded-2xl border-2 border-black object-cover"
            />
          ) : (
            <div className="h-11 w-11 rounded-2xl border-2 border-black bg-[#FFAEC0] flex items-center justify-center font-bold text-black text-lg">
              {(post.user?.username || "U")[0].toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="font-extrabold text-sm text-black">
              {post.user?.username}
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold shadow-[1px_1px_0px_#000] ${badge.color}`}
        >
          {badge.icon}
          {badge.text}
        </span>
      </div>

      {/* Category Pills */}
      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-full bg-[#D5F94C] border-2 border-black px-3 py-0.5 text-xs font-bold text-black shadow-[1px_1px_0px_#000]">
          {post.challenge?.category === "custom"
            ? post.challenge?.customCategory
            : post.challenge?.category}
        </span>

        <span className="rounded-full border-2 border-black bg-zinc-100 px-3 py-0.5 text-xs font-bold text-black shadow-[1px_1px_0px_#000]">
          Day {post.progress?.currentDay}/{post.progress?.duration}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-zinc-600">
          <span>Challenge Progress</span>
          <span className="text-black font-extrabold">{progress.toFixed(0)}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-zinc-200 border-2 border-black">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === "completed"
                ? "bg-[#A0E7D4]"
                : status === "failed"
                ? "bg-red-400"
                : "bg-[#FF6B4A]"
            }`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Image & Caption */}
      <div className="mt-4 flex items-start gap-3.5 bg-[#FED7A5]/20 p-3 rounded-2xl border-2 border-black">
        <img
          src={post.postUrl}
          alt="Challenge proof"
          className="h-20 w-20 rounded-xl border-2 border-black object-cover flex-shrink-0"
        />
        <p className="line-clamp-3 text-xs leading-relaxed text-black font-medium">
          {post.caption}
        </p>
      </div>

      {/* Failed Banner */}
      {status === "failed" && (
        <div className="mt-3 rounded-2xl border-2 border-black bg-[#FFAEC0] p-3 text-xs font-bold text-black shadow-[2px_2px_0px_#000]">
          Failed on Day {post.challenge.failedDay}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t-2 border-black/10 pt-3">
        <div className="flex items-center gap-1.5">
          <Flame size={16} className="text-[#FF6B4A] fill-[#FF6B4A]" />
          <span className="text-xs font-bold text-black">
            Day {post.progress?.completedDays} Completed
          </span>
        </div>

        <button className="flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3.5 py-1.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition">
          <Heart size={14} />
          <span>Appreciate</span>
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
