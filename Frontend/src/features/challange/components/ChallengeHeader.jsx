import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChallengeHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-950
            transition-all
            duration-300
            hover:border-violet-500/40
            hover:bg-zinc-900
            hover:scale-105
            active:scale-95
          "
        >
          <ArrowLeft size={18} />
        </button>

        {/* Title */}
        <div className="flex-1">

          <div className="flex items-center gap-3">

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Create Challenge
            </h1>

            <span className="hidden sm:flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <Sparkles size={13} />
              New
            </span>

          </div>

          <p className="mt-1 text-sm text-zinc-500">
            Start your public commitment and stay consistent every day.
          </p>

        </div>

      </div>
    </header>
  );
};

export default ChallengeHeader;