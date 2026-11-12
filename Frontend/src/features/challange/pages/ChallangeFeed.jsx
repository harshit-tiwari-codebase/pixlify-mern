import React, { useEffect } from "react";
import { ArrowLeft, Sparkles, Plus, Trophy } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

import ChallengeCard from "../components/ChallangeCard";
import useChallenge from "../hooks/useChallange";
import BottomNavbar from "../../post/components/BottomNavbar";

const ChallengeFeed = () => {
  const navigate = useNavigate();
  const { posts, loading, fetchChallengeFeed } = useChallenge();

  useEffect(() => {
    fetchChallengeFeed();
  }, []);

  return (
    <div className="min-h-screen bg-[#EBE6FB] text-black pb-28">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 border-b-2 border-black bg-[#EBE6FB]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-md sm:max-w-lg items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl font-extrabold text-black tracking-tight">
                Challenges
              </h1>
              <p className="text-zinc-600 text-xs hidden sm:block font-medium">
                Daily vibes and community streaks
              </p>
            </div>
          </div>

          <Link
            to="/challange/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-black bg-[#FF6B4A] hover:bg-[#ff5a36] text-white text-xs font-bold transition shadow-[2px_2px_0px_#000] active:scale-95"
          >
            <Plus size={15} className="stroke-[3]" />
            <span>New Challenge</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-md sm:max-w-lg px-4 py-5">
        {loading ? (
          <div className="py-20 text-center text-zinc-500 text-xs font-bold">
            <div className="w-8 h-8 border-4 border-black border-t-[#FF6B4A] rounded-full animate-spin mx-auto mb-3" />
            Loading challenges...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white border-2 border-black rounded-[32px] shadow-[4px_4px_0px_#000]">
            <div className="w-14 h-14 rounded-2xl bg-[#D5F94C] border-2 border-black flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_#000]">
              <Trophy size={28} className="text-black" />
            </div>
            <h3 className="text-base font-extrabold text-black mb-1">
              No Challenge Check-ins Yet
            </h3>
            <p className="text-xs text-zinc-600 max-w-xs mx-auto mb-5 font-medium">
              Start your own 30 or 100-day journey and share your daily updates!
            </p>
            <Link
              to="/challange/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF6B4A] hover:bg-[#ff5a36] text-white border-2 border-black text-xs font-bold transition shadow-[2px_2px_0px_#000]"
            >
              <Plus size={16} className="stroke-[3]" />
              Create Challenge
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <ChallengeCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

export default ChallengeFeed;
