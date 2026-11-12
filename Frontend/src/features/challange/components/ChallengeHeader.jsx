import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChallengeHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-[#EBE6FB]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3.5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-2xl border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-black tracking-tight">
              Create Challenge
            </h1>
            <span className="flex items-center gap-1 rounded-full border-2 border-black bg-[#D5F94C] px-2.5 py-0.5 text-[11px] font-bold text-black shadow-[1px_1px_0px_#000]">
              <Sparkles size={11} />
              New
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChallengeHeader;
