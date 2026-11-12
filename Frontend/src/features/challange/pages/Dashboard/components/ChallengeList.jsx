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
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-[28px] border-2 border-black bg-white p-5 shadow-[3px_3px_0px_#000]"
          >
            <div className="h-4 w-32 rounded bg-zinc-200" />
            <div className="mt-3 h-3 w-full rounded bg-zinc-200" />
            <div className="mt-4 h-2 rounded-full bg-zinc-200" />
          </div>
        ))}
      </div>
    );
  }

  if (!challenges.length) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[32px] border-2 border-black bg-white p-8 text-center shadow-[4px_4px_0px_#000]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D5F94C] border-2 border-black shadow-[2px_2px_0px_#000]">
          <Trophy size={26} className="text-black" />
        </div>

        <h2 className="mt-4 text-base font-extrabold text-black">
          No Challenges Yet
        </h2>

        <p className="mt-1 max-w-xs text-xs text-zinc-600 font-medium">
          Create your first challenge and start sharing your journey today.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border-[2.5px] border-black bg-white p-5 shadow-[4px_4px_0px_#000]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-black">
            My Challenges
          </h2>
          <p className="text-xs text-zinc-500 font-bold">
            {challenges.length} challenge{challenges.length > 1 && "s"}
          </p>
        </div>
      </div>

      {/* Challenge List */}
      <div className="space-y-3">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            challenge={challenge}
            selected={selectedChallenge?._id === challenge._id}
            onSelect={setSelectedChallenge}
          />
        ))}
      </div>
    </div>
  );
};

export default ChallengeList;
