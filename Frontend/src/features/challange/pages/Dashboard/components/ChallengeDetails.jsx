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

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {challenge.category === "Other"
              ? challenge.customCategory
              : challenge.category}
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            {challenge.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm">
              <Calendar size={16} />
              {challenge.duration} Days
            </div>

            <div className="rounded-full bg-violet-500/10 px-4 py-2 text-sm capitalize text-violet-400">
              {challenge.status}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Stat
        icon={Flag}
        title="Current Day"
        value={progress.currentDay}
      />

      <Stat
        icon={CheckCircle2}
        title="Completed"
        value={progress.completedDays}
      />

      <Stat
        icon={Clock3}
        title="Remaining"
        value={progress.remainingDays}
      />

      <Stat
        icon={Target}
        title="Progress"
        value={`${progress.progress}%`}
      />
    </div>

    {/* Progress */}

    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Progress
          </h2>

          <p className="text-zinc-500">
            Track your consistency
          </p>
        </div>

        <h2 className="text-4xl font-bold text-violet-400">
          {progress.progress}%
        </h2>
      </div>

      <div className="mt-6">
        <ProgressBar value={progress.progress} />
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

      <AchievementCard
        challenge={challenge}
        progress={progress}
      />
    </div>
  </div>
);
};
export default ChallengeDetails;