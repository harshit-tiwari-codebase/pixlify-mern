import { useEffect } from "react";
import { ArrowLeft, Sparkles, PlusCircle } from "lucide-react";
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
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 border-b border-zinc-800/80 bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 hover:border-zinc-700 transition"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Challenge Feed
              </h1>
              <p className="text-zinc-500 text-xs hidden sm:block">
                Daily consistency from the Pixlify community.
              </p>
            </div>
          </div>

          <Link
            to="/challange/create"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition"
          >
            <PlusCircle size={15} />
            <span>New Challenge</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6">
        {loading ? (
          <div className="py-20 text-center text-zinc-500 text-sm">
            <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading challenges...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 px-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white mb-1">
              No Challenge Check-ins Yet
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-5">
              Start your own 30, 60, or 100-day journey and check in daily with photo proofs!
            </p>
            <Link
              to="/challange/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition"
            >
              <PlusCircle size={16} />
              Create Challenge
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
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
