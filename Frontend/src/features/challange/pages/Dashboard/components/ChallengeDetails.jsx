import React from "react";
import {
  Calendar,
  Target,
  CheckCircle2,
  Clock3,
  Flag,
} from "lucide-react";

import ProgressBar from "./ProgressBar";
import ChallengeHeatmap from "./ChallengeHeatmap";
import CheckInCard from "./CheckInCard";
import AchievementCard from "./AchievementCard";

const Stat = ({ icon: Icon, title, value }) => (
  <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[2px_2px_0px_#000]">
    <div className="flex items-center gap-2 text-zinc-500 font-bold">
      <Icon size={16} />
      <span className="text-xs">{title}</span>
    </div>

    <h2 className="mt-2 text-2xl font-extrabold text-black">
      {value}
    </h2>
  </div>
);

const ChallengeDetails = ({
  challenge,
  progress,
  heatmap,
  checkIns,
  onCheckIn,
}) => {
  if (!challenge) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-[32px] border-2 border-dashed border-black/40 bg-white/50 p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#D5F94C] border-2 border-black flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_#000]">
            <Target className="text-black" size={32} />
          </div>

          <h2 className="text-lg font-extrabold text-black">
            Select a Challenge
          </h2>

          <p className="mt-1 text-xs text-zinc-600 font-medium">
            Choose a challenge from the left to view details and heatmap.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[32px] border-[2.5px] border-black bg-white p-6 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-black">
              {challenge.category === "custom"
                ? challenge.customCategory
                : challenge.category}
            </h2>
            <p className="mt-1 text-xs text-zinc-600 font-medium">
              {challenge.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border-2 border-black bg-zinc-100 px-3.5 py-1 text-xs font-bold text-black shadow-[1px_1px_0px_#000]">
              Day {progress?.currentDay}/{challenge.duration}
            </span>

            <span className="rounded-full border-2 border-black bg-[#D5F94C] px-3.5 py-1 text-xs font-bold text-black capitalize shadow-[1px_1px_0px_#000]">
              {challenge.status}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-zinc-600">
            <span>Overall Progress</span>
            <span className="text-black font-extrabold">{progress?.progress ?? 0}%</span>
          </div>

          <ProgressBar value={progress?.progress ?? 0} />
        </div>
      </div>

      {/* Heatmap */}
      <ChallengeHeatmap
        challenge={challenge}
        heatmap={heatmap}
      />

      {/* Bottom Section */}
      <div className="grid gap-6 xl:grid-cols-2">
        <CheckInCard
          challenge={challenge}
          progress={progress}
          checkIns={checkIns}
          onCheckIn={onCheckIn}
        />
      </div>
    </div>
  );
};

export default ChallengeDetails;
