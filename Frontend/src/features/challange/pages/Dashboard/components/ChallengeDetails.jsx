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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center gap-2 text-zinc-400">
            <Icon size={16} />
            <span className="text-sm">{title}</span>
        </div>

        <h2 className="mt-3 text-3xl font-bold">
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
            <div className="flex h-full min-h-[600px] items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40">
                <div className="text-center">
                    <Target
                        className="mx-auto text-zinc-600"
                        size={55}
                    />

                    <h2 className="mt-5 text-2xl font-semibold">
                        Select a Challenge
                    </h2>

                    <p className="mt-2 text-zinc-500">
                        Choose a challenge from the left side.
                    </p>
                </div>
            </div>
        );
    }

return (
  <div className="space-y-6">
    {/* Header */}

    <div className="rounded-2xl border border-zinc-800 bg-black p-6">

  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

    <div>

      <h2 className="text-2xl font-semibold">
        {challenge.category === "Other"
          ? challenge.customCategory
          : challenge.category}
      </h2>

      <p className="mt-2 text-sm text-zinc-500">
        {challenge.description}
      </p>

    </div>

    <div className="flex items-center gap-3">

      <span className="rounded-full border border-zinc-800 px-3 py-1 text-sm text-zinc-400">
        Day {progress?.currentDay}/{challenge.duration}
      </span>

      <span className="rounded-full bg-violet-600/10 px-3 py-1 text-sm capitalize text-violet-400">
        {challenge.status}
      </span>

    </div>

  </div>

  <div className="mt-8">

    <div className="mb-3 flex items-center justify-between text-sm">

      <span className="text-zinc-500">
        Progress
      </span>

      <span className="font-medium">
        {progress?.progress ?? 0}%
      </span>

    </div>

    <ProgressBar
      value={progress?.progress ?? 0}
    />

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