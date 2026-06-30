import React from "react";
import { Trophy } from "lucide-react";
import ChallengeCard from "./ChallengeCard";

const ChallengeList = ({
  challenges = [],
  selectedChallenge,
  setSelectedChallenge,
  loading,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <div className="h-5 w-40 rounded bg-zinc-800" />

            <div className="mt-3 h-3 w-full rounded bg-zinc-800" />

            <div className="mt-2 h-3 w-2/3 rounded bg-zinc-800" />

            <div className="mt-6 h-2 rounded-full bg-zinc-800" />

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="h-16 rounded-2xl bg-zinc-800" />
              <div className="h-16 rounded-2xl bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!challenges.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
          <Trophy
            size={30}
            className="text-violet-400"
          />
        </div>

        <h2 className="mt-6 text-xl font-semibold">
          No Challenges Yet
        </h2>

        <p className="mt-2 max-w-xs text-sm text-zinc-400">
          Create your first challenge and start
          building your streak today.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-5 backdrop-blur-xl">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            My Challenges
          </h2>

          <p className="text-sm text-zinc-500">
            {challenges.length} challenge
            {challenges.length > 1 && "s"}
          </p>
        </div>
      </div>

      {/* Challenge List */}

      <div className="space-y-5">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            challenge={challenge}
            selected={
              selectedChallenge?._id === challenge._id
            }
            onSelect={setSelectedChallenge}
          />
        ))}
      </div>
    </div>
  );
};

export default ChallengeList;