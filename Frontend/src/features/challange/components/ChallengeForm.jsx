import { PlusCircle, Rocket } from "lucide-react";

import CategorySelect from "./CategorySelect";
import DurationSelect from "./DurationSelect";

const ChallengeForm = () => {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-black/30">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-5 sm:px-7">

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
            <PlusCircle
              size={22}
              className="text-violet-400"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">
              Challenge Details
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Tell everyone what you're committing to.
            </p>
          </div>

        </div>

        <span className="hidden rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 md:block">
          Public
        </span>

      </div>

      {/* Body */}

      <div className="space-y-6 p-5 sm:p-7">

        {/* Challenge Name */}

        <div>

        


        </div>

        {/* Category & Duration */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <CategorySelect />

          <DurationSelect />

        </div>

        {/* Goal */}

        <div>

          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Goal
          </label>

          <div className="relative">

            <textarea
              rows={5}
              maxLength={150}
              placeholder="Solve one LeetCode problem every day and explain the approach."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-zinc-800
                bg-black
                p-4
                text-white
                placeholder:text-zinc-500
                outline-none
                transition
                focus:border-violet-500
                focus:ring-4
                focus:ring-violet-500/10
              "
            />

            <span className="absolute bottom-4 right-4 text-xs text-zinc-500">
              0/30
            </span>

          </div>

        </div>

        {/* Button */}

        <button
          className="
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-violet-600
            to-violet-500
            font-medium
            transition-all
            duration-300
            hover:scale-[1.01]
            hover:shadow-lg
            hover:shadow-violet-500/20
            active:scale-[0.99]
          "
        >
          <Rocket size={18} />

          Create Challenge
        </button>

      </div>

    </section>
  );
};

export default ChallengeForm;